import axios from "axios";

const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  try {
    const response = await authApi.post("/register", {
      email,
      contact,
      password,
      fullname,
      isSeller,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data || error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await authApi.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data || error;
  }
}
