import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function Topico({ topico }) {
  const { user, toggleLike, likedPosts, isAuthenticated } = useAuth();
  const isLiked = likedPosts.includes(topico.id);

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'posts', topico.id);

      if (isLiked) {
        // Descurtir
        await updateDoc(postRef, {
          likes: topico.likes - 1,
          likedBy: arrayRemove(user.uid)
        });
      } else {
        // Curtir
        await updateDoc(postRef, {
          likes: topico.likes + 1,
          likedBy: arrayUnion(user.uid)
        });
      }
      console.log(topico.id)
      toggleLike(topico.id);
    } catch (error) {
      console.error("Erro ao curtir/descurtir post:", error);
    }
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
          {isLiked ? 'Descurtir' : 'Curtir'}
        </button>
      )}
    </div>
  );
}

export default Topico;

