export const emailValidation = (email) => {
  const regexEmail = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,4})+$/;
  return regexEmail.test(email);
}

export const passwordValidation = (password) => {
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  return regexPassword.test(password);
}

export const usernameValidation = (username) => {
  const regexUsername = /^[a-zA-Z0-9]{4,10}$/;
  return regexUsername.test(username);
}