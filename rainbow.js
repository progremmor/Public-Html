let element=document.getElementById("tswcontainer");
console.log(element);
let angle=0;
let tune=document.getElementById("spookytuney")
let video=document.getElementById("cookedblender")
let input=document.getElementById("colorInput")
let increment=0.3;
let shouldRainbow=true;

tune.loop=true;
video.loop=true;

function gradOnFrame(){
    requestAnimationFrame(gradOnFrame);
    if(shouldRainbow){
        video.autoplay=true;
        tune.autoplay=true;
        element.style.backgroundColor="hsl("+angle+"deg, 100%, 50%)"
    }else{
        tune.autoplay=false;   
        video.autoplay=false; 
    }
    if(angle<360){
        angle+=increment;
    }else{
        angle=increment;
    }
}
gradOnFrame();
function startRainbow(){
    shouldRainbow=true;

}
function onM1(event){
    shouldRainbow=false
    if(input.value!=""){
        element.style.backgroundColor=input.value;
    }else{
        setTimeout(startRainbow, 1000);
    }
    console.log(video);
}
