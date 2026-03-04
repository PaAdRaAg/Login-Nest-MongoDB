import { getToken } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const ApiFetch = async <T>(
  path: string,
  options?: RequestInit & { auth?: boolean },
): Promise<T> => {
  const headers = new Headers(options?.headers || {});
  headers.set("Content-Type", "application/json");

  if (options?.auth !== false) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.message;
    const message = Array.isArray(msg)
      ? msg.join("\n")
      : msg || "Error inesperado";
    throw new Error(message);
  }

  return data as T;
};