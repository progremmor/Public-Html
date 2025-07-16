function M1(index){

}
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
function scramble(){
    
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