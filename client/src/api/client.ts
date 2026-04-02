const BASE_URL = "/api/v1";

export const apiPost = async <T>(path: string, body?: FormData | object): Promise<T> => {
  const isFormData = body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message);
  }

  return res.json();
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message);
  }

  return res.json();
};
