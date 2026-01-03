// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import "../contracts/gas/NaiveUserRegistry.sol";
import "../contracts/gas/MediumUserRegistry.sol";
import "../contracts/gas/OptimizedUserRegistry.sol";

contract UserRegistryGasTest is Test {
    NaiveUserRegistry naive;
    MediumUserRegistry medium;
    OptimizedUserRegistry optimized;

    address user = address(0xBEEF);

    function setUp() public {
        naive = new NaiveUserRegistry();
        medium = new MediumUserRegistry();
        optimized = new OptimizedUserRegistry();
    }

    function test_addUser() public {
        naive.addUser(user, "Alice");
        medium.addUser(user, "Alice");
        optimized.addUser(user, bytes32("Alice"));
    }

    function test_incrementActions() public {
        naive.addUser(user, "Alice");
        medium.addUser(user, "Alice");
        optimized.addUser(user, bytes32("Alice"));

        naive.incrementActions(user);
        medium.incrementActions(user);
        optimized.incrementActions(user);
    }

    function test_deactivateUser() public {
        naive.addUser(user, "Alice");
        medium.addUser(user, "Alice");
        optimized.addUser(user, bytes32("Alice"));

        naive.deactivateUser(user);
        medium.deactivateUser(user);
        optimized.deactivateUser(user);
    }
}
