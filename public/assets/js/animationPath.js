
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

// var loader = new GLTFLoader();

// loader.load( 'assets/3d_assets/drone.glb', function ( gltf ) {
// 	scene.add( gltf.scene );
// }, undefined, function ( error ) {
//     console.error( error );
// });

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

        // Load 3D lines
    var params = {}
    params.lineMaterial = new THREE.LineMaterial({
        color: 0xff0000,
        linewidth: 0.003,
        dashed: true
    }); 

    GeoJSON("assets/mygeodata/flightpath2.geojson", params, viewer.scene.scene);

});

GeoJSON = function(url, params, scene) {
    $.ajax({
        url: url ,
        dataType: 'json',
        success: function(geojson) {
            var positions = [];

            for (var i=0; i<geojson.features.length; i++) {
                
                var coord = geojson.features[i].geometry.coordinates;
                var geotype = geojson.features[i].geometry.type;
                
                if (geotype.toLowerCase() == 'point') {
                    if(i==geojson.features.length-1){
                        var lineGeometry = new THREE.LineGeometry();
                        lineGeometry.setPositions( positions );

                        var line = new THREE.Line2(lineGeometry, params.lineMaterial);
                        scene.add(line);
                    }
                    else if(i>0 && coord[0]!=geojson.features[i-1].geometry.coordinates[0]){
                        positions.push( coord[1]*100000-5971866+256387, coord[0]*100000-1022212+4111287, coord[2]); 
                        if(Math.trunc(coord[0]*100000-1022212+4111287)!= Math.trunc(geojson.features[i-1].geometry.coordinates[0]*100000-1022212+4111287)){
                            path.push([coord[1]*100000-5971866+256387, coord[0]*100000-1022212+4111287, coord[2]]);
                        }
                    }
                    
                } else if (geotype.toLowerCase() == 'linestring') {
                        for (var j=0; j<coord.length; j++) {
                            positions.push( coord[j][0]*10000+1208211.34+296.27+284746.34, coord[j][1]*10000-353764.8980-162+5207179.8980, 350 );                    
                        }

                        var lineGeometry = new THREE.LineGeometry();
                        lineGeometry.setPositions( positions );

                        var line = new THREE.Line2(lineGeometry, params.lineMaterial);

                        scene.add(line);
                } else {
                    console.log(geojson.features[i].geometry.type + 'Geometry type not (yet) supported');
                }
            }
        },
        error: function(req, status, err) {
            console.log('Potree: error loading geojson', status, err );
        }
    });
}

document.getElementById('btn6').onclick=function(){ 

        let path2 = path.map(v => new THREE.Vector3(...v));
        let animationPath = new Potree.AnimationPath(path2);
        animationPath.closed = true;
    
        let start = 1050;
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


