// Reference DOM Elements

const RESET_BUTTON = document.querySelector(".container_buttonHolder")
  .children[0];
const STOP_BUTTON = document.querySelector(".container_buttonHolder")
  .children[1];
const START_BUTTON = document.querySelector(".container_buttonHolder")
  .children[2];
const LAP_BUTTON = document.getElementById("lapBtn");
const TIMER_HOLDER = document.getElementById("timer");
const LAPS_HOLDER = document.getElementById("laps");
const EXTRA_TIMER = document.getElementById("extraTimer");
const THEME_SWITCHER = document.getElementById("themeSwitcher");

// Global Variables

let timer = 0;
let timerId;
let hasStarted = false;
let lapIndex = 0;
let prevLap = 0;
let isDarkMode = true;

/**
 * Handles the start button click event.
 * If the stopwatch has already started, it will do nothing.
 * Otherwise, it will start the stopwatch by setting the interval
 * and updating the UI.
 */
const handleStart = () => {
  if (hasStarted) {
    return;
  }
  let miliseconds = 0;
  timerId = setInterval(() => {
    timer += 1;
    miliseconds = setMiliseconds(timer);
    TIMER_HOLDER.innerHTML = `${formatTimeWithoutMiliseconds(
      timer
    )}.<span>${miliseconds.toString().slice(0, 2).padStart(2, "0")}</span>`;
    EXTRA_TIMER.innerText = `+${formatTimeWithMiliseconds(timer - prevLap)}`;
  }, 1);

  hasStarted = true;
  START_BUTTON.disabled = true;
  STOP_BUTTON.disabled = false;
  LAP_BUTTON.disabled = false;
  RESET_BUTTON.disabled = true;
};

/**
 * Handles the stop button click event.
 * Clears the interval for the stopwatch and updates the UI
 * by enabling the start button and disabling the stop and lap buttons.
 */
const handleStop = () => {
  clearInterval(timerId);
  hasStarted = false;
  START_BUTTON.disabled = false;
  STOP_BUTTON.disabled = true;
  RESET_BUTTON.disabled = false;
  LAP_BUTTON.disabled = true;
};

/**
 * Resets the stopwatch by clearing the interval, resetting
 * the timer and prevLap values, and updating the UI by
 * resetting the timer and lap holder elements and disabling
 * all buttons except the start button.
 */
const handleReset = () => {
  clearInterval(timerId);
  timer = 0;
  prevLap = 0;
  TIMER_HOLDER.innerHTML = "00:00:00.<span>00</span>";
  LAPS_HOLDER.innerHTML = "";
  hasStarted = false;
  EXTRA_TIMER.innerText = "+00:00:00.00";
  START_BUTTON.disabled = false;
  STOP_BUTTON.disabled = true;
  LAP_BUTTON.disabled = true;
  RESET_BUTTON.disabled = true;
  LAPS_HOLDER.style.opacity = 0;
  lapIndex = 0;
};

/**
 * Handles the lap button click event.
 * Creates a new lap element with the current lap index and time,
 * and appends it to the lap holder element.
 * Also updates the prevLap value with the current timer value.
 */
const handleLaps = () => {
  LAPS_HOLDER.style.opacity = 1;
  lapIndex++;

  const lap = document.createElement("article");
  lap.innerHTML = `<h6 style="color: ${
    isDarkMode ? "white" : "hsl(225, 23%, 24%)"
  }">${lapIndex.toString().padStart(2, "0")}<span>+${formatTimeWithMiliseconds(
    timer - prevLap
  )}</span></h6> 
    <h5 style="color: ${
      isDarkMode ? "white" : "hsl(225, 23%, 24%)"
    }">${formatTimeWithMiliseconds(timer)}</h5>`;
  LAPS_HOLDER.prepend(lap);
  prevLap = timer;
};

/**
 * Formats a given time in milliseconds into a string
 * representing the time in the format "HH:MM:SS".
 * @param {number} time - The time in milliseconds
 * @returns {string} - The formatted time string
 */
const formatTimeWithoutMiliseconds = (time) => {
  let hours = Math.floor(time / 3600000);
  let minutes = Math.floor((time - hours * 3600000) / 60000);
  let seconds = Math.floor((time - minutes * 60000) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Formats a given time in milliseconds into a string
 * representing the time in the format "HH:MM:SS.MMM".
 * @param {number} time - The time in milliseconds
 * @returns {string} - The formatted time string
 */
const formatTimeWithMiliseconds = (time) => {
  let hours = Math.floor(time / 3600000);
  let minutes = Math.floor((time - hours * 3600000) / 60000);
  let seconds = Math.floor((time - minutes * 60000) / 1000);
  let miliseconds = setMiliseconds(time);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${miliseconds
    .toString()
    .slice(0, 2)
    .padStart(2, "0")}`;
};

/**
 * Returns the miliseconds of the given time in milliseconds as a string.
 * If the time in milliseconds is less than 10, returns "00".
 * If the time in milliseconds is less than 100, returns "0X" where X is the
 * first character of the time in milliseconds.
 * Otherwise, returns the time in milliseconds as a string.
 * @param {number} time - The time in milliseconds
 * @returns {string} - The miliseconds of the given time
 */

const setMiliseconds = (time) => {
  let miliseconds;
  if (time % 1000 < 10) {
    miliseconds = "00";
  } else if (time % 1000 < 100) {
    miliseconds = `0${(time % 1000).toString().charAt(0)}`;
  } else {
    miliseconds = time % 1000;
  }
  return miliseconds;
};

/**
 * Toggles the theme of the application between dark and light mode.
 * Updates the theme icons, background colors, and text colors of the application.
 */
const toggleTheme = () => {
  if (isDarkMode) {
    THEME_SWITCHER.children[0].src = "./assets/images/icon-moon.svg";
    THEME_SWITCHER.style.backgroundColor = "white";
    document.body.style.background =
      "linear-gradient(180deg, #EBF2FC 0%, #EEF8F9 100%)";
    document.querySelector("h1").style.color = "hsl(225, 23%, 24%)";
    document.querySelector(".container_time").style.borderColor =
      "hsl(225, 23%, 24%)";
    TIMER_HOLDER.style.color = "hsl(225, 23%, 24%)";
    LAPS_HOLDER.style.backgroundColor = "white";
    for (let article of LAPS_HOLDER.children) {
      article.children[0].style.color = "hsl(225, 23%, 24%)";
      article.children[1].style.color = "hsl(225, 23%, 24%)";
    }
    isDarkMode = false;
  } else {
    THEME_SWITCHER.children[0].src = "./assets/images/icon-sun.svg";
    THEME_SWITCHER.style.backgroundColor = "hsl(225, 23%, 24%)";
    document.body.style.background = "#24232b";
    document.querySelector("h1").style.color = "white";
    document.querySelector(".container_time").style.borderColor = "#4ef4dd";
    TIMER_HOLDER.style.color = "white";
    LAPS_HOLDER.style.backgroundColor = "#1e1e1e";
    for (let article of LAPS_HOLDER.children) {
      article.children[0].style.color = "white";
      article.children[1].style.color = "white";
    }
    isDarkMode = true;
  }
};

// Event Listeners for Buttons and Theme Switcher
START_BUTTON.addEventListener("click", handleStart);
STOP_BUTTON.addEventListener("click", handleStop);
RESET_BUTTON.addEventListener("click", handleReset);
LAP_BUTTON.addEventListener("click", handleLaps);
THEME_SWITCHER.addEventListener("click", toggleTheme);
