// Select DOM elements
const tasksList = document.querySelector("#tasksList");
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");

// Initialize tasks array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render existing tasks from localStorage
tasks.forEach(renderTask);

// Check and update empty list state
checkEmptyList();

// Event listeners
form.addEventListener("submit", addTask);
tasksList.addEventListener("click", handleTaskAction);

// Handle task form submission
function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) return; // Prevent adding empty tasks

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);
  saveToLocalStorage();
  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
}

// Handle task action (done or delete)
function handleTaskAction(event) {
  const { action } = event.target.dataset;
  if (!action) return;

  const taskItem = event.target.closest("li");
  const taskId = Number(taskItem.id);

  if (action === "delete") {
    deleteTask(taskId, taskItem);
  } else if (action === "done") {
    toggleTaskDone(taskId, taskItem);
  }
}

// Delete a task
function deleteTask(taskId, taskItem) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveToLocalStorage();
  taskItem.remove();
  checkEmptyList();
}

// Toggle task completion
function toggleTaskDone(taskId, taskItem) {
  const task = tasks.find((task) => task.id === taskId);
  if (!task) return;

  task.done = !task.done;
  saveToLocalStorage();

  const taskTitle = taskItem.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

// Check and update empty list state
function checkEmptyList() {
  if (tasks.length === 0) {
    if (!document.querySelector("#emptyList")) {
      const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <h2 class="empty-list__title">Список дел пуст</h2>
        </li>`;
      tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
    }
  } else {
    const emptyListEl = document.querySelector("#emptyList");
    if (emptyListEl) {
      emptyListEl.remove();
    }
  }
}

// Save tasks to localStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render a task
function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
          <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18" />
          </button>
          <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>
    </li>`;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
