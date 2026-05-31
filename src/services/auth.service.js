const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict`;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
};

export const storeUserToken = ({ accessToken }) => {
  if (accessToken) setCookie("accessToken", accessToken);
};

export const storeRefreshToken = ({ refreshToken }) => {
  if (refreshToken) setCookie("refreshToken", refreshToken);
};

export const getUserToken = () => getCookie("accessToken");
