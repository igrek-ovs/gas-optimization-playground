// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OptimizedUserRegistry {
    struct User {
        uint128 actionsCount;
        bool isActive;
        bytes32 name;
    }

    mapping(address => User) private users;
    mapping(address => bool) private registered;

    error UserAlreadyExists();
    error UserDoesNotExist();

    function addUser(address user, bytes32 name) external {
        if(registered[user]) revert UserAlreadyExists();

        users[user] = User({
            actionsCount: 0,
            isActive: true,
            name: name
        });

        registered[user] = true;
    }

    function incrementActions(address user) external {
        if(!registered[user]) revert UserDoesNotExist();

        unchecked {
            users[user].actionsCount++;
        }
    }

    function deactivateUser(address user) external {
        if(!registered[user]) revert UserDoesNotExist();

        users[user].isActive = false;
    }

    function getUser(address user)
        external
        view
        returns (
            uint128 actionsCount,
            bool isActive,
            bytes32 name
        )
    {
        if(!registered[user]) revert UserDoesNotExist();

        User storage u = users[user];

        return (u.actionsCount, u.isActive, u.name);
    }
}