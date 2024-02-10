// Variables
const container = document.getElementById('container');
const card = document.getElementById('card');
const secondsHand = document.querySelector('.seconds-hand');
const minuteHand = document.querySelector('.minute-hand');
const hourHand = document.querySelector('.hour-hand');
const clock = document.getElementById('clock');
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const alarmHoursInput = document.getElementById('alarmHours');
const alarmMinutesInput = document.getElementById('alarmMinutes');
const alarmSecondsInput = document.getElementById('alarmSeconds');
const amPmSelect = document.getElementById('amPm');
const alarmsList = document.getElementById('alarmsList');

// Update clock every second
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const amPm = now.getHours() >= 12 ? 'PM' : 'AM';

  // Calculate degrees for the seconds hand
  const secondsDegrees = (seconds / 60) * 360 - 180;
  secondsHand.style.transform = `rotate(${secondsDegrees}deg)`;

  // Calculate degrees for the minute hand
  const totalMinutes = minutes + seconds / 60;
  const minutesDegrees = (totalMinutes / 60) * 360 - 180;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;

  // Calculate degrees for the hour hand
  const totalHours = hours + totalMinutes / 60;
  const hoursDegrees = (totalHours / 12) * 360 - 180;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  clock.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
    seconds
  )} ${amPm}`;

  // Check if any alarms match the current time
  checkAlarms(hours, minutes, seconds, amPm);
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Function to check if alarms match the current time
function checkAlarms(
  currentHours,
  currentMinutes,
  currentSeconds,
  currentAmPm
) {
  const existingAlarms = document.querySelectorAll('#alarmsList li');
  const currentTime = `${formatTime(currentHours)}:${formatTime(
    currentMinutes
  )}:${formatTime(currentSeconds)} ${currentAmPm}`;

  for (const alarm of existingAlarms) {
    const existingAlarmTime = alarm.textContent.split('Delete')[0].trim();

    // Check if the current time matches any of the alarm times
    if (existingAlarmTime === currentTime.trim()) {
      // Play audio
      playAlarmSound();

      // Set animation for alarm-clock
      const alarmClock = document.querySelector('.alarm-clock');
      alarmClock.style.animation = 'clock 20s 1 linear';
    }
  }
}

// Function to play alarm sound
function playAlarmSound() {
  const audio = new Audio('assets/alarm_tune.mp3');
  audio.play();
}

// Function to show/hide the "Alarms" header based on the presence of items
function toggleAlarmsHeader() {
  const alarmsContainer = document.querySelector('.alarms-container');
  const alarmsList = document.getElementById('alarmsList');
  const alarmsHeader = alarmsContainer.querySelector('h2');

  if (alarmsList.children.length > 0) {
    // If there are items, show the header
    alarmsHeader.style.display = 'block';
  } else {
    // If no items, hide the header
    alarmsHeader.style.display = 'none';
  }
}

// Set Alarm
function setAlarm() {
  const hours = parseInt(alarmHoursInput.value);
  const minutes = parseInt(alarmMinutesInput.value);
  const seconds = parseInt(alarmSecondsInput.value);
  const amPm = amPmSelect.value;

  // Validate the entered values
  if (
    isNaN(hours) ||
    hours < 1 ||
    hours > 12 ||
    isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59 ||
    isNaN(seconds) ||
    seconds < 0 ||
    seconds > 59
  ) {
    // Alert the user about invalid input
    showAlert(
      'Invalid input! Please enter valid values for hours, minutes, and seconds.'
    );
    return; // Stop execution if input is invalid
  }

  const alarmTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
    seconds
  )} ${amPm}`;

  // Check if the alarm time is already present
  if (isAlarmAlreadyPresent(alarmTime)) {
    showAlert('An alarm with the same time is already present!');
    return; // Stop execution if duplicate alarm is found
  }

  const listItem = document.createElement('li');
  listItem.textContent = alarmTime;

  // Delete button for each alarm
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function () {
    alarmsList.removeChild(listItem);

    // After deleting an alarm, toggle the header visibility
    toggleAlarmsHeader();
  };

  listItem.appendChild(deleteButton);
  alarmsList.appendChild(listItem);

  // After adding an alarm, toggle the header visibility
  toggleAlarmsHeader();

  // Clear input fields
  alarmHoursInput.value = '';
  alarmMinutesInput.value = '';
  alarmSecondsInput.value = '';
}

// Function to check if alarm with the same time is already present
function isAlarmAlreadyPresent(alarmTime) {
  const existingAlarms = document.querySelectorAll('#alarmsList li');
  for (const alarm of existingAlarms) {
    const existingAlarmTime = alarm.textContent.split('Delete')[0].trim();
    if (existingAlarmTime === alarmTime.trim()) {
      return true; // Duplicate alarm found
    }
  }
  return false; // No duplicate alarm found
}

// Function to show styled alert
function showAlert(message) {
  alert(message);
}

// Toggle Theme
function toggleTheme() {
  const themeCheckbox = document.getElementById('toggleThemeBtn');
  const toggleText = document.getElementById('toggleText');
  const root = document.documentElement;

  if (themeCheckbox.checked) {
    // Dark theme
    root.style.setProperty('--theme-color', '#2c3e50');
    root.style.setProperty('--themetoggle-color', '#ecf0f1');
    toggleText.textContent = 'Light';
  } else {
    // Light theme
    root.style.setProperty('--theme-color', '#ecf0f1');
    root.style.setProperty('--themetoggle-color', '#2c3e50');
    toggleText.textContent = 'Dark';
  }
}

// Update clock and minute hand every second
setInterval(() => {
  updateClock();
}, 1000);

// Initial clock update
updateClock();
// Initial check to hide the header if no alarms are present
toggleAlarmsHeader();
