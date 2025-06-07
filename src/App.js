import React, { useEffect, useRef, useState } from "react";
import { Fireworks } from "fireworks-js";
import "./App.css"; // Optional if you want to add your own styles

export default function App() {
  const [blownOut, setBlownOut] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const fireworkRef = useRef(null);

  useEffect(() => {
    if (!blownOut) {
      listenToMic();
    } else {
      triggerFireworks();
    }
  }, [blownOut]);

  const listenToMic = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      const mic = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const dataArray = new Uint8Array(analyser.fftSize);
      mic.connect(analyser);

      const checkVolume = () => {
        analyser.getByteTimeDomainData(dataArray);
        const volume =
          dataArray.reduce((acc, val) => acc + Math.abs(val - 128), 0) /
          dataArray.length;

        if (volume > 10) {
          setCandlesLit(false);
          setTimeout(() => setBlownOut(true), 1000);
          stream.getTracks().forEach((track) => track.stop());
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    });
  };

  const triggerFireworks = () => {
    const container = fireworkRef.current;
    if (!container) return;

    const fireworks = new Fireworks(container, {
      rocketsPoint: 50,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.2,
      particles: 80,
      trace: 5,
      explosion: 7,
    });
    fireworks.start();
    setTimeout(() => fireworks.stop(), 5000);
  };

  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffe0e0, #fff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "400px",
          perspective: "1000px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transformStyle: "preserve-3d",
            transition: "transform 1s",
            transform: blownOut ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front - Cake Card */}
          <div
            style={{
              position: "absolute",
              backfaceVisibility: "hidden",
              width: "100%",
              height: "100%",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              🎂 Someone one year older today!
            </h2>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <div
                style={{
                  width: "120px",
                  height: "60px",
                  backgroundColor: "#ff99aa",
                  borderRadius: "20px 20px 0 0",
                }}
              />
              {candlesLit &&
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: `${30 + i * 20}px`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "20px",
                        backgroundColor: "#ffcc00",
                      }}
                    />
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#ff6600",
                        marginTop: "-3px",
                        animation: "flicker 1s infinite alternate",
                      }}
                    />
                  </div>
                ))}
            </div>
            <p>Blow the candles to see your birthday wish 🎉</p>
          </div>

          {/* Back - Wish Card */}
          <div
            style={{
              position: "absolute",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              width: "100%",
              height: "100%",
              background: "#f9e6ff",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              textAlign: "center",
              fontSize: "20px",
              color: "#663399",
              zIndex: 2,
            }}
          >
            <div ref={fireworkRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}></div>
            <div style={{ zIndex: 1 }}>
              🌟 HAPPY BIRTHDAY to my Beloved Najwa, Thank You for all the warm of loves and care. May your year be filled with love, joy, and amazing memories! 🌟
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}