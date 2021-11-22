const WaveList = ({ waveList }) => {
  return (
    <div className="w-full">
      {waveList.map((wave, index) => {
        const waver = wave.address;
        const message = wave.message;
        const timestamp = wave.timestamp.toLocaleString();

        return (
          <div
            className="my-2 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 bg-white rounded-xl p-3"
            key={index}
          >
            <div className="flex">
              <div className="flex text-3xl mx-3 items-center">👋</div>
              <div>
                <div className="text-xs md:text-sm">
                  <span className="mr-2 font-bold">From:</span>
                  {waver}
                </div>
                <div className="text-xs md:text-sm">
                  <span className="mr-2 font-bold">Time:</span>
                  {timestamp}
                </div>
                <div className="text-xs md:text-sm">
                  <span className="mr-2 font-bold">Message:</span>
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
