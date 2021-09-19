export const getUserId = () => {
  return window.localStorage.getItem('userId') || '';
};

export const setUserId = (userId: string) => {
  window.localStorage.setItem('userId', userId);
};

export const getUserSeed = () => {
  return window.localStorage.getItem('userSeed') || '';
};

export const setUserSeed = (userSeed: string) => {
  window.localStorage.setItem('userSeed', userSeed);
};
