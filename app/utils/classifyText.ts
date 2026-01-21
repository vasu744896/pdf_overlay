export function classifyText(text: string) {
  if (/^\d+\)/.test(text)) return "listitem";
  if (/https?:\/\//i.test(text)) return "link";
  if (/^[\w.-]+@[\w.-]+/.test(text)) return "email";
  return "text";
}
