import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import Topico from '../components/Topico';
import Login from '../components/Login';
import { Link } from 'react-router-dom';

function Home() {
  const { isAuthenticated, posts, fetchPosts, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const fetchData = async () => { // Função assíncrona para buscar os posts
      if (fetchPosts) {
        await fetchPosts(); 
      }
      setIsLoading(false); // Define isLoading como false após a busca
    };

    fetchData(); // Chama a função fetchData
  }, [fetchPosts]);

  return (
    <div className="container" style={{ marginBottom: '50px' }}>
      <h1>Fórum Gamificado</h1>

      {!isAuthenticated ? (
        <Login /> 
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/criar-topico">
              <button>Criar Novo Tópico</button>
            </Link>
            <button onClick={logout}>Logout</button>
          </div>

          {isLoading ? ( // Exibe "Carregando..." enquanto os dados são buscados
            <p>Carregando posts...</p>
          ) : (
            posts.map(post => (
              <Topico key={post.id} topico={post} />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Home;
