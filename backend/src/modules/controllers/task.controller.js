const Task = require("../../db/index");

// get all available tasks
// the function takes arguments rec:request, res:response, next:callback for the middleware function
module.exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.send({ success: true, data: tasks });
  } catch (error) {
    res.status(500).send({ success: false, message: "mongoError" });
  }
};
// function to add a new task
// the function takes arguments rec:request, res:response, next:callback for the middleware function
module.exports.createNewTask = async (req, res, next) => {
  try {
    const { namesExpenses, amountSpent, date, dateOriginal } = req.body;
    if (
      namesExpenses === undefined ||
      namesExpenses === "" ||
      amountSpent === undefined ||
      amountSpent < 0
    ) {
      res.status(400).send("Error... you entered an empty value");
    }
    const task = new Task({ namesExpenses, amountSpent, date, dateOriginal });
    await task.save();
    res.send({ success: true, date: task });
  } catch (error) {
    res.status(500).send({ success: false, message: "mongoError" });
  }
};
// function to change the selected task
// the function takes arguments rec:request, res:response, next:callback for the middleware function
module.exports.changeTaskInfo = async (req, res, next) => {
  try {
    const { namesExpenses, amountSpent, _id, date, dateOriginal } = req.body;
    if (
      namesExpenses === undefined ||
      namesExpenses === "" ||
      amountSpent === undefined ||
      amountSpent < 0 ||
      _id.length !== 24 ||
      chackDate(dateOriginal, date)
    ) {
      res.status(400).send("Error... you entered an empty value");
    } else {
      await Task.updateOne({ _id }, { namesExpenses, amountSpent, date });
      res.status(200).send({ success: true, message: "update" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error..." });
  }
};
// function of deleting the selected task
// the function takes arguments rec:request, res:response, next:callback for the middleware function
module.exports.deleteTask = async (req, res, next) => {
  try {
    const tasks = await Task.deleteOne({ _id: req.query._id });
    res.status(200).send({ success: true, data: tasks });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error..." });
  }
};
// date check function
// the function takes the current date and the modified date
chackDate = (itemDate, data) => {
  const nextWeek = new Date().setDate(new Date(itemDate).getDate() + 7);
  const lastWeek = new Date().setDate(new Date(itemDate).getDate() - 7);
  const validationResult = !(
    new Date(data) <= nextWeek && new Date(data) >= lastWeek
  );
  return validationResult;
};
