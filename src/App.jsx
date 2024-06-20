import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetalhesTopico from './pages/DetalhesTopico';
import CriarTopico from './pages/CriarTopico';
import Perfil from './pages/Perfil';
import Signup from './pages/Signup'; // Importa o componente Signup
import Cabecalho from './components/Cabecalho';
import Rodape from './components/Rodape';
import './App.css';

function App() {
  return (
    <Router>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topicos/:id" element={<DetalhesTopico />} />
        <Route path="/criar-topico" element={<CriarTopico />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/signup" element={<Signup />} /> {/* Nova rota para cadastro */}
      </Routes>
      <Rodape />
    </Router>
  );
}

export default App;
