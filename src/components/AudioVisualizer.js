import React, { useState, useEffect } from "react";

const AudioVisualizer = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [audioContext, setAudioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );

  useEffect(() => {
    const fileInput = document.getElementById("fileInput");
    fileInput.onchange = () => {
      const reader = new FileReader();
      reader.onload = async function () {
        const arrayBuffer = await reader.result;
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        setAudioData(new Uint8Array(bufferLength));
        function renderFrame() {
          requestAnimationFrame(renderFrame);
          analyser.getByteFrequencyData(audioData);
        }
        renderFrame();
      };
      reader.readAsArrayBuffer(fileInput.files[0]);
    };
  }, [audioContext]);

  return (
    <div>
      <input type="file" id="fileInput" />
      <div className="audio-visualizer">
        {audioData.map((data, index) => (
          <div
            key={index}
            className="audio-bar"
            style={{ height: `${data}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
