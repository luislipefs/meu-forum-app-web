import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, orderBy } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { db, app } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export const AuthContext = createContext();
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        fetchLikedPosts(user.uid);
        fetchPosts();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLikedPosts([]);
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchLikedPosts = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setLikedPosts(userDocSnap.data().likedPosts || []);
      }
    } catch (error) {
      console.error("Erro ao buscar posts curtidos:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const postsCollectionRef = collection(db, 'posts');
      const querySnapshot = await getDocs(postsCollectionRef);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Lógica para lidar com o erro (ex: exibir mensagem de erro)
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: email, // Ou obtenha o nome de usuário de outro campo do formulário
        email,
        likedPosts: []
      });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      // Lógica para lidar com o erro (ex: exibir mensagem de erro)
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const addPost = async (newPost) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...newPost,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        author: user.uid,
        authorName: user.displayName || user.email,
      });
      console.log("Post adicionado com ID: ", docRef.id);
      fetchPosts(); // Atualiza a lista de posts após adicionar um novo
    } catch (e) {
      console.error("Erro ao adicionar post: ", e);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) return;
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        const usuarioCurtiu = postData.likedBy.includes(user.uid);

        if (usuarioCurtiu) {
          await updateDoc(postRef, {
            likes: postData.likes - 1,
            likedBy: arrayRemove(user.uid)
          });
          setLikedPosts(likedPosts.filter(id => id !== postId));
        } else {
          await updateDoc(postRef, {
            likes: postData.likes + 1,
            likedBy: arrayUnion(user.uid)
          });
          setLikedPosts([...likedPosts, postId]);
        }

        // Atualiza o estado local dos posts
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === postId ? { ...post, likes: postData.likes + (usuarioCurtiu ? -1 : 1), likedBy: usuarioCurtiu ? postData.likedBy.filter(uid => uid !== user.uid) : [...postData.likedBy, user.uid] } : post
        ));
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir post:", error);
    }
  };

  const addComment = async (postId, commentText) => {
    if (!isAuthenticated || !user) return; // Verifica se o usuário está autenticado

    try {
      const commentId = Date.now().toString(); // Gera um ID único para o comentário
      const commentData = {
        id: commentId,
        postId,
        content: commentText,
        author: user.uid, // Usa o UID do usuário como autor
        createdAt: new Date(),
        likes: 0,
        likedBy: []
      };

      // Adiciona o comentário ao Firestore
      await addDoc(collection(db, "comments"), commentData);

      // Atualiza o array de comentários do post no Firestore
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentId)
      });

      // Atualiza o estado local dos posts (opcional, para atualizar a interface imediatamente)
      fetchPosts();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      // Lida com o erro (ex: exibe uma mensagem de erro para o usuário)
    }
  };

  const addResposta = async (postId, commentId, respostaText) => {
    if (!isAuthenticated || !user) return; // Verifica se o usuário está autenticado

    try {
      const respostaId = Date.now().toString(); // Gera um ID único para a resposta
      const respostaData = {
        id: respostaId,
        postId,
        commentId, // ID do comentário pai
        content: respostaText,
        author: user.uid, // Usa o UID do usuário como autor
        createdAt: new Date(),
        likes: 0,
        likedBy: []
      };

      // Adiciona a resposta ao Firestore
      await addDoc(collection(db, "respostas"), respostaData);

      // Atualiza o array de respostas do comentário no Firestore (se necessário)
      // ... (lógica para atualizar o array de respostas no comentário)

      // Atualiza o estado local dos posts (opcional, para atualizar a interface imediatamente)
      fetchPosts();
    } catch (error) {
      console.error("Erro ao adicionar resposta:", error);
      // Lida com o erro (ex: exibe uma mensagem de erro para o usuário)
    }
  };

return (
  <AuthContext.Provider
    value={{
      isAuthenticated,
      user,
      likedPosts,
      login,
      signup,
      logout,
      toggleLike,
      addComment,
      addResposta,
      posts,
      setPosts,
      addPost
    }}
  >
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;