function M1(index){

}
let availableNum=[]

function start(){
    const board=[...document.getElementById("board").children];
    let box=[];
    for(let i=1;i<16;i++){
        availableNum.push(i);
    }
    for(let i;i<16;i+=4){
        box.push(board.slice(i,i+4));
    }    
    return box;
}
const puzzle=start();