const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    ctx.strokeStyle="white";
    ctx.lineWidth=5;
    ctx.strokeRect(0,0,BOARD_WIDTH,BOARD_HEIGHT);


    ctx.beginPath();
    ctx.setLineDash([10, 15]);

    ctx.lineTo(BOARD_WIDTH / 2, 0);
    ctx.moveTo(BOARD_WIDTH / 2, BOARD_HEIGHT);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);

    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle="white";
    ctx.fill();  
    ctx.stroke();                                                                                                                                                                                                                                    
    ctx.closePath();


}

function draw_paddle(ctx, paddle) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.rect(paddle.posx, paddle.posy, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.stroke();   
    ctx.closePath();
}
