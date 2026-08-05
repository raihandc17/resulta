const MIN_PASSWORD_LENGTH = 8;

const PASSWORD_RULES = [
  {
    id: "length",
    test: (value) => value.length >= MIN_PASSWORD_LENGTH,
    label: `At least ${MIN_PASSWORD_LENGTH} characters`,
  },
  {
    id: "lower",
    test: (value) => /[a-z]/.test(value),
    label: "One lowercase letter",
  },
  {
    id: "upper",
    test: (value) => /[A-Z]/.test(value),
    label: "One uppercase letter",
  },
  {
    id: "number",
    test: (value) => /\d/.test(value),
    label: "One number",
  },
];

export function getPasswordRules() {
  return PASSWORD_RULES;
}

export function validatePassword(password) {
  const value = typeof password === "string" ? password : "";

  if (!value) {
    return { ok: false, error: "Password is required." };
  }

  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      return { ok: false, error: `Password must include: ${rule.label.toLowerCase()}.` };
    }
  }

  return { ok: true };
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }
  return { ok: true };
}

export { MIN_PASSWORD_LENGTH };
