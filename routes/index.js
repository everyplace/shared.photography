const fs = require('fs');
const fetch = require('node-fetch');

exports.upload = (req, res, next) => {
  console.log(req.files)  
  req.files.image.mv('.data/'+req.files.image.name);
  res.end("https://store-uploaded-images.glitch.me/author?image="+req.files.image.name);
};

//from inmylane
exports.uploadWithMetadata = (req, res, next) => {
  console.log(req.files)
  const filename = Buffer.from(`${Date.now()}-${req.files.image.name}`).toString('base64') + '.png';
  req.files.image.mv(`.data/${filename}`);
  
  //store the reference to the image
  //disabled because for this app the data isn't coming from the share dialog, but from the form later
  // const {address, latitude, longitude, author} = req.body;
  // let log = fs.readFileSync('.data/log.json');
  // let obj = JSON.parse(log);
  // obj.push({filename, address, latitude, longitude, author});
  // fs.writeFileSync('.data/log.json', JSON.stringify(obj));
 
  
  res.end(`https://store-uploaded-images.glitch.me/author?image=${filename}`);
};


exports.display = async (req, res) => {
  //list all image names and urls
  fs.readdir('.data/', (err, files)=>{
    let output = '<ul>'
    files.forEach((file)=>{
      output += `<li><a href="/img/${file}">${file}</a></li>`
    })
    output += '</ul>'
    res.set('Content-Type', 'text/html');
    res.end(output);
  });
  
};

exports.preview = async (req, res) => {
  //show all images
  fs.readdir('.data/', (err, files)=>{
    let output = '<ul>'
    files.forEach((file)=>{
      output += `<li>
        <span>${file}</span>
        <a href="/img/${file}">
          <img width="100%" src="/img/${file}" />
        </a>
      </li>`;
    })
    output += '</ul>'
    res.set('Content-Type', 'text/html');
    res.end(output);
  });
  
};

exports.list = async (req, res) => {
  //output all image titles
  fs.readdir('.data/', (err, files)=>{
    res.json(files);
  });
};

exports.orderedList = async (req, res) => {
  //output all image titles, most recent first
  
  const dir = '.data/';
  var files = fs.readdirSync(dir);
  files.sort(function(a, b) {
     return fs.statSync(dir + a).mtime.getTime() - 
            fs.statSync(dir + b).mtime.getTime();
  });
  res.json(files.reverse());
  
};

exports.postcard = async (req, res) => {
  
  let back_image = ("back_image" in req.body) ? `${decodeURI(req.body.back_image)}` : null;
  
  let postcard_object = {
    "Front": "8b1fa991-7b39-4925-ad63-aa5ce050059c", //signature-and-salutation
    "Back": "https://store-uploaded-images.glitch.me/img/"+req.body.image,
    "Description": "auto-uploaded test",
    "Size": "4.25x6",
    "VariablePayload":{
      "salutation": ("salutation" in req.body) ? req.body.salutation : '',
      "message": ("message" in req.body) ? req.body.message : '',
      "signature": ("signature" in req.body) ? req.body.signature : '',
      "image": back_image
    },
    "DryRun": (req.body.send == 'false') ? true : false,
    "To": {
      "Name": req.body.name,
      "AddressLine1": req.body.street,
      "AddressLine2": ("street2" in req.body) ? req.body.street2 : '',
      "City": req.body.city,
      "State": req.body.state,
      "Zip": req.body.zipcode
    },
    "From": {
      "Name": "Erin Sparling's Automated Postcards",
      "AddressLine1": "473 Van Buren St",
      "AddressLine2": "",
      "City": "Brooklyn",
      "State": "NY",
      "Zip": "11221"
    }
  };
  
  console.log(postcard_object);
  
  let username = process.env.username;
  let password = process.env.password;
  let auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  
  const enabled = true;
  
  if(enabled == true) {
    let submitted_postcard = await fetch(`${process.env.endpoint}/postcard/`, {
            method: 'post',
            body:    JSON.stringify(postcard_object),
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Basic ${auth}`},
        })
        .then(res => res.text())
        .then(text => {return text});
    
    let pdflink = JSON.parse(submitted_postcard).RenderedPdf;
    let html = `
      <link rel="stylesheet" href="/style.css" />
      <h1>Submitted</h1>
      <p>Your postcard has been sent. See a <a href="${pdflink}">preview here.</a></p>`
    console.log(submitted_postcard);
    res.set('Content-Type', 'text/html');
    res.end(html);
  } else {
     res.json("postcard not submitted"); 
  }
};

exports.getAllPostcards = async (req, res) => {
  
  
  let username = process.env.username;
  let password = process.env.password;
  let auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  
  console.log(auth)
  res.end("no")
};

exports.notify =  (req, res) => {

  // console.log(req);
  res.end("ok");
  
}

exports.remove = (req, res) => {
  
  let files = fs.readdirSync('/app/.dataTest/');
  
  files.forEach((file)=>{
    fs.unlinkSync(`/app/.dataTest/${file}`);
  })
  // fs.unlinkSync('/app/.dataTest');
  res.end("deleted all uploaded images");
}