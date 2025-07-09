var cat;
var amountOfCats;
var counter=0;
var first=true;
function catNum(Num){
    amountOfCats=Num;
    if(first){
        for(let i=1;i<=amountOfCats;i++){
            catLoop(i);
        }
    }
}
var spd;
function catLoop(val){
    cat=document.getElementById("crazed"+val);
    let MaxY=window.innerHeight-cat.offsetHeight;
    let MaxX=window.innerWidth-cat.offsetWidth;
    let randX=Math.random()*MaxX;
    let randY=Math.random()*MaxY;

    cat.style.left=randX+"px";
    cat.style.top=randY+"px";
    cat.style.transform="rotate("+Math.random()*360+"deg)";
}
function updatePos(i){
    catLoop(i);
}
function cooked(){
    requestAnimationFrame(cooked);
    spd=Math.random()*(400-200)+200;
    setTimeout(updatePos, spd,counter%3+1);
    counter++;
}
cooked()
