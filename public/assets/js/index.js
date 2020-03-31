function checkextension() {
    var file = document.querySelector("#cloudUpload");
    if ( /\.(laz|las|txt)$/i.test(file.files[0].name) === false ) { 
        alert("not a supported filetype!"); 
    }
  }