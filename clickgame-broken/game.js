const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
const SPS_element = document.getElementById("SPS");
const dmg=document.getElementById("damage");
let music = document.getElementById("bunnyBoss");
let BunnyWrinkler=document.getElementById("Bunny");
let score = 50;
let prevScore=0;
let prevSPS=0;
let super_gompei_count = 0;
let multiplier=1;
let negativeCount=0;

let bunSpawned=false;
let bunLim=1;
let curBunAmt=0;
let bunHp=0;
let bunScoreStored=0;
let bunCooldown=0;

let clickDmg=1;

function spawnLeBunny(){
    const Buny=BunnyWrinkler.cloneNode(true);
    let Bun=document.createElement("div");
    Bun.appendChild(Buny);
    Bun.style.visibility="visible"; 
    bunHp=Math.random()*(score-(50+score/2))+50+score/2
    Bun.setAttribute("Hp",Math.round(bunHp));
    Bun.setAttribute("storedScore",Math.round(Math.random()*(score-0)));
    Bun.setAttribute("eating","");
    Bun.style.zIndex=100;
    Buny.onclick= () => {
        bunGettingCooked(Bun);
    }
    Buny.style.position="absolute";
    document.body.appendChild(Bun);
    let x=Math.random()*(window.innerHeight-BunnyWrinkler.offsetHeight)+"px";
    let y=Math.random()*(window.innerWidth-BunnyWrinkler.offsetWidth)+"px";
    Bun.setAttribute("x",x);
    Bun.setAttribute("y",y);
    BunnyEats(Bun,bunHp,bunScoreStored);

}
function eatTimer(bun,time){
    setTimeout(() => {
        // Remove the harvesting flag
        bun.removeAttribute("eating");
        // If automatic, start again
        BunnyEats(bun);
    }, time);
}
function BunnyEats(bun){
    let scoreStored=Number(bun.getAttribute("storedScore"));
    bun.style.top=Number(bun.getAttribute("y"));
    bun.style.left=Number(bun.getAttribute("x"));
    bun.setAttribute("eating", "");
    if(bun.hasAttribute("eating")){
        console.log(scoreStored);
        score-=Math.round(bun.getAttribute("Hp"));
        scoreStored=Math.round(Number(bun.getAttribute("Hp")))+scoreStored;
        changeScore(score, true);
        bun.setAttribute("storedScore",scoreStored);
    }else{
        return;
    }
    eatTimer(bun,Math.random()*(1200-600)+600);
}
function bunSpawnTimer(){
    if(curBunAmt+1<=bunLim&&Math.random()*(20+bunLim-1)+1>1+curBunAmt&&score>800){
        if(!bunSpawned){
            music.play();
            music.volume=1;
            alert("The Bunny Has Spawned");
            bunSpawned=true;
        }
        spawnLeBunny();
        ++curBunAmt;
    }
    if(score>7000){
        bunLim+=Math.round((score-7000)/2)
    }
    setTimeout(bunSpawnTimer,18000);
}
function bunGettingCooked(bun){
    let hp=bun.getAttribute("Hp");
    hp-=clickDmg;
    dmgTickPoint(bun,clickDmg);
    bun.setAttribute("Hp",hp);
    if(hp<=0){
        changeScore(Number(bun.getAttribute("storedScore")));
        bun.remove();
    }
}

function changeScore(amount,subtract=false) {
    if(negativeCount>0){
        multiplier=Math.pow(negativeCount,3);
    }
    if(!subtract&&amount>0){
        score += amount*multiplier;
    }else if(!subtract){
        score+=amount;
    }
    //set score element
    score_element.innerHTML = "Score: " + score;
    // Update the stores to show ones that are too expensive
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
        if(store.hasAttribute("negative")){
            if(score>cost){
                store.setAttribute("broke","")
            }else{
                store.removeAttribute("broke");
            }
        }
    }
}
function SPSCalc(){
    SPS_element.innerHTML= prevSPS+score-prevScore+" Score/Second";
    console.log(multiplier);
    prevSPS>0&prevSPS>clickDmg ? clickDmg=prevSPS : clickDmg=clickDmg;
    dmg.innerHTML=clickDmg+" Damage/Click"
    prevSPS=score-prevScore;
    prevScore=score;
    setTimeout(SPSCalc,1000);
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));
    if(store.hasAttribute("broke")){
        return;
    }
    // check available to buy
    // change score
    score-=cost;
    changeScore(score,true);
    if (store.getAttribute("name") === "Super-Gompei") {
        const super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
        // If Super-Gompei already exists
        if (super_gompei) {
            super_gompei_count += 1;
            document.body.style = "--gompei-count: " + super_gompei_count + ";"
            super_gompei.setAttribute("reap", (parseInt(super_gompei.getAttribute("reap")) + 100));
            return;
        }
    }
    if(store.getAttribute("name")==="Negative Bun"){
        ++negativeCount;
    }
    // clone node for widget, and add to container
    const widget = store.firstElementChild.cloneNode(true);
    widget.onclick = () => {
        harvest(widget);
    }
    widget.style.zIndex=0;
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        widget.setAttribute("harvesting", "");
        setup_end_harvest(widget);
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap")));
    if(Number(widget.getAttribute("cooldown")>0)){
        showPoint(widget);
    }

    setup_end_harvest(widget);
}


function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}
function dmgTickPoint(enemy, hit){
    let dmg=document.createElement("span");
    dmg.className="dmgPoint";
    dmg.innerHTML= "-"+hit;
    dmg.onanimationend=()=>{
        enemy.removeChild(dmg);
    }
    enemy.appendChild(dmg);
}

SPSCalc();
bunSpawnTimer();
changeScore(0);