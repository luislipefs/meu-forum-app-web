import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Importe o contexto
import Topico from '../components/Topico';
import Login from '../components/Login';
import { Link } from 'react-router-dom';

function Home() {
  const { isAuthenticated, posts, fetchPosts, logout } = useContext(AuthContext);

  useEffect(() => {
    if (fetchPosts) {
      fetchPosts(); // Chame fetchPosts apenas se estiver definida
    }
  }, [fetchPosts]);

  return (
    <div className="container" style={{ marginBottom: '50px' }}>
      <h1>Fórum Gamificado</h1>

      {!isAuthenticated ? (
        <Login /> 
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {/* Centraliza o botão e o logout */}
            <Link to="/criar-topico">
              <button>Criar Novo Tópico</button>
            </Link>
            <button onClick={logout}>Logout</button> {/* Move o botão Logout para perto do botão "Criar Novo Tópico" */}
          </div>

          {posts.map(post => (
            <Topico key={post.id} topico={post} />
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
