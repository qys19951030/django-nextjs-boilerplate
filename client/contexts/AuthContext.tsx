import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser as apiGetCurrentUser,
  setStoredTokens,
  clearStoredTokens,
  getStoredToken,
  extractErrorMessage,
} from "../lib/api";
import { LoginData, RegisterData, User } from "../lib/types";

type Status = "idle" | "loading" | "success" | "error";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginStatus: Status;
  registerStatus: Status;
  fetchUserStatus: Status;
  logoutStatus: Status;
  loginError: string | null;
  registerError: string | null;
  fetchUserError: string | null;
  loginMessage: string | null;
  registerMessage: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  resetLoginStatus: () => void;
  resetRegisterStatus: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [loginStatus, setLoginStatus] = useState<Status>("idle");
  const [registerStatus, setRegisterStatus] = useState<Status>("idle");
  const [fetchUserStatus, setFetchUserStatus] = useState<Status>("idle");
  const [logoutStatus, setLogoutStatus] = useState<Status>("idle");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [fetchUserError, setFetchUserError] = useState<string | null>(null);

  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const fetchCurrentUser = useCallback(async () => {
    setFetchUserStatus("loading");
    setFetchUserError(null);
    try {
      const currentUser = await apiGetCurrentUser();
      setUser(currentUser);
      setFetchUserStatus("success");
    } catch (error) {
      clearStoredTokens();
      setUser(null);
      setFetchUserError(extractErrorMessage(error));
      setFetchUserStatus("error");
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchCurrentUser().finally(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, [fetchCurrentUser]);

  const login = useCallback(async (data: LoginData) => {
    setLoginStatus("loading");
    setLoginError(null);
    setLoginMessage(null);
    try {
      const tokens = await apiLogin(data);
      setStoredTokens(tokens.access, tokens.refresh);
      setLoginStatus("success");
      setLoginMessage("登录成功，正在加载用户信息...");
      await fetchCurrentUser();
    } catch (error) {
      setLoginError(extractErrorMessage(error));
      setLoginStatus("error");
    }
  }, [fetchCurrentUser]);

  const register = useCallback(async (data: RegisterData) => {
    setRegisterStatus("loading");
    setRegisterError(null);
    setRegisterMessage(null);
    try {
      const newUser = await apiRegister(data);
      setRegisterStatus("success");
      setRegisterMessage(
        `注册成功！用户 "${newUser.username}" 已创建，请使用注册信息登录。`
      );
    } catch (error) {
      setRegisterError(extractErrorMessage(error));
      setRegisterStatus("error");
    }
  }, []);

  const logout = useCallback(() => {
    setLogoutStatus("loading");
    clearStoredTokens();
    setUser(null);
    setLoginStatus("idle");
    setRegisterStatus("idle");
    setLoginError(null);
    setRegisterError(null);
    setLoginMessage(null);
    setRegisterMessage(null);
    setLogoutStatus("success");
    setTimeout(() => setLogoutStatus("idle"), 1000);
  }, []);

  const resetLoginStatus = useCallback(() => {
    setLoginStatus("idle");
    setLoginError(null);
    setLoginMessage(null);
  }, []);

  const resetRegisterStatus = useCallback(() => {
    setRegisterStatus("idle");
    setRegisterError(null);
    setRegisterMessage(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isInitialized,
    loginStatus,
    registerStatus,
    fetchUserStatus,
    logoutStatus,
    loginError,
    registerError,
    fetchUserError,
    loginMessage,
    registerMessage,
    login,
    register,
    logout,
    fetchCurrentUser,
    resetLoginStatus,
    resetRegisterStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
