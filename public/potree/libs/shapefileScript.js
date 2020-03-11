
window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setDescription("Sample 1 - Railway");
viewer.setPointBudget(1 * 1000 * 1000);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setMinNodeSize(10);
viewer.loadSettingsFromURL();

	viewer.loadGUI(() => {
		viewer.setLanguage('en');
		$("#menu_appearance").next().show();
		$("#menu_tools").next().show();
		$("#menu_scene").next().show();
	});

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

	{
		// define the transformation from shapefile to point cloud coordinate systems
		proj4.defs("WGS84", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
		proj4.defs("pointcloud", pointcloud.projection);
		let transform = proj4("WGS84", "pointcloud");

		const loader = new Potree.ShapefileLoader();
		loader.transform = transform;

		// group all shapefile scene nodes into this node
		const shapeNode = new THREE.Object3D();
		viewer.scene.scene.add(shapeNode);

		// add roads.shp and change colors to yellow
		const shpRoads = await loader.load("./morro_bay_shp/shape/roads.shp");
		shapeNode.add(shpRoads.node);

		shpRoads.node.traverse(node => {
			if(node.material){
				node.material.color.setRGB(1, 1, 0)
			}
		});

		// this is necessary so that fat lines are correctly sized
		viewer.addEventListener("update", () => {
			const size = viewer.renderer.getSize(new THREE.Vector2());

			shpRoads.setResolution(size.width, size.height);
			shpWaterways.setResolution(size.width, size.height);
			shpNatural.setResolution(size.width, size.height);
			shpPoints.setResolution(size.width, size.height);
		});
	}
});
