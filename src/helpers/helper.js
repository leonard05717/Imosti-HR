export function toProper(str) {
  const excludeWords = ["of", "in", "and", "the", "on"];
  return str
    .split(" ")
    .map((word) => {
      const isExclude = excludeWords.includes(word.toLowerCase());
      return (
        (isExclude
          ? word.charAt(0).toLowerCase()
          : word.charAt(0).toUpperCase()) + word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}
