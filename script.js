const ball = document.getElementById('ball');
const batsman = document.querySelector('.batsman');
const stumps = document.querySelector('.stumps');
const bails = document.querySelector('.bails');

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
    
    ball.classList.add('anim-shot-ball');
    batsman.classList.add('anim-shot-bat');

}

function wicket(){
    resetAnimations();
    
    ball.classList.add('anim-wicket-ball');
    batsman.classList.add('anim-wicket-bat');
    stumps.classList.add('anim-stumps-break');
    bails.classList.add('anim-bails-fly');

}