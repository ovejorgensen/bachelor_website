require('dotenv').config(); // read .env files
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;


app.use(fileUpload());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// })

app.post('/', function(req, res) {
  if(req.files.geoUpload){
    var file = req.files.geoUpload;
    var filename = file.name;
    file.mv('public/assets/mygeodata/'+ filename, function (err) {
      if (err) res.send(err);
      else {
        console.log(filename + " uploaded successfully");
        res.sendFile(`${__dirname}/public/index.html`);
      }
    });
  }
  // if(req.files.geoUpload){
  //   var file = req.files.geoUpload;
  //   var filename = file.name;
  //   file.mv('public/uploads/'+ filename, function (err) {
  //     if (err) res.send(err);
  //     else {
  //       console.log(filename + " uploaded successfully");
  //       res.sendFile(`${__dirname}/public/index.html`);
  //     }
  //   });
  // }
});

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

