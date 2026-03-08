
// Scoreboard variables
let runs = 0;
let wickets = 0;
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

// Slider probabilities configuration
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
        { label: '4', prob: 0.15, score: 4, class: 'score-4' },
        { label: '6', prob: 0.20, score: 6, class: 'score-6' }
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

function setStyle(style) {
    currentStyle = style;
    
    // Update button visual state
    document.getElementById('btn-aggressive').classList.toggle('active', style === 'aggressive');
    document.getElementById('btn-defensive').classList.toggle('active', style === 'defensive');

    const config = styleConfig[style];
    const track = document.getElementById('slider-track');
    const labelsDiv = document.querySelector('.slider-labels');
    
    // Create segments
    let segmentsHTML = '';
    config.forEach(item => {
        segmentsHTML += `<div class="segment ${item.class}" style="width: ${item.prob * 100}%;">${item.label}</div>`;
    });

    // Add pointer back
    segmentsHTML += `
        <div class="slider-pointer" id="slider-pointer">
            <div class="pointer-box"></div>
        </div>
    `;
    track.innerHTML = segmentsHTML;

    // Update labels
    let labelsHTML = '<span>0</span>';
    let cumulative = 0;
    config.forEach(item => {
        cumulative += item.prob;
        labelsHTML += `<span>${cumulative.toFixed(2)}</span>`;
    });
    labelsDiv.innerHTML = labelsHTML;
}

function playBall() {
 }

// Initial call
setStyle('defensive');

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

function shot(){
    // Legacy support, or just call playBall
    playBall();
}

function wicket(){
    // Legacy support
    resetAnimations();
    wickets += 1;
    ballsBowled += 1;
    updateScoreboard();
    ball.classList.add('anim-wicket-ball');
    batsman.classList.add('anim-wicket-bat');
    stumps.classList.add('anim-stumps-break');
    bails.classList.add('anim-bails-fly');
}
