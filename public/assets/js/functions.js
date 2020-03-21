
document.getElementById('btn1').onclick=function(){ 
    if(viewer.getBackground() == "gradient") viewer.setBackground("skybox") ;
    else viewer.setBackground("gradient");
}


let points = document.getElementById("setPoints");
var currPoint = document.getElementById("rangevalue");

points.addEventListener('mouseup', function(){
    viewer.setPointBudget(currPoint.value * 1000 * 1000);
    console.log(currPoint.value, viewer.getPointBudget());
})
