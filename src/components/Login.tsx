import React, { useState } from "react";
import apiClient from "../api/apiClient";

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    apiClient
      .post("/auth/login", { username, password })
      .then(() => {
        setIsLoggedIn(true); // Log in the user
      })
      .catch(() => {
        setError("Invalid credentials");
      });
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-96">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block mb-2 w-full px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-4 w-full px-3 py-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
