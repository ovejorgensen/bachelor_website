document.getElementById('controlDiv').innerHTML="";
document.getElementById('fpMaker').innerHTML="";
document.getElementById('annoMaker').innerHTML="";
document.getElementById('insertImg').innerHTML="";
document.getElementById('uploadLi').innerHTML="";

window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(false);
viewer.setFOV(60);
viewer.setDescription("Sample 2 - Railway with flightpath overlay");
viewer.setPointBudget(1 * 1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();


let gradientName = "YELLOW_GREEN";
let gradient = Potree.Gradients[gradientName];

let x = 0;
let y = 400

Potree.loadPointCloud("potree/myData/pointclouds/nuPage/cloud.js", "nuPage", e => {    
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    viewer.scene.addPointCloud(pointcloud);
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

    material.activeAttributeName = "elevation";
    material.gradient = gradient;

    // e.pointcloud.position.set(x, y, e.pointcloud.position.z);
    material.elevationRange = [150, 225];//magic number

    e.pointcloud.updateMatrixWorld();
    let box = e.pointcloud.pcoGeometry.tightBoundingBox.clone();
    box.applyMatrix4(e.pointcloud.matrixWorld);
    material.shape = Potree.PointShape.CIRCLE;
    material.size = 1;
    viewer.fitToScreen();

});

gradientSelector("potree/myData/pointclouds/nuPage/cloud.js");

//This geojson was converted slightly differently than the others, hence the reason for it
//having its own convertion function.
GeoJSON = function(geojson, params, scene) {
        var positions = [];
        for (var i=0; i<geojson.features.length; i++) {
            var coord = geojson.features[i].geometry.coordinates;
            var altitude = geojson.features[i].properties.E;
            if(i==geojson.features.length-1){
                var lineGeometry = new THREE.LineGeometry();
                lineGeometry.setPositions( positions );
                var line = new THREE.Line2(lineGeometry, params.lineMaterial);
                scene.add(line);
            }
            else if(i>0 && geojson.features[i].geometry.coordinates[0]!=geojson.features[i-1].geometry.coordinates[0]){
                positions.push( coord[0]*100000-5971866+284348, coord[2]*100000-1022212+5206745, parseInt(altitude)+200); 
        }
    }
}

// Load 3D lines
let params = {};
params.lineMaterial = new THREE.LineMaterial({
    color: 0xff0000,
    linewidth: 0.003,
}); 

function reqListener() {
    var data = JSON.parse(this.responseText);
    GeoJSON(data, params, viewer.scene.scene);
}
  
function reqError(err) {
    console.log('Error while loading GeoJSON :-S', err);
}

let flightpath = document.getElementById("flightPathBtn");
let fpToggle = document.getElementById("fpToggle");

fpToggle.innerHTML="Hide Flightpath";
var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', 'assets/mygeodata/flightpath.geojson', true);
oReq.send();

flightpath.onclick=function(){ 
    if(fpToggle.innerHTML == "Show Flightpath"){
        fpToggle.innerHTML="Hide Flightpath";
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('get', 'assets/mygeodata/flightpath.geojson', true);
        oReq.send();    } 
    else {
        fpToggle.innerHTML="Show Flightpath";
    }
}
