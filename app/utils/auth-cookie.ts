import { createCookie } from "react-router";

const secrets = [
  import.meta.env.VITE_COOKIE_SECRET,
  // import.meta.env.VITE_JWT_SECRET,
  // import.meta.env.VITE_REFRESH_SECRET_KEY,
];
export const aksesTokenCookie = createCookie("aksesToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

export const refreshTokenCookie = createCookie("refreshToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

export function setRawCookie(name: string, value: string, maxAge?: number) {
  const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=None; Secure; ${
    maxAge ? `Max-Age=${maxAge};` : ""
  }`;
  return cookie;
}

export async function setAuthCookiesRaw(
  aksesToken: string,
  refreshToken: string,
) {
  return [
    setRawCookie("aksesToken", aksesToken, 3600),
    setRawCookie("refreshToken", refreshToken, 604800),
  ];
}

export async function setAuthCookies(aksesToken: string, refreshToken: string) {
  const setToken = await aksesTokenCookie.serialize(aksesToken);
  const setRefresh = await refreshTokenCookie.serialize(refreshToken);
  return [setToken, setRefresh];
}

export async function clearAuthCookies() {
  const clearToken = await aksesTokenCookie.serialize(null);
  const clearRefresh = await refreshTokenCookie.serialize(null);
  return [clearToken, clearRefresh];
}

export async function getAuthCookies(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const aksesToken = await aksesTokenCookie.parse(cookieHeader);
  const refreshToken = await refreshTokenCookie.parse(cookieHeader);
  // console.log("aksesTokenCookie", aksesToken);
  // console.log("refreshTokenCookie", refreshToken);
  return { aksesToken, refreshToken };
}

export async function hasAuthCookies(request: Request) {
  const { aksesToken, refreshToken } = await getAuthCookies(request);
  return !!aksesToken && !!refreshToken;
}
