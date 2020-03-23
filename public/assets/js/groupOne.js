window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Group One Sample Point Cloud");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

let gradientName = "YELLOW_GREEN_2";
let gradient = Potree.Gradients[gradientName];


Potree.loadPointCloud("potree/myData/pointclouds/groupOneBlocksPage2/cloud.js", "GroupOneBlocksPage2", e => {
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

GeoJSONConverter = function(geoObj, params, scene) {
    let positions = [];
    for (let i=0; i<geoObj.features.length; i++) {
        let coord = geoObj.features[i].geometry.coordinates;        
        if(i==geoObj.features.length-1){
            let lineGeometry = new THREE.LineGeometry();
            lineGeometry.setPositions( positions );

            let line = new THREE.Line2(lineGeometry, params.lineMaterial);
            scene.add(line);
        }
        else if(i>0) positions.push( coord[1], coord[0], coord[2]); 
    } 
}
// Load 3D lines
let params = {};
params.lineMaterial = new THREE.LineMaterial({
    color: 0xff0000,
    linewidth: 0.005,
}); 

function reqListener() {
    var data = JSON.parse(this.responseText);
    GeoJSONConverter(data, params, viewer.scene.scene)
}
  
function reqError(err) {
    console.log('Error while loading GeoJSON :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', 'assets/mygeodata/blocksData.geojson', true);
oReq.send();