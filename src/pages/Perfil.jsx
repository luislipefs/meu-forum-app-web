import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Topico from '../components/Topico';
import { query, collection, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import FormularioPerfil from '../components/FormularioPerfil';

function Perfil() {
  const { user } = useAuth();
  const [postsDoUsuario, setPostsDoUsuario] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    photoURL: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserInfo(userDocSnap.data());
            setFormData(userDocSnap.data());
          } else {
            console.log("Usuário não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault(); // Permite que o botão "Cancelar" chame a função sem um evento
    setErrorMessage(null);

    try {
      // Se o evento for null (botão Cancelar), apenas saia do modo de edição
      if (!event) {
        setEditing(false);
        return;
      }

      // Upload da foto (se houver)
      if (selectedFile) {
        const storageRef = ref(storage, `images/${user.uid}/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await uploadTask;
        formData.photoURL = await getDownloadURL(storageRef);
      }

      // Atualiza os dados do usuário no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, formData);

      setUserInfo(formData);
      setEditing(false);
    } catch (error) {
      // Adicione um tratamento de erro específico para o caso de erro de CORS
      if (error.code === 'storage/object-not-found') {
        setErrorMessage('Erro ao fazer o upload da imagem. Verifique se o arquivo existe e se você tem permissão para acessá-lo.');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  if (!user) {
    return <p>Você não está logado. <Link to="/">Faça login</Link> para ver seu perfil.</p>;
  }

  return (
    <div className="container">
      {editing && userInfo ? ( // Verifica se está editando E se userInfo existe
        <FormularioPerfil
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          uploadProgress={uploadProgress}
          errorMessage={errorMessage}
        />
      ) : userInfo ? ( // Verifica se userInfo existe (e não está editando)
        <>
          <h2>Perfil de {userInfo.username || userInfo.email}</h2>
          {userInfo.photoURL && (
            <img src={userInfo.photoURL} alt="Foto de Perfil" style={{ maxWidth: '100px', borderRadius: '50%' }} />
          )}
          <p>Email: {userInfo.email}</p>
          {userInfo.bio && <p>Bio: {userInfo.bio}</p>}

          <h3>Tópicos criados:</h3>
          {postsDoUsuario.length === 0 ? (
            <p>Você ainda não criou nenhum tópico.</p>
          ) : (
            <ul>
              {postsDoUsuario.map(post => (
              <Topico key={post.id} topico={post} isPerfilPage={true} /> // Passa a prop isPerfilPage
              ))}
            </ul>
          )}
          <button type="button" className="botao-editar-perfil" onClick={() => setEditing(true)}>Editar Perfil</button>
        </>
      ) : (
        <p>Carregando perfil...</p> // Exibe enquanto carrega
      )}
    </div>
  );
  }

export default Perfil;
