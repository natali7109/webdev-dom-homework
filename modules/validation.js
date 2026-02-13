export function validateComment(nameValue, textValue) {
  if (!nameValue.trim()) {
    return { isValid: false, message: "Пожалуйста, введите ваше имя", focusElement: "name" };
  }

  if (!textValue.trim()) {
    return {
      isValid: false,
      message: "Пожалуйста, введите текст комментария",
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
