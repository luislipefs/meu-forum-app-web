import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Comentario from '../components/Comentario';
import FormularioComentario from '../components/FormularioComentario';
import FormularioResposta from '../components/FormularioResposta';
import { doc, getDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function DetalhesTopico() {
  const { id } = useParams();
  const [topico, setTopico] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const { user, addComment, addResposta } = useAuth();

  useEffect(() => {
    const fetchTopicoEComentarios = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTopico(docSnap.data());

          const comentariosQuery = query(
            collection(db, 'comments'),
            where('postId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(comentariosQuery);
          const comentariosData = querySnapshot.docs.map(doc => doc.data());
          setComentarios(comentariosData);
        } else {
          console.log("Tópico não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do tópico e comentários:", error);
      }
    };

    fetchTopicoEComentarios();
  }, [id]); // Adiciona id como dependência

  const handleAddComment = async (commentData) => {
    try {
      await addComment(id, commentData);
      // Recarrega os comentários após adicionar um novo
      fetchTopicoEComentarios(); 
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleAddResposta = async (commentId, respostaData) => {
    try {
      await addResposta(id, commentId, respostaData);
      // Recarrega os comentários após adicionar uma resposta
      fetchTopicoEComentarios();
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  if (!topico) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container">
      <Link to="/">Voltar para a página inicial</Link>
      <h2>{topico.title}</h2>
      <p>{topico.content}</p>

      <h3>Comentários:</h3>
      {comentarios.map(comentario => (
        <div key={comentario.id}>
          <Comentario comentario={comentario} />
          <FormularioResposta onSubmit={(texto) => handleAddResposta(comentario.id, texto)} commentId={comentario.id} postId={id} />
          {comentario.respostas && comentario.respostas.map(resposta => (
            <Comentario key={resposta.id} comentario={resposta} isResposta={true} />
          ))}
        </div>
      ))}
      <FormularioComentario onSubmit={handleAddComment} postId={id} />
    </div>
  );
}

export default DetalhesTopico;
