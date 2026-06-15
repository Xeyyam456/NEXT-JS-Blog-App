import axios from "axios";

export function createRequestError(error, fallbackMessage) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error(fallbackMessage);
  }

  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;
  const requestError = new Error(
    serverMessage ||
      (status ? `${fallbackMessage} Status: ${status}.` : fallbackMessage)
  );

  requestError.status = status;
  return requestError;
}

export async function runRequest({ request, successMessage, errorMessage }) {
  try {
    const data = await request();

    return {
      ok: true,
      data,
      message: successMessage,
    };
  } catch (error) {
    const normalizedError = createRequestError(error, errorMessage);

    return {
      ok: false,
      error: normalizedError,
      message: normalizedError.message,
    };
  }
}

export async function unwrapRequest(config) {
  const result = await runRequest(config);

  if (!result.ok) {
    throw result.error;
  }

  return result;
}