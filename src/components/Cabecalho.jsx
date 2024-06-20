import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Cabecalho() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="cabecalho">
      <h1>Meu Fórum Gamificado</h1>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated ? ( // Exibe opções apenas se autenticado
          <>
            <Link to="/criar-topico">Criar Tópico</Link>
            <Link to="/perfil">Perfil ({user.username})</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : null} {/* Não renderiza nada se não autenticado */}
      </nav>
    </header>
  );
}

export default Cabecalho;
