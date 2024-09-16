// Select DOM elements
const tasksList = document.querySelector("#tasksList");
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks.forEach(renderTask);

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", handleTaskAction);

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) return;

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

function deleteTask(taskId, taskItem) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveToLocalStorage();
  taskItem.remove();
  checkEmptyList();
}

function toggleTaskDone(taskId, taskItem) {
  const task = tasks.find((task) => task.id === taskId);
  if (!task) return;

  task.done = !task.done;
  saveToLocalStorage();

  const taskTitle = taskItem.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

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

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
