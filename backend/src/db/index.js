const mongoose = require("mongoose");

const { Schema } = mongoose;
// The schema in Mongoose defines the metadata of the model, the types of data that the
const taskSchema = new Schema({
  namesExpenses: String,
  date: Date,
  dateOriginal: Date,
  amountSpent: Number,
});
// A model is created using a model schema definition
module.exports = Task = mongoose.model("amount", taskSchema);
