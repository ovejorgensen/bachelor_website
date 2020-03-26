
window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 6 - Route Planner");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

let gradientName = "TURBO";
let gradient = Potree.Gradients[gradientName];

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

let flightplanner = document.getElementById("flightPlanBtn");
let active = false;

flightplanner.onclick = function(){
    if(active == false){
        active = true;
        console.log(active);
    }else{
        active = false;
        console.log(active);

    }
}


viewer.renderer.domElement.addEventListener("mousedown", (e) => {
    if(active == true){
        let mouse = viewer.inputHandler.mouse;
        const camera = viewer.scene.getActiveCamera(); 
    
        let hit = Potree.Utils.getMousePointCloudIntersection(mouse,camera,viewer, viewer.scene.pointclouds);
    
        //make point
        let measure = new Potree.Measure();
        measure.showDistances = false;
        measure.showCoordinates = true;
        measure.maxMarkers = 1;
        measure.addMarker(new THREE.Vector3(hit.location.x, hit.location.y, hit.location.z));
    
        viewer.scene.addMeasurement(measure);
    }
    
})
