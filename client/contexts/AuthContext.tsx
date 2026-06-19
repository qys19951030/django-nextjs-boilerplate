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
import { LoginData, RegisterData, TokenResponse, User } from "../lib/types";

type Status = "idle" | "loading" | "success" | "error";

interface AuthChecklistState {
  registerSucceeded: boolean;
  loginSucceeded: boolean;
  tokenPresent: boolean;
  userFetched: boolean;
  logoutPerformed: boolean;
}

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

  checklist: AuthChecklistState;

  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  fetchCurrentUser: () => Promise<boolean>;

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

  const [checklist, setChecklist] = useState<AuthChecklistState>({
    registerSucceeded: false,
    loginSucceeded: false,
    tokenPresent: false,
    userFetched: false,
    logoutPerformed: false,
  });

  const isAuthenticated = !!user;

  const fetchCurrentUser = useCallback(async (): Promise<boolean> => {
    setFetchUserStatus("loading");
    setFetchUserError(null);
    try {
      const currentUser = await apiGetCurrentUser();
      setUser(currentUser);
      setFetchUserStatus("success");
      setChecklist((prev) => ({ ...prev, userFetched: true }));
      return true;
    } catch (error) {
      clearStoredTokens();
      setUser(null);
      setFetchUserError(extractErrorMessage(error));
      setFetchUserStatus("error");
      setChecklist((prev) => ({
        ...prev,
        tokenPresent: getStoredToken() !== null,
        userFetched: false,
      }));
      return false;
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    setChecklist((prev) => ({ ...prev, tokenPresent: token !== null }));
    if (token) {
      fetchCurrentUser().finally(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, [fetchCurrentUser]);

  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    setLoginStatus("loading");
    setLoginError(null);
    setLoginMessage(null);

    let tokens: TokenResponse;
    try {
      tokens = await apiLogin(data);
    } catch (error) {
      setLoginError(extractErrorMessage(error));
      setLoginStatus("error");
      return false;
    }

    setStoredTokens(tokens.access, tokens.refresh);
    setChecklist((prev) => ({ ...prev, tokenPresent: true }));
    setLoginMessage("令牌已获取，正在拉取当前用户信息...");

    let currentUser: User;
    try {
      currentUser = await apiGetCurrentUser();
    } catch (error) {
      const msg = extractErrorMessage(error);
      clearStoredTokens();
      setUser(null);
      setFetchUserError(msg);
      setFetchUserStatus("error");
      setChecklist((prev) => ({
        ...prev,
        tokenPresent: false,
        userFetched: false,
        loginSucceeded: false,
      }));
      setLoginError(`已拿到令牌但获取用户信息失败，本次登录未完成：${msg}`);
      setLoginMessage(null);
      setLoginStatus("error");
      return false;
    }

    setUser(currentUser);
    setFetchUserStatus("success");
    setFetchUserError(null);
    setChecklist((prev) => ({
      ...prev,
      userFetched: true,
      loginSucceeded: true,
    }));
    setLoginStatus("success");
    setLoginMessage("登录成功");
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setRegisterStatus("loading");
    setRegisterError(null);
    setRegisterMessage(null);
    try {
      const newUser = await apiRegister(data);
      setRegisterStatus("success");
      setRegisterMessage(
        `注册成功！用户 "${newUser.username}" 已创建，请使用注册信息登录。`
      );
      setChecklist((prev) => ({ ...prev, registerSucceeded: true }));
      return true;
    } catch (error) {
      setRegisterError(extractErrorMessage(error));
      setRegisterStatus("error");
      return false;
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
    setFetchUserStatus("idle");
    setFetchUserError(null);
    setChecklist((prev) => ({
      ...prev,
      tokenPresent: false,
      userFetched: false,
      logoutPerformed: true,
    }));
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
    checklist,
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
