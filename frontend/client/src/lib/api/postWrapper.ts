import { BASEURL } from "../constant.js";

export async function postWrapper(path: string, body?: any): Promise<any> {
  const response = await fetch(`${BASEURL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
}
