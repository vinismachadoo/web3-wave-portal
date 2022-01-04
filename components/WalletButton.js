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
    <div className="mt-2">
      {!walletInstalled && (
        <a href="https://metamask.io/download.html" target="_blank">
          <button className="px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-black bg-black hover:bg-transparent hover:text-black">
            Install MetaMask
            <img
              src="/download.png"
              alt="download"
              className="w-3 sm:w-4 h-3 sm:h-4 ml-2"
            />
          </button>
        </a>
      )}
      {walletInstalled && !walletConnected && (
        <button
          className="px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-black bg-black hover:bg-transparent hover:text-black"
          onClick={() => connectWallet()}
        >
          Connect Wallet
          <img
            src="/metamask.png"
            alt="metamask"
            className="w-3 sm:w-4 h-3 sm:h-4 ml-2"
          />
        </button>
      )}
      {walletConnected && (
        <button
          disabled={!message || waveLoading !== TRANSACTION_STATUS.None}
          className={classNames(
            message && waveLoading === TRANSACTION_STATUS.None
              ? "hover:bg-transparent hover:border-black hover:text-black"
              : "opacity-50 cursor-not-allowed",
            "flex items-center px-3 py-0.5 text-sm md:text-lg rounded-lg border-2 border-black bg-black"
          )}
          onClick={() => sendWave(message)}
        >
          Wave at me
          <img
            src="/wave.png"
            alt="wave"
            className="w-3 sm:w-4 h-3 sm:h-4 ml-2"
          />
        </button>
      )}
    </div>
  );
};

export default WalletButton;
