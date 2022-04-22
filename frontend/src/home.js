const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

const getToken = () => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};
if (getToken() == undefined) {
  window.location.href = '../index.html';
}
