export const MEDIA_PREVIEW_IMG_NUMBER = 3

export function containsLink(str) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const match = str.match(urlPattern);
  return {
    hasLink: match !== null,
    link: match ? match[0] : null
  };
}