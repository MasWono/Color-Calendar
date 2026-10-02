(() => {
  "use strict";

  const STORAGE_KEY = "color-calendar-v1";
  const state = {
    cursor: new Date(),
    marks: loadMarks()
  };

  const title = document.getElementById("monthTitle");
  const grid = document.getElementById("calendarGrid");
  const greenCount = document.getElementById("greenCount");
  const redCount = document.getElementById("redCount");
  const unmarkedCount = document.getElementById("unmarkedCount");

  document.getElementById("prevMonth").addEventListener("click", () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() - 1, 1);
    render();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + 1, 1);
    render();
  });

  let touchStartX = 0;
  let touchStartY = 0;
  grid.addEventListener("touchstart", e => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, {passive: true});

  grid.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      state.cursor = new Date(
        state.cursor.getFullYear(),
        state.cursor.getMonth() + (dx < 0 ? 1 : -1),
        1
      );
      render();
    }
  }, {passive: true});

  function loadMarks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (_) {
      return {};
    }
  }

  function saveMarks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.marks));
  }

  function keyFor(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function nextStatus(status) {
    if (status === "green") return "red";
    if (status === "red") return "normal";
    return "green";
  }

  function render() {
    const year = state.cursor.getFullYear();
    const month = state.cursor.getMonth();

    title.textContent = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(state.cursor).toUpperCase();

    grid.innerHTML = "";

    // JS Sunday=0; convert to Monday=0.
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < mondayOffset; i++) {
      const blank = document.createElement("div");
      blank.className = "day empty";
      blank.setAttribute("aria-hidden", "true");
      grid.appendChild(blank);
    }

    const today = new Date();
    let green = 0, red = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const button = document.createElement("button");
      button.className = "day";
      button.type = "button";

      const key = keyFor(year, month, day);
      const status = state.marks[key] || "normal";

      if (status !== "normal") button.classList.add(`status-${status}`);

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

      button.setAttribute(
        "aria-label",
        `${key}, status ${status}. Tap to change status.`
      );

      button.addEventListener("click", () => {
        const updated = nextStatus(state.marks[key] || "normal");
        if (updated === "normal") delete state.marks[key];
        else state.marks[key] = updated;
        saveMarks();
        render();
      });

      if (status === "green") green++;
      if (status === "red") red++;

      grid.appendChild(button);
    }

    greenCount.textContent = green;
    redCount.textContent = red;
    unmarkedCount.textContent = daysInMonth - green - red;
  }

  render();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();
