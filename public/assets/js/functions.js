//Change Background
document.getElementById('gradBtn').onclick=function(){ viewer.setBackground("gradient") }
document.getElementById('skyBtn').onclick=function(){ viewer.setBackground("skybox") }
document.getElementById('blackBtn').onclick=function(){ viewer.setBackground("black") }
document.getElementById('whiteBtn').onclick=function(){ viewer.setBackground("white") }


// TODO, when this function is called the old point cloud and everything related to
// it has to be completely removed before creating a new one.
function newGradientCloud(gradient, url) {
    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

    Potree.loadPointCloud(url, "cloud", e => {
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
    gradientSelector();
}

function newCloud(url) {
    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

    // let pcScene = new Potree.Scene();
    // viewer.setScene(pcScene);

    Potree.loadPointCloud(url, "cloud", e => {
        let pointcloud = e.pointcloud;
        let material = pointcloud.material;
        viewer.scene.addPointCloud(pointcloud);
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

        material.activeAttributeName = "elevation";
        material.gradient = Potree.Gradients["YELLOW_GREEN_2"];
    
        material.shape = Potree.PointShape.CIRCLE;
        material.size = 1;
        viewer.fitToScreen();
    });
    gradientSelector();
}

function gradientSelector() {
    document.getElementById('grad1').onclick=function(){
        for(let pointcloud of viewer.scene.pointclouds){
            pointcloud.material.activeAttributeName = "elevation";
            pointcloud.material.gradient = Potree.Gradients["YELLOW_GREEN_2"];
        }
    }
    document.getElementById('grad2').onclick=function(){ 
        for(let pointcloud of viewer.scene.pointclouds){
            pointcloud.material.activeAttributeName = "elevation";
            pointcloud.material.gradient = Potree.Gradients["TURBO"];
        }    }
    document.getElementById('grad3').onclick=function(){ 
        for(let pointcloud of viewer.scene.pointclouds){
            pointcloud.material.activeAttributeName = "elevation";
            pointcloud.material.gradient = Potree.Gradients["VIRIDIS"];
        }    
    }
    document.getElementById('rgba').onclick=function(){
        for(let pointcloud of viewer.scene.pointclouds){
            pointcloud.material.activeAttributeName = "RGBA";
        }
    }
}

let points = document.getElementById("setPoints");
var currPoint = document.getElementById("rangevalue");

points.addEventListener('mouseup', function(){
    viewer.setPointBudget(currPoint.value * 1000 * 1000);
})

function uploadModal(){
    // Get the modal
    var modal = document.getElementById("uploadModal");
    // Get the button that opens the modal
    var btn = document.getElementById("modBtn");
    // Get the <span> element that closes the modal
    var span = document.getElementById("close");
    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
