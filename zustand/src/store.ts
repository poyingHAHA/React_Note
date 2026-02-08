import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface UserStore {
    username: string;
    email: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
}

// create is going to take a callback function, and this callback function is going to receive a set function as an argument, and this set function is going to be used to update the state of our store.
// the callback function is also going to return an object, and this object is going to represent the initial state of our store, and also the actions that we can use to update the state of our store.
// the set function is going to take an object as an argument, and this object is going to represent the new state of our store, and this new state is going to be merged with the previous state of our store, and then the components that are using the store are going to be re-rendered with the new state of our store.
export const useUserStore = create(
    devtools<UserStore>((set) => ({
        username: 'poying',
        email: 'poying@example.com',
        // set will actually do the immutable update for us, so we don't have to worry about mutating the state of our store, we can just return a new object with the updated state of our store, and set will take care of merging it with the previous state of our store.
        setUsername: (username: string) => set(
            () => ({ username })
        ),
        setEmail: (email: string) => set(
            () => ({ email })
        )
    }), { name: "user", store: "user" })
)

export interface Post {
    id: string;
    title: string;
    content: string;
}

export interface PostStore {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    removePost: (id: string) => void;
}

export const usePostStore = create(
    devtools<PostStore>((set) => ({
        posts: [{"id": "1", "title": "Post 1", "content": "This is the content of post 1"}, {"id": "2", "title": "Post 2", "content": "This is the content of post 2"}],
        setPosts: (posts: Post[]) => set(
            () => ({ posts })
        ),
        addPost: (post: Post) => set(
            (state) => ({ posts: [...state.posts, post] })
        ),
        removePost: (id: string) => set(
            (state) => ({ posts: state.posts.filter(post => post.id !== id) })
        )
    }), { name: "posts", store: "posts" })
);