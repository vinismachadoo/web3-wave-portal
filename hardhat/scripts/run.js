const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners(); // wallet address of contract owner and random wallet address

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); // generate required files
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  }); // create a local eth network (everytime)
  await waveContract.deployed(); // wait untill the contract is officially deployed

  console.log("Contract addy:", waveContract.address);

  // get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const waveTxn = await waveContract.wave("This is wave #0"); // send a wave myself
  await waveTxn.wait();

  // check if new balance has decreased in 0.0001 ether
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
