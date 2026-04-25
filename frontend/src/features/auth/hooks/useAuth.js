import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setLoading, setUser } from "../state/auth.slice";

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
    if (data?.user) {
      dispatch(setUser(data.user));
    }
    return data?.user;  
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    if (data?.user) {
      dispatch(setUser(data.user));
    }
    return data?.user;
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      if (data?.user) {
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
};
