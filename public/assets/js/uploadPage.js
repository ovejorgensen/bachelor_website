window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("User Uploaded Point Cloud");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

newGradientCloud(Potree.Gradients["YELLOW_GREEN_2"], "output/cloud.js");    