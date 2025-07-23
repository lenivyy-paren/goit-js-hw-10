import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector('#datetime-picker');
  const startBtn = document.querySelector('[data-start]');
  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');

  let selectedDate = null;
  let intervalId = null;

  startBtn.disabled = true;

  const fp = flatpickr(picker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const picked = selectedDates[0];
      if (!picked || picked <= new Date()) {
        startBtn.disabled = true;
        iziToast.error({
          title: 'Invalid date',
          message: 'Please choose a date in the future',
          position: 'topRight',
        });
      } else {
        selectedDate = picked;
        startBtn.disabled = false;
      }
    },
  });

  // Встановлюємо поточну дату у поле інпуту вручну
  picker.value = fp.input.value;

  // Запускаємо таймер
  startBtn.addEventListener('click', () => {
    if (!selectedDate) return;

    startBtn.disabled = true;
    picker.disabled = true;

    intervalId = setInterval(() => {
      const now = new Date();
      const diff = selectedDate - now;

      if (diff <= 0) {
        clearInterval(intervalId);
        updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        picker.disabled = false;

        iziToast.success({
          title: 'Timer finished',
          message: 'You can select a new date now!',
          position: 'topRight',
        });

        return;
      }

      const time = convertMs(diff);
      updateTimerUI(time);
    }, 1000);
  });

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  function updateTimerUI({ days, hours, minutes, seconds }) {
    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
});
