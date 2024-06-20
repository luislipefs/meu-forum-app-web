import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Cabecalho() {
  const { isAuthenticated, user, logout, userInfo } = useAuth();

  return (
    <header className="cabecalho">
      <h1>Meu Fórum Gamificado</h1>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated &&
          userInfo && ( // Exibe opções apenas se autenticado
            <>
              <Link to="/perfil">
                Perfil ({user.displayName || userInfo.username})
              </Link>
              <button className="botao-logout" onClick={logout}>Logout</button>
            </>
          )}
      </nav>
    </header>
  );
}

export default Cabecalho;
