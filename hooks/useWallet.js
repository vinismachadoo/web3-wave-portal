import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CHAIN_IDS, TRANSACTION_STATUS, CONTRACT_ADDRESS } from "../globals";
import CONTRACT_ABI from "../utils/WavePortal.json";

export default function useWallet() {
  const [walletInstalled, setInstalled] = useState(false);
  const [walletConnected, setConnected] = useState(false);
  const [walletNetwork, setNetwork] = useState(null);
  const [walletAccount, setAccount] = useState("");
  const [walletBalance, setBalance] = useState(0);
  const [totalWaves, setTotalWaves] = useState(0);
  const [waveList, setWaveList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRinkeby, setIsRinkeby] = useState(false);
  const [waveLoading, setWaveLoading] = useState(TRANSACTION_STATUS.None);

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
      .request({ method: "eth_accounts" })
      .then((accountList) => {
        setAccount(accountList[0]);
      })
      .catch((error) => {
        setWalletError(error);
      });
  };

  // get Wallet Network
  const getWalletNetwork = () => {
    if (!window.ethereum) {
      return false;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    return provider.getNetwork();
  };

  const trackChanges = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    provider.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
    });

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
    (isRinkeby) => {
      const runUpdates = async () => {
        setTotalWaves(await getTotalWaves());
        setWaveList(await getAllWaves());
      };
      if (isRinkeby) {
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
      updateWaves();
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
        updateWaves();
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
      trackChanges();
      // stop loading
      setIsLoading(false);
    };
    runUpdates();
  }, []);

  useEffect(() => {
    if (walletNetwork) {
      setIsRinkeby(walletNetwork.chainId === CHAIN_IDS.Rinkeby);
    }
    connectWallet();
  }, [walletNetwork]);

  useEffect(() => {
    updateWaves(isRinkeby);
  }, [isRinkeby]);

  useEffect(() => {
    const getBalance = async () => {
      if (walletAccount) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );

        const balance = await provider.getBalance(walletAccount);
        setBalance(ethers.utils.formatEther(balance));
      }
    };
    getBalance();
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
