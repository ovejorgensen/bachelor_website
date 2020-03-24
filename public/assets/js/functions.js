//Change Background
document.getElementById('gradBtn').onclick=function(){ 
    viewer.setBackground("gradient");
}
document.getElementById('skyBtn').onclick=function(){ 
    viewer.setBackground("skybox");
}
document.getElementById('blackBtn').onclick=function(){ 
    viewer.setBackground("black");
}
document.getElementById('whiteBtn').onclick=function(){ 
    viewer.setBackground("white");
}

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
}

function gradientSelector(url) {
    document.getElementById('grad1').onclick=function(){
        newGradientCloud(Potree.Gradients["YELLOW_GREEN_2"], url);
    }
    document.getElementById('grad2').onclick=function(){ 
        newGradientCloud(Potree.Gradients["TURBO"], url);
    }
    document.getElementById('grad3').onclick=function(){ 
        newGradientCloud(Potree.Gradients["VIRIDIS"], url);
    }
}

let points = document.getElementById("setPoints");
var currPoint = document.getElementById("rangevalue");

points.addEventListener('mouseup', function(){
    viewer.setPointBudget(currPoint.value * 1000 * 1000);
    console.log(currPoint.value, viewer.getPointBudget());
})
