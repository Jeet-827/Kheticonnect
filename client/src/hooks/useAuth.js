/**
 * useAuth — backward-compatible hook backed by Redux auth slice.
 */
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/uiSlice';
import {
  selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError, selectAccessToken,
  selectProfileLoading, selectProfileUpdating, selectProfileError, selectProfileLastFetched,
  loginUser, registerUser, logoutUser, demoLoginUser, clearError, clearProfileError,
  fetchUserProfile, updateUserProfile
} from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();

  const user               = useSelector(selectUser);
  const isAuthenticated    = useSelector(selectIsAuthenticated);
  const loading            = useSelector(selectAuthLoading);
  const error              = useSelector(selectAuthError);
  const accessToken        = useSelector(selectAccessToken);
  const profileLoading     = useSelector(selectProfileLoading);
  const profileUpdating    = useSelector(selectProfileUpdating);
  const profileError       = useSelector(selectProfileError);
  const profileLastFetched = useSelector(selectProfileLastFetched);

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

  const fetchProfile = async () => {
    const result = await dispatch(fetchUserProfile());
    if (fetchUserProfile.fulfilled.match(result)) return { success: true, user: result.payload };
    return { success: false, message: result.payload };
  };

  const updateProfileData = async (data) => {
    const result = await dispatch(updateUserProfile(data));
    if (updateUserProfile.fulfilled.match(result)) return { success: true, user: result.payload };
    return { success: false, message: result.payload };
  };

  const logout = () => {
    dispatch(logoutUser());
    dispatch(setActiveTab('dashboard'));
  };

  const demoLogin = (role = 'farmer') => dispatch(demoLoginUser(role));

  return {
    user,
    token: accessToken,
    accessToken,
    loading,
    error,
    profileLoading,
    profileUpdating,
    profileError,
    profileLastFetched,
    login,
    register,
    fetchProfile,
    updateProfile: updateProfileData,
    logout,
    demoLogin,
    isAuthenticated,
    clearError: () => dispatch(clearError()),
    clearProfileError: () => dispatch(clearProfileError()),
  };
}
