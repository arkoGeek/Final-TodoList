const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
const Task = require("./taskModel");

const DB = "mongodb+srv://arkomitra:arkomitra@cluster0.jlubh0c.mongodb.net/todoDB?retryWrites=true&w=majority";

const connectDB = async () => {
  try{
    await mongoose.connect(DB);
    console.log("Successfully connected to Mongo");
  }catch(err){
    console.log("Error connecting to Database");
  }
}

connectDB();

app.get("/", async (req, res) => {
  try{
    let data = await Task.find({});
    let data1 = await Task.find({isCompleted : false});
    res.render("home", {tasks : data, incompleteCount : data1.length, fullCount : data.length, render:"/"});
  }catch(err){
    console.log(err);
  }
})

app.get("/renderCompleted", async (req, res) => {
  try{
    let fullData = await Task.find({});
    let data = await Task.find({isCompleted : true});
    let data1 = await Task.find({isCompleted : false});
    res.render("home", {tasks : data, incompleteCount : data1.length, fullCount : fullData.length, render:"/renderCompleted"});
  }catch(err){
    console.log(err);
  }
})

app.get("/renderActive", async(req, res) => {
  try{
    let data = await Task.find({});
    let data1 = await Task.find({isCompleted : false});
    res.render("home", {tasks : data1, incompleteCount : data1.length, fullCount:data.length, render:"/renderActive"});
  }catch(err){
    console.log(err);
  }
})

app.post("/addTask", async (req, res) => {
  if(req.body.task === ""){
    res.redirect(req.body.route);
  }else{
    let task = new Task({
      task : req.body.task
    })
    try{
      await task.save();
      res.redirect(req.body.route);
    }catch(err){
      console.log("Error occured while adding : "+err);
    }
  }
})

app.post("/deleteTask", async (req, res) => {
  try{
    await Task.deleteOne({_id : req.body.delId});
    res.redirect(req.body.route);
  }catch(err){
    console.log("Error occured while deleting : "+err);
  }
})

app.post("/deleteCompleted", async (req, res) => {
  try{
    await Task.deleteMany({isCompleted : true});
    res.redirect(req.body.route);
  }catch(err){
    console.log("Error occured while deleting completed items : "+err);
  }
})

app.post("/check", async (req, res) => {
  let obj = {};
  obj.isCompleted = false;
  if(req.body.check === "on"){
    obj.isCompleted = true;
  }
  try{
    await Task.updateOne({_id : req.body.checkId}, {$set : obj});
    res.redirect(req.body.route);
  }catch{
    console.log("Error while updating : "+err);
  }
})

app.post("/checkAll", async (req, res) => {
  try{
    let data = await Task.find({isCompleted:false});
    let obj = {};
    obj.isCompleted = false;
    if(data.length > 0){
      obj.isCompleted = true;
    }
    await Task.updateMany({}, {$set : obj});
    res.redirect(req.body.route);
  }catch(err){
    console.log("Error while updating all : "+err);
  }
})

app.listen(8000, () => {
  console.log("Listening at PORT 8000");
})