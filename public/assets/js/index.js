function checkExtension() {
    var file = document.querySelector("#cloudUpload");
    if ( /\.(laz|las|txt)$/i.test(file.files[0].name) === false ) { 
        document.getElementById('cloudUpload').value="";
        alert("Please select a supported filetype!"); 
    }
  }

  function Loader() {
      document.getElementById('loader').style.display='block';
  }