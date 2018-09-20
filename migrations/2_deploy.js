var TokenContract = artifacts.require("./ExampleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenContract);
};
