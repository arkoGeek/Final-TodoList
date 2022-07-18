const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
const Task = require("./taskModel");

const DB = "mongodb+srv://arkomitra:arkomitra@cluster0.jlubh0c.mongodb.net/todoDB?retryWrites=true&w=majority";

mongoose.connect(DB)
.then(() => {
  console.log("Successfully connected to Mongo");
}).catch((err) => {
  console.log("Error connecting to Database");
});

app.get("/", (req, res) => {
  Task.find({}, (err, data) => {
    if(!err){
      Task.find({isCompleted : false}, (err, data1) => {
        if(!err){
          res.render("home", {tasks : data, incompleteCount : data1.length, fullCount : data.length, render:"/"});
        }
      })
    }else{
      console.log("Error is : "+err);
      res.send("Error encountered.");
    }
  })
})

app.get("/renderCompleted", (req, res) => {
  Task.find({}, (err, fullData) => {
    if(!err){
      Task.find({isCompleted: true}, (err, data) => {
        if(!err){
          Task.find({isCompleted : false}, (err, data1) => {
            if(!err){
              res.render("home", {tasks : data, incompleteCount : data1.length, fullCount : fullData.length, render:"/renderCompleted"});
            }
          })
        }else{
          console.log("Error is : "+err);
          res.send("Error encountered.");
        }
      })
    }
  })
})

app.get("/renderActive", (req, res) => {
  Task.find({}, (err, data) => {
    if(!err){
      Task.find({isCompleted : false}, (err, data1) => {
        if(!err){
          res.render("home", {tasks : data1, incompleteCount : data1.length, fullCount:data.length, render:"/renderActive"});
        }
      })
    }else{
      console.log("Error is : "+err);
      res.send("Error encountered.");
    }
  })
})

app.post("/addTask", (req, res) => {
  if(req.body.task === ""){
    res.redirect(req.body.route);
  }else{
    let task = new Task({
      task : req.body.task
    })
    task.save()
    .then(() => {
      res.redirect(req.body.route);
    }).catch(err => {
      console.log("Error occured while adding : "+err);
    });
  }
})

app.post("/deleteTask", (req, res) => {
  Task.deleteOne({_id : req.body.delId}, (err) => {
    if(!err){
      res.redirect(req.body.route);
    }else{
      console.log("Error occured while deleting : "+err);
    }
  })
})

app.post("/deleteCompleted", (req, res) => {
  Task.deleteMany({isCompleted : true}, (err) => {
    if(!err){
      res.redirect(req.body.route);
    }else{
      console.log("Error occured while deleting completed items : "+err);
    }
  })
})

app.post("/check", (req, res) => {
  let obj = {};
  obj.isCompleted = false;
  if(req.body.check === "on"){
    obj.isCompleted = true;
  }
  Task.updateOne({_id : req.body.checkId}, {$set : obj}, (err) => {
    if(err){
      console.log("Error while updating : "+err);
    }else{
      res.redirect(req.body.route);
    }
  })
})

app.post("/checkAll", (req, res) => {
  Task.find({isCompleted:false}, (err, data) => {
    if(!err){
      let obj = {};
      obj.isCompleted = false;
      if(data.length > 0){
        obj.isCompleted = true;
      }
      Task.updateMany({}, {$set : obj}, 
        (err) => {
          if(err){
            console.log("Error while updating all : "+err);
          }else{
            res.redirect(req.body.route);
          }
        })
    }
  })
  
})

app.listen(8000, () => {
  console.log("Listening at PORT 8000");
})