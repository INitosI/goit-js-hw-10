import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

//значення обраної дати
const userSelectedDate = {
  selectedYear: 0,
  selectedMonth: 0,
  selectedDay: 0,
  selectedHour: 0,
  selectedMinutes: 0,
  selectedSeconds: 0,
};

let timerId = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function getMilis(date = {}) {
  const year = date.selectedYear ?? date.currentYear ?? date.year;
  const month = date.selectedMonth ?? date.currentMonth ?? date.month;
  const day = date.selectedDay ?? date.currentDay ?? date.day;
  const hour = date.selectedHour ?? date.currentHour ?? date.hour;
  const minutes = date.selectedMinutes ?? date.currentMinutes ?? date.minutes;
  const seconds = date.selectedSeconds ?? date.currentSeconds ?? date.seconds;
  return new Date(year, month, day, hour, minutes, seconds).getTime();
}

function getTimeDifference(selectedDate = {}, currentDate = {}) {
  const selectedMs = getMilis(selectedDate);
  const currentMs = getMilis(currentDate);
  return selectedMs - currentMs;
}

function convertMs(selectedDate = {}, currentDate = {}) {
  const ms = getTimeDifference(selectedDate, currentDate);
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

//ініціалізація елементів з розмітки
const init = {
  startBtn: document.querySelector('[data-start]'),
  daysLeft: document.querySelector('[data-days]'),
  hoursLeft: document.querySelector('[data-hours]'),
  minutesLeft: document.querySelector('[data-minutes]'),
  secondsLeft: document.querySelector('[data-seconds]'),
};

//відключеня кнопки
init.startBtn.disabled = true;

//функція перевірки валідності внесеної дати та часу
function validateDate() {
  return new Promise((res, rej) => {
    const selected = new Date(
      userSelectedDate.selectedYear,
      userSelectedDate.selectedMonth,
      userSelectedDate.selectedDay,
      userSelectedDate.selectedHour,
      userSelectedDate.selectedMinutes,
      userSelectedDate.selectedSeconds
    );
    if (selected <= new Date()) {
      init.startBtn.disabled = true;
      rej('Please choose a date in the future');
    } else {
      res('Date is valid');
    }
  });
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const d = selectedDates[0];

    userSelectedDate.selectedYear = d.getFullYear();
    userSelectedDate.selectedMonth = d.getMonth();
    userSelectedDate.selectedDay = d.getDate();
    userSelectedDate.selectedHour = d.getHours();
    userSelectedDate.selectedMinutes = d.getMinutes();
    userSelectedDate.selectedSeconds = d.getSeconds();
    validateDate()
      .then(msg => {
        init.startBtn.disabled = false;
      })
      .catch(err => {
        iziToast.show({
          title: 'Hey',
          message: err,
          color: 'red',
          position: 'topRight',
        });
      });
  },
};

flatpickr('#datetime-picker', options);

init.startBtn.addEventListener('click', () => {
  if (timerId) return;
  timerId = setInterval(() => {
    const d = new Date();

    const currentDate = {
      currentYear: d.getFullYear(),
      currentMonth: d.getMonth(),
      currentDay: d.getDate(),
      currentHour: d.getHours(),
      currentMinutes: d.getMinutes(),
      currentSeconds: d.getSeconds(),
    };

    const dateDifference = convertMs(userSelectedDate, currentDate);
    init.daysLeft.textContent = addLeadingZero(dateDifference.days);
    init.hoursLeft.textContent = addLeadingZero(dateDifference.hours);
    init.minutesLeft.textContent = addLeadingZero(dateDifference.minutes);
    init.secondsLeft.textContent = addLeadingZero(dateDifference.seconds);
  }, 1000);
});
