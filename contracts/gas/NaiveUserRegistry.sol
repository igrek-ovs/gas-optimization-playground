// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NaiveUserRegistry {
    struct User {
        address userAddress;
        uint256 actionsCount;
        bool isActive;
        string name;
    }

    User[] public users;
    mapping(address => uint256) public userIndex;
    mapping(address => bool) public exists;

    function addUser(address _user, string memory _name) public {
        require(!exists[_user], "User already exists");

        User memory newUser = User({
            userAddress: _user,
            actionsCount: 0,
            isActive: true,
            name: _name
        });

        users.push(newUser);
        userIndex[_user] = users.length - 1;
        exists[_user] = true;
    }

    function incrementActions(address _user) public {
        require(exists[_user], "User does not exist");

        uint256 index = userIndex[_user];
        User storage user = users[index];

        user.actionsCount = user.actionsCount + 1;
    }

    function deactivateUser(address _user) public {
        require(exists[_user], "User does not exist");

        uint256 index = userIndex[_user];
        users[index].isActive = false;
    }

    function getUser(address _user)
        public
        view
        returns (
            address userAddress,
            uint256 actionsCount,
            bool isActive,
            string memory name
        )
    {
        require(exists[_user], "User does not exist");

        User memory user = users[userIndex[_user]];
        return (
            user.userAddress,
            user.actionsCount,
            user.isActive,
            user.name
        );
    }
}
