import React, { useState } from "react";

// Services
import { login } from "../services/login";

// CSS
import "../styles/Login.css";

/**
 * ログイン画面
 */
const Login: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  };

  const clickLogin = async () => {
    if (!user.trim()) {
      setMessage("ユーザー名を入力してください。");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsSuccess(null);

    try {
      const resultMessage = await login(user);
      const isLoginSuccess = resultMessage.includes("成功");

      setMessage(resultMessage);
      setIsSuccess(isLoginSuccess);
    } catch (error) {
      setMessage("ログイン中にエラーが発生しました。");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setUser("");
    }
  };

  return (
    <div className="login">
      <h1 className="login-title">FIDO認証でログインをしてみよう!</h1>

      <label htmlFor="username">ユーザー名</label>
      <input
        type="text"
        id="username"
        value={user}
        onChange={handleOnChange}
        disabled={isLoading}
      />

      <button id="login-btn" onClick={clickLogin} disabled={isLoading}>
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>

      {message && (
        <p
          id="result"
          className={
            isSuccess === null
              ? ""
              : isSuccess
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
