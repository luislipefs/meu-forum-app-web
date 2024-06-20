import React, { useState } from 'react';

function FormularioPerfil({ formData, handleInputChange, handleFileChange, handleSubmit, uploadProgress, errorMessage }) {


  return (
    <form onSubmit={handleSubmit} className="formulario-perfil">
      <div>
        <label htmlFor="username">Nome de usuário:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="photoURL">Foto de perfil:</label>
        <input type="file" id="photoURL" name="photoURL" onChange={handleFileChange} />
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
        )}
      </div>
      <div className="botoes-formulario">
        <button type="submit" className="botao-salvar">Salvar</button>
        <button type="button" className="botao-cancelar" onClick={() => handleSubmit(null)}>Cancelar</button>
      </div> 
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
  }

export default FormularioPerfil;
