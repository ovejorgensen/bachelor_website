
window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 1 - Railway");
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

// viewer.scene.view.position.set(1441.04, -826.93, 1604.68);
// viewer.scene.view.lookAt(new THREE.Vector3(296.27, -162.42, 786.24));

let gradientName = "TURBO";
let gradient = Potree.Gradients[gradientName];

let x = 0;
let y = 400

Potree.loadPointCloud("http://5.9.65.151/mschuetz/potree/resources/pointclouds/opentopography/CA13_1.4/cloud.js", "CA13", e => {
    let scene = viewer.scene;
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    scene.addPointCloud(pointcloud);
    
    material.pointSizeType = Potree.PointSizeType.FIXED;
    material.size = 1;
    
    // scene.view.position.set(697757.85, 3913444.33, 2827.33);
    // scene.view.lookAt(new THREE.Vector3(695231.74, 3916988.94, 87.64));
    // scene.view.position.set(-1208234.595, 353835.955, 100); FUNGERENDE
    // scene.view.lookAt(new THREE.Vector3(-1208234.595, 353835.955, 0));
    scene.view.position.set(-1208234.595+1905991, 3913444.33, 100);
    scene.view.lookAt(new THREE.Vector3(-1208234.595+1905991, 3913444.33, 0));



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
            
            if (params.lineMaterial) {
                lineMaterial = params.lineMaterial;
            } else {
                lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff00,
                    linewidth: 5
                });
            }

            for (var i=0; i<geojson.features.length; i++) {
                
                var coord = geojson.features[i].geometry.coordinates;
                var geotype = geojson.features[i].geometry.type;
                
                if (geotype.toLowerCase() == 'point') {
                    var pointGeometry = new THREE.Geometry();
                    pointGeometry.vertices.push(new THREE.Vector3(coord[0], coord[1], coord[2]));
                    var point = new THREE.PointCloud(pointGeometry, pointMaterial );
                    scene.add(point);
                } else if (geotype.toLowerCase() == 'linestring') {
                        var lineGeometry = new THREE.Geometry();
                        for (var j=0; j<coord.length; j++) {
                            lineGeometry.vertices.push(
                                // new THREE.Vector3(coord[j][0]*10000, coord[j][1]*10000, 0)
                                new THREE.Vector3(coord[j][0]*10000+1905991, (coord[j][1]*10000)+3559609, 0)
                            );
                        }
                        var line = new THREE.Line(lineGeometry, lineMaterial );
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
params.lineMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    linewidth: 100
}); 

GeoJSON("assets/shape/roads.geojson", params, viewer.scene.scene);
