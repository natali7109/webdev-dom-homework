import { escapeHtml } from "./escapeHtml.js";
import { api } from "../app.js";

// Локальный кэш комментариев
let commentsCache = [];

export async function loadComments() {
  try {
    const apiComments = await api.getComments();

    commentsCache = apiComments.map((comment) => ({
      id: comment.id,
      name: comment.author ? escapeHtml(comment.author.name) : escapeHtml(comment.name || "Аноним"),
      date: formatDate(comment.date),
      text: escapeHtml(comment.text || ""),
      likes: comment.likes || 0,
      isLiked: comment.isLiked || false,
    }));

    return commentsCache;
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return [];
  }
}

export function getComments() {
  return [...commentsCache];
}

export async function addComment(newComment) {
  try {
    await api.addComment({
      text: newComment.text,
      name: newComment.name,
    });

    // Перезагружаем после добавления
    return await loadComments();
  } catch (error) {
    throw error;
  }
}

export async function toggleLike(commentId) {
  try {
    await api.toggleLike(commentId);
    await loadComments(); // Перезагружаем
  } catch (error) {
    throw error;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
