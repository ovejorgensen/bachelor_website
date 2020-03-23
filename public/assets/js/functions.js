
document.getElementById('gradBtn').onclick=function(){ 
    viewer.setBackground("gradient");
}
document.getElementById('skyBtn').onclick=function(){ 
    viewer.setBackground("skybox");
}
document.getElementById('blackBtn').onclick=function(){ 
    viewer.setBackground("black");
}
document.getElementById('whiteBtn').onclick=function(){ 
    viewer.setBackground("white");
}

let points = document.getElementById("setPoints");
var currPoint = document.getElementById("rangevalue");

points.addEventListener('mouseup', function(){
    viewer.setPointBudget(currPoint.value * 1000 * 1000);
    console.log(currPoint.value, viewer.getPointBudget());
})
