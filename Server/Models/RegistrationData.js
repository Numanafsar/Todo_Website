const mongoose = require("mongoose");

const RegistrationDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  Notes_id: [{ type: mongoose.Types.ObjectId, ref: "Notes", },],
  Todos_id: [{ type: mongoose.Types.ObjectId, ref: "todos", },],
});

const RegistrationDataModel = mongoose.model(
  "Register",
  RegistrationDataSchema
);
module.exports = RegistrationDataModel;
