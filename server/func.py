"""サーバー処理"""

import secrets
import string

from cryptography.hazmat.primitives import serialization


def load_private_key(pem_path: str):
    """PEM形式の秘密鍵を読み込む関数"""
    with open(pem_path, "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )
    return private_key


def load_public_key(pem_path: str):
    """PEM形式の公開鍵を読み込む関数"""
    with open(pem_path, "rb") as key_file:
        public_key = serialization.load_pem_public_key(key_file.read())
    return public_key


def get_public_key() -> str:
    """公開鍵を取得する関数"""
    public_key = load_public_key("public_key.pem")
    public_key_byte = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return public_key_byte.decode("utf-8")


def generate_challenge() -> str:
    """暗号論的に安全な16桁のチャレンジコードを生成
    
    NOTE:
        大文字+小文字+数字+記号の16文字
    """
    challenge = string.ascii_letters + string.digits + string.punctuation
    return "".join(secrets.choice(challenge) for _ in range(16))
