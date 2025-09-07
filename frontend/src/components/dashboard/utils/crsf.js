function getCsrfToken() {
  const match = document.cookie.match(new RegExp('(^| )csrf_access_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
export default getCsrfToken;
