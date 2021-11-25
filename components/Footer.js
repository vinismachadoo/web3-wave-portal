import {
  TWITTER_LINK,
  TWITTER_USERNAME,
  GITHUB_LINK,
  GITHUB_USERNAME,
} from "../globals";

const Footer = () => {
  return (
    <div className="mt-6 text-black flex items-center text-xs">
      <a href={`${TWITTER_LINK}${TWITTER_USERNAME}`} target="_blank">
        {`built with 🖤 by @${TWITTER_USERNAME}`}
      </a>
      <p className="mx-1">&rarr;</p>
      <a href={`${TWITTER_LINK}${TWITTER_USERNAME}`} target="_blank">
        <img className="w-4 h-4 mx-1" src="/twitter.png" alt="twitter" />
      </a>
      <a href={`${GITHUB_LINK}${GITHUB_USERNAME}`} target="_blank">
        <img className="w-4 h-4 mx-1" src="/github.png" alt="github" />
      </a>
    </div>
  );
};

export default Footer;