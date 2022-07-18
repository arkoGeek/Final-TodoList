const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task:{
    type:String
  },
  isCompleted:{
    type:Boolean,
    default:false
  }
})

const Task = mongoose.model("todoTask", taskSchema);

module.exports = Task;