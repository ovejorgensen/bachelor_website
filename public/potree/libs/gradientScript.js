window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 1 - Railway");
viewer.setPointBudget(1 * 1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

//  viewer.loadGUI(() => {
//      viewer.setLanguage('en');
//      $("#menu_appearance").next().show();
//      $("#menu_tools").next().show();
//      $("#menu_scene").next().show();
//  });

// viewer.scene.view.position.set(1441.04, -826.93, 1604.68);
// viewer.scene.view.lookAt(new THREE.Vector3(296.27, -162.42, 786.24));

let gradientName = "TURBO";
let gradient = Potree.Gradients[gradientName];

let x = 0;
let y = 400



Potree.loadPointCloud("potree/myData/pointclouds/nuPage/cloud.js", "nuPage", e => {    
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    viewer.scene.addPointCloud(pointcloud);
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    

    {
        {
            let elTitle = $(`
                <span>
                    About Annotations
                </span>
            `);
            elTitle.find("img[name=action_set_scene]").click( (event) => {
                event.stopPropagation();
                viewer.setScene(viewer.scene); 
            });
            elTitle.toString = () => "About Annotations";

             About1 = new Potree.Annotation({
                position: [285093.891, 5207463.696, 400.305],
                title: elTitle,
                cameraPosition: [285153.891, 5207513.696, 450.305],
                cameraTarget: [285093.891, 5207463.696, 400.305],
                description: `<ul><li>Annotations will store text and images at certain points.</li> 
                <img src="bachelor_wesite/public/assets/images/digital_draft_3.png" alt="test image" width="200px" height="200px">
                </ul>`
              
            });

            viewer.scene.annotations.add(About1);
        }
    }

    material.activeAttributeName = "elevation";
    material.gradient = gradient;

    // e.pointcloud.position.set(x, y, e.pointcloud.position.z);
    material.elevationRange = [150, 225];//magic number

    e.pointcloud.updateMatrixWorld();
    let box = e.pointcloud.pcoGeometry.tightBoundingBox.clone();
    box.applyMatrix4(e.pointcloud.matrixWorld);
    // let center = box.getCenter();
    material.shape = Potree.PointShape.CIRCLE;
    material.size = 1;
    viewer.fitToScreen();





});

/*
document.getElementById('btn4').onclick = function(){
    let anno = document.getElementsByClassName(".annotation");
    if( anno.display === "false"){
        console.log("1");
        anno.display = "true";
    } else {
        anno.display = "false";
        console.log("2");
    }
}*/








