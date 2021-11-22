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
          <button className="px-3 py-0.5 text-sm md:text-lg font-semibold rounded-lg bg-black">
            Install MetaMask ⬇️
          </button>
        </a>
      )}
      {walletInstalled && !walletConnected && (
        <button
          className="px-3 py-0.5 text-sm md:text-lg font-semibold rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
          onClick={() => connectWallet}
        >
          Connect Wallet 🦊
        </button>
      )}
      {walletConnected && (
        <button
          className={classNames(
            message && waveLoading === TRANSACTION_STATUS.None
              ? "hover:bg-transparent hover:text-purple-500"
              : "opacity-50 cursor-not-allowed",
            "px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-purple-500 bg-purple-500"
          )}
          onClick={() => sendWave(message)}
        >
          Wave at me 👋
        </button>
      )}
    </div>
  );
};

export default WalletButton;
