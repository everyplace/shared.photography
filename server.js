// server.js
// where your node app starts

// init project
const express = require('express');
const app = module.exports = express();
const routes = require('./routes');
const payment = require('./routes/payment');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');



// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  // res.sendFile(__dirname + '/views/index.vue.html');
  res.sendFile(__dirname + '/views/author.html');
});

app.get('/author-test.html', function(req, res) {
  // res.sendFile(__dirname + '/views/index.vue.html');
  res.sendFile(__dirname + '/views/author-test.html');
});

app.get('/author', function(req, res) {
  res.sendFile(__dirname + '/views/author.html');
});
app.get('/upload', function(req, res) {
  res.sendFile(__dirname + '/views/upload.html');
});
app.get('/img/:file', function(req, res) {
  res.sendFile(__dirname + '/.data/'+req.params.file);
});

app.post('/upload', routes.upload);
app.post('/uploadWithMetadata', routes.uploadWithMetadata);

app.get('/display', routes.display);
app.get('/preview', routes.preview);
app.get('/list', routes.list);
app.get('/orderedList', routes.orderedList);

app.get('/remove', routes.remove);


app.post('/notify', routes.notify);


app.post('/postcard', routes.postcard);
app.get('/all', routes.getAllPostcards);

app.get('/stripe', payment.debug);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
