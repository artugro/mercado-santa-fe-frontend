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
  const userAddress = "0x203Aa96f8559a2DF928Ba442F1aDD66a9c9092Df";
  const MLARGE = ethers.parseEther("1000000000000000");

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
  const MercadoSantaFe = await hre.ethers.getContract<Contract>("MercadoSantaFe", deployer);

  // Bonding the Mercado and the Bodega.
  await BodegaDeChocolates.updateMercado(MercadoSantaFe.target);

  await USDCToken.allocateTo(deployer, ethers.parseUnits("1000000", 6));
  await XOCToken.allocateTo(deployer, ethers.parseEther("1000000"));

  await USDCToken.allocateTo(userAddress, ethers.parseUnits("1000000", 6));
  // await XOCToken.allocateTo(userAddress, ethers.parseEther("1000000"));
  /// Deposit liquidity.
  await XOCToken.approve(BodegaDeChocolates.target, MLARGE);
  await BodegaDeChocolates.deposit(await XOCToken.balanceOf(deployer), deployer);

  console.log("👋 Initial greeting");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["MercadoSantaFe"];
