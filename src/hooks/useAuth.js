/**
 * useAuth — backward-compatible hook backed by Redux auth slice.
 */
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError, selectAccessToken,
  loginUser, registerUser, logoutUser, demoLoginUser, clearError,
} from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();

  const user            = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading         = useSelector(selectAuthLoading);
  const error           = useSelector(selectAuthError);
  const accessToken     = useSelector(selectAccessToken);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) return { success: true };
    return { success: false, message: result.payload };
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) return { success: true };
    return { success: false, message: result.payload };
  };

  const logout = () => dispatch(logoutUser());

  const demoLogin = (role = 'farmer') => dispatch(demoLoginUser(role));

  return {
    user,
    token: accessToken,
    accessToken,
    loading,
    error,
    login,
    register,
    logout,
    demoLogin,
    isAuthenticated,
    clearError: () => dispatch(clearError()),
  };
}
