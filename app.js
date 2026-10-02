const monthTitle = document.getElementById("monthTitle");
const calendarGrid = document.getElementById("calendarGrid");
const greenCount = document.getElementById("greenCount");
const redCount = document.getElementById("redCount");
const normalCount = document.getElementById("normalCount");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const STORAGE_KEY = "color-calendar-status-v1";

let viewDate = new Date();
viewDate.setDate(1);

function loadStatuses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveStatuses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
}

let statuses = loadStatuses();

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nextStatus(current) {
  switch (current) {
    case "green": return "red";
    case "red": return "normal";
    default: return "green";
  }
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  monthTitle.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(viewDate).toUpperCase();

  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendarGrid.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day";

    const key = dateKey(year, month, day);
    const status = statuses[key] || "normal";

    button.dataset.dateKey = key;

    if (status === "green") button.classList.add("status-green");
    if (status === "red") button.classList.add("status-red");

    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    ) {
      button.classList.add("today");
    }

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;
    button.appendChild(number);

    calendarGrid.appendChild(button);
  }

  const totalCells = offset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < trailing; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendarGrid.appendChild(empty);
  }

  updateSummary(year, month, daysInMonth);
}

// One delegated click handler keeps tapping reliable even after every re-render.
calendarGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button.day");
  if (!button || button.classList.contains("empty")) return;

  const key = button.dataset.dateKey;
  if (!key) return;

  const current = statuses[key] || "normal";
  const newStatus = nextStatus(current);

  if (newStatus === "normal") {
    delete statuses[key];
  } else {
    statuses[key] = newStatus;
  }

  saveStatuses();
  renderCalendar();
});

function updateSummary(year, month, daysInMonth) {
  let green = 0;
  let red = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const status = statuses[dateKey(year, month, day)] || "normal";
    if (status === "green") green++;
    else if (status === "red") red++;
  }

  greenCount.textContent = green;
  redCount.textContent = red;
  normalCount.textContent = daysInMonth - green - red;
}

prevMonth.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=5", { updateViaCache: "none" }).catch(() => {});
  });
}
