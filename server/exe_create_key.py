"""公開鍵と秘密鍵のキーペアを作成するスクリプト"""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


ROOT_KEY_PATH = "server/user_key_pair"


def execute(username: str|None = None) -> None:
    """ユーザー毎にキーペアを生成する
    
    NOTE:
        ターミナル実行→動作確認用のキーペアを生成する
        Web実行→ユーザー登録機能から呼び出されてキーペアを生成する
    """
    # キーファイル名称の決定
    private_key_filename = "private_key.pem"
    public_key_filename = "public_key.pem"
    if username:
        private_key_filename = f"{username}_{private_key_filename}"
        public_key_filename = f"{username}_{private_key_filename}"

    # キーペアの生成
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )

    # 公開鍵の取得
    public_key = private_key.public_key()

    # 秘密鍵をPEM形式で保存
    with open(private_key_filename, "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))

    # 公開鍵をPEM形式で保存
    with open(public_key_filename, "wb") as f:
        f.write(public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ))


# ターミナルからの実行用
if __name__ == "__main__":
    execute()
