import { useDispatch } from "react-redux";
import { register, login } from "../services/auth.api";
import { setUser } from "../state/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    const data = await register({
      email,
      contact,
      password,
      fullname,
      isSeller,
    });
    console.log(data);
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }

  return { handleRegister, handleLogin };
};
