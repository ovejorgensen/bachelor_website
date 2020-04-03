// Algorithm for placing images inside the closest annotation in the current scene.
// The folder containing images has to contain images where each imagename is a number, starting
// from 1 and incrementing +=1 for each image.
// The folder also has to contain a .txt file with coordiates for each image with each line formatted: [imgNum, X, Y, Z]
function imageSorter(){
    fetch('assets/images/upload/pos.txt')
    .then(response => response.text())
    .then(pos =>{
        let split = pos.split(/\r\n|\n/);

        let img;
        let annotations = annoFinder();

        //Use the function for eucledian distance to find the annotation closest to each image
        for(let i=0; i<split.length; i++){
            img = {x:split[i][1], y:split[i][2], z:split[i][3]}

            let lowest = 0;
            let anno;
            let annoLowPos = {x:annotations[0].position.x, y:annotations[0].position.y, z:annotations[0].position.z}
            let annoLow = annotations[0];
            for(let j=1; j<annotations.length; j++){
                anno = {x:annotations[j].position.x, y:annotations[j].position.y, z:annotations[j].position.z}
                if(euclideanDistance(img, anno) < euclideanDistance(img, annoLowPos)){
                    lowest = j;
                    annoLowPos = {x:annotations[j].position.x, y:annotations[j].position.y, z:annotations[j].position.z}
                    annoLow = annotations[j];
                }
            }
            let image = document.createElement('img');
            image.src="assets/images/upload/"+ (i) + ".png";
            image.classList.add("anno-image", "hover-shadow");
            image.alt = "";
            // image.onclick = openModal(), currentSlide(i+1);

            console.log(lowest);
            document.getElementsByClassName("anno-container")[lowest].appendChild(image);
        }
    });
}

function euclideanDistance(p1,p2){
    xdiff = Math.pow((p1.x-p2.x),2);
    ydiff = Math.pow((p1.y-p2.y),2);
    zdiff = Math.pow((p1.z-p2.z),2);
   return Math.sqrt( xdiff + ydiff + zdiff)
}

function annoFinder(){
    let arr = [];
    viewer.scene.annotations.traverseDescendants(a => {
        arr.push(a);
    });
    
    return arr;
}


