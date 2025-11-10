import { atom } from 'jotai';

const storedUser = JSON.parse(localStorage.getItem("user")) || {
  name: "",
  email: "",
  collegeId: "",
  role: ""
};

export const userAtom = atom(storedUser);

// set selectedRole from stored user or default to Admin
export const selectedRole = atom(storedUser.role || "Admin");
