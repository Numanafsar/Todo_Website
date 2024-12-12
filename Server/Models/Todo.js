const mongoose = require('mongoose')
const TodoSchema = new mongoose.Schema({
  task: String , 
  date: String,
  deadlineDate: String,
  priority : String,
  isRecurring: Boolean,
  recurrencePeriod: String,
  nextDates: [{
    type: String,
  }],
  done: {
    type: Boolean,
    default: false
  },
  userId: 
    {
      type: mongoose.Types.ObjectId,
      ref: "Register"
    },
},{
    timestamps: true
})
const TodoModel = mongoose.model('todos', TodoSchema)
module.exports = TodoModel