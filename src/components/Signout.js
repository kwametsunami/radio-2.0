import PropagateLoader from "react-spinners/PropagateLoader";

const Signout = () => {
  return (
    <div className="signedOut">
      <div className="speakerContainer">
        <div className="speaker">
          <div className="topCone">
            <div className="topConeInner"></div>
          </div>
          <div className="bottomCone">
            <div className="bottomConeInner">
              <div className="innerInner"></div>
            </div>
          </div>
        </div>
        <div className="speaker">
          <div className="topCone">
            <div className="topConeInner"></div>
          </div>
          <div className="bottomCone">
            <div className="bottomConeInner">
              <div className="innerInner"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="signedOutText">
        <h2 className="signOutGreeting">
          We'll keep the music going -- see you next time!
        </h2>
        <PropagateLoader
          color={"#EDD060"}
          height={80}
          width={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Signout;
