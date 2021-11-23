import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CHAIN_IDS, TRANSACTION_STATUS, CONTRACT_ADDRESS } from "../globals";
import CONTRACT_ABI from "../utils/WavePortal.json";

export default function useWallet() {
  const [walletInstalled, setInstalled] = useState(false);
  const [walletConnected, setConnected] = useState(false);
  const [walletNetwork, setNetwork] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [walletAccount, setAccount] = useState("");
  const [walletBalance, setBalance] = useState(0);
  const [totalWaves, setTotalWaves] = useState(0);
  const [waveList, setWaveList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [waveLoading, setWaveLoading] = useState(TRANSACTION_STATUS.None);

  const isRinkeby = walletNetwork?.chainId === CHAIN_IDS.Rinkeby;

  // if MetaMask is installed
  const isWalletInstalled = () => {
    return typeof window.ethereum !== "undefined";
  };

  // get MetaMask account
  const isWalletConnected = async () => {
    if (!window.ethereum) {
      return false;
    }
    const accountList = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accountList.length !== 0;
  };

  const connectWallet = () => {
    return window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accountList) => {
        setAccount(accountList[0]);
      })
      .catch((error) => {
        setWalletError(error);
      });
  };

  const getWalletNetwork = () => {
    if (!window.ethereum) {
      return false;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    return provider.getNetwork();
  };

  const trackAccountChanges = () => {
    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
    });
  };

  const trackNetworkChanges = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });
  };

  const getTotalWaves = async () => {
    if (!window.ethereum) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wavePortalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI.abi,
      provider
    );
    const totalWaves = await wavePortalContract.getTotalWaves();
    return Number.parseInt(totalWaves.toString(), 10);
  };

  const getAllWaves = async () => {
    if (!window.ethereum) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wavePortalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI.abi,
      provider
    );

    const allWaves = await wavePortalContract.getAllWaves();
    if (!allWaves) {
      return [];
    }

    const wavesCleaned = (wave) => ({
      address: wave.waver,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message,
    });

    return allWaves.map(wavesCleaned).reverse();
  };

  const updateWaves = useCallback(
    (walletConnected, isRinkeby) => {
      const runUpdates = async () => {
        setTotalWaves(await getTotalWaves());
        setWaveList(await getAllWaves());
      };
      if (walletConnected && isRinkeby) {
        runUpdates();
      }
    },
    [setTotalWaves, setWaveList]
  );

  const subscribeToWaveEvents = (callback) => {
    if (!window.ethereum) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wavePortalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI.abi,
      provider
    );

    wavePortalContract.on("NewWave", (waver, timestamp, message) => {
      callback({ waver, timestamp, message });
    });
  };

  useEffect(() => {
    subscribeToWaveEvents((newWave) => {
      updateWaves(walletConnected, isRinkeby);
    });
    // SUBSCRICE ONCE when mounting the component
  }, []);

  // return a promise for the transaction
  const writeWave = (message) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI.abi,
      signer
    );

    return wavePortalContract.wave(message, {
      gasLimit: 300000,
    });
  };

  const wave = async (message) => {
    if (!walletInstalled) {
      return;
    }
    if (!walletConnected) {
      // update wave status to connecting
      setWaveLoading(TRANSACTION_STATUS.Connect);
      await connectWallet();
      // update wallet status
      setConnected(await isWalletConnected());
    }
    // update wave status to requesting
    setWaveLoading(TRANSACTION_STATUS.Request);

    writeWave(message)
      .then(async (transaction) => {
        // update wave status to pending
        setWaveLoading(TRANSACTION_STATUS.Pending);
        // wait for wave to finish
        await transaction.wait();
        // update
        updateWaves(walletConnected, isRinkeby);
        // update wave status to begin
        setWaveLoading(TRANSACTION_STATUS.None);
      })
      .catch((error) => {
        window.alert("Failed to write transaction!");
        console.error(error);
        setWaveLoading(TRANSACTION_STATUS.None);
      });
  };

  const sendWave = (message) => wave(message);

  useEffect(() => {
    const runUpdates = async () => {
      // check if metamask is installed
      setInstalled(isWalletInstalled());
      // check if wallet is connected
      setConnected(await isWalletConnected());
      // get network
      setNetwork(await getWalletNetwork());
      // track changes
      trackAccountChanges();
      trackNetworkChanges();
      // stop loading
      setIsLoading(false);
    };
    runUpdates();
  }, []);

  useEffect(() => {
    updateWaves(walletConnected, isRinkeby);
  }, [walletConnected, isRinkeby]);

  useEffect(() => {
    const getAccount = async () => {
      if (walletConnected) {
        // set account
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setAccount(accounts[0]);
      }
    };
    getAccount();
  }, [walletConnected]);

  useEffect(() => {
    const getBalance = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const balance = await provider.getBalance(walletAccount);
      setBalance(ethers.utils.formatEther(balance));
    };
    const updateWalletConnected = async () => {
      setConnected(await isWalletConnected());
    };

    if (walletAccount) {
      getBalance();
      updateWalletConnected();
    }
  }, [walletAccount]);

  return {
    walletInstalled,
    walletConnected,
    connectWallet,
    walletNetwork,
    walletAccount,
    walletBalance,
    totalWaves,
    waveList,
    isLoading,
    isRinkeby,
    waveLoading,
    sendWave,
  };
}
