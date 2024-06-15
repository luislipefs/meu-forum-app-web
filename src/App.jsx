import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './App.css';

function App() {
 const { isAuthenticated, login, logout, likedPosts, toggleLike, addComment, comments, posts, setPosts } = useAuth();
 const [newPost, setNewPost] = useState({ title: '', description: '', image: '' });
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [newComment, setNewComment] = useState('');

 const handleLogin = () => {
    login(username, password);
 };

 const addPost = () => {
    if (!isAuthenticated) return;
    const id = posts.length + 1;
    setPosts([...posts, { ...newPost, id, likes: 0 }]);
    setNewPost({ title: '', description: '', image: '' });
 };

 const handleComment = (postId) => {
    if (!isAuthenticated) return;
    addComment(postId, newComment);
    setNewComment('');
 };

 return (
    <div className="App">
      <h1>Fórum Gamificado</h1>
      {!isAuthenticated ? (
        <div>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Usuário"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value.slice(0, 80) })}
            placeholder="Digite o título do novo post"
            maxLength={80}
          />
          <div className="restantes" >caracteres restantes: {80 - newPost.title.length}</div>
          <textarea
            value={newPost.description}
            onChange={e => setNewPost({ ...newPost, description: e.target.value.slice(0, 300) })}
            placeholder="Digite a descrição do novo post"
            maxLength={300}
          />
          <div className="restantes" >caracteres restantes: {300 - newPost.description.length}</div>
          <input
            type="text"
            value={newPost.image}
            onChange={e => setNewPost({ ...newPost, image: e.target.value })}
            placeholder="Digite o URL da imagem do novo post"
          />
          <button onClick={addPost}>Adicionar Post</button>
          {posts.map(post => (
            <div key={post.id} className="post">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              {post.image && <img src={post.image} alt={post.title} style={{maxWidth: '35%', height: 'auto'}} />}
              <p>Likes: {post.likes}</p>
              {isAuthenticated && (
                <button className="like-button"onClick={() => toggleLike(post.id)} style={{backgroundColor: likedPosts.includes(post.id) ? 'red' : '#007bff'}}>
                 {likedPosts.includes(post.id) ? 'Descurtir' : 'Curtir'}
                </button>
              )}
              <p>Comentários: {comments[post.id] ? comments[post.id].length : 0}</p>
              {isAuthenticated && (
                <div>
                 <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Digite seu comentário"
                 />
                 <button onClick={() => handleComment(post.id)}>Comentar</button>
                </div>
              )}
              {comments[post.id] && comments[post.id].map((comment, index) => (
                <p key={index}>{comment}</p>
              ))}
            </div>
          ))}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
 );
}

export default App;
