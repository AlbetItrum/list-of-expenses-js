let allTasks = []; // creating an empty array to store all added tasks
let textExpenseInput = null; // name of expenses
let numberExpenseInput = null; // expense amount
let dateToday = new Date(); // date the expense was added
let sumAllExpenses = 0; // keeping the whole amount
let saveInterfaceDisable = false; // input editing interface activity
let serverUrl = "http://localhost:8080/tasks";
let HTTP_HEADERS = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

window.onload = async function init() {
  textExpenseInput = document.getElementById("newTaskTextField");
  numberExpenseInput = document.getElementById("add-task-amount");
  // adding a new expense when pressing enter in the text field
  textExpenseInput.onkeyup = (event) => {
    if (event.key === "Enter") {
      createTask();
    }
  };
  // adding a new expense by pressing enter in the amount input field
  numberExpenseInput.onkeyup = (event) => {
    if (event.key === "Enter") {
      createTask();
    }
  };
  render();
};

render = async () => {
  await updateAllTasks(); // data request
  sumAllExpenses = 0;
  const content = document.getElementById("content-page");
  content.innerHTML = "";
  const getSumAllExpenses = document.createElement("p");
  getSumAllExpenses.className = `task-sum`;
  content.appendChild(getSumAllExpenses);

  // displaying all received expenses
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    const namesExpenses = document.createElement("p");
    const amountSpent = document.createElement("p");
    container.className = "task-container";
    container.id = `task-${index}`;
    namesExpenses.id = `text-id-one-${index}`;
    amountSpent.id = `text-id-two-${index}`;
    namesExpenses.innerText = `${index + 1} ) ${item.namesExpenses}`;
    amountSpent.innerText = `${item.amountSpent} ₽`;
    const dateAmount = document.createElement("p");
    dateAmount.innerText = new Date(item.date).toLocaleDateString("Ru-ru");
    const imageEdit = document.createElement("img");
    imageEdit.src = "./img/writing.png";
    const arrayElements = [namesExpenses, dateAmount, amountSpent, imageEdit];
    arrayElements.forEach((element) => {
      container.appendChild(element);
    });

    imageEdit.onclick = () => {
      if (saveInterfaceDisable === false) {
        // deleting elements on click on edit icon
        [dateAmount, imageDelete, imageEdit].forEach((element) => {
          container.removeChild(element);
        });
        // calling the change task function
        // passing the received values ​​to the function
        onEditTask(item, index);
        saveInterfaceDisable = true;
      }
    };

    const imageDelete = document.createElement("img");
    imageDelete.src = "./img/delete.png";
    // action when clicking on the delete icon of a specific task
    imageDelete.onclick = function () {
      // calling the delete task function
      // the function takes the task deletion index
      onDeleteTask(index);
    };
    // change in the amount of all expenses
    sumAllExpenses += item.amountSpent;
    container.appendChild(imageDelete);
    content.appendChild(container);
  });
  getSumAllExpenses.innerText += `Итого: ${sumAllExpenses}₽`;
  document.querySelector(".spinner").style.display = "none";
  setTimeout(
    // display on the screen notification of task deletion by name
    () => (document.querySelector(".task-deleting").style.display = "none"),
    2500
  );
};
// task change function
// takes an item object of the selected task and an index
onEditTask = (item, index) => {
  const tasksContainerId = document.getElementById(`task-${index}`);
  const textContainerId = document.getElementById(`text-id-one-${index}`);
  const amountContainerId = document.getElementById(`text-id-two-${index}`);
  const imgDoneEdit = document.createElement("img");
  const textInputContainer = document.createElement("textarea");
  const amountInputContainer = document.createElement("input");
  const imageCancel = document.createElement("img");
  const dateTaksContainer = document.createElement("input");

  imageCancel.src = "./img/cancel.png";
  imgDoneEdit.src = "./img/check-mark.png";
  textInputContainer.value = item.namesExpenses;
  amountInputContainer.value = item.amountSpent;
  dateTaksContainer.type = "date";
  dateTaksContainer.valueAsDate = new Date(item.date);
  // rounding to integer
  textInputContainer.rows = `${Math.ceil(
    textInputContainer.value.length / 30
  )}`;

  tasksContainerId.removeChild(textContainerId);
  tasksContainerId.removeChild(amountContainerId);
  // undo actions when clicking on the undo icon
  imageCancel.onclick = () => {
    saveInterfaceDisable = false;
    render();
  };
  // save changes icon
  imgDoneEdit.onclick = async () => {
    // checking for empty lines
    if (
      textInputContainer.value.trim() !== "" &&
      amountInputContainer.value.trim() !== "" &&
      amountInputContainer.value >= 0 &&
      // if the change occurs within a week
      chackDate(item, dateTaksContainer.valueAsDate)
    ) {
      // task change request
      await onUpdateTask(
        index,
        textInputContainer.value,
        amountInputContainer.value,
        dateTaksContainer.value,
        sumAllExpenses,
        item.dateOriginal
      );
    }
    saveInterfaceDisable = false;
    render();
  };
  [
    textInputContainer,
    dateTaksContainer,
    amountInputContainer,
    imgDoneEdit,
    imageCancel,
  ].forEach((element) => {
    // display items of the selected task for editing
    tasksContainerId.appendChild(element);
  });
};

