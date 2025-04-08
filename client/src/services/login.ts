/** ログイン処理 */

import { fetchApi } from "../features/fetch";
import { convertPublicKey, encryptChallenge } from "../features/encrypt";

const BASE_URL = "http://127.0.0.1:8000";

type APIResponse<T = any> = {
  status: string;
  message?: string;
  data?: T;
};

/**
 * ログイン処理
 * @param username
 * @returns
 */
async function login(username: string): Promise<string> {
  if (!username) {
    return "ユーザー名が未入力です。";
  }

  try {
    // 公開鍵を取得
    const resPublicKey = await fetchApi(
      `${BASE_URL}/public_key/?username=${username}`
    );
    const publicKey: CryptoKey = await convertPublicKey(
      resPublicKey.data.public_key
    );

    // チャレンジの取得
    const resChallenge = await fetchApi(
      `${BASE_URL}/challenge/?username=${username}`
    );

    // チャレンジを暗号化
    const encryptedChallenge = await encryptChallenge(
      resChallenge.data.challenge,
      publicKey
    );

    // サーバーに送信
    const resLogin = await fetchApi<APIResponse<object>>(
      `${BASE_URL}/login`,
      "POST",
      {
        username: username,
        encrypted_challenge: encryptedChallenge,
      }
    );

    if (resLogin.status === "OK") {
      return "ログイン認証に成功しました。";
    } else {
      return "ログインに失敗しました。(理由: チャレンジ検証エラー)";
    }
  } catch (err: any) {
    console.error("ログインエラー:", err.message);
    return `ログインに失敗しました。(理由: ${err.message})`;
  }
}

export { login };
