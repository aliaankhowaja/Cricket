
// scoreboard variables
let runs = 0;
let wickets = 0;
const totalWickets = 2
let totalBalls = 12; // 2 overs
let ballsBowled = 0;
const ballsPerOver = 6;

const ball = document.getElementById('ball');
const batsman = document.querySelector('.batsman');
const stumps = document.querySelector('.stumps');
const bails = document.querySelector('.bails');

const runsEl = document.getElementById('score-runs');
const wicketsEl = document.getElementById('score-wickets');
const oversEl = document.getElementById('score-overs');
const runText = document.getElementById('run-text');

// slider probabilities configuration
const styleConfig = {
    defensive: [
        { label: 'W', prob: 0.1, score: -1, class: 'wicket' },
        { label: '0', prob: 0.3, score: 0, class: 'score-0' },
        { label: '1', prob: 0.4, score: 1, class: 'score-1' },
        { label: '2', prob: 0.06, score: 2, class: 'score-2' },
        { label: '3', prob: 0.05, score: 3, class: 'score-3' },
        { label: '4', prob: 0.05, score: 4, class: 'score-4' },
        { label: '6', prob: 0.04, score: 6, class: 'score-6' }
    ],
    aggressive: [
        { label: 'W', prob: 0.4, score: -1, class: 'wicket' },
        { label: '0', prob: 0.05, score: 0, class: 'score-0' },
        { label: '1', prob: 0.05, score: 1, class: 'score-1' },
        { label: '2', prob: 0.05, score: 2, class: 'score-2' },
        { label: '3', prob: 0.1, score: 3, class: 'score-3' },
        { label: '4', prob: 0.20, score: 4, class: 'score-4' },
        { label: '6', prob: 0.15, score: 6, class: 'score-6' }
    ]
};

let currentStyle = 'defensive';

function updateScoreboard() {
    runsEl.textContent = runs;
    wicketsEl.textContent = wickets;
    const ballsLeft = totalBalls - ballsBowled;
    const oversLeft = Math.floor(ballsLeft / ballsPerOver);
    const ballsInOver = ballsLeft % ballsPerOver;
    oversEl.textContent = `${oversLeft}.${ballsInOver}`;
}

updateScoreboard();


const gameContainer = document.querySelector('.game-container');
let isAnimating = false;

function startSlider() {
    const pointer = document.getElementById('slider-pointer');
    if (pointer) {
        pointer.classList.add('anim-slider-move');
    }
}

function stopSlider() {
    const pointer = document.getElementById('slider-pointer');
    if (pointer) {
        const computedStyle = window.getComputedStyle(pointer);
        const leftValue = computedStyle.left;
        const trackWidth = document.getElementById('slider-track').offsetWidth;
        const percentage = (parseFloat(leftValue) / trackWidth) * 100;
        
        pointer.classList.remove('anim-slider-move');
        pointer.style.left = percentage + '%';
        return percentage / 100;
    }
    return 0;
}

function getOutcome(normalizedPosition) {
    const config = styleConfig[currentStyle];
    let cumulative = 0;
    for (const item of config) {
        cumulative += item.prob;
        if (normalizedPosition <= cumulative) {
            return item;
        }
    }
    return config[config.length - 1];
}

function showRunText(text) {
    runText.textContent = text;
    runText.classList.remove('anim-run-burst');
    void runText.offsetWidth; // trigger reflow
    runText.classList.add('anim-run-burst');
}

gameContainer.addEventListener('click', () => {
    if (isAnimating || ballsBowled >= totalBalls || wickets >= totalWickets) return;
    
    isAnimating = true;
    const position = stopSlider();
    const outcome = getOutcome(position);
    
    ballsBowled++;
    if (outcome.score === -1) {
        wickets++;
        showRunText('OUT!');
        playWicketAnimation();
    } else {
        runs += outcome.score;
        showRunText(outcome.score);
        playShotAnimation();
    }
    updateScoreboard();
});

function playShotAnimation() {
    resetAnimations();
    ball.classList.add('anim-shot-ball');
    batsman.classList.add('anim-shot-bat');
    
    setTimeout(() => {
        isAnimating = false;
        if (ballsBowled < totalBalls && wickets < totalWickets) startSlider();
    }, 2000); // matches bowl-and-hit duration
}

function playWicketAnimation() {
    resetAnimations();
    ball.classList.add('anim-wicket-ball');
    batsman.classList.add('anim-wicket-bat');
    stumps.classList.add('anim-stumps-break');
    bails.classList.add('anim-bails-fly');
    
    setTimeout(() => {
        isAnimating = false;
        if (ballsBowled < totalBalls && wickets < totalWickets) startSlider();
    }, 1500); // matches bowl-to-stumps duration
}

function setStyle(style) {
    currentStyle = style;
    
    // update button state
    document.getElementById('btn-aggressive').classList.toggle('active', style === 'aggressive');
    document.getElementById('btn-defensive').classList.toggle('active', style === 'defensive');

    const config = styleConfig[style];
    const track = document.getElementById('slider-track');
    
    // create segments
    let segmentsHTML = '';
    config.forEach(item => {
        segmentsHTML += `<div class="segment ${item.class}" style="width: ${item.prob * 100}%;">${item.label}</div>`;
    });

    // add pointer
    segmentsHTML += `
        <div class="slider-pointer" id="slider-pointer">
            <div class="pointer-box"></div>
        </div>
    `;
    track.innerHTML = segmentsHTML;
    
    if (!isAnimating) startSlider();
}

function playBall() {
}

setStyle('defensive');
startSlider();

function resetAnimations() {
    ball.classList.remove('anim-shot-ball', 'anim-wicket-ball');
    batsman.classList.remove('anim-shot-bat', 'anim-wicket-bat');
    stumps.classList.remove('anim-stumps-break');
    bails.classList.remove('anim-bails-fly');

    void ball.offsetWidth;
    void batsman.offsetWidth;
    void stumps.offsetWidth;
    void bails.offsetWidth;
}