chackDate = (item, data) => {
  let nextWeek = new Date(item.date);
  nextWeek.setDate(nextWeek.getDate() + 7);
  let lastWeek = new Date(item.date);
  lastWeek.setDate(lastWeek.getDate() - 7);
  return data <= nextWeek && data >= lastWeek;
};
// task change request
// function takes index - the index of the selected element
//    namesExpenses - the name of the modified task
//    amountSpent - the amount of the modified task
//    date - date the task was modified
//    sum - the total amount of expenses
//    dateOriginal - date the task was added
onUpdateTask = async (
  index,
  namesExpenses,
  amountSpent,
  date,
  sum,
  dateOriginal
) => {
  // rounding of the received amount
  const roundingNumber = Math.round(parseFloat(amountSpent) * 100) / 100;
  await respFunc(serverUrl, "PATCH", {
    _id: allTasks[index]._id,
    namesExpenses,
    date,
    amountSpent: roundingNumber,
    sum,
    dateOriginal,
  });
  await updateAllTasks();
  render();
};
// function of deleting the selected task
// takes the index of the selected task
onDeleteTask = async (index) => {
  saveInterfaceDisable = false;
  // display notification of deleted task
  document.querySelector(".task-deleting").style.display = "flex";
  const notificationDeletion = document.getElementById("del");
  notificationDeletion.innerText = `Задача "${allTasks[index].namesExpenses}" удалена`;
  await respFunc(`${serverUrl}?_id=${allTasks[index]._id}`, "DELETE");
  await updateAllTasks();
  render();
};
// function to add a new task
createTask = async () => {
  const animatedButton = document.querySelector(".main__header");
  animatedButton.className =
    "main__header animate__animated animate__heartBeat";
  // animation when clicking on the add task button
  setTimeout(() => (animatedButton.className = "main__header"), 1500);
  // rounding of the received amount
  const roundingNumber =
    Math.round(parseFloat(numberExpenseInput.value) * 100) / 100;
  // checking inputs for empty characters and spaces
  if (
    textExpenseInput.value != "" &&
    numberExpenseInput.value != "" &&
    textExpenseInput.value.trim() != "" &&
    numberExpenseInput.value.trim() != "" &&
    numberExpenseInput.value > 0
  ) {
    // request to add a task
    await respFunc(serverUrl, "POST", {
      namesExpenses: textExpenseInput.value,
      date: dateToday,
      amountSpent: roundingNumber,
      sum: sumAllExpenses,
      dateOriginal: dateToday,
    });
  } else {
    // error text display
    document.querySelector(".textError").style.display = "flex";
    setTimeout(
      () => (document.querySelector(".textError").style.display = "none"),
      1500
    );
  }
  textExpenseInput.value = "";
  numberExpenseInput.value = "";
  render();
};
// unique server requests feature
respFunc = async (url, method, obj) => {
  document.querySelector(".spinner").style.display = "flex";
  try {
    const resp = await fetch(url, {
      method: method,
      headers: HTTP_HEADERS,
      body: JSON.stringify(obj),
    });
    return await resp.json();
  } catch (error) {
    alert(error.message);
  }
};

updateAllTasks = async () => {
  let resultResp = await respFunc(serverUrl, "GET");
  allTasks = resultResp.data;
};
