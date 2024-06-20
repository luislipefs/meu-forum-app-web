import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth(); // Obtém a função signup do contexto
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password); // Chama a função signup do contexto
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Cadastrar</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>

      <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
    </div>
  );
}

export default Signup;
