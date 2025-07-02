import { jwtDecode } from "jwt-decode";

export function isAccessTokenExpired(token: string) {
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    
    if (!exp) {
      return true;
    }

    return exp < Date.now() / 1000 + 30;
  } catch (error) {
    console.error(error);
    return true;
  }
}