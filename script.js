const STORAGE_KEY = "todo-tasks";

const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCounter = document.getElementById("task-counter");

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
  renderTaskCounter();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(index));

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.setAttribute("aria-label", `Remove "${task.text}"`);
    removeBtn.addEventListener("click", () => removeTask(index));

    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function renderTaskCounter() {
  if (tasks.length === 0) {
    taskCounter.textContent = "";
    return;
  }
  const remaining = tasks.filter((task) => !task.done).length;
  taskCounter.textContent = `${remaining} of ${tasks.length} task${tasks.length === 1 ? "" : "s"} remaining`;
}

function addTask(text) {
  tasks.push({ text, done: false });
  saveTasks();
  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

render();
