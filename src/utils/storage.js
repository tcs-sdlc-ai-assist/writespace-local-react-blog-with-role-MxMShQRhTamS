const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // localStorage unavailable or full
  }
}

export function addPost(post) {
  const posts = getPosts();
  posts.push(post);
  savePosts(posts);
}

export function updatePost(updatedPost) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
    savePosts(posts);
  }
}

export function deletePost(postId) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== postId);
  savePosts(filtered);
}

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage unavailable or full
  }
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function deleteUser(userId) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);
  saveUsers(filtered);
}