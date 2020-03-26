window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("User Uploaded Point Cloud");
viewer.setPointBudget(1000 * 1000);
viewer.setBackground("gradient");
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

newGradientCloud(Potree.Gradients["YELLOW_GREEN_2"], "output/cloud.js");

flightPathDisplay("assets/mygeodata/upload/uploaded.geojson", "output/cloud.js", 5, 50, true);

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