import Cookies from "js-cookie";

const TOKEN_KEY = "firebase-token";

export function setAuthCookie(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // scade dopo 7 giorni
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export function removeAuthCookie() {
  Cookies.remove(TOKEN_KEY);
}
