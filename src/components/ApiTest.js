import React from "react";
import HLSPlayer from "./HLSPlayer";

const ApiTest = () => {
  const sourceUrl =
    "https://prod-54-159-183-174.wostreaming.net/bristolbroad-wexxfmaac-hlsc2.m3u8";

  return (
    <div>
      <h1>HLS Player</h1>
      <HLSPlayer />
    </div>
  );
};

export default ApiTest;
