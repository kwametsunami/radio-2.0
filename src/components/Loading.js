import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = () => {
  return (
    <div className="loadingPage">
      <ScaleLoader
        color={"#EDD060"}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
