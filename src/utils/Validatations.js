export const isValidEmail = stringEmail => {
  return /^[A-Za-z0-9+_.-]+@(.+)$/.test(stringEmail)
}

export const isValidPassword = stringPassword => {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    stringPassword,
  )
}

export const isValidEmailOrUsername = stringEmailOrUsername => {
  return (
    /^[A-Za-z0-9+_.-]+@(.+)$/.test(stringEmailOrUsername) ||
    /^[A-Za-z0-9_.-]+$/.test(stringEmailOrUsername)
  )
}

export const isValidUsername = stringUsername => {
  return /^[A-Za-z0-9_.-]+$/.test(stringUsername)
}

export const isValidFullName = stringFullName => {
  return /^[A-Za-z\s]+$/.test(stringFullName)
}
