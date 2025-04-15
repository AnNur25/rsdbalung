import logo from "~/assets/logosquare.jpg";

const imageErrorHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = logo;
};

export default imageErrorHandler;
