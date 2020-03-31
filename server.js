const express = require('express');
const fileUpload = require('express-fileupload');
const { exec, spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow the app to upload files and let the server use the conversion directory
app.use(fileUpload());
app.use(express.static('conversion'));

//handles file uploading
app.post('/', function(req, res) {
  if(req.files.geoUpload){
    var file = req.files.geoUpload;
    var filename = "uploaded.geojson";
    file.mv('public/assets/mygeodata/upload/'+ filename, function (err) {
      if (err) res.send(err);
      else {
        console.log(filename + " uploaded successfully");
        res.sendFile(`${__dirname}/public/upload.html`);
      }
    });
  }
  else if(req.files.pcUpload){
    var file = req.files.pcUpload;
    var filename = file.name;

    let output;
    if (filename.charAt(filename.length-1)=="t") output="output.txt";
    else if(filename.charAt(filename.length-1)=="z") output="output.laz";
    else output="output.las"

    file.mv('conversion/files/'+ output, function (err) {
      if (err) res.send(err);
      else {
        console.log(filename + " uploaded successfully");
        console.log("converting cloud...");
        exec('conversion.bat', (err, stdout) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
          
          res.sendFile(`${__dirname}/public/upload.html`);
        });
              
        // const bat = spawn('cmd.exe', ['/c', 'conversion.bat']);

        // bat.stdout.on('data', (data) => {
        //   console.log(data.toString());
        // });
        
        // bat.stderr.on('data', (data) => {
        //   console.error(data.toString());
        // });
        
        // bat.on('exit', (code) => {
        //   console.log(`Child exited with code ${code}`);
        //   res.sendFile(`${__dirname}/public/upload.html`);
        // });
      }
    });
  }
});

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log('listening on %d', port);
});

