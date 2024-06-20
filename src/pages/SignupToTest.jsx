import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import FormularioCadastro from '../components/FormularioCadastro';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    photoURL: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos do formulário 
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData); // Passa formData para signup
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <FormularioCadastro
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        uploadProgress={uploadProgress}
        errorMessage={errorMessage}
      />

      <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
    </div>
  );
}

export default Signup;
