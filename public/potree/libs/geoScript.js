window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 2 - Railway with flightpath overlay");
viewer.setPointBudget(1 * 1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

 viewer.loadGUI(() => {
     viewer.setLanguage('en');
     $("#menu_appearance").next().show();
     $("#menu_tools").next().show();
     $("#menu_scene").next().show();
 });

let gradientName = "TURBO";
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


GeoJSON = function(url, params, scene) {
    $.ajax({
        url: url ,
        dataType: 'json',
        success: function(geojson) {
            var pointMaterial, lineMaterial, polyMaterial;
            if (params.pointMaterial) {
                pointMaterial = params.pointMaterial;
            } else {
                pointMaterial = new THREE.PointsMaterial({
                    size: 10,
                    color: 0X00ff00,
                    sizeAttenuation: false 
                });
            }

            var positions = [];

            for (var i=0; i<geojson.features.length; i++) {
                
                var coord = geojson.features[i].geometry.coordinates;
                var geotype = geojson.features[i].geometry.type;
                var altitude = geojson.features[i].properties.E;
                
                if (geotype.toLowerCase() == 'point') {
                    if(i==geojson.features.length-1){
                        var lineGeometry = new THREE.LineGeometry();
                        lineGeometry.setPositions( positions );

                        var line = new THREE.Line2(lineGeometry, params.lineMaterial);
                        scene.add(line);
                    }
                    else if(i>0 && geojson.features[i].geometry.coordinates[0]!=geojson.features[i-1].geometry.coordinates[0]){
                        positions.push( coord[0]*100000-5971866+283048, coord[2]*100000-1022212+5206745, parseInt(altitude)+200); 
                        // console.log(coord[0]*100000-5971866+284448, coord[2]*100000-1022212+5206745, parseInt(altitude));
                    }
                    
                } else if (geotype.toLowerCase() == 'linestring') {

                        // var positions = [];

                        for (var j=0; j<coord.length; j++) {
                            Roads.geojson
                            positions.push( coord[j][0]*10000+1208211.34+296.27+284746.34, coord[j][1]*10000-353764.8980-162+5207179.8980, 350 );                    

                            //console.log(coord[j][0]*10000, coord[j][1]*10000);
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

// Load 3D lines
var params = {}
params.lineMaterial = new THREE.LineMaterial({
    color: 0xff0000,
    linewidth: 0.003,
    dashed: true
}); 

GeoJSON("assets/mygeodata/flightpath.geojson", params, viewer.scene.scene);
