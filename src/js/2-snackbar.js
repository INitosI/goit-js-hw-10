import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const init = {
  form: document.querySelector('.form'),
};

const createPromise = (state, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
};

init.form.addEventListener('submit', e => {
  e.preventDefault();

  const delay = Number(init.form.elements.delay.value);
  const state = init.form.elements.state.value;

  createPromise(state, delay)
    .then(delay => {
      iziToast.success({
        icon: false,
        message: `✅ Fulfilled promise in ${delay}ms`,
        color: 'green',
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        icon: false,
        message: `❌ Rejected promise in ${delay}ms`,
        color: 'red',
        position: 'topRight',
      });
    });
});
