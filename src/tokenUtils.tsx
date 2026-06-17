// src/tokenUtils.ts

export const getAccessToken = () => localStorage.getItem("accessToken");
export const saveAccessToken = (token: string) => localStorage.setItem("accessToken", token);

export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const saveRefreshToken = (token: string) => localStorage.setItem("refreshToken", token);

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
