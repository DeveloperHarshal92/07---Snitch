import { useDispatch } from "react-redux";
import { registerUser } from "../services/auth.api";
import { setUser } from "../state/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller,
  }) {
    const data = await registerUser({
      email,
      contact,
      password,
      fullname,
      isSeller,
    });
    dispatch(setUser(data.user));
  }
  return { handleRegister };
};
