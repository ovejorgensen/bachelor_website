document.getElementById('fpLi').innerHTML="";
document.getElementById('controlDiv').innerHTML="";

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
        { //Defining annotations
            let elTitle = $(`
                <span id="spanID1">
                    Annotations #1
                </span>
            `);
            
            elTitle.toString = () => "Annotations #1";

            event.stopPropagation();
             About1 = new Potree.Annotation({
                position: [285393.891, 5207463.696, 400.305],
                title: elTitle,
                cameraPosition: [285453.891, 5207513.696, 450.305],
                cameraTarget: [285393.891, 5207463.696, 400.305],
                description:"",
            });

            let elTitle2 = $(`
                <span id="spanID2">
                    Annotations #2
                </span>
            `);
            elTitle2.find("img[name=action_set_scene]").click( (event) => {
                viewer.setScene(viewer.scene); 
            });
            elTitle2.toString = () => "Annotations #2";

                event.stopPropagation();
             About2 = new Potree.Annotation({
                position: [284793.891, 5207463.696, 400.305],
                title: elTitle2,
                cameraPosition: [284853.891, 5207513.696, 450.305],
                cameraTarget: [284793.891, 5207463.696, 400.305],
                description:"",
            });
            let elTitle3 = $(`
            <span id="spanID3">
                Annotations #3
            </span>
            `);
            elTitle3.find("img[name=action_set_scene]").click( (event) => {
                viewer.setScene(viewer.scene); 
            });
            elTitle3.toString = () => "Annotations #2";

                event.stopPropagation();
            About3 = new Potree.Annotation({
                position: [284293.891, 5207063.696, 300.305],
                title: elTitle3,
                cameraPosition: [285353.891, 5208113.696, 350.305],
                cameraTarget: [284293.891, 5207063.696, 300.305],
                description:"",
            });

            viewer.scene.annotations.add(About1);
            viewer.scene.annotations.add(About2);
            viewer.scene.annotations.add(About3);   

        } //Show/hide annotations

        // document.getElementsByClassName('closer').onclick = function(el) {
        //     this.el.style.display = "none";
        // }

         el = document.getElementById("anno1");
         a1 = document.getElementById("spanID1");

         a1.onclick = function(){
            el2.style.display = "none";
            el3.style.display = "none";
            if(el.style.display == "none" && el2.style.display == "none" && el3.style.display == "none"){
                el.style.display = "block";
                }else{
                el.style.display = "none";
            }
        }
        el2 = document.getElementById("anno2");
        a2 = document.getElementById("spanID2");

        a2.onclick = function(){
            el.style.display = "none";
            el3.style.display = "none";
            if(el.style.display == "none" && el2.style.display == "none" && el3.style.display == "none"){
            el2.style.display = "block";
            }else{
            el2.style.display = "none";
        }}

        el3 = document.getElementById("anno3");
        a3 = document.getElementById("spanID3");

        a3.onclick = function(){
            el2.style.display = "none";
            el.style.display = "none";
            if(el.style.display == "none" && el2.style.display == "none" && el3.style.display == "none"){
            el3.style.display = "block";
            }else{
            el3.style.display = "none";
        }}

        close = document.getElementById("closer");
        close.onclick = function(){
            el.style.display = "none";  
            
        }
        
        close2 = document.getElementById("closer2");
        close2.onclick = function(){
            el2.style.display = "none";  
        }
        close3 = document.getElementById("closer3");
        close3.onclick = function(){
            el3.style.display = "none";  
            
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