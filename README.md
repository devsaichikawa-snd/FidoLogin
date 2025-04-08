# 🚀 プロジェクト名

FIDO 認証を用いたログインアプリケーション

## プロジェクト説明

FIDO 認証風のログイン機能を実装した。本来はクライアント側で秘密鍵を所持し、サーバー側で公開鍵を所有する。  
実装の都合上、クライアントは公開鍵で暗号化し、サーバーは秘密鍵で復号している。

---

## 🧪 技術スタック

| 分類     | 技術                              |
| -------- | --------------------------------- |
| OS       | Windows11                         |
| フロント | TypeScript + React + Vite         |
| バック   | Python3.11, FastAPI               |
| 認証     | RSA 公開鍵暗号, FIDO 風チャレンジ |
| 暗号     | Web Crypto API                    |
| DB       | ×                                 |

---

## 📦 主な機能

- 🔐 ユーザー認証（公開鍵暗号によるチャレンジレスポンス）
- ⚙️ API サーバーは FastAPI を使用

---

## 📁 ディレクトリ構成

## ✅ セットアップ手順

### 🔧 バックエンド（FastAPI）

```PowerShell
# 任意の作業ディレクトリを作成する。

# 依存関係をインストール
>cd <作業ディレクトリ>
>git clone https://github.com/devsaichikawa-snd/FidoLogin.git
>.\exe_pythonEnvSetUp.ps1
>pip install -r requirements.txt
>cd .\server\

# 動作確認用のキーペアを生成する。
>python exe_create_key.py
→.\server配下にpemファイルが2つ作成される。

# 開発サーバー起動
>uvicorn main:app --reload
```

### 🔧 フロントエンド（TypeScript + React + Vite）

```PowerShell
# 依存関係をインストール
>cd .\client\
>npm install

# 開発サーバー起動
>npm run dev
```
