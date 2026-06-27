export type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  familyName: string;
};

export type RegisterFieldErrors = Partial<Record<keyof RegisterValues, string>>;

export function validateRegister(values: RegisterValues): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (!values.firstName?.trim()) {
    errors.firstName = "Inserisci il tuo nome.";
  }

  if (!values.lastName?.trim()) {
    errors.lastName = "Inserisci il tuo cognome.";
  }

  if (!values.email?.includes("@")) {
    errors.email = "Inserisci una email valida.";
  }

  if (!values.password || values.password.length < 8) {
    errors.password = "La password deve avere almeno 8 caratteri.";
  }

  if (!values.familyName?.trim()) {
    errors.familyName = "Inserisci il nome della famiglia.";
  }

  return errors;
}

export function hasErrors(errors: RegisterFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}