let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

let draggedItem = null;
let editingTask = null;

/* Task Logic */

function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const descElement = document.createElement("p");
  descElement.textContent = desc;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  div.appendChild(titleElement);
  div.appendChild(descElement);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  column.appendChild(div);

  // Drag
  div.addEventListener("dragstart", () => {
    draggedItem = div;
  });

  // Delete
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  // Edit
  editButton.addEventListener("click", () => {
    editingTask = div;

    taskTitleInput.value = titleElement.textContent;
    taskDescInput.value = descElement.textContent;

    taskError.textContent = "";
    taskError.classList.remove("active");

    addTaskButton.textContent = "Save Changes";

    modal.classList.add("active");
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((task) => {
      return {
        title: task.querySelector("h2").textContent,
        desc: task.querySelector("p").textContent,
      };
    });

    count.textContent = tasks.length;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

/* Load Saved Tasks */

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }

  updateTaskCount();
}

/* Drag & Drop */

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (draggedItem) {
      column.appendChild(draggedItem);

      column.classList.remove("hover-over");

      updateTaskCount();

      draggedItem = null;
    }
  });
}

columns.forEach((column) => {
  addDragEventsOnColumn(column);
});

/* Modal Logic */

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");

const addTaskButton = document.querySelector("#add-new-task");

const taskTitleInput = document.querySelector("#task-title-input");
const taskDescInput = document.querySelector("#task-desc-input");

const taskError = document.querySelector("#task-error");

/* Open Modal */

toggleModalButton.addEventListener("click", () => {
  editingTask = null;

  taskTitleInput.value = "";
  taskDescInput.value = "";

  taskError.textContent = "";
  taskError.classList.remove("active");

  addTaskButton.textContent = "Add Task";

  modal.classList.add("active");
});

/* Close Modal */

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");

  editingTask = null;

  taskTitleInput.value = "";
  taskDescInput.value = "";

  taskError.textContent = "";
  taskError.classList.remove("active");

  addTaskButton.textContent = "Add Task";
});

/* Add / Edit Task */

addTaskButton.addEventListener("click", () => {
  const taskTitle = taskTitleInput.value.trim();
  const taskDesc = taskDescInput.value.trim();

  // Validation
  if (!taskTitle || !taskDesc) {
    taskError.textContent = "Task title and description are required.";
    taskError.classList.add("active");

    return;
  }

  // Clear error
  taskError.textContent = "";
  taskError.classList.remove("active");

  // Edit existing task
  if (editingTask) {
    editingTask.querySelector("h2").textContent = taskTitle;
    editingTask.querySelector("p").textContent = taskDesc;

    editingTask = null;

    addTaskButton.textContent = "Add Task";

    updateTaskCount();

    modal.classList.remove("active");

    taskTitleInput.value = "";
    taskDescInput.value = "";

    return;
  }

  // Add new task
  addTask(taskTitle, taskDesc, todo);

  updateTaskCount();

  modal.classList.remove("active");

  taskTitleInput.value = "";
  taskDescInput.value = "";
});