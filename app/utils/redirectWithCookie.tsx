export default function redirectWithCookie(
  location: string,
  cookies: string[] | string,
) {
  const headers = new Headers({
    Location: location,
  });

  if (Array.isArray(cookies)) {
    for (const cookie of cookies) {
      headers.append("Set-Cookie", cookie);
    }
  } else {
    headers.set("Set-Cookie", cookies);
  }

  return new Response(null, {
    status: 302,
    headers,
  });
}
