import PulseLoader from "react-spinners/PulseLoader";

const Loading = () => {
  return (
    <div className="loadingPage">
      <PulseLoader
        color={"#EDD060"}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
