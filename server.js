const express = require('express');
const app = express();
const path = require(`path`);
const bodyParser = require('body-parser');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var http = require('http');
var formidable = require('formidable');

let transcription ="";  
const storage_path = 'D:/MSc Data Science/Voice to Text Project/a20191215/resources/';


async function main(audioBytes) {
  // Creates a client
  const client = new speech.SpeechClient();

  //console.log("fileName=====>", fileName)
  //The name of the audio file to transcribe (input of function)
  //Reads a local audio file and converts it to base64
  //const file = fs.readFileSync(fileName);
  //console.log("what is it=====>", file);
  // const audioBytes = file.toString('base64');
  //console.log("audioBytes=====>", audioBytes);
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  console.log("language", language);
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRate,
    languageCode: language,
  };
  const request = {
    audio: audio,
    config: config,
  };
  //console.log("request", request)
  //Detects speech in the audio file
  const [response] = await client.recognize(request);
  //const [operation] = await client.longRunningRecognize(request);
  //const [response] = await operation.promise();
  //console.log("response.results", response.results)
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);

  const confidence = response.results
  .map(result => result.alternatives[0].confidence)
  .join('\n');
  console.log(`confidence: ${confidence}`);

  return transcription;
  //return result.alternatives[0]
}

 //console.log("__dirname",__dirname, path.join(__dirname, '/public/'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/form.html'));
  });

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/getResult", function(req,res){
  return res.send("customers");
});

app.use(fileUpload());

app.post('/submit', (req, res) => {
var results = ""
 // if (!req.files || Object.keys(req.files).length === 0) {
  //   console.log("Require uploading...")
  //   return res.status(400).send('No files were uploaded.');
  // }
  // console.log("File Name for Upload",fileName)
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // let sampleFile = req.files.fileName;

  // // Use the mv() method to place the file somewhere on your server
  // console.log(fileName)
  // sampleFile.mv('/resources/'+fileName, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });
    encoding=req.body.encoding;
    sampleRate=req.body.sampleRate;
    language=req.body.language;
  
     console.log({
       name: req.body.name,
       message: req.body.message,
       path: req.body.path,
       fileName:req.body.fileName,
       encoding: encoding,
       sampleRate: sampleRate,
       language: language
     });
 //console.log("Server has started.");
    let fileName = "./resources/" + req.body.fileName;
    var contents = fs.readFileSync(fileName);
    const audioBytes = contents.toString('base64');
    var content_block = "";
    var i,block_length=20000;
    
    console.log("fileName: ",fileName);
    console.log("contents" , contents);
    console.log("contents length: ", contents.length);
    console.log("audioBytes length: ", audioBytes.length);
///////////////////////////////////////////////////////////
// var char = '\n';
// var i = j = 0;

// while ((j = contents.indexOf(char, i)) !== -1) {
//   //console.log("CONTENTS SLICE: i =",i + " j=" + j + contents.slice(i, j));
//   i = j + 1;

////////////////////////////////////////////////////////////
// content_block = contents.slice(i, j)
// audioBytes_block = content_block.toString('base64');
      //console.log("fileName", fileName)
      //block_length= contents.length/500
  //for (i = 0; i < contents.length/block_length - 1; i++) {
    //  for (i = 0; i <2; i++) { 
      // content_block = audioBytes.slice(i*block_length,(i+1)*block_length-1);
      // console.log("content_block = " + i + "  :", content_block);
        main(audioBytes).then(result=>{
          //console.log("result====>", result);

          results += result
          //console.log("result====>", results);
          res.send({xxx:results});
        }).catch(console.error);
      // }
  // }
        // console.log("ultimate result====>", results);
     // ******** ask: how to break file in to many and send res after group
    // fs.writeFile(fileName +".txt", transcription + "  " + confidence, function(err) {
    //   if(err) {
    //       return console.log(err);
    //   }
    // }); 


  });

  
  app.post('/upload', function(req, res) {
    let sampleFile = req.body.upFile;//req.files.fileName;
    console.log("it is file =====>", sampleFile.name);
    console.log("it is file =====>", sampleFile.name);
    console.log("See if success")
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("Require uploading...", files)
      return res.status(400).send('No files were uploaded.');
    }
    console.log("File is not null")
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //let sampleFile = req.files.fileName;

    // Use the mv() method to place the file somewhere on your server
    console.log("upload:",sampleFile)
    sampleFile.mv(storage_path+sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);

      //res.send('File uploaded!');
      //alert("File uploaded. You may proceed...");
     // app.post('/submit',function(req,res){});
     //return res.end();
     
    });
  });

app.get('/', (req, res) => {
  res.send('Ok, does it work?');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//   res.write('<input type="file" name="filetoupload"><br>');
//   res.write('<input type="submit">');
//   res.write('</form>');
//   return res.end();
// }).listen(8080);
