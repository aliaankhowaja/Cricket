
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

function updateScoreboard() {
    runsEl.textContent = runs;
    wicketsEl.textContent = wickets;
    const ballsLeft = totalBalls - ballsBowled;
    const oversLeft = Math.floor(ballsLeft / ballsPerOver);
    const ballsInOver = ballsLeft % ballsPerOver;
    oversEl.textContent = `${oversLeft}.${ballsInOver}`;
}

updateScoreboard();

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
    resetAnimations();

    ballsBowled += 1;
    updateScoreboard();
    ball.classList.add('anim-shot-ball');
    batsman.classList.add('anim-shot-bat');
}

function wicket(){
    resetAnimations();
    // Example: Add 1 wicket and 1 ball bowled
    wickets += 1;
    ballsBowled += 1;
    updateScoreboard();
    ball.classList.add('anim-wicket-ball');
    batsman.classList.add('anim-wicket-bat');
    stumps.classList.add('anim-stumps-break');
    bails.classList.add('anim-bails-fly');
}