import { useState } from "react";
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import WalletButton from "../components/WalletButton";
import Message from "../components/Message";
import NetworkConnection from "../components/NetworkConnection";
import WaveTransaction from "../components/WaveTransaction";
import WaveList from "../components/WaveList";
import useWallet from "../hooks/useWallet";

const index = () => {
  const {
    walletInstalled,
    walletConnected,
    connectWallet,
    walletAccount,
    walletBalance,
    totalWaves,
    waveList,
    isLoading,
    isRinkeby,
    waveLoading,
    sendWave,
  } = useWallet();

  const [message, setMessage] = useState("");

  return (
    <>
      <Background />
      <div className="items-center flex justify-center py-24">
        <div className="overflow-y-auto z-10 w-4/5 md:w-3/4 lg:w-2/3">
          <div className="bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 bg-white w-full max-h-full rounded-xl items-center flex flex-col justify-center text-white text-center pt-10 pb-6 px-2 md:px-6">
            <NetworkConnection
              walletInstalled={walletInstalled}
              walletConnected={walletConnected}
              isRinkeby={isRinkeby}
              walletAccount={walletAccount}
              walletBalance={walletBalance}
            />
            <Header />
            <Message
              setMessage={setMessage}
              isRinkeby={isRinkeby}
              waveLoading={waveLoading}
              walletConnected={walletConnected}
            />
            <div className="text-right text-black w-5/6 md:w-2/3 p-0 my-1 text-xs md:text-sm font-semibold">
              {message.length} / {240 - message.length}
            </div>
            <WalletButton
              isLoading={isLoading}
              connectWallet={connectWallet}
              walletInstalled={walletInstalled}
              walletConnected={walletConnected}
              sendWave={sendWave}
              message={message}
              waveLoading={waveLoading}
            />
            <Footer />
          </div>
          <WaveTransaction waveLoading={waveLoading} />
          <WaveList waveList={waveList} />
        </div>
      </div>
    </>
  );
};

export default index;
