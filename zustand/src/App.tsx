import { useUserStore, usePostStore } from "@/store";
import { useState } from "react";

function UpdateUserForm() {
  const { setUsername, setEmail } = useUserStore();

  return <>
    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
  </>
}

export default function App() {
  const {username, email, setUsername, setEmail} = useUserStore();
  const {posts, setPosts, addPost, removePost} = usePostStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return <>
  <div>{username} - {email}</div>
  <UpdateUserForm />
  <div>Create a New Post</div>
  <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
  <input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
  <button onClick={() => {
      addPost({ id: Date.now().toString(), title, content })
      setTitle("");
      setContent("");
    }}>Add Post</button>

  <div>
    <h2>Posts</h2>
    {posts.map(post => (
      <div key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <button onClick={() => removePost(post.id)}>Remove Post</button>
      </div>
    ))}
  </div>
  </>
}