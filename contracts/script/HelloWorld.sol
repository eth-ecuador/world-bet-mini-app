// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {Pool} from "../src/Pool.sol";
import {GGTToken} from "../src/Pool.sol";

contract HelloWorldScript is Script {
    Pool public pool;
    GGTToken public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        token = new GGTToken();
        pool = new Pool(address(token));

        vm.stopBroadcast();
    }
}
