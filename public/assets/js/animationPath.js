document.getElementById('fpMaker').innerHTML="";
document.getElementById('annoMaker').innerHTML="";
document.getElementById('insertImg').innerHTML="";
document.getElementById('uploadLi').innerHTML="";

window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 3 - Forest with flightpath");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

let drone = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshNormalMaterial()
);
viewer.scene.scene.add(drone);

let gradientName = "TURBO";
let gradient = Potree.Gradients[gradientName];

// let path = [];

Potree.loadPointCloud("potree/myData/pointclouds/samplePage/cloud.js", "samplePage", e => {
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    viewer.scene.addPointCloud(pointcloud);
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

    material.activeAttributeName = "elevation";
    material.gradient = gradient;

    material.shape = Potree.PointShape.CIRCLE;
    material.size = 1;
    viewer.fitToScreen();
});

gradientSelector("potree/myData/pointclouds/samplePage/cloud.js");

// Load 3D lines
let params = {};
params.lineMaterial = new THREE.LineMaterial({
    color: 0xff0000,
    linewidth: 0.003,
}); 
let pathAnim = [];
function reqListener() {
    var data = JSON.parse(this.responseText);
    GeoJSONConverter2(data, params, viewer.scene.scene, 3089075, -5715479, 2100, 2400);
}
  
function reqError(err) {
    console.log('Error while loading GeoJSON :-S', err);
}

let flightpath = document.getElementById("flightPathBtn");
let fpToggle = document.getElementById("fpToggle");
flightpath.onclick=function(){ 
    if(fpToggle.innerHTML == "Show Flightpath"){
        fpToggle.innerHTML="Hide Flightpath";
        document.getElementById('controlDiv').style.display = 'block';

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('get', 'assets/mygeodata/flightpath2.geojson', true);
        oReq.send();    } 
    else {
        fpToggle.innerHTML="Show Flightpath";
        document.getElementById('controlDiv').style.display = 'none';
    }
}

let animation;
let first = true;
document.getElementById('anim1').onclick=function(){
    if(!first)animation.resume();
    else{
        viewer.scene.scene.add(drone);
        
        first=false;
        let pathMap = pathAnim.map(v => new THREE.Vector3(...v));
        let animationPath = new Potree.AnimationPath(pathMap);
        animationPath.closed = true;

        let start = 0;
        let end = Infinity;
        let speed = 200; 
        animation = animationPath.animate(start, end, speed, t => {
            animation.repeat = true;
            // t is a value between 0 and 1.
            // use getPoint(t) to map from t to the position on the animation path
            let point = animation.getPoint(t);
            drone.position.copy(point);
        });
        window.animation = animation;
        window.animationPath = animationPath;
    }
}
document.getElementById('anim2').onclick=function(){animation.pause()}
document.getElementById('anim3').onclick=function(){
    animation.pause();
    viewer.scene.scene.remove(drone);
    first = true;
}



