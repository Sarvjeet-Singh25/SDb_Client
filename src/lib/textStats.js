// Client-side mirror of the server's reading-time estimate, used only to
// show a live counter while the admin is typing. The server (utils/textHelpers.js)
// recalculates and stores the authoritative value on save.
const WORDS_PER_MINUTE = 200;

export function stripHtml(html = "") {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

export function getContentStats(html) {
  const text = stripHtml(html);
  const charCount = text.length;
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return { charCount, wordCount, readingTime: `${minutes} min read` };
}
