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
            let desiredX=ball.posx+BALL_RADIUS;
            let errorX=desiredX-this.posx+this.width/2;
            let error=desired-this.posy;
            let touchedSide=true;
            console.log(ball.velx)

            if(is_hard){
                if(this.posx>ball.posx+BALL_RADIUS&&Math.abs(errorX)<20){
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,Math.abs(Math.sign(errorX)*ball.velx*0.003)));
                    if(this.posx>ball.posx+BALL_RADIUS){
                        this.velx=Math.min(PADDLE_VELOCITY,-3+Math.max(-PADDLE_VELOCITY,Math.abs(Math.sign(errorX*ball.velx))));
                    }
                    if(this.posx>BOARD_WIDTH-this.width*2){
                        this.velx=0;
                        this.vely*=0;
                    }  
                }
                else{
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,errorX));
                }
                this.vely=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,error));
                if(Math.abs(ball.velx)<=0.5){
                    this.velx=-2;
                    if(!is_hard){
                        this.vely*=0.7;
                    }
                }
                if(ball.posx<this.width*2&&this.posx<BOARD_WIDTH/4){
                    this.velx=5;
                }
            }else{
                if(this.posx>BOARD_WIDTH-this.width*2){
                    touchedSide=true;
                }
                if(ball.posx>=200){
                    if(this.posx>BOARD_WIDTH-this.width*2&&Math.abs(errorX)<10&&touchedSide){
                        this.velx=-7;
                        touchedSide=false;
                    } else{
                        this.velx=Math.min(PADDLE_VELOCITY-3,Math.max(-PADDLE_VELOCITY+3,errorX*0.5));
                    }
                }else{
                    this.velx=Math.min(PADDLE_VELOCITY,Math.max(-PADDLE_VELOCITY,(BOARD_WIDTH-this.posx+this.width))*0.1)
                }
                this.vely=Math.min(PADDLE_VELOCITY-3,Math.max(-PADDLE_VELOCITY+3,error*0.4));
                if(Math.abs(errorX)>15&&ball.vely<5){
                    this.velx=3;
                }
                if(Math.abs(ball.velx)<=0.5){
                    this.velx=2;
                    if(!is_hard){
                        this.vely*=0.7;
                    }
                }   
            }
        };
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
        this.posx = Math.min(BOARD_WIDTH - this.width, Math.max(0, this.posx + this.velx));

    }

    bounce(ball) {
        let desired = ball.posy - this.height/2;
        let error=desired-this.posy;
        let bounce_dir=Math.sign(BOARD_WIDTH/2-this.posx);
        if(this.startposx>BOARD_WIDTH/2&&this.posx<BOARD_WIDTH/2){
            bounce_dir=-1;
        }else if(this.startposx<BOARD_WIDTH/2&this.posx>BOARD_WIDTH/2){
            bounce_dir=1;   
        }
        if((this.startposx<BOARD_WIDTH/2&&ball.posx<=this.posx)||(this.startposx>BOARD_WIDTH/2&&ball.posx>=this.posx+this.width)){
            bounce_dir=-bounce_dir;
        }
        if(ball.posy<=this.posy+this.height&&ball.posy>=this.posy&&this.startposx<BOARD_WIDTH/2&&this.posx<this.width&&ball.posx<=this.width+1+this.posx){
            ball.velx=1;
        }else if(ball.posy<=this.posy+this.height&&ball.posy>=this.posy&&this.startposx>BOARD_WIDTH/2&&this.posx>BOARD_WIDTH-this.width-1&&ball.posx>=this.posx-this.width){
            ball.velx=-1;
        }
        Model.ballDir=bounce_dir;
        // try bounce ball
        if(ball.posy>=this.posy&&Math.abs(error)<0.4&&this.posx+this.width>=Math.abs(ball.posx+BALL_RADIUS-this.posx-this.width/2)&&this.posx<=Math.abs(ball.posx+BALL_RADIUS-this.posx-this.width/2)){
            ball.vely=-1;
        }else if(ball.posy<=this.posy&&Math.abs(error)<0.4&&this.posx+this.width>=Math.abs(ball.posx+BALL_RADIUS-this.posx-this.width/2)&&this.posx<=Math.abs(ball.posx+BALL_RADIUS-this.posx-this.width/2)){
            ball.vely=1;
        }
        if (ball.posy+BALL_RADIUS >= this.posy && ball.posy-BALL_RADIUS <= this.posy + this.height && // within y
            (ball.posx-BALL_RADIUS<= this.posx+this.width && ball.posx + BALL_RADIUS >= this.posx)// ball going into wall
        ) {
            ball.velx = Math.min(30,Math.max(this.velx+bounce_dir * PADDLE_FORCE * Math.abs(ball.velx)));
            ball.vely = Math.min(4,Math.max(-4,ball.vely+this.vely*0.3))
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
