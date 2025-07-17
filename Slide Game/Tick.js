let scrambled=false;
let scrambling=false;
let availableNum=[];
let box=[];
let puzzleBox=[];
function createPuzzleBox(){
    const board=[...document.getElementById("catGrid").children];
    let puzzleBoard=[];
    for(i=0;i<16;i+=4){
        puzzleBoard.push(board.slice(i,i+4));
    }
    return puzzleBoard;
}
function start(){

    for(let i=1;i<16;i++){
        availableNum.push(i);
    }
    availableNum.push(" ");
    for(let i=0;i<16;i+=4){
        box.push(availableNum.slice(i,i+4));
    }
    //console.log(randomizedArr);
}
function findBlank(){
    let coord=[0,0];
    for(let i=0;i<4;i++){
        for(let k=0;k<4;k++){
            if(puzzle[i][k].innerHTML==" "){
                coord[0]=i;
                coord[1]=k;
                return coord;
            }
        }
    }

}
let counter=0;
let oldX=-1;
let oldY=-1;
function scramble(){
    if(counter<500){
        let blankCoord=findBlank();
        let vert=0;
        let hori=0;
        let newX=0;
        let newY=0;
        do{
            let rando=Math.round(Math.random()*4+1)
            switch(rando){
                case 1:
                    vert=1;
                    hori=0;
                    break;
                case 2:
                    vert=-1;
                    hori=0;
                    break;
                case 3:
                    hori=1;
                    vert=0;
                    break;
                case 4:
                    hori=-1;
                    vert=0;
                    break;
            }
            newX=blankCoord[0]+hori;
            newY=blankCoord[1]+vert;
        }while((newX<0||newX>3||newY<0||newY>3)||(newX==oldX&&newY==oldY))
        puzzle[blankCoord[0]][blankCoord[1]].innerHTML=puzzle[newX][newY].innerHTML;
        puzzle[newX][newY].innerHTML=" ";
        oldX=newX;
        oldY=newY;
        counter++;
        setTimeout(scramble, 10);
    }else{
        scrambled=true;
        counter=0;
        return;
    }
}
const puzzle=createPuzzleBox();
function setUp(schtuff){
    for(let i=0;i<4;i++){
        console.log(schtuff[i]);
        for(let k=0;k<4;k++){   
            puzzle[i][k].innerHTML=schtuff[i][k];
            console.log(puzzle[i][k].innerHTML)
        }
    }
}
function M1(x,y){
    if(!scrambled) return;
    let blankNear=false;
    let X =[-1,0,0,1];
    let Y =[0,-1,1,0];
    let goox=0;
    let gooy=0;
    for(i=0;i<4;i++){
        goox=X[i];
        gooy=Y[i];

        if(x+goox>=0&&x+goox<4&&y+gooy>=0&&y+gooy<4&&puzzle[x+goox][y+gooy].innerHTML==" "){
            console.log(puzzle[x+goox][y+gooy].innerHTML)   
            blankNear=true;
        }
        if(blankNear){

            puzzle[x+goox][y+gooy].innerHTML=puzzle[x][y].innerHTML;
            puzzle[x][y].innerHTML=" ";
            break;
        }
    }

}
start();
setUp(box);
scramble();