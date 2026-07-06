const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Standard fetch API wrapper.
 * Automatically appends JSON headers, processes responses, and handles HTTP errors.
 * 
 * @param endpoint The API path (e.g. "/tasks" or "tasks/1")
 * @param options Express/Fetch RequestInit configuration
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle error responses
  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = { message: response.statusText };
    }
    const message = errorDetails?.error?.message || errorDetails?.message || "An unexpected error occurred";
    throw new Error(message);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
