export const isSuccess = (responses: { success: boolean }[]) =>
  responses.every((response) => response.success);

export function combineMessages(
  responses: { success: boolean; message?: string }[],
) {
  const messages = responses
    .filter((response) => response.success && response.message)
    .map((response) => response.message)
    .join(", ");

  return messages;
}
