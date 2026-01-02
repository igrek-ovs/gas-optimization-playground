// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MediumUserRegistry {
    struct User {
        uint128 actionsCount;
        bool isActive;
        address userAddress;
        string name;
    }

    User[] private users;

    mapping(address => uint256) private userIndex;

    error UserAlreadyExist();
    error UserDoesntExist();

    function addUser(address _user, string calldata _name) external {
        if (userIndex[_user] !=0) revert UserAlreadyExist();

        users.push(
            User({
                actionsCount: 0,
                isActive: true,
                userAddress: _user,
                name: _name
            })
        );

        userIndex[_user] = users.length;
    }

    function incrementActions(address _user) external {
        uint256 index = userIndex[_user];

        if(index == 0) revert UserDoesntExist();

        User storage user = users[index-1];

        unchecked {
            user.actionsCount++;
        }
    }

    function deactivateUser(address _user) external {
        uint256 index = userIndex[_user];
        if(index == 0) revert UserDoesntExist();

        users[index-1].isActive = false;
    }

    function getUser(address _user) 
        external 
        view 
        returns (
            address userAddress,
            uint256 actionsCount,
            bool isActive,
            string memory name
        )
    {
        uint256 index = userIndex[_user];
        if(index == 0) revert UserDoesntExist();

        User storage user = users[index-1];

        return (
            user.userAddress,
            user.actionsCount,
            user.isActive,
            user.name
        );
    }

}