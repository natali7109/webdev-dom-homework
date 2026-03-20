export function validateComment(textValue) {
  if (!textValue.trim()) {
    return {
      isValid: false,
      message: "Пожалуйста, введите текст комментария",
      focusElement: "text",
    };
  }

  if (textValue.trim().length < 3) {
    return {
      isValid: false,
      message: "Комментарий должен быть не короче 3 символов",
      focusElement: "text",
    };
  }

  const lines = textValue.split("\n");
  const onlyQuote = lines.every((line) => {
    const trimmedLine = line.trim();
    return !trimmedLine || trimmedLine.startsWith(">");
  });

  if (onlyQuote) {
    return {
      isValid: false,
      message: "Пожалуйста, добавьте свой текст к цитате",
      focusElement: "text",
    };
  }

  return { isValid: true };
}
