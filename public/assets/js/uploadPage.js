window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("User Uploaded Point Cloud");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

newCloud("output/cloud.js");

// newGradientCloud(Potree.Gradients["TURBO"], "output/cloud.js");

flightPathDisplay("assets/mygeodata/upload/uploaded.geojson", "output/cloud.js", 3, 50, true);

uploadModal();