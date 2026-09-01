let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

const tasks = document.querySelectorAll(".task");
let draggedItem = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  column.appendChild(div);

  div.addEventListener("drag", (e) => {
    draggedItem = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((tsk) => {
      return {
        title: tsk.querySelector("h2").textContent,
        desc: tsk.querySelector("p").textContent,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.textContent = tasks.length;
  });
}

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

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    draggedItem = task;
  });
});

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.appendChild(draggedItem);
    column.classList.remove("hover-over");

    updateTaskCount();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

/* Modal related logic */
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

const taskTitleInput = document.querySelector("#task-title-input");
const taskDescInput = document.querySelector("#task-desc-input");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = taskTitleInput.value;
  const taskDesc = taskDescInput.value;

  addTask(taskTitle, taskDesc, todo);
  updateTaskCount();

  modal.classList.remove("active");

  taskTitleInput.value = "";
  taskDescInput.value = "";
});
/* Modal related logic */
