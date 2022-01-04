const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address); // contract owner
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); // generate required files
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed(); // done deploying

  console.log("WavePortal address: ", waveContract.address); // address on the blockchain
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

// on a new terminal -> npx hardhat node :: create a local node and 20 new wallets for us to test
// on a new terminal -> npx hardhat run scripts/deploy.js --network localhost :: deploy it to the local node
// on a new terminal -> npx hardhat run scripts/deploy.js --network rinkeby :: deploy it to the local node
