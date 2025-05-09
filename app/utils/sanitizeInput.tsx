function sanitizeInput(
  // e: React.FormEvent<HTMLInputElement>,
  input: HTMLInputElement | HTMLTextAreaElement,
  allowLeading62: boolean = false,
  allowNonDigit: boolean = true,
) {
  // Prevent leading zeros
  if (input.value === " " || input.value === "0") {
    // Disallow "0" as the only input
    input.value = "";
  }

  if (allowLeading62) {
    // Replace leading zeros with 62
    return (input.value = input.value.replace(/^0+(?!$)/, "62"));
  }

  // Remove non-digit characters
  if (!allowNonDigit) {
    return (input.value = input.value.replace(/[^\d]/g, ""));
  }
}
