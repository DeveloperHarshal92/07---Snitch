import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api";
import { setLoading, setUser, clearUser } from "../state/auth.slice";
import { clearCart } from "../../cart/state/cart.slice";

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

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.log("Error during logout:", error);
    } finally {
      dispatch(clearUser());
      dispatch(clearCart());
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};

