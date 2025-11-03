import { BASEURL } from "../constant";

export async function fetchWrapper(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${BASEURL}${path}`, {
    method: options.method || "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }
  return response.json();
}
