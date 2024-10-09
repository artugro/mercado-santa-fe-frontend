import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("USDCToken", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const USDCToken = await hre.ethers.getContract<Contract>("USDCToken", deployer);

  await deploy("XOCToken", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const XOCToken = await hre.ethers.getContract<Contract>("XOCToken", deployer);

  await deploy("BodegaDeChocolates", {
    from: deployer,
    // Contract constructor arguments
    args: [XOCToken.target, deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const BodegaDeChocolates = await hre.ethers.getContract<Contract>("BodegaDeChocolates", deployer);

  await deploy("USDToMXNOracle", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const USDToMXNOracle = await hre.ethers.getContract<Contract>("USDToMXNOracle", deployer);

  await deploy("MercadoSantaFe", {
    from: deployer,
    // Contract constructor arguments
    args: [USDCToken.target, BodegaDeChocolates.target, USDToMXNOracle.target],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  await hre.ethers.getContract<Contract>("MercadoSantaFe", deployer);

  await USDCToken.allocateTo(deployer, ethers.parseEther("10"));
  await XOCToken.allocateTo(deployer, ethers.parseEther("10"));

  console.log("👋 Initial greeting");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["MercadoSantaFe"];
