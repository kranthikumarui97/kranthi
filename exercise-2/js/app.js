var getDomElementById = (id) => {
  return document.getElementById(id);
}

var setLocalStorageItem = (collectionKey, listItemName) => {
  if (!localStorage.getItem(collectionKey)) {
    var addCurrentElement = { [listItemName] : listItemName};
    localStorage.setItem(collectionKey, JSON.stringify(addCurrentElement));
  } else {
    var existingCollection = JSON.parse(localStorage.getItem(collectionKey));
    existingCollection[listItemName] = listItemName;
    localStorage.setItem(collectionKey, JSON.stringify(existingCollection));
  }
}

var deleteLocalStorageItem = (collectionKey, listItemName) => {
  if (localStorage.getItem(collectionKey)) {
    var existingStorageCollection = JSON.parse(localStorage.getItem(collectionKey));
    delete existingStorageCollection[listItemName];
    localStorage.setItem(collectionKey, JSON.stringify(existingStorageCollection));
  }
}

var showTodo = () => {
  var todoItems = JSON.parse(localStorage.getItem("incomplete-tasks"));
  for (const [key, value] of Object.entries(todoItems)) {
    var newListItem = createNewTaskElement(value);
    getDomElementById("incomplete-tasks").appendChild(newListItem);
    bindTaskEvents(newListItem, taskCompleted);
  }
}

var showCompleted = () => {
  var completedItems = JSON.parse(localStorage.getItem("completed-tasks"));
  if (typeof completedItems === Object) {
    for (const [key, value] of Object.entries(completedItems)) {
      var newListItem = createNewTaskElement(value);
      newListItem.querySelectorAll("input[type=checkbox]")[0].checked = true;
      getDomElementById("completed-tasks").appendChild(newListItem);
      bindTaskEvents(newListItem, taskIncomplete);
    }
  }
}

var showAll = () => {
  showTodo();
  showCompleted();
}

window.onload = (event) => {
  showAll();
} 

var createNewTaskElement = function(taskString) {
  var listItem = document.createElement("li");
  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  checkBox.setAttribute("aria-label", "todo-item-checkbox");
  checkBox.setAttribute("tabindex", "0");
  editInput.type = "text";
  editInput.setAttribute("aria-label", "todo-item-input");
  editInput.setAttribute("tabindex", "0");
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

var addTask = function(event) {
  event.preventDefault();
  var taskInput = document.getElementById("new-task");
  var listItemName = taskInput.value;
  if (listItemName) {
    var newListItem = createNewTaskElement(listItemName);
    getDomElementById("incomplete-tasks").appendChild(newListItem);
    bindTaskEvents(newListItem, taskCompleted);
    var localStorageCollectionKey = newListItem.parentNode.id;
    setLocalStorageItem(localStorageCollectionKey, listItemName);
    taskInput.value = "";
  }
};

var editTask = function() {
  var listItem = this.parentNode;
  var editInput = listItem.querySelectorAll("input[type=text")[0];
  var label = listItem.querySelector("label");
  var button = listItem.getElementsByTagName("button")[0];

  var containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    label.innerText = editInput.value
    button.innerText = "Edit";
  } else {
    editInput.value = label.innerText
    button.innerText = "Save";
  }

  listItem.classList.toggle("editMode");
};

var deleteTask = function(el) {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  const localStorageCollectionKey = ul.id;
  const listItemName = listItem.innerText.split('\n')[0];
  deleteLocalStorageItem(localStorageCollectionKey, listItemName);
  ul.removeChild(listItem);
};

var taskCompleted = function(el) {
  var listItem = this.parentNode;
  getDomElementById("completed-tasks").appendChild(listItem);
  const listItemName = listItem.innerText.split('\n')[0];
  setLocalStorageItem("completed-tasks", listItemName);
  deleteLocalStorageItem("incomplete-tasks", listItemName);
  bindTaskEvents(listItem, taskIncomplete);
};

var taskIncomplete = function() {
  var listItem = this.parentNode;
  getDomElementById("incomplete-tasks").appendChild(listItem);
  const listItemName = listItem.innerText.split('\n')[0];
  setLocalStorageItem("incomplete-tasks", listItemName);
  deleteLocalStorageItem("completed-tasks", listItemName);
  bindTaskEvents(listItem, taskCompleted);
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  var editButton = taskListItem.querySelectorAll("button.edit")[0];
  var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

getDomElementById("add-btn").addEventListener("click", addTask);


for (var i = 0; i < getDomElementById("incomplete-tasks").children.length; i++) {
  bindTaskEvents(getDomElementById("incomplete-tasks").children[i], taskCompleted);
}

for (var i = 0; i < getDomElementById("completed-tasks").children.length; i++) {
  bindTaskEvents(getDomElementById("completed-tasks").children[i], taskIncomplete);
}