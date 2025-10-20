export const saveSession = (token, roleID) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("roleID", roleID);
};

export const clearSession = () => {
  sessionStorage.clear();
};

export const getRoleID = () => sessionStorage.getItem("roleID");
