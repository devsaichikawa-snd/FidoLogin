/** 暗号処理 */

/**
 * チャレンジを暗号化する
 * @param challenge
 * @param publicKey
 * @returns
 */
export async function encryptChallenge(
  challenge: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const encodedChallenge = encoder.encode(challenge);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encodedChallenge
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

/**
 * 公開鍵をSPKI形式にインポートする
 * @param publicKeyPem
 * @returns
 */
export async function convertPublicKey(
  publicKeyPem: string
): Promise<CryptoKey> {
  // 不要文字列を削除
  const formattedPublicKeyPem = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(formattedPublicKeyPem), (c) =>
    c.charCodeAt(0)
  );

  // CryptoKeyにインポート（spki形式）
  const publicKey = window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  return publicKey;
}
