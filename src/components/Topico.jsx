import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

  function Topico({ topico }) { // Remove setTopico como prop
    const { user, toggleLike, likedPosts, isAuthenticated } = useAuth();
    const isLiked = likedPosts.includes(topico.id);

    const handleLike = async () => {
      console.log('ID do post antes de toggleLike:', topico.id); 
      console.log('isLiked antes de toggleLike:', isLiked);

      toggleLike(topico.id); // Chama a função toggleLike do contexto

      console.log('ID do post depois de toggleLike:', topico.id); 
      console.log('isLiked depois de toggleLike:', !isLiked); 
    };

  return (
    <div className="topico">
      <Link to={`/topicos/${topico.id}`}>
        <h2>{topico.title}</h2>
      </Link>
      <p>{topico.content}</p> {/* Exibe o conteúdo do tópico */}
      <p>
        Likes: {topico.likes} | Por: {topico.authorName || 'Usuário Anônimo'}
      </p>
      {isAuthenticated && (
        <button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!user} // Desabilita o botão se o usuário não estiver logado
        >
          {isLiked ? 'Descurtir' : 'Curtir'} {topico.likes}
        </button>
      )}
    </div>
  );
}

export default Topico;

