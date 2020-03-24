//This function is for when the user knows the geojson will only contain points,
//and the point cloud and flightpath are on top of each other in the coordinate system
let path = [];
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
        else if(i>0) {
            positions.push( coord[1], coord[0], coord[2]);
            path.push([coord[1], coord[0], coord[2]]);
        }
    } 
}

function flightPathDisplay(url, cloud, animSize, animSpeed){    
    // Load 3D lines
    let params = {};
    params.lineMaterial = new THREE.LineMaterial({
        color: 0xff0000,
        linewidth: 0.005,
    }); 
    function reqListener() {
        var data = JSON.parse(this.responseText);
        GeoJSONConverter(data, params, viewer.scene.scene);

    }
      
    function reqError(err) {
        console.log('Error while loading GeoJSON :-S', err);
    }
    let flightpath = document.getElementById("flightPathBtn");
    let fpToggle = document.getElementById("fpToggle");
    let theBool = true;
    flightpath.onclick=function(){ 
        if(fpToggle.innerHTML == "Show Flightpath"){
            document.getElementById('controlDiv').style.display = 'block';

            fpToggle.innerHTML="Hide Flightpath";
            var oReq = new XMLHttpRequest();
            oReq.onload = reqListener;
            oReq.onerror = reqError;
            oReq.open('get', url, true);
            oReq.send();    
            
            animationHandler(animSize, animSpeed, theBool);
            theBool=false;
        } else {
            active=true;
            fpToggle.innerHTML="Show Flightpath";
            document.getElementById('controlDiv').style.display = 'none';
            newGradientCloud(Potree.Gradients["YELLOW_GREEN_2"], cloud);
        }
    }
}

function animationHandler(size, speed, active){
    //return if the animation has already been created
    if(!active) return;

    let drone = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshNormalMaterial()
    );

    let animation;
    let first = true;
    document.getElementById('anim1').onclick=function(){
        if(!first)animation.resume();
        else{
            viewer.scene.scene.add(drone);
            
            first=false;
            let pathMap = path.map(v => new THREE.Vector3(...v));
            let animationPath = new Potree.AnimationPath(pathMap);
            animationPath.closed = true;

            let start = 0;
            let end = Infinity;
            animation = animationPath.animate(start, end, speed, t => {
                animation.repeat = true;
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
}

//This function is for loading a GeoJSON where the path and point cloud are not located on top
//of each other, giving the user the possibility to specify location via the lat and long parameters
GeoJSONConverter2 = function(geoObj, params, scene, latIn, longIn, startIn, stopIn) {
    let positions = [];
    let start = startIn;
    let stop = stopIn;
        
    for (let i=start; i<geoObj.features.length-stop; i++) {
        let coord = geoObj.features[i].geometry.coordinates;
        let geotype = geoObj.features[i].geometry.type;
        // let lat = coord[0]*100000-1022212+4111287;
        let lat = coord[0]*100000 + latIn;
        // let long = coord[1]*100000-5971866+256387;
        let long = coord[1]*100000 + longIn;
        
        if (geotype.toLowerCase() == 'point') {
            if(i==geoObj.features.length-stop-1){
                let lineGeometry = new THREE.LineGeometry();
                lineGeometry.setPositions( positions );

                let line = new THREE.Line2(lineGeometry, params.lineMaterial);
                scene.add(line);
            }
            else if(i>0){
                positions.push( long, lat, coord[2]); 
                pathAnim.push([long, lat, coord[2]]);
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