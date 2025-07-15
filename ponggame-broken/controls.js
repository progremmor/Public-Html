window.addEventListener("keydown", keyDown);
function keyDown(event) {
    const key = event.code;
    // console.log(`KEYDOWN: ${key}`);

    switch (key) {
        case "ArrowUp":
            model.paddleR.vely = -PADDLE_VELOCITY;
            break;
        case "ArrowDown":
            model.paddleR.vely = PADDLE_VELOCITY;
            break;
        case "ArrowRight":
            model.paddleR.velx=PADDLE_VELOCITY;
            break;
        case "ArrowLeft":
            model.paddleR.velx=-PADDLE_VELOCITY;
            break;
        case "KeyW":
            model.paddleL.vely = -PADDLE_VELOCITY;
            break;
        case "KeyD":
            model.paddleL.velx=PADDLE_VELOCITY;
            break;
        case "KeyA":
            model.paddleL.velx=-PADDLE_VELOCITY;
            break;
        case "KeyS":
            model.paddleL.vely = PADDLE_VELOCITY;
            break;
        case "End":
            model.resetGame();
            break;
        
    }
}
window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;
    // console.log(`KEYUP: ${key}`);

    switch (key) {
        case "ArrowUp":
        case "ArrowDown":
            model.paddleR.vely = 0;
            break;
        case "ArrowRight":
        case "ArrowLeft":
            model.paddleR.velx=0;
            break;
        case "KeyS":
        case "KeyW":
            model.paddleL.vely = 0;
            break;
        case "KeyA":
        case "KeyD":
            model.paddleL.velx=0;
            break;
    }
}

function resetGame() {
    model.resetGame();
    onTick();
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
}
function set_hard(event){
    model.is_hard=event.target.checked;
}