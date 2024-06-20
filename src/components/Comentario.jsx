import React from 'react';
import { useAuth } from '../AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function Comentario({ comentario }) {
  const { user, toggleLike } = useAuth();
  const isLiked = comentario.likedBy && comentario.likedBy.includes(user?.uid); 

  const handleLike = async () => {
    try {
      const commentRef = doc(db, 'comments', comentario.id);
      if (isLiked) {
        await updateDoc(commentRef, {
          likes: comentario.likes - 1,
          likedBy: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(commentRef, {
          likes: comentario.likes + 1,
          likedBy: arrayUnion(user.uid)
        });
      }
      toggleLike(comentario.id); // Atualiza o estado local
    } catch (error) {
      console.error("Erro ao curtir/descurtir comentário:", error);
    }
  };

  return (
    <div className="comentario">
      <h4>{comentario.authorName || 'Usuário Anônimo'}</h4> {/* Exibe nome do usuário ou "Anônimo" */}
      <p>{comentario.content}</p>
      <div>
        <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? 'Descurtir' : 'Curtir'} {comentario.likes}
        </button>
      </div>
    </div>
  );
}

export default Comentario;
