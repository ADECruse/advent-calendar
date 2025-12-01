// Advent Calendar - ES6 JavaScript

class AdventCalendar {
  constructor() {
    this.content = [];
    this.openedWindows = new Set();
    this.currentYear = new Date().getFullYear();
    this.currentMonth = 12; // December
    this.init();
  }

  async init() {
    this.loadOpenedWindows();
    await this.loadContent();
    this.renderCalendar();
    this.setupEventListeners();
  }

  async loadContent() {
    try {
      const response = await fetch("content.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.content = await response.json();
      // Sort by day number to ensure correct order
      this.content.sort((a, b) => a.day - b.day);
      console.log("Content loaded successfully:", this.content.length, "days");
    } catch (error) {
      console.error("Error loading content:", error);
      console.error(
        "Make sure you are running a local server. Try: python3 -m http.server 8000"
      );
      // Continue anyway - windows will still render, just without content
      this.content = [];
    }
  }

  loadOpenedWindows() {
    const saved = localStorage.getItem("adventOpenedWindows");
    if (saved) {
      try {
        const opened = JSON.parse(saved);
        this.openedWindows = new Set(opened);
      } catch (error) {
        console.error("Error loading opened windows:", error);
      }
    }
  }

  saveOpenedWindow(day) {
    this.openedWindows.add(day);
    localStorage.setItem(
      "adventOpenedWindows",
      JSON.stringify([...this.openedWindows])
    );
  }

  checkDateRestriction(day) {
    const today = new Date();
    const targetDate = new Date(this.currentYear, this.currentMonth - 1, day);

    // Allow opening if today is on or after the target date
    return today >= targetDate;
  }

  renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    if (!grid) {
      console.error("Calendar grid element not found!");
      return;
    }

    grid.innerHTML = "";

    // Create 24 windows
    for (let day = 1; day <= 24; day++) {
      const windowElement = this.createWindowElement(day);
      grid.appendChild(windowElement);
    }

    console.log("Calendar rendered with", grid.children.length, "windows");
  }

  createWindowElement(day) {
    const isOpened = this.openedWindows.has(day);
    const canOpen = this.checkDateRestriction(day);
    const dayContent = this.content.find((item) => item.day === day);

    const windowDiv = document.createElement("div");
    windowDiv.className = `
            relative aspect-square rounded-lg shadow-lg transition-all duration-300
            ${
              isOpened
                ? "bg-gradient-to-br from-green-400 to-green-600 cursor-pointer hover:scale-105"
                : canOpen
                ? "bg-gradient-to-br from-red-400 to-red-600 cursor-pointer hover:scale-105 hover:shadow-xl"
                : "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed opacity-60"
            }
            flex items-center justify-center
        `;

    const dayNumber = document.createElement("div");
    dayNumber.className = "text-4xl font-bold text-white drop-shadow-lg";
    dayNumber.textContent = day;

    windowDiv.appendChild(dayNumber);

    if (isOpened) {
      const checkmark = document.createElement("div");
      checkmark.className = "absolute top-2 right-2 text-white text-2xl";
      checkmark.textContent = "✓";
      windowDiv.appendChild(checkmark);
    }

    if (canOpen && !isOpened) {
      windowDiv.addEventListener("click", () => this.openWindow(day));
    } else if (isOpened) {
      windowDiv.addEventListener("click", () => this.openWindow(day));
    } else {
      windowDiv.addEventListener("click", () => {
        this.showError(
          `Day ${day} is not available yet. Please wait until December ${day}!`
        );
      });
    }

    return windowDiv;
  }

  openWindow(day) {
    if (!this.checkDateRestriction(day) && !this.openedWindows.has(day)) {
      this.showError(
        `Day ${day} is not available yet. Please wait until December ${day}!`
      );
      return;
    }

    const dayContent = this.content.find((item) => item.day === day);
    if (!dayContent) {
      this.showError(`No content found for day ${day}.`);
      return;
    }

    this.saveOpenedWindow(day);
    this.displayContent(dayContent);
    // Re-render to update the visual state
    this.renderCalendar();
  }

  displayContent(dayData) {
    const modal = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = dayData.title || `Day ${dayData.day}`;
    modalContent.innerHTML = "";

    if (dayData.type === "photo") {
      const img = document.createElement("img");
      img.src = dayData.content;
      img.alt = dayData.title || `Day ${dayData.day}`;
      img.className = "w-full h-auto rounded-lg shadow-md";
      img.onerror = () => {
        modalContent.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-red-500 mb-4">Failed to load image</p>
                        <p class="text-gray-600">Path: ${dayData.content}</p>
                    </div>
                `;
      };
      modalContent.appendChild(img);
    } else if (dayData.type === "message") {
      const messageDiv = document.createElement("div");
      messageDiv.className = "text-lg text-gray-700 whitespace-pre-wrap";
      messageDiv.textContent = dayData.content;
      modalContent.appendChild(messageDiv);
    } else {
      modalContent.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-600">Unknown content type: ${dayData.type}</p>
                </div>
            `;
    }

    modal.classList.remove("hidden");
  }

  setupEventListeners() {
    const modal = document.getElementById("modal-overlay");
    const closeBtn = document.getElementById("close-modal");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal();
      }
    });
  }

  closeModal() {
    const modal = document.getElementById("modal-overlay");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  showError(message) {
    const toast = document.getElementById("error-toast");
    const errorMsg = document.getElementById("error-message");

    if (toast && errorMsg) {
      errorMsg.textContent = message;
      toast.classList.remove("hidden");

      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    }
  }
}

// Initialize the calendar when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing calendar...");
  try {
    new AdventCalendar();
  } catch (error) {
    console.error("Error initializing calendar:", error);
    const grid = document.getElementById("calendar-grid");
    if (grid) {
      grid.innerHTML = `
                <div class="col-span-full text-center p-8 bg-red-100 rounded-lg">
                    <p class="text-red-600 font-bold mb-2">Error loading calendar</p>
                    <p class="text-gray-700">Please check the browser console for details.</p>
                    <p class="text-sm text-gray-600 mt-4">Make sure you are running a local server (e.g., python3 -m http.server 8000)</p>
                </div>
            `;
    }
  }
});
