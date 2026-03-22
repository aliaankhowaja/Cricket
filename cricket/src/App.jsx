import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// --- Config ---
const TOTAL_WICKETS = 2;
const TOTAL_BALLS = 12;
const BALLS_PER_OVER = 6;

const styleConfig = {
  defensive: [
    { label: "W", prob: 0.1,  score: -1, cls: "wicket"  },
    { label: "0", prob: 0.3,  score: 0,  cls: "score-0" },
    { label: "1", prob: 0.4,  score: 1,  cls: "score-1" },
    { label: "2", prob: 0.06, score: 2,  cls: "score-2" },
    { label: "3", prob: 0.05, score: 3,  cls: "score-3" },
    { label: "4", prob: 0.05, score: 4,  cls: "score-4" },
    { label: "6", prob: 0.04, score: 6,  cls: "score-6" },
  ],
  aggressive: [
    { label: "W", prob: 0.4,  score: -1, cls: "wicket"  },
    { label: "0", prob: 0.05, score: 0,  cls: "score-0" },
    { label: "1", prob: 0.05, score: 1,  cls: "score-1" },
    { label: "2", prob: 0.05, score: 2,  cls: "score-2" },
    { label: "3", prob: 0.1,  score: 3,  cls: "score-3" },
    { label: "4", prob: 0.20, score: 4,  cls: "score-4" },
    { label: "6", prob: 0.15, score: 6,  cls: "score-6" },
  ],
};

function getOutcome(normalizedPosition, style) {
  const config = styleConfig[style];
  let cumulative = 0;
  for (const item of config) {
    cumulative += item.prob;
    if (normalizedPosition <= cumulative) return item;
  }
  return config[config.length - 1];
}

function formatOvers(ballsLeft) {
  return `${Math.floor(ballsLeft / BALLS_PER_OVER)}.${ballsLeft % BALLS_PER_OVER}`;
}

