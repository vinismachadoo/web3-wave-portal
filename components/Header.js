const Header = () => {
  return (
    <div className="flex text-black w-5/6 md:w-2/3">
      <div className="flex items-center mr-3 md:mr-6">
        <img
          className="h-16 md:h-24 w-16 md:w-24"
          src="/eth-dynamic-color.png"
          alt="etherium"
        />
      </div>
      <div className="text-left">
        <div className="font-mono text-sm md:text-xl">Hi there,</div>
        <div className="text-xl md:text-5xl font-bold mb-2">
          I'm{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500">
            Vinicius
          </span>
        </div>
        <div className="font-mono text-sm md:text-xl">
          This is my first project of the Web3 Series 🌈
        </div>
      </div>
    </div>
  );
};

export default Header;