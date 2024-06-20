import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function FormularioResposta({ onSubmit, commentId, postId }) {
    const [texto, setTexto] = useState('');
    const { isAuthenticated, user } = useAuth();

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (texto.trim() !== '' && isAuthenticated && user) {
          try {
            const respostaData = {
              commentId, // ID do comentário pai
              content: texto,
              author: user.uid,
              authorName: user.displayName || user.email,
              createdAt: serverTimestamp(),
              likes: 0,
              likedBy: []
            };

            // Adiciona a resposta à subcoleção "respostas" do post
            await addDoc(collection(db, "posts", postId, "respostas"), respostaData);

          setTexto(''); 
          onSubmit(respostaData); 
        } catch (error) {
          console.error("Erro ao adicionar resposta:", error);
        }
      }
    };

    if (!isAuthenticated) {
      return <p>Faça login para responder.</p>;
    }

    return (
      <form onSubmit={handleSubmit} className="formulario-resposta">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva sua resposta..."
        />
        <button type="submit">Responder</button>
      </form>
    );
  }

  export default FormularioResposta;