export default function App() {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [style, setStyle] = useState("defensive");
  const [isAnimating, setIsAnimating] = useState(false);
  const [runText, setRunText] = useState("");
  const [runBurstKey, setRunBurstKey] = useState(0); // force re-animation

  // animation state classes
  const [ballAnim, setBallAnim] = useState("");
  const [batsmanAnim, setBatsmanAnim] = useState("");
  const [stumpsAnim, setStumpsAnim] = useState("");
  const [bailsAnim, setBailsAnim] = useState("");

  // slider
  const [sliderMoving, setSliderMoving] = useState(false);
  const [sliderLeft, setSliderLeft] = useState("0%");
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  // game over flag
  const gameOver = ballsBowled >= TOTAL_BALLS || wickets >= TOTAL_WICKETS;

  // start/stop slider
  const startSlider = useCallback(() => setSliderMoving(true), []);

  const stopSlider = useCallback(() => {
    if (!sliderRef.current || !trackRef.current) return 0;
    const computedLeft = parseFloat(window.getComputedStyle(sliderRef.current).left);
    const trackWidth = trackRef.current.offsetWidth;
    const pct = (computedLeft / trackWidth) * 100;
    setSliderMoving(false);
    setSliderLeft(pct + "%");
    return pct / 100;
  }, []);

  // reset animation classes
  const resetAnimations = useCallback(() => {
    setBallAnim("");
    setBatsmanAnim("");
    setStumpsAnim("");
    setBailsAnim("");
  }, []);

  // auto-start slider on mount and style change
  useEffect(() => {
    if (!isAnimating && !gameOver) startSlider();
  }, [style]); // eslint-disable-line

  // init slider
  useEffect(() => {
    startSlider();
  }, []); // eslint-disable-line

  function showRunText(text) {
    setRunText(String(text));
    setRunBurstKey((k) => k + 1);
  }

  function handleGameAreaClick() {
    if (isAnimating || gameOver) return;
    setIsAnimating(true);

    const position = stopSlider();
    const outcome = getOutcome(position, style);

    const newBalls = ballsBowled + 1;
    setBallsBowled(newBalls);

    if (outcome.score === -1) {
      setWickets((w) => {
        const newW = w + 1;
        // check game over after state update
        setTimeout(() => checkGameOverState(newBalls, newW), 1600);
        return newW;
      });
      showRunText("OUT!");
      // wicket animation
      resetAnimations();
      setBallAnim("anim-wicket-ball");
      setBatsmanAnim("anim-wicket-bat");
      setStumpsAnim("anim-stumps-break");
      setBailsAnim("anim-bails-fly");
      setTimeout(() => {
        setIsAnimating(false);
        resetAnimations();
      }, 1500);
    } else {
      setRuns((r) => r + outcome.score);
      showRunText(outcome.score);
      // shot animation
      resetAnimations();
      setBallAnim("anim-shot-ball");
      setBatsmanAnim("anim-shot-bat");
      setTimeout(() => {
        setIsAnimating(false);
        resetAnimations();
      }, 2000);
    }
  }

  function checkGameOverState(balls, wkts) {
    if (balls >= TOTAL_BALLS || wkts >= TOTAL_WICKETS) {
      setTimeout(() => {
        alert(`GAME OVER!\nFinal Score: ${runs + (wickets !== wkts ? 0 : 0)}/${wkts}\nOvers: ${formatOvers(balls)}`);
      }, 500);
    } else {
      startSlider();
    }
  }

  // after non-wicket animation ends, start slider if game not over
  useEffect(() => {
    if (!isAnimating && ballsBowled > 0 && !gameOver) {
      startSlider();
    }
  }, [isAnimating]); // eslint-disable-line

  function restartGame() {
    setRuns(0);
    setWickets(0);
    setBallsBowled(0);
    setIsAnimating(false);
    setRunText("");
    resetAnimations();
    setSliderLeft("0%");
    startSlider();
  }

  const ballsLeft = TOTAL_BALLS - ballsBowled;
  const config = styleConfig[style];

  return (
    <>
      {/* Game area */}
      <div className="game-container" onClick={handleGameAreaClick}>
        <div className="sky">
          <div className="scoreboard">
            <div className="score-row">
              <span className="score-label">Runs:</span>
              <span>{runs}</span>
            </div>
            <div className="score-row">
              <span className="score-label">Wickets:</span>
              <span>{wickets}</span>
            </div>
            <div className="score-row">
              <span className="score-label">Overs/Balls Left:</span>
              <span>{formatOvers(ballsLeft)}</span>
            </div>
          </div>
        </div>

        <div className="grass" />

        <div className="pitch">
          {/* Stumps */}
          <div className={`stumps ${stumpsAnim}`}>
            <div className="stump stump-left" />
            <div className="stump stump-mid" />
            <div className="stump stump-right" />
            <div className={`bails ${bailsAnim}`} />
          </div>

          {/* Batsman */}
          <div className={`batsman ${batsmanAnim}`}>
            <div className="head" />
            <div className="body" />
            <div className="leg leg-front" />
            <div className="leg leg-back" />
            <div className="arm">
              <div className="bat" />
            </div>
          </div>

          {/* Ball */}
          <div className={`ball ${ballAnim}`} />
        </div>

        {/* Run burst text */}
        <div key={runBurstKey} className={`run-burst ${runText ? "anim-run-burst" : ""}`}>
          {runText}
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        {/* Style buttons */}
        <div className="style-selection">
          <button
            className={`style-btn ${style === "aggressive" ? "active" : ""}`}
            onClick={() => setStyle("aggressive")}
          >
            Aggressive
          </button>
          <button
            className={`style-btn ${style === "defensive" ? "active" : ""}`}
            onClick={() => setStyle("defensive")}
          >
            Defensive
          </button>
        </div>

        {/* Probability slider */}
        <div className="probability-slider-container">
          <div className="slider-track" ref={trackRef}>
            {config.map((item) => (
              <div
                key={item.cls}
                className={`segment ${item.cls}`}
                style={{ width: `${item.prob * 100}%` }}
              >
                {item.label}
              </div>
            ))}
            {/* Pointer */}
            <div
              ref={sliderRef}
              className={`slider-pointer ${sliderMoving ? "anim-slider-move" : ""}`}
              style={sliderMoving ? {} : { left: sliderLeft }}
            >
              <div className="pointer-box" />
            </div>
          </div>
        </div>

        <button className="restart-btn" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </>
  );
}