const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
const SPS_element = document.getElementById("SPS");
let music = document.getElementById("bunnyBoss");
let BunnyWrinkler=document.getElementById("Bunny");
let score = 500;
let prevScore=0;
let prevSPS=0;
let super_gompei_count = 0;
let multiplier=1;

let bunSpawned=false;
let bunLim=1;
let curBunAmt=0;
let bunHp=0;
let bunScoreStored=0;
let bunCooldown=0;

let clickDmg=1;

function spawnLeBunny(){
    const Bun=BunnyWrinkler.firstElementChild.cloneNode(true);
    Bun.style.visibility="visible";
    bunHp=Math.random()*(score-(50+score/2))+50+score/2
    Bun.style="--Hp: "+bunHp;
    Bun.setAttribute("eating","");
    Bun.style.zIndex=100;
    Bun.onclick= () => {
        bunGettingCooked(Bun);
    }
    BunnyEats(Bun);
    Bun.style.position="absolute";
    document.body.appendChild(Bun);
    Bun.classList.add("bunny");
    Bun.style="--y: "+Math.random()*(window.innerHeight-BunnyWrinkler.offsetHeight)+"px";
    Bun.style="--x: "+Math.random()*(window.innerWidth-BunnyWrinkler.offsetWidth)+"px";
    Bun.left=getComputedStyle(Bun).getPropertyValue("--x");
    Bun.top=getComputedStyle(Bun).getPropertyValue("--y");

    console.log(Bun.classList);

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
    console.log(getComputedStyle(bun).getPropertyValue("--storedScore"));
    bun.setAttribute("eating", "");
    if(getComputedStyle(bun).getPropertyValue("--Hp")>0&&!bun.hasAttribute("eating")){
        score-=getComputedStyle(bun).getPropertyValue("--Hp");
        bunScoreStored+=getComputedStyle(bun).getPropertyValue("--Hp")
        bun.bunny.style="--storedScore: "+bunScoreStored;
        bunGettingCooked(bun);
        changeScore(score, true);
    }else{
        if(!bun.hasAttribute("eating")){
            bun.removeAttribute("eating");
            changeScore(getComputedStyle(bun).getPropertyValue("--storedScore"))
            setTimeout(function(){document.body.remove(bun);},1000);
        }else{
            return;
        }
    }
    eatTimer(bun,Math.random()*(1200-600)+600);
}
function bunSpawnTimer(){
    if(curBunAmt+1<=bunLim&&Math.random()*(20+bunLim-1)+1>3+curBunAmt&&score>200){
        if(!bunSpawned){
            music.autoplay=true;
            alert("The Bunny Has Spawned");
            bunSpawned=true;
        }
        spawnLeBunny();
        ++curBunAmt;
    }
    if(score>1000){
        bunLim+=Math.round((score-1000)/2)
    }
    setTimeout(bunSpawnTimer,1000);
}
function bunGettingCooked(bun){
    prevSPS>0&prevSPS>clickDmg ? clickDmg=prevSPS : clickDmg=clickDmg;
    bunHp=getComputedStyle(bun).getPropertyValue("--Hp")-clickDmg;
    dmgTickPoint(bun,clickDmg);
    bun.style="--Hp: "+bunHp;
    if(bunHp<=0){
        bun.remove();
    }
}

function changeScore(amount,subtract=false) {
    if(!subtract){
        score += amount*multiplier;
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
    }
}
function SPSCalc(){
    console.log(clickDmg);
    SPS_element.innerHTML= prevSPS+score-prevScore+" Score/Second";
    prevSPS=score-prevScore;
    prevScore=score;
    setTimeout(SPSCalc,1000);
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));
    if(score<cost){
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
    showPoint(widget);

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