"""AP-Server側エントリーポイント

本来のFIDO認証はクライアントサイドで管理する秘密鍵を暗号化に使用し、
サーバーサイドで保持する公開鍵を復号に使用する。
しかし、実装の都合で立場を逆にして本アプリケーションは実装を行う。
"""

import base64
from typing import Optional

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from func import generate_challenge, get_public_key, load_private_key


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 共通レスポンスモデル ---
class APIResponse(BaseModel):
    status: str  # "OK" or "NG"
    message: Optional[str] = None  # エラーや補足のメッセージ
    data: Optional[dict[str, str]] = None  # 返却したいデータ


# --- リクエストモデル ---
class LoginRequest(BaseModel):
    username: str
    encrypted_challenge: str


# --- ユーザーチャレンジ管理 ---
user_challenges: dict[str, str] = {
    "test": "",
}


@app.get("/challenge/", response_model=APIResponse)
async def get_challenge(username: str):
    """チャレンジ文字列を返却するAPI"""
    if username not in user_challenges:
        return APIResponse(status="NG", message="ユーザーが存在しません")
    challenge = generate_challenge()
    user_challenges[username] = challenge
    return APIResponse(status="OK", data={"challenge": challenge})


@app.get("/public_key/", response_model=APIResponse)
async def get_pubkey():
    """公開鍵を返却"""
    try:
        public_key = get_public_key()
        return APIResponse(status="OK", data={"public_key": public_key})
    except Exception as e:
        return APIResponse(status="NG", message=f"公開鍵の取得に失敗: {e}")


@app.post("/login", response_model=APIResponse)
async def login(request: LoginRequest):
    """ログイン認証API"""
    try:
        private_key = load_private_key("private_key.pem")

        # Base64 でデコードされた暗号チャレンジを復号
        encrypted_bytes = base64.b64decode(request.encrypted_challenge)
        decrypted_bytes = private_key.decrypt(
            encrypted_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        decrypted_challenge = decrypted_bytes.decode("utf-8")

        # 元のチャレンジと一致するか確認
        original_challenge = user_challenges.get(request.username)
        if decrypted_challenge != original_challenge:
            return APIResponse(status="NG", message="チャレンジが一致しません")

        return APIResponse(status="OK", data={"decrypted_challenge": decrypted_challenge})

    except Exception as e:
        return APIResponse(status="NG", message=f"復号失敗: {e}")
