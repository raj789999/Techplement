const validatePassword = (password, email) => {
  const minLength = 8;
  const uppercaseRegex = /[A-Z]/;
  const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const digitRegex = /\d/;

  if (password.length < minLength) {
    return "Password must be at least 8 characters long.";
  }

  if (email && password.toLowerCase().includes(email.toLowerCase())) {
    return "Password cannot include any part of the email.";
  }

  if (!uppercaseRegex.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!symbolRegex.test(password)) {
    return 'Password must include at least one symbol (!@#$%^&*(),.?":{}|<>).';
  }

  if (!digitRegex.test(password)) {
    return "Password must include at least one numeric digit.";
  }

  return null; // Password is valid
};

const passwordValidation = (req, res, next) => {
  const password = req.body.password || "";
  const email = req.body.email || "";
  
  const passwordError = validatePassword(password, email);

  if (passwordError) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
      details: passwordError,
    });
  }

  next();
};

export default passwordValidation;
