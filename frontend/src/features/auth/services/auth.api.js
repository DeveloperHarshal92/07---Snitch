import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function registerUser({
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
  }
}
