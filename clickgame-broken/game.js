const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
const SPS_element = document.getElementById("SPS");
const world=document.getElementById("worldBuns");
let BunnyWrinkler=document.getElementById("Bunny");
let score = 5;
let prevScore=0;
let prevSPS=0;
let super_gompei_count = 0;
let multiplier=1;

let bunSpawned=false;
let bunBunHp =0;
let bunLim=1;
let curBunAmt=0;
let bunHp=0;
let bunScoreStored=0;
let bunCooldown=0;

let clickDmg=1;

function spawnLeBunny(){
    BunnyWrinkler.style.visibility="visible";
    BunnyWrinkler.style.top=Math.random()*(window.innerHeight-BunnyWrinkler.offsetHeight)+"px";
    BunnyWrinkler.style.left=Math.random()*(window.innerWidth-BunnyWrinkler.offsetWidth)+"px";
    const Bun=BunnyWrinkler.cloneNode(true);
    world.appendChild(Bun);
    Bun.setAttribute("eating");
}
function BunnyEats(){

}
function bunSpawnTimer(){
    if(curBunAmt+1<=bunLim&&Math.random()*(20-1)+1>3+curBunAmt&&score>200){
        console.log("bun")
        if(!bunSpawned){
            alert("The Bunny Has Spawned");
            
            bunSpawned=true;
        }
        spawnLeBunny();
        curBunAmt++;
    }
    if(score>1000){
        bunLim+=Math.round((score-1000)/2)
    }
    setTimeout(bunSpawnTimer,1000);
}
function bunGettingCooked(){

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
SPSCalc();
bunSpawnTimer();
changeScore(0);