let counter=1;

let active = false;
document.getElementById('activateAnno').onclick = function(){
    if (active == false) active = true;
	else active = false;
	
	viewer.renderer.domElement.addEventListener("mousedown", (e) => { 
		if(active == true){ 
			let mouse = viewer.inputHandler.mouse;
			const camera = viewer.scene.getActiveCamera(); 
		
			let hit = Potree.Utils.getMousePointCloudIntersection(mouse,camera,viewer, viewer.scene.pointclouds);
	
			//make annotation
			if(hit != null){
				let div = document.createElement('div')
				div.classList.add("annotation-sidebar");
				let newID = "anno"+counter;
				div.id = newID;
				div.style.display = "none";
				
				let inner = document.createElement('div');
				inner.classList.add("anno-close");
				inner.id = "closer"+counter;
				inner.innerHTML += "<i class='fa fa-times closer' aria-hidden='true'></i>";
				inner.onclick=function(){
					let sides = document.getElementsByClassName('annotation-sidebar')
					for(let i=0; i<sides.length; i++) sides[i].style.display="none";
				}
				div.appendChild(inner);


				let title = document.createElement('div')
				title.classList.add("anno-title");
				title.innerHTML = "Annotation "+counter;
				let desc = document.createElement('div')
				desc.classList.add("anno-description");
				desc.innerHTML = "This annotation contains stored images that can be inspected in a modal.";
				let container = document.createElement('div')
				container.classList.add("anno-container");
				container.innerHTML+="<div class='modal myModal'><span class='close cursor' onclick='closeModal()'>&times;</span> <div class='modal-content'><a class='prev' onclick='plusSlides(-1)'>&#10094;</a> <a class='next' onclick='plusSlides(1)'>&#10095;</a> <div class='caption-container'> <p id='caption'></p></div></div>"


				desc.appendChild(container);
				div.appendChild(title);
				div.appendChild(desc);
						
				let potreeArea = document.getElementsByClassName('potree_container')[0];
				potreeArea.appendChild(div);

				event.stopPropagation();
				let newAnno = new Potree.Annotation({
					position: [hit.location.x, hit.location.y, hit.location.z+2],
					// "cameraPosition": [hit.location.x, hit.location.y+100, hit.location.z+40],
					// "cameraTarget": [hit.location.x, hit.location.y, hit.location.z+2],
					"title": "<span id='annoInner"+ counter+"'> Annotation "+counter+"</span>",
				});
				viewer.scene.annotations.add(newAnno)
				console.log(counter);

				let id = "annoInner"+counter;
				let current = document.getElementById(id);
				let side = "anno"+counter;
				let sidebar = document.getElementById(side);
				current.onclick = function(){
					let sidesInit = document.getElementsByClassName('annotation-sidebar');
					for(let i=0; i<sidesInit.length; i++){
						if(sidesInit[i].style.display=="block") sidesInit[i].style.display="none";
					}
					sidebar.style.display = "block";
				}

				counter++;

			}

			}
		});
}

document.getElementById('insertImgBtn').onclick=function(){
	imageSorter();
}




