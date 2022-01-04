const WaveList = ({ waveList }) => {
  return (
    <div className="w-full">
      {waveList.map((wave, index) => {
        const waver = wave.address;
        const message = wave.message;
        const timestamp = wave.timestamp.toLocaleString();

        return (
          <div
            className="my-2 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 z-0 bg-white rounded-xl p-3"
            key={index}
          >
            <div className="flex">
              <div className="hidden sm:flex items-center mx-3 z-30">
                <img
                  src="/wave.png"
                  alt="wave"
                  className="w-4 sm:w-8 h-4 sm:h-8 mx-auto opacity-100"
                />
              </div>
              <div className="w-full">
                <div className="hidden sm:flex text-xs md:text-sm before:content-['From:'] before:font-bold before:mr-1">
                  {waver}
                </div>
                <div className="flex sm:hidden text-xs md:text-sm before:content-['From:'] before:font-bold before:mr-1">
                  ...{waver.slice(waver.length - 8)}
                </div>
                <div className="text-xs md:text-sm before:content-['Time:'] before:font-bold before:mr-1 line-clamp-1">
                  {timestamp}
                </div>
                <div className="text-xs md:text-sm before:content-['Message:'] before:font-bold before:mr-1 line-clamp-3 break-words">
                  {message}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WaveList;
