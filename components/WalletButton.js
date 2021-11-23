import { TRANSACTION_STATUS } from "../globals";

const WalletButton = ({
  isLoading,
  walletInstalled,
  walletConnected,
  sendWave,
  message,
  waveLoading,
  connectWallet,
}) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div>
      {!walletInstalled && (
        <a href="https://metamask.io/download.html" target="_blank">
          <button className="px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-purple-500 bg-purple-500 hover:bg-transparent hover:text-purple-500">
            Install MetaMask ⬇️
          </button>
        </a>
      )}
      {walletInstalled && !walletConnected && (
        <button
          className="px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-purple-500 bg-purple-500 hover:bg-transparent hover:text-purple-500"
          onClick={() => connectWallet()}
        >
          Connect Wallet 🦊
        </button>
      )}
      {walletConnected && (
        <button
          disabled={!message || waveLoading !== TRANSACTION_STATUS.None}
          className={classNames(
            message && waveLoading === TRANSACTION_STATUS.None
              ? "hover:bg-transparent hover:border-black hover:text-black"
              : "opacity-50 cursor-not-allowed",
            "px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-purple-500 bg-purple-500"
          )}
          onClick={() => sendWave(message)}
        >
          Wave at me 👋 {walletConnected}
        </button>
      )}
    </div>
  );
};

export default WalletButton;
