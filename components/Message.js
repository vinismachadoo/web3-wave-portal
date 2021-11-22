import { TRANSACTION_STATUS } from "../globals";

const Message = ({ setMessage, isRinkeby, waveLoading }) => {
  return (
    <div className="w-5/6 md:w-2/3 h-24 mt-5">
      <textarea
        type="text"
        disabled={!isRinkeby || waveLoading !== TRANSACTION_STATUS.None}
        maxLength="240"
        onChange={(e) =>
          setMessage(TRANSACTION_STATUS.Pending ? "" : e.target.value)
        }
        placeholder="Send a message to blockchain"
        className="p-2 w-full h-full resize-none text-xs md:text-sm text-purple-500 border border-transparent rounded-md bg-pink-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
};

export default Message;
