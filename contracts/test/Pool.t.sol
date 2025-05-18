// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Pool.sol";

contract PoolTest is Test {
    GGTToken public ggtToken;
    Pool public pool;
    Rewarder public rewarder;
    
    address public owner = address(this);
    address public alice = address(0x1);
    address public bob = address(0x2);
    
    function setUp() public {
        // Deploy contracts
        ggtToken = new GGTToken();
        pool = new Pool(address(ggtToken));
        rewarder = new Rewarder(
            address(pool),
            address(ggtToken),
            1e16 // 0.01 tokens per second
        );
        
        // Setup contracts
        pool.setRewarder(address(rewarder));
        
        // Mint tokens to users
        ggtToken.mint(alice, 1000 ether);
        ggtToken.mint(bob, 1000 ether);
        ggtToken.mint(address(this), 10000 ether);
        
        // Fund rewarder
        ggtToken.approve(address(rewarder), 5000 ether);
        rewarder.fund(5000 ether);
        
        // Setup users
        vm.startPrank(alice);
        ggtToken.approve(address(pool), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(bob);
        ggtToken.approve(address(pool), type(uint256).max);
        vm.stopPrank();
    }
    
    // Test 1: Depositing tokens
    function testDepositToken() public {
        vm.startPrank(alice);
        
        uint256 initialBalance = ggtToken.balanceOf(alice);
        uint256 depositAmount = 100 ether;
        
        bytes32 txId = pool.depositToken(address(ggtToken), depositAmount);
        
        assertEq(ggtToken.balanceOf(alice), initialBalance - depositAmount);
        assertEq(ggtToken.balanceOf(address(pool)), depositAmount);
        
        Pool.Transaction memory txData = pool.getTransaction(alice, txId);
        assertEq(txData.amount, depositAmount);
        assertEq(txData.tokenAddress, address(ggtToken));
        assertEq(uint(txData.txType), uint(Pool.TransactionType.Deposit));
        
        vm.stopPrank();
    }
    
    // Test 2: Staking tokens
    function testStakeToken() public {
        vm.startPrank(alice);
        
        uint256 initialBalance = ggtToken.balanceOf(alice);
        uint256 stakeAmount = 100 ether;
        
        bytes32 txId = pool.stake(address(ggtToken), stakeAmount);
        
        assertEq(ggtToken.balanceOf(alice), initialBalance - stakeAmount);
        assertEq(pool.stakeBalances(alice, address(ggtToken)), stakeAmount);
        assertEq(pool.totalStaked(address(ggtToken)), stakeAmount);
        
        Pool.Transaction memory txData = pool.getTransaction(alice, txId);
        assertEq(txData.amount, stakeAmount);
        assertEq(uint(txData.txType), uint(Pool.TransactionType.Stake));
        
        vm.stopPrank();
    }
    
    // Test 3: Unstaking tokens
    function testUnstakeToken() public {
        // First stake some tokens
        vm.startPrank(alice);
        uint256 stakeAmount = 100 ether;
        pool.stake(address(ggtToken), stakeAmount);
        
        // Fast forward time
        vm.warp(block.timestamp + 1 days);
        
        // Unstake half the tokens
        uint256 unstakeAmount = 50 ether;
        uint256 balanceBefore = ggtToken.balanceOf(alice);
        
        bytes32 txId = pool.unstake(address(ggtToken), unstakeAmount);
        
        // Check balances
        assertEq(ggtToken.balanceOf(alice), balanceBefore + unstakeAmount);
        assertEq(pool.stakeBalances(alice, address(ggtToken)), stakeAmount - unstakeAmount);
        
        Pool.Transaction memory txData = pool.getTransaction(alice, txId);
        assertEq(txData.amount, unstakeAmount);
        assertEq(uint(txData.txType), uint(Pool.TransactionType.Unstake));
        
        vm.stopPrank();
    }
    
    // Test 4: Claiming rewards
    function testClaimRewards() public {
        // First stake some tokens
        vm.startPrank(alice);
        uint256 stakeAmount = 100 ether;
        pool.stake(address(ggtToken), stakeAmount);
        vm.stopPrank();
        
        // Fast forward time to accrue rewards
        vm.warp(block.timestamp + 30 days);
        
        // Claim rewards
        vm.startPrank(alice);
        uint256 balanceBefore = ggtToken.balanceOf(alice);
        
        rewarder.claim();
        
        // Verify rewards were received
        uint256 balanceAfter = ggtToken.balanceOf(alice);
        assertGt(balanceAfter, balanceBefore, "Should have received rewards");
        
        vm.stopPrank();
    }
} 