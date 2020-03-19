
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

let path = [];

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

GeoJSONConverter = function(geoObj, params, scene) {
    let positions = [];
    let start = 2100;
    let stop = 2400;
        
    for (let i=start; i<geoObj.features.length-stop; i++) {
        
        let coord = geoObj.features[i].geometry.coordinates;
        let geotype = geoObj.features[i].geometry.type;
        // let lat = coord[0]*100000-1022212+4111287;
        let lat = coord[0]*100000+3089075;
        // let long = coord[1]*100000-5971866+256387;
        let long = coord[1]*100000-5715479;
        
        if (geotype.toLowerCase() == 'point') {
            if(i==geoObj.features.length-stop-1){
                let lineGeometry = new THREE.LineGeometry();
                lineGeometry.setPositions( positions );

                let line = new THREE.Line2(lineGeometry, params.lineMaterial);
                scene.add(line);
            }
            else if(i>0){
                positions.push( long, lat, coord[2]); 
                path.push([long, lat, coord[2]]);
            }
            
        } 
        else if (geotype.toLowerCase() == 'linestring') {
            let posLineString = [];
            for (let j=0; j<coord.length; j++) {
                posLineString.push( coord[j][0], coord[j][1], 350 );                    
            }

            let lineGeometry = new THREE.LineGeometry();
            lineGeometry.setPositions( posLineString );

            let line = new THREE.Line2(lineGeometry, params.lineMaterial);

            scene.add(line);
        } else {
            console.log(geoObj.features[i].geometry.type + 'Geometry type not (yet) supported');
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
    GeoJSONConverter(data, params, viewer.scene.scene)
}
  
function reqError(err) {
    console.log('Error while loading GeoJSON :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', 'assets/mygeodata/flightpath2.geojson', true);
oReq.send();

document.getElementById('btn6').onclick=function(){ 
    let pathMap = path.map(v => new THREE.Vector3(...v));
    let animationPath = new Potree.AnimationPath(pathMap);
    animationPath.closed = true;

    let start = 0;
    let end = Infinity;
    let speed = 200; 
    let animation = animationPath.animate(start, end, speed, t => {
        animation.repeat = true;
        // t is a value between 0 and 1.
        // use getPoint(t) to map from t to the position on the animation path
        let point = animation.getPoint(t);
        drone.position.copy(point);
    });
    window.animation = animation;

    window.animationPath = animationPath;
}


