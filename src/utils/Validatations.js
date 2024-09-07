export const isValidEmail = (stringEmail) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(stringEmail)
}

export const isValidPassword = (stringPassword) => {
  return stringPassword.length >= 3
}
