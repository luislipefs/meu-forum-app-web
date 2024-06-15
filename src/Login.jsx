import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const LoginPage = () => {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const { login } = useAuth();

 const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
 };

 return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
 );
};