document.getElementById('fpLi').innerHTML="";
document.getElementById('controlDiv').innerHTML="";
document.getElementById('annoMaker').innerHTML="";
document.getElementById('insertImg').innerHTML="";
document.getElementById('uploadLi').innerHTML="";

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
let pointContainer = document.getElementById("annoPoints");




close = document.getElementById("closerPoints");
close.onclick = function(){
    pointContainer.style.display = "none";  
    
}

//Display or hide the container 

flightplanner.onclick = function(){
    if(pointContainer.style.display == "none"){
        pointContainer.style.display = "block";
    } else{
        pointContainer.style.display ="none";

    }
    if(active == false){
        active = true;
    }else{
        active = false;
    }
}

var listPoints = [];
var container = document.getElementById("pointContainer");
var index = 1;
var coordinate = document.getElementById("pointCoordinate");
var listMeasures = [];
var tsvList = [];
var coords = document.getElementById("coords");
container.innerHTML += "Points " +'\t';
coords.innerHTML += "Coordinates"; 




viewer.renderer.domElement.addEventListener("mousedown", (e) => { //clicking plan route button
    if(active == true){ 

        let mouse = viewer.inputHandler.mouse;
        const camera = viewer.scene.getActiveCamera(); 
    
        let hit = Potree.Utils.getMousePointCloudIntersection(mouse,camera,viewer, viewer.scene.pointclouds);

        //make point
        if(hit != null){
            let measure = new Potree.Measure();
            measure.showDistances = false; //default true
            measure.showCoordinates = false;
            measure.addMarker(new THREE.Vector3(hit.location.x, hit.location.y, hit.location.z+50)); //new point with XYZ, z+50 is to make the lines visible
            listMeasures.push(measure); //used for coordinate presentation
            viewer.scene.addMeasurement(measure); 
            listPoints.push(hit.location.x, hit.location.y, hit.location.z+50); //+50 is added to make the lines visible

            
            //presentation in the container
            container.innerHTML += index + '\t';
            coords.innerHTML += hit.location.x  + " "+ hit.location.y  + " "+ hit.location.z+50 +"<br></br>";
            
            index+=1;    
        
           
        }


        //Toggle coordinates in the list of measure
        coordinate.onclick = function(){
            for(var i = 0; i<=listMeasures.length; i++){
                if(listMeasures[i].showCoordinates == false ){
                    listMeasures[i].showCoordinates = true; 
                } else {
                    listMeasures[i].showCoordinates = false; 
                }
            }
        }

        //Setup for lines between points
        {

        let geometry = new THREE.BufferGeometry();
        let material = new THREE.LineBasicMaterial({ 
            color: 0xff0000, 
            linewidth: 5 });
        let buffer = new Float32Array(listPoints);
        geometry.addAttribute('position', new THREE.BufferAttribute(buffer, 3)); //Adding data from list of points with 3 variables.
        geometry.computeBoundingSphere();

        let line = new THREE.Line(geometry, material);
        viewer.scene.scene.add(line);
        }
     
    }



    
})




var exporter = document.getElementById('exportPoints');

//initiate download
exporter.onclick = function(){

    //Add coordinates to new list with tab space and newlines
    for(var i=0; i<listPoints.length; i+=3){
        tsvList += listPoints[i].toString()+ " " +listPoints[i+1].toString() + " " +listPoints[i+2].toString() + "\r\n";
    }
    
    download("coordinates.txt", tsvList);
}

function download(filename, data) { //download file with data
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    
    
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}