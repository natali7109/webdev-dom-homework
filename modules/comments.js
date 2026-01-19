import { escapeHtml } from "./escapeHtml.js";

let comments = [
  {
    id: 1,
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    text: "Это будет первый комментарий на этой странице",
    likes: 3,
    isLiked: false,
  },
  {
    id: 2,
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    text: "Мне нравится как оформлена эта страница! ❤",
    likes: 75,
    isLiked: true,
  },
];

comments = comments.map((comment) => ({
  ...comment,
  name: escapeHtml(comment.name),
  text: escapeHtml(comment.text),
}));

export function getComments() {
  return [...comments];
}

export function addComment(newComment) {
  const commentWithId = {
    id: Date.now(),
    ...newComment,
  };
  comments.push(commentWithId);
  return commentWithId;
}

export function updateComment(index, updates) {
  if (index >= 0 && index < comments.length) {
    comments[index] = { ...comments[index], ...updates };
    return comments[index];
  }
  return null;
}

export function getComment(index) {
  if (index >= 0 && index < comments.length) {
    return { ...comments[index] };
  }
  return null;
}
