export const isValidEmail = ( stringEmail ) => {
  return /^[A-Za-z0-9+_.-]+@(.+)$/.test( stringEmail );
}

export const isValidPassword = ( stringPassword ) => {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test( stringPassword );
}