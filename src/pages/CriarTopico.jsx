import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function CriarTopico() {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const { isAuthenticated, user, addPost } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (titulo.trim() !== '' && conteudo.trim() !== '' && isAuthenticated && user) { // Verifica se está autenticado
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
        // Lógica para lidar com o erro (ex: exibir mensagem de erro)
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
        {/* ... (inputs de título e conteúdo) ... */}
        <button type="submit">Criar Tópico</button>
      </form>
    </div>
  );
}

export default CriarTopico;
