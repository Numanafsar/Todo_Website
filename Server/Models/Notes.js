const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  userId: 
    {
      type: mongoose.Types.ObjectId,
      ref: "Register"
    },
});

const NotesModel = mongoose.model("Notes", NotesSchema);
module.exports = NotesModel;
