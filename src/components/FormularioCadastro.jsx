import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function FormularioCadastro({ formData, handleInputChange, handleFileChange, handleSubmit, uploadProgress, errorMessage }) {
  return (
    <form onSubmit={handleSubmit} className="formulario-cadastro">
      <div>
        <label htmlFor="username">Nome de usuário:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </div>

      <div>
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirmar Senha:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="photoURL">Foto de perfil (opcional):</label>
        <input type="file" id="photoURL" name="photoURL" onChange={handleFileChange} />
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
        )}
      </div>

      <button type="submit" className="botao-salvar">Cadastrar</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
}

export default FormularioCadastro;
