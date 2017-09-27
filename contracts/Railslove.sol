pragma solidity ^0.4.15;

contract Railslove {
  
  address public owner;
  mapping(uint => address) public members;
  mapping(address => uint) public balances;
  
  function Railslove() public {
    owner = msg.sender;
  }

  function mint(uint _amount, address _recipient) public {
    balances[_recipient] = balances[_recipient] + _amount;
  }

}
