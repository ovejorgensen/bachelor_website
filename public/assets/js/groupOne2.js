document.getElementById('fpMaker').innerHTML="";
document.getElementById('annoMaker').innerHTML="";
document.getElementById('insertImg').innerHTML="";
document.getElementById('uploadLi').innerHTML="";

window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Group One Sample Point Cloud");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

newGradientCloud(Potree.Gradients["TURBO"], "potree/myData/pointclouds/groupOneMazePage/cloud.js");

gradientSelector("potree/myData/pointclouds/groupOneMazePage/cloud.js");

flightPathDisplay("assets/mygeodata/groupOne3.geojson", "potree/myData/pointclouds/groupOneMazePage/cloud.js", 2, 25);
