require('dotenv').config(); // read .env files
const express = require('express');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

//handles file uploading
app.post('/', function(req, res) {
  if(req.files.geoUpload){
    var file = req.files.geoUpload;
    var filename = file.name;
    file.mv('public/uploads/geoData/'+ filename, function (err) {
      if (err) res.send(err);
      else {
        console.log(filename + " uploaded successfully");
        res.sendFile(`${__dirname}/public/index.html`);
      }
    });
  }
  else if(req.files.txtUpload){
    var file = req.files.txtUpload;
    var filename = file.name;
    file.mv('conversion/txtfiles/'+ filename, function (err) {
      if (err) res.send(err);
      else {
        console.log(filename + " uploaded successfully");
              
        const bat = spawn('cmd.exe', ['/c', 'conversion.bat']);

        bat.stdout.on('data', (data) => {
          console.log(data.toString());
        });
        
        bat.stderr.on('data', (data) => {
          console.error(data.toString());
        });
        
        bat.on('exit', (code) => {
          console.log(`Child exited with code ${code}`);
          res.sendFile(`${__dirname}/public/upload.html`);
        });
      }
    });
  }
});

app.use(express.static('conversion'));

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log('listening on %d', port);
});

