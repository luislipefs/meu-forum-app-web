import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { serverTimestamp } from 'firebase/firestore';

function FormularioComentario({ onSubmit, postId }) { // Adiciona postId como prop
  const [texto, setTexto] = useState('');
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (texto.trim() !== '') {
      onSubmit({
        postId,
        content: texto,
        author: user.uid,
        authorName: user.displayName || user.email, // Obtém o nome do usuário
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      });
      setTexto('');
    }
  };

  if (!isAuthenticated) {
    return <p>Faça login para comentar.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva seu comentário..."
      />
      <button type="submit">Comentar</button>
    </form>
  );
}

export default FormularioComentario;
