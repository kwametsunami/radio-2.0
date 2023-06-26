import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

const HLSPlayer = (props) => {
  const url = props.stationUrl;
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(true);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().play();
    }
    setPlaying(true);
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().pause();
    }
    setPlaying(false);
  };

  const handleVolumeChange = (volume) => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().volume = volume;
    }
  };

  const setDefaultAlert = () => {
    alert(
      "Sorry, this station is offline or unavailable in your region. Please select another stream."
    );
    setPlaying(false);
  };

  return (
    <div className="hlsplayer">
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls={false}
        playing={true}
        width="100%"
        height="auto"
        volume={1}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={setDefaultAlert}
      />

      <div className="playerControls">
        <div className="playPause">
          {playing ? (
            <button className="playerButton pause" onClick={handlePause}>
              <i className="fa-solid fa-pause"></i>
            </button>
          ) : (
            <button className="playerButton play" onClick={handlePlay}>
              <i className="fa-solid fa-play"></i>
            </button>
          )}
        </div>
        <div className="volume">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            defaultValue={1}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default HLSPlayer;
