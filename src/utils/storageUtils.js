export const saveSession = (token, roleID) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("roleID", roleID);
};

export const clearSession = () => {
  sessionStorage.clear();
};

export const getRoleID = () => sessionStorage.getItem("roleID");

export const setUserAuth = (token, roleID) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("roleID", roleID);
};

export const getUserAuth = () => ({
  token: sessionStorage.getItem("token"),
  roleID: sessionStorage.getItem("roleID"),
});

export const clearUserAuth = () => {
  sessionStorage.clear();
};
