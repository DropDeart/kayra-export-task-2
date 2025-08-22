const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}/${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API isteği başarısız oldu');
  }

  return response.json() as Promise<T>;
}