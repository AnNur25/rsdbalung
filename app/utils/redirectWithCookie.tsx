export default function redirectWithCookie(location: string, cookie: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": cookie,
    },
  });
}
