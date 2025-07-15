const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WiDTH = 25;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 6.25;
const PADDLE_VELOCITY = 5;
const PADDLE_FORCE = 1; // 110% of speed before

class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    ballDir;
    is_cpu = false;
    is_hard=false;
    state = STATE.STARTUP;
    intervalID = -1;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.STARTUP;
        this.scoreL=0;
        this.scoreR=0;
        updateScore(this);
        clearTimeout(this.intervalID);
        this.resetBall();
        this.paddleL = new Paddle(0, BOARD_HEIGHT/2, PADDLE_WiDTH, PADDLE_HEIGHT, SIDE.LEFT, "white");
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WiDTH, BOARD_HEIGHT/2, PADDLE_WiDTH+this.scoreL, PADDLE_HEIGHT, SIDE.RIGHT, "lightgray");
    }

    resetBall() {
        this.ballDir=1+(Math.round(Math.random())*-2);
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2,1+(Math.round(Math.random())*-2), Math.random()*2-1);
    }

}
