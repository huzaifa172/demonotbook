const path = require('path')
const express = require('express');
const app = express(); 
const fs = require('fs');

// middle wears and other 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname , 'public')));
app.set('view engine', 'ejs')
// routers 

app.get("/", function(req, res){
  fs.readdir(`./files`, function(err, files){
    res.render("index", {files: files});
    });
});



app.get("/files/:filename", function(req, res){
  
  const filename = req.params.filename.replace("$", "").replace("}", "").replace("{", ""); // Sanitize filename
  const filepath = path.join(__dirname, "files", filename);
  
  console.log("Resolved file path:", filepath);
  
  if (!fs.existsSync(filepath)) {
    console.error("File does not exist:", filepath);
    return res.status(404).send("File not found.");
  }
  
  fs.readFile(filepath, "utf-8", function (err, data) {
  if (err) {
  console.error("Error reading file:", err);
  return res.status(500).send("Internal Server Error.");
  }
    
    res.render("show", { filename, data: data });
});
});


// notes creation 
app.post("/create", function(req, res){
  var path = req.body.title.split(' ').join('-');
  var details = req.body.details.toString();
  fs.writeFile(`./files/${path}.txt`,details , function(err){
  res.redirect("/") 
  console.log(err)
  });
});


// edit file 
app.get("/edit/:filename",function(req, res){
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, data){
    filedata = data;
    console.log(filedata);
    console.log(err)
    res.render("edit", {filename: req.params.filename, theData: filedata });
  })
});


app.post("/edittask", function(req, res){
  console.log(req.body);
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new.split(" ").join("-")}.txt`, function(err){
    console.log(err)
    res.redirect("/");
  });

});


// server
app.listen(3000, function(){
  console.log("ok its running ")
});

