/**API通信ロジック */

/**
 * Fetch関数
 * @param url
 * @param method
 * @param body
 * @returns レスポンスJSONまたはエラー
 */
export async function fetchApi<T = any>(
  url: string,
  method: string = "GET",
  body: object = {}
): Promise<T> {
  try {
    const res = await fetch(url, {
      method: method,
      body: method === "GET" ? undefined : JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`HTTP ${res.status} - ${errorBody}`);
    }

    const json: T = await res.json();
    return json;
  } catch (error) {
    console.error("fetchApi error:", error);
    throw error;
  }
}
