window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Group One Sample Point Cloud");
// viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

newGradientCloud(Potree.Gradients["YELLOW_GREEN_2"], "potree/myData/pointclouds/groupOneBlocksPage2/cloud.js");

gradientSelector("potree/myData/pointclouds/groupOneBlocksPage2/cloud.js");

flightPathDisplay("assets/mygeodata/blocksData.geojson", "potree/myData/pointclouds/groupOneBlocksPage2/cloud.js", 5, 50);