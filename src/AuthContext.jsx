import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [user, setUser] = useState({ username: '' });
 const [likedPosts, setLikedPosts] = useState([]);
 const [comments, setComments] = useState({});
 const [posts, setPosts] = useState([
      { id: 1, title: 'Leroy Merlin', description: 'Leroy Merlin é uma rede de lojas de materiais de construção, acabamento, decoração, jardinagem e bricolagem, fundada na França em 1923 por Adolphe Leroy e Rose Merlin. Atualmente, é uma empresa pertencente ao grupo francês Adeo.', image: 'https://1.bp.blogspot.com/-27LragsCCxg/YEGBvRtGDpI/AAAAAAAB3A8/IkNTcpAtt8M9ia9CN0zWR_HreFoFkIKxQCLcBGAsYHQ/s420/leroy%2Bslogan.jpg', likes: 0, likedBy: [] },
      { id: 2, title: 'Clube de Regatas do Flamengo', description: 'O Clube de Regatas do Flamengo é uma agremiação poliesportiva brasileira com sede na cidade do Rio de Janeiro, capital do estado homônimo.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/1200px-Flamengo_braz_logo.svg.png', likes: 0, likedBy: [] },
     ]);

 useEffect(() => {
     const storedLikedPosts = localStorage.getItem('likedPosts');
     const storedComments = localStorage.getItem('comments');
     if (storedLikedPosts) {
       setLikedPosts(JSON.parse(storedLikedPosts));
     }
     if (storedComments) {
       setComments(JSON.parse(storedComments));
     }
 }, []);

 useEffect(() => {
     localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
     localStorage.setItem('comments', JSON.stringify(comments));
 }, [likedPosts, comments]);

 const login = (username, password) => {
     setIsAuthenticated(true);
     setUser({ username, password });
 };

 const logout = () => {
     setIsAuthenticated(false);
     setUser({ username: '' });
 };

 const addComment = (postId, comment) => {
     if (!isAuthenticated) return;
     setComments(prevComments => ({
       ...prevComments,
       [postId]: [...(prevComments[postId] || []), comment]
     }));
 };

 const toggleLike = (postId) => {
          if (!isAuthenticated) return;
          const postIndex = posts.findIndex(post => post.id === postId);
          const post = posts[postIndex];
          if (post.likedBy.includes(user.username)) {
             setLikedPosts(likedPosts.filter(id => id !== postId));
             setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likes: p.likes - 1, likedBy: p.likedBy.filter(username => username !== user.username) } : p));
          } else {
             setLikedPosts([...likedPosts, postId]);
             setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, user.username] } : p));
          }
      };

 return (
     <AuthContext.Provider value={{ isAuthenticated, user, likedPosts, login, logout, toggleLike, addComment, comments, posts, setPosts }}>
       {children}
     </AuthContext.Provider>
 );
};

export const useAuth = () => {
 return useContext(AuthContext);
};
