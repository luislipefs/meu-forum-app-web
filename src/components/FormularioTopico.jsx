import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function FormularioTopico() {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const { isAuthenticated, user, addPost } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (titulo.trim() !== '' && conteudo.trim() !== '' && isAuthenticated && user) {
      try {
        await addPost({
          title: titulo,
          content: conteudo,
          createdAt: serverTimestamp(),
          likes: 0,
          likedBy: [],
          author: user.uid,
          authorName: user.displayName || user.email,
        });
        setTitulo('');
        setConteudo('');
        navigate('/');
      } catch (error) {
        console.error("Erro ao criar tópico:", error);
        setErrorMessage(error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return <p>Faça login para criar um tópico.</p>;
  }

  return (
    <div className="container">
      <h2>Criar Novo Tópico</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={80}
            required
          />
          <span className="restantes">Caracteres restantes: {80 - titulo.length}</span>
        </div>
        <div>
          <label htmlFor="conteudo">Conteúdo:</label>
          <textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            maxLength={300}
            required
          />
          <span className="restantes">Caracteres restantes: {300 - conteudo.length}</span>
        </div>
        <button type="submit">Criar Tópico</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default FormularioTopico;
