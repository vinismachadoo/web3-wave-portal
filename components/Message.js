import { TRANSACTION_STATUS } from "../globals";

const Message = ({ setMessage, isRinkeby, waveLoading, walletConnected }) => {
  return (
    <div className="w-5/6 md:w-2/3 h-24 mt-5">
      <textarea
        type="text"
        disabled={
          !walletConnected ||
          !isRinkeby ||
          waveLoading !== TRANSACTION_STATUS.None
        }
        maxLength="240"
        onChange={(e) =>
          setMessage(
            waveLoading === TRANSACTION_STATUS.Pending ? "" : e.target.value
          )
        }
        placeholder="Send a message to blockchain"
        className="p-2 w-full h-full resize-none text-xs md:text-sm text-black border border-transparent rounded-md bg-pink-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>
  );
};

export default Message;
