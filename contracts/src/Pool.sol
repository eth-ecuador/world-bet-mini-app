// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

// ---------------------------------------
// GGT Token (ERC20 Mintable)
// ---------------------------------------
contract GGTToken is IERC20, Ownable {
    string public constant name = "GGT Token";
    string public constant symbol = "GGT";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        totalSupply += amount;
        balanceOf[to] += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

// ---------------------------------------
// Interface for Rewarder
// ---------------------------------------
interface IRewarder {
    function updateReward(address user) external;
}

// ---------------------------------------
// Staking Pool with Transaction Tracking
// ---------------------------------------
contract Pool is Ownable {
    IERC20 public immutable rewardToken;
    IRewarder public rewarder;

    // Transaction tracking
    uint256 private _txCounter;
    enum TransactionType {
        Deposit,
        Pay,
        Stake,
        Unstake,
        Withdraw
    }
    struct Transaction {
        uint256 amount;
        bytes32 txId;
        TransactionType txType;
        address tokenAddress;
        uint256 timestamp;
    }
    mapping(address => Transaction[]) public userTransactions;
    mapping(address => mapping(bytes32 => uint256)) public txIndex;

    // Staking data
    mapping(address => mapping(address => uint256)) public stakeBalances;
    mapping(address => uint256) public totalStaked;

    event Pay(address indexed user, uint256 amount, bytes32 txId);
    event Deposit(
        address indexed user,
        uint256 amount,
        bytes32 txId,
        address tokenAddress
    );
    event Stake(
        address indexed user,
        uint256 amount,
        bytes32 txId,
        address tokenAddress
    );
    event Unstake(
        address indexed user,
        uint256 amount,
        bytes32 txId,
        address tokenAddress
    );
    event Withdraw(
        address indexed to,
        uint256 amount,
        bytes32 txId,
        address tokenAddress
    );

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
        _txCounter = 0;
    }

    // Admin: set or change rewarder contract
    function setRewarder(address _rewarder) external onlyOwner {
        rewarder = IRewarder(_rewarder);
    }

    // Generate a unique tx ID
    function _generateTxId() internal returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    _txCounter++,
                    blockhash(block.number - 1)
                )
            );
    }

    // Record a transaction
    function _record(
        address user,
        uint256 amount,
        TransactionType t,
        address token
    ) internal returns (bytes32) {
        bytes32 txId = _generateTxId();
        userTransactions[user].push(
            Transaction(amount, txId, t, token, block.timestamp)
        );
        txIndex[user][txId] = userTransactions[user].length - 1;
        return txId;
    }

    // **** User Pay for service (maintains balance & record) ****
    function pay() external payable returns (bytes32) {
        require(msg.value > 0, "Amount must be greater than 0");
        bytes32 txId = _record(
            msg.sender,
            msg.value,
            TransactionType.Pay,
            address(0)
        );
        emit Pay(msg.sender, msg.value, txId);
        return txId;
    }

    // **** Deposit liquidity without rewards ****
    function deposit() external payable returns (bytes32) {
        require(msg.value > 0, "Amount must be greater than 0");
        bytes32 txId = _record(
            msg.sender,
            msg.value,
            TransactionType.Deposit,
            address(0)
        );
        emit Deposit(msg.sender, msg.value, txId, address(0));
        return txId;
    }

    function depositToken(
        address tokenAddress,
        uint256 amount
    ) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Invalid token address");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        bytes32 txId = _record(
            msg.sender,
            amount,
            TransactionType.Deposit,
            tokenAddress
        );
        emit Deposit(msg.sender, amount, txId, tokenAddress);
        return txId;
    }

    // **** Stake with rewards ****
    function stake(
        address tokenAddress,
        uint256 amount
    ) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        rewarder.updateReward(msg.sender);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        stakeBalances[msg.sender][tokenAddress] += amount;
        totalStaked[tokenAddress] += amount;
        bytes32 txId = _record(
            msg.sender,
            amount,
            TransactionType.Stake,
            tokenAddress
        );
        emit Stake(msg.sender, amount, txId, tokenAddress);
        return txId;
    }

    function unstake(
        address tokenAddress,
        uint256 amount
    ) external returns (bytes32) {
        require(
            stakeBalances[msg.sender][tokenAddress] >= amount,
            "Insufficient stake balance"
        );
        rewarder.updateReward(msg.sender);
        stakeBalances[msg.sender][tokenAddress] -= amount;
        totalStaked[tokenAddress] -= amount;
        IERC20(tokenAddress).transfer(msg.sender, amount);
        bytes32 txId = _record(
            msg.sender,
            amount,
            TransactionType.Unstake,
            tokenAddress
        );
        emit Unstake(msg.sender, amount, txId, tokenAddress);
        return txId;
    }

    // **** Withdraw for service purchases (admin) ****
    function withdraw(
        address to,
        uint256 amount,
        address tokenAddress
    ) external onlyOwner returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        if (tokenAddress == address(0)) {
            require(
                address(this).balance >= amount,
                "Insufficient ETH balance"
            );
            (bool sent, ) = to.call{value: amount}("");
            require(sent, "Failed to send ETH");
        } else {
            IERC20(tokenAddress).transfer(to, amount);
        }
        bytes32 txId = _record(
            to,
            amount,
            TransactionType.Withdraw,
            tokenAddress
        );
        emit Withdraw(to, amount, txId, tokenAddress);
        return txId;
    }

    // **** View Transactions ****
    function getTransactions(
        address user
    ) external view returns (Transaction[] memory) {
        return userTransactions[user];
    }

    function getTransaction(
        address user,
        bytes32 txId
    ) external view returns (Transaction memory) {
        return userTransactions[user][txIndex[user][txId]];
    }
}

// ---------------------------------------
// Rewarder Contract
// ---------------------------------------
contract Rewarder is Ownable, IRewarder {
    IERC20 public immutable rewardToken;
    Pool public immutable pool;
    uint256 public rewardRatePerSecond;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    constructor(
        address _pool,
        address _token,
        uint256 _rate
    ) Ownable(msg.sender) {
        pool = Pool(_pool);
        rewardToken = IERC20(_token);
        rewardRatePerSecond = _rate;
        lastUpdateTime = block.timestamp;
    }

    modifier updateGlobal() {
        uint256 duration = block.timestamp - lastUpdateTime;
        uint256 total = pool.totalStaked(address(rewardToken));
        if (total > 0) {
            rewardPerTokenStored +=
                (duration * rewardRatePerSecond * 1e18) /
                total;
        }
        lastUpdateTime = block.timestamp;
        _;
    }

    function updateReward(address user) external override updateGlobal {
        uint256 owed = (pool.stakeBalances(user, address(rewardToken)) *
            (rewardPerTokenStored - userRewardPerTokenPaid[user])) / 1e18;
        rewards[user] += owed;
        userRewardPerTokenPaid[user] = rewardPerTokenStored;
    }

    function claim() external updateGlobal {
        this.updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");
        rewards[msg.sender] = 0;
        rewardToken.transfer(msg.sender, reward);
    }

    function setRewardRate(uint256 _rate) external onlyOwner updateGlobal {
        rewardRatePerSecond = _rate;
    }

    function fund(uint256 amount) external onlyOwner {
        rewardToken.transferFrom(msg.sender, address(this), amount);
    }
}
