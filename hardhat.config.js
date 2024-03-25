const { task, vars } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
};

task("account", "Print the list of accounts", async function(taskArgs, hre){
  const accounts = await hre.ethers.getSigners();
  const hello = vars.get("hello")
  for(const account of accounts){
    vars.has("hello")? console.log("ada"): console.log("zoong");

    console.log(hello)
    
    console.log(vars.has("hello"))
    
    console.log(vars.get("hello", "hay"))
    
    console.log(account.address);
  }
})