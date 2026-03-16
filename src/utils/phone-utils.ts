/**
 * Restreint une chaîne de caractères aux seuls caractères valides pour un numéro de téléphone
 * (chiffres, espaces, tirets, parenthèses)
 */
export const restrictToPhoneNumber = (value: string): string => {
  return value.replace(/[^\d\s\-()]/g, "");
};

/**
 * Version stricte (chiffres uniquement)
 */
export const restrictToDigits = (value: string): string => {
  return value.replace(/[^\d]/g, "");
};
