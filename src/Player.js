import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

  const setDefaultAlert = () => {
    alert(
      "Sorry, this station is offline or unavailable in your region. Please select another stream."
    );
  };

const Player = (props) => {
  return (
    <section className="radio">
      <div className="radioPlayer">
        <AudioPlayer
          autoPlay
          layout="horizontal-reverse"
          showJumpControls={false}
          onError={setDefaultAlert}
          src={props.audioSource}
        />
      </div>
    </section>
  );
};

export default Player;
