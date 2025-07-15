const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };
class Paddle {
    posx;
    posy;
    startposx;
    width;
    height;
    color;

    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.startposx=posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
        this.velx=0;
    }
    set_cpu(event){
        this.is_cpu=event.target.checked;
    }
    set_hard(event){
        this.is_hard=event.target.checked;
    }
    move(is_cpu, ball,is_hard) {
        if (is_cpu) {

            // ball.y <- where the ball is
            // this.y <- where the paddle is
            // this.l <- how long the paddle is
            // control this.vy using ball
            // don't set this.y! (cheating)
            //let error=ball.y-this.y;
            let desired = ball.posy - this.height/2;
            let desiredX=ball.posx+this.width;
            let errorX=desiredX-this.posx;
            let error=desired-this.posy;
            if(ball.posx>250){
                if(this.posx>ball.posx+BALL_RADIUS&&Math.abs(errorX)<100){
                    this.velx=0;
                        //this.posx+=BALL_RADIUS*ball.velx;
                }else{
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,errorX*0.05));
                }
            }else{
                this.velx=0;
            }

            if(is_hard){
                if(this.posx>ball.posx+BALL_RADIUS&&Math.abs(errorX)<20){
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,Math.abs(Math.sign(errorX)*ball.velx*0.003)));
                    if(this.posx>ball.posx+BALL_RADIUS){
                        this.velx=Math.min(PADDLE_VELOCITY,-3+Math.max(-PADDLE_VELOCITY,Math.abs(Math.sign(errorX*ball.velx))));
                    }
                    if(this.posx>BOARD_HEIGHT-this.width*2){
                        this.velx=0;
                        this.vely*=0;
                    }  
                }
                else{
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,errorX));
                }
                this.vely=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,error));
            }else{
                if(error<5){
                    this.vely=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,error));          
                }else{
                    this.velx=0;
                    this.vely=Math.sign(error)*0.8;
                }
            }
        };
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
        this.posx = Math.min(BOARD_WIDTH - this.width, Math.max(0, this.posx + this.velx));
    }

    bounce(ball) {
        let bounce_dir=Math.sign(BOARD_WIDTH/2-this.posx);
        if(this.startposx>BOARD_WIDTH/2&&this.posx<BOARD_WIDTH/2){
            bounce_dir=-1;
        }else if(this.startposx<BOARD_WIDTH/2&this.posx>BOARD_WIDTH/2){
            bounce_dir=1;   
        }
        Model.ballDir=bounce_dir;
        // try bounce ball
        if (ball.posy+BALL_RADIUS >= this.posy && ball.posy-BALL_RADIUS <= this.posy + this.height && // within y
            (ball.posx-BALL_RADIUS<= this.posx+this.width && ball.posx + BALL_RADIUS >= this.posx)// ball going into wall
        ) {
            ball.velx = Math.min(30,Math.max(this.velx+bounce_dir * PADDLE_FORCE * Math.abs(ball.velx)));
            ball.vely = Math.min(2,Math.max(2,ball.vely+this.vely*0.003))

            return SIDE.NONE;
        }

        return SIDE.NONE;
    }
}

// function bounceRightPaddle(paddle) {
//     if (this.posx + BALL_RADIUS < paddle.posx) return SIDE.NONE;
//     if (this.posx + BALL_RADIUS > paddle.posx + paddle.width) return SIDE.LEFT; // Someone got a point...
//     if (this.posy < paddle.posy) return SIDE.NONE;
//     if (this.posy > paddle.posy + paddle.height) return SIDE.NONE;
//     if (this.velx > 0) {
//         this.velx = -PADDLE_FORCE * Math.abs(this.velx);
//         // add other spin, etc.
//         // add sound?
//     }
//     return SIDE.NONE;
// }
