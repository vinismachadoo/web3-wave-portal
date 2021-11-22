import { TRANSACTION_STATUS } from "../globals";

const WaveTransaction = ({ waveLoading }) => {
  if (waveLoading !== TRANSACTION_STATUS.Pending) {
    return <div></div>;
  }

  return (
    <div className="w-full flex justify-center items-center my-2 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 bg-black text-white rounded-xl p-3">
      <img className="w-4 h-4 mr-3" src="/grid.svg" alt="loading" />
      <span>Transaction in progress</span>
    </div>
  );
};

export default WaveTransaction;
