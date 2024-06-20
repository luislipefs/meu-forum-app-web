import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Topico from '../components/Topico';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom'; // Importe o Link

function Perfil() {
  const { user } = useAuth();
  const [postsDoUsuario, setPostsDoUsuario] = useState([]);

  useEffect(() => {
    const fetchPostsDoUsuario = async () => {
      if (user) {
        try {
          const q = query(collection(db, "posts"), where("author", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPostsDoUsuario(postsData);
        } catch (error) {
          console.error("Erro ao buscar posts do usuário:", error);
        }
      }
    };

    fetchPostsDoUsuario();
  }, [user]);

  if (!user) {
    return <p>Você não está logado. <Link to="/">Faça login</Link> para ver seu perfil.</p>; // Link para a página de login
  }

  return (
    <div className="container">
      <h2>Perfil de {user.displayName || user.email}</h2> 

      <h3>Tópicos criados:</h3>
      {postsDoUsuario.length === 0 ? (
        <p>Você ainda não criou nenhum tópico.</p>
      ) : (
        <ul>
          {postsDoUsuario.map(post => (
            <Topico key={post.id} topico={post} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Perfil;
