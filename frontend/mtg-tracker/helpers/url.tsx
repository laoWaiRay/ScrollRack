export function getPath(url: string) {
  return url.split(/[?#]/)[0];
}