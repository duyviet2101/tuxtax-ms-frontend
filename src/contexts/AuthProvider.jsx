import { createContext, useReducer, useEffect } from 'react';
import cookies from "../utils/cookies.js";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import errorsExplain from "../constants/errorsExplain.js";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: !!cookies.get('token'),
  user: null,
  token: cookies.get('token') || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { isAuthenticated: false, user: null, token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const login = async ({
    email,
    password
  }) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      const { accessToken: token, data: user } = response.data;
      cookies.set('token', token, { path: '/' });
      dispatch({ type: 'LOGIN', payload: { token, user } });
      return true;
    } catch (error) {
      pushToast(errorsExplain[error?.response?.data?.message] || "Lỗi khi đăng nhập! Thử lại sau.", "error");
      dispatch({ type: 'LOGOUT' });
      return false;
    }
  };

  const logout = () => {
    cookies.remove('token', { path: '/' });
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;