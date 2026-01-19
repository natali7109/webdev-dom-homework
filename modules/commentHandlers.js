import { escapeHtml } from "./escapeHtml.js";
import { getCurrentDate } from "./dateUtils.js";
import { addComment, getComment, updateComment } from "./comments.js";
import { renderComments } from "./render.js";
import { validateComment } from "./validation.js";

export function handleAddComment(nameInput, textInput, commentsList) {
  const nameValue = nameInput.value;
  const textValue = textInput.value;

  const validation = validateComment(nameValue, textValue);
  if (!validation.isValid) {
    alert(validation.message);
    validation.focusElement === "name" ? nameInput.focus() : textInput.focus();
    return;
  }

  const safeName = escapeHtml(nameValue.trim());
  const safeText = escapeHtml(textValue.trim());

  addComment({
    name: safeName,
    date: getCurrentDate(),
    text: safeText,
    likes: 0,
    isLiked: false,
  });

  nameInput.value = "";
  textInput.value = "";
  nameInput.focus();

  renderComments(commentsList);
}

export function quoteComment(index, textInput) {
  const comment = getComment(index);
  if (!comment) return;

  const textForTextarea = comment.text.replace(/<br\s*\/?>/gi, "\n");
  const textLines = textForTextarea.split("\n");
  const quotedLines = textLines.map((line) => `> ${line}`).join("\n");
  const quotedText = `> ${comment.name}:\n${quotedLines}\n\n`;

  textInput.value = quotedText + textInput.value;
  textInput.focus();
  textInput.scrollIntoView({ behavior: "smooth" });
}

export function toggleLike(index) {
  const comment = getComment(index);
  if (!comment) return;

  const updates = {
    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
    isLiked: !comment.isLiked,
  };

  updateComment(index, updates);
}
