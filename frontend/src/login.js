const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

const setToken = (token) => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const login = {
  formValid: document.getElementById('submitLogin'),
  form: document.querySelector('#form'),
  inputsForm: {
    //Input element
    email: document.getElementById('email'), // Email
    password: document.getElementById('password'), // Password
    otp: document.getElementById('otp'), // otp
    //ValueInput
    inputEmail: function () {
      return this.email.value;
    },
    inputPassword: function () {
      return this.password.value;
    },
    inputOtp: function () {
      return this.otp.value;
    },
  },
  error: document.getElementById('error'),
};
login.formValid.addEventListener('click', (e) => {
  if (login.inputsForm.email) {
    if (login.inputsForm.email.validity.valueMissing) {
      e.preventDefault();
    }
  }
  if (login.inputsForm.password) {
    if (login.inputsForm.password.validity.valueMissing) {
      e.preventDefault();
    }
  }
  if (login.inputsForm.otp) {
    if (login.inputsForm.otp.validity.valueMissing) {
      e.preventDefault();
    }
  }
});
login.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  //Send to API
  try {
    fetch(login.form.getAttribute('action'), {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        email: login.inputsForm.inputEmail(),
        password: login.inputsForm.inputPassword(),
        otp: login.inputsForm.inputOtp(),
      }),
    }).then((res) => {
      if (res.status === 200 || res.status === 201) {
        res.json().then((token) => {
          setToken(token.token);
        });
        window.location.href = 'view/home.html';
      } else if (res.status === 429) {
        login.error.innerHTML = 'Trop de tentatives, veuillez réessayer plus tard';
        login.error.classList.add('errorbg');
      } else {
        login.error.innerHTML = 'Erreur de saisie';
        login.error.classList.add('errorbg');
      }
    });
  } catch (e) {
    console.log(e);
  }
});
