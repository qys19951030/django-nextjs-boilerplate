import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Divider,
  Stack,
  Avatar,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import {
  EmailIcon,
  LockIcon,
  ViewIcon,
  ViewOffIcon,
  CalendarIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../lib/api";

const Home: NextPage = () => {
  const {
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
  } = useAuth();

  const toast = useToast();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [localRegError, setLocalRegError] = useState<string | null>(null);

  useEffect(() => {
    if (loginStatus === "error" && loginError) {
      toast({
        title: "登录失败",
        description: loginError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [loginStatus, loginError, toast]);

  useEffect(() => {
    if (registerStatus === "error" && registerError) {
      toast({
        title: "注册失败",
        description: registerError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [registerStatus, registerError, toast]);

  useEffect(() => {
    if (registerStatus === "success" && registerMessage) {
      toast({
        title: "注册成功",
        description: registerMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [registerStatus, registerMessage, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      toast({
        title: "请填写完整",
        description: "用户名和密码不能为空",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    const ok = await login({ username: loginUsername, password: loginPassword });
    if (ok) {
      setLoginUsername("");
      setLoginPassword("");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalRegError(null);

    if (!regEmail || !regUsername || !regPassword || !regConfirmPassword) {
      setLocalRegError("请填写所有字段");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setLocalRegError("两次输入的密码不一致");
      return;
    }
    if (regPassword.length < 8) {
      setLocalRegError("密码长度至少为 8 位");
      return;
    }

    const ok = await register({
      email: regEmail,
      username: regUsername,
      password: regPassword,
      re_password: regConfirmPassword,
    });

    if (ok) {
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      setRegConfirmPassword("");
    }
  };

  const handleFetchUser = async () => {
    const ok = await fetchCurrentUser();
    if (ok) {
      toast({
        title: "刷新成功",
        description: "用户信息已更新",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  if (!isInitialized) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">正在初始化认证状态...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <div>
      <Head>
        <title>认证控制台 | Django + Next.js</title>
        <meta
          name="description"
          content="Django + Next.js 认证演示样板 - 注册、登录、用户信息、登出"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH="100vh" py={8}>
        <Container maxW="4xl">
          <VStack spacing={8} w="full" align="stretch">
            <Box textAlign="center">
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                Django + Next.js Boilerplate
              </Badge>
              <Heading
                as="h1"
                size="2xl"
                mt={4}
                bgGradient="linear(to-r, primary.500, primary.700)"
                bgClip="text"
              >
                认证控制台
              </Heading>
              <Text color="gray.600" mt={2}>
                基于 Djoser + JWT 的完整认证演示 · API 地址:{" "}
                <code>{API_BASE_URL}</code>
              </Text>
            </Box>

            {isAuthenticated ? (
              <AuthenticatedView
                user={user!}
                fetchUserStatus={fetchUserStatus}
                fetchUserError={fetchUserError}
                logoutStatus={logoutStatus}
                onLogout={logout}
                onRefreshUser={handleFetchUser}
                checklist={checklist}
              />
            ) : (
              <GuestView
                loginStatus={loginStatus}
                registerStatus={registerStatus}
                localRegError={localRegError}
                loginUsername={loginUsername}
                loginPassword={loginPassword}
                showLoginPassword={showLoginPassword}
                regEmail={regEmail}
                regUsername={regUsername}
                regPassword={regPassword}
                regConfirmPassword={regConfirmPassword}
                showRegPassword={showRegPassword}
                showRegConfirmPassword={showRegConfirmPassword}
                onLoginUsernameChange={setLoginUsername}
                onLoginPasswordChange={setLoginPassword}
                onToggleShowLoginPassword={() =>
                  setShowLoginPassword((v) => !v)
                }
                onRegEmailChange={setRegEmail}
                onRegUsernameChange={setRegUsername}
                onRegPasswordChange={setRegPassword}
                onRegConfirmPasswordChange={setRegConfirmPassword}
                onToggleShowRegPassword={() => setShowRegPassword((v) => !v)}
                onToggleShowRegConfirmPassword={() =>
                  setShowRegConfirmPassword((v) => !v)
                }
                onLogin={handleLogin}
                onRegister={handleRegister}
                onTabChange={(index) => {
                  if (index === 0) {
                    resetRegisterStatus();
                    setLocalRegError(null);
                  } else {
                    resetLoginStatus();
                  }
                }}
                loginMessage={loginMessage}
                checklist={checklist}
              />
            )}
          </VStack>
        </Container>
      </Box>
    </div>
  );
};

interface ChecklistState {
  registerSucceeded: boolean;
  loginSucceeded: boolean;
  tokenPresent: boolean;
  userFetched: boolean;
  logoutPerformed: boolean;
}

interface GuestViewProps {
  loginStatus: string;
  registerStatus: string;
  localRegError: string | null;
  loginUsername: string;
  loginPassword: string;
  showLoginPassword: boolean;
  regEmail: string;
  regUsername: string;
  regPassword: string;
  regConfirmPassword: string;
  showRegPassword: boolean;
  showRegConfirmPassword: boolean;
  onLoginUsernameChange: (v: string) => void;
  onLoginPasswordChange: (v: string) => void;
  onToggleShowLoginPassword: () => void;
  onRegEmailChange: (v: string) => void;
  onRegUsernameChange: (v: string) => void;
  onRegPasswordChange: (v: string) => void;
  onRegConfirmPasswordChange: (v: string) => void;
  onToggleShowRegPassword: () => void;
  onToggleShowRegConfirmPassword: () => void;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
  onTabChange: (index: number) => void;
  loginMessage: string | null;
  checklist: ChecklistState;
}

function GuestView(props: GuestViewProps) {
  return (
    <VStack spacing={6} align="stretch">
      <Box
        borderWidth="1px"
        borderColor="primary.200"
        borderRadius="2xl"
        bg="white"
        shadow="lg"
        overflow="hidden"
      >
        <Box px={6} pt={5} pb={2}>
          <Heading as="h2" size="lg" color="gray.700">
            欢迎访问
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            请登录或注册一个新账号以继续
          </Text>
        </Box>
        <Divider />
        <Box px={6} pt={4} pb={6}>
          <Tabs
            variant="enclosed-colored"
            colorScheme="purple"
            onChange={props.onTabChange}
          >
            <TabList>
              <Tab fontWeight="semibold">登录</Tab>
              <Tab fontWeight="semibold">注册</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                {props.loginMessage && props.loginStatus === "success" && (
                  <Alert status="success" mb={4} borderRadius="lg">
                    <AlertIcon />
                    <AlertTitle mr={2}>{props.loginMessage}</AlertTitle>
                  </Alert>
                )}
                <form onSubmit={props.onLogin}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>用户名</FormLabel>
                      <HStack>
                        <CalendarIcon color="gray.400" />
                        <Input
                          type="text"
                          placeholder="注册时使用的用户名"
                          value={props.loginUsername}
                          onChange={(e) =>
                            props.onLoginUsernameChange(e.target.value)
                          }
                          autoComplete="username"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>密码</FormLabel>
                      <HStack position="relative" w="full">
                        <LockIcon color="gray.400" flexShrink={0} />
                        <Input
                          type={props.showLoginPassword ? "text" : "password"}
                          placeholder="请输入密码"
                          value={props.loginPassword}
                          onChange={(e) =>
                            props.onLoginPasswordChange(e.target.value)
                          }
                          autoComplete="current-password"
                          pr="48px"
                        />
                        <IconButton
                          aria-label="切换密码可见"
                          icon={
                            props.showLoginPassword ? (
                              <ViewOffIcon />
                            ) : (
                              <ViewIcon />
                            )
                          }
                          variant="ghost"
                          size="sm"
                          position="absolute"
                          right="8px"
                          onClick={props.onToggleShowLoginPassword}
                        />
                      </HStack>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      isLoading={props.loginStatus === "loading"}
                      loadingText="正在登录..."
                      width="full"
                      mt={2}
                    >
                      登录
                    </Button>
                  </VStack>
                </form>
              </TabPanel>

              <TabPanel px={0}>
                {props.localRegError && (
                  <Alert status="error" mb={4} borderRadius="lg">
                    <AlertIcon />
                    <AlertTitle>{props.localRegError}</AlertTitle>
                  </Alert>
                )}
                <form onSubmit={props.onRegister}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>邮箱</FormLabel>
                      <HStack>
                        <EmailIcon color="gray.400" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={props.regEmail}
                          onChange={(e) => props.onRegEmailChange(e.target.value)}
                          autoComplete="email"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>用户名</FormLabel>
                      <HStack>
                        <CalendarIcon color="gray.400" />
                        <Input
                          type="text"
                          placeholder="显示用的用户名"
                          value={props.regUsername}
                          onChange={(e) =>
                            props.onRegUsernameChange(e.target.value)
                          }
                          autoComplete="username"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>密码</FormLabel>
                      <HStack position="relative" w="full">
                        <LockIcon color="gray.400" flexShrink={0} />
                        <Input
                          type={props.showRegPassword ? "text" : "password"}
                          placeholder="至少 8 位"
                          value={props.regPassword}
                          onChange={(e) => props.onRegPasswordChange(e.target.value)}
                          autoComplete="new-password"
                          pr="48px"
                        />
                        <IconButton
                          aria-label="切换密码可见"
                          icon={
                            props.showRegPassword ? <ViewOffIcon /> : <ViewIcon />
                          }
                          variant="ghost"
                          size="sm"
                          position="absolute"
                          right="8px"
                          onClick={props.onToggleShowRegPassword}
                        />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>确认密码</FormLabel>
                      <HStack position="relative" w="full">
                        <LockIcon color="gray.400" flexShrink={0} />
                        <Input
                          type={
                            props.showRegConfirmPassword ? "text" : "password"
                          }
                          placeholder="再次输入密码"
                          value={props.regConfirmPassword}
                          onChange={(e) =>
                            props.onRegConfirmPasswordChange(e.target.value)
                          }
                          autoComplete="new-password"
                          pr="48px"
                        />
                        <IconButton
                          aria-label="切换密码可见"
                          icon={
                            props.showRegConfirmPassword ? (
                              <ViewOffIcon />
                            ) : (
                              <ViewIcon />
                            )
                          }
                          variant="ghost"
                          size="sm"
                          position="absolute"
                          right="8px"
                          onClick={props.onToggleShowRegConfirmPassword}
                        />
                      </HStack>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      isLoading={props.registerStatus === "loading"}
                      loadingText="正在注册..."
                      width="full"
                      mt={2}
                    >
                      创建账号
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>

      <ChecklistPanel checklist={props.checklist} />
    </VStack>
  );
}

interface AuthenticatedViewProps {
  user: { id: number; email: string; username: string };
  fetchUserStatus: string;
  fetchUserError: string | null;
  logoutStatus: string;
  onLogout: () => void;
  onRefreshUser: () => void;
  checklist: ChecklistState;
}

function AuthenticatedView(props: AuthenticatedViewProps) {
  return (
    <VStack spacing={6} align="stretch">
      <Box
        borderWidth="1px"
        borderColor="green.200"
        borderRadius="2xl"
        bg="green.50"
        shadow="lg"
        p={6}
      >
        <Flex
          align="center"
          justify="space-between"
          direction={["column", "row"]}
          gap={4}
        >
          <HStack spacing={4}>
            <Avatar
              size="xl"
              name={props.user.username}
              bgGradient="linear(to-br, primary.400, primary.600)"
              color="white"
            />
            <Box>
              <Badge
                colorScheme="green"
                mb={2}
                px={3}
                py={1}
                borderRadius="full"
              >
                ✓ 已登录
              </Badge>
              <Heading as="h2" size="lg" color="gray.700">
                你好, {props.user.username}
              </Heading>
              <Text color="gray.500" mt={1}>
                {props.user.email}
              </Text>
            </Box>
          </HStack>
          <HStack flexWrap="wrap">
            <Button
              leftIcon={<RepeatIcon />}
              variant="outline"
              colorScheme="purple"
              onClick={props.onRefreshUser}
              isLoading={props.fetchUserStatus === "loading"}
              loadingText="刷新中"
            >
              刷新用户信息
            </Button>
            <Button
              colorScheme="red"
              variant="solid"
              onClick={props.onLogout}
              isLoading={props.logoutStatus === "loading"}
              loadingText="退出中"
            >
              退出登录
            </Button>
          </HStack>
        </Flex>
      </Box>

      {props.fetchUserError && (
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <AlertTitle>刷新用户信息失败</AlertTitle>
            <AlertDescription>{props.fetchUserError}</AlertDescription>
          </VStack>
        </Alert>
      )}

      <Box
        borderWidth="1px"
        borderColor="primary.100"
        borderRadius="2xl"
        bg="white"
        shadow="md"
        overflow="hidden"
      >
        <Box px={6} pt={5} pb={3}>
          <Heading as="h3" size="md" color="gray.700">
            当前用户信息 (来自 /auth/users/me/)
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            这是调用 Django 后端认证接口返回的真实数据
          </Text>
        </Box>
        <Divider />
        <Box px={6} py={5}>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            <InfoCard label="用户 ID" value={String(props.user.id)} />
            <InfoCard label="用户名" value={props.user.username} />
            <InfoCard label="邮箱" value={props.user.email} />
          </SimpleGrid>

          <Box
            mt={6}
            bg="gray.900"
            borderRadius="lg"
            p={4}
            overflowX="auto"
          >
            <Text
              color="green.300"
              fontFamily="monospace"
              fontSize="sm"
              whiteSpace="pre"
            >
{JSON.stringify(props.user, null, 2)}
            </Text>
          </Box>
          <Text mt={2} color="gray.500" fontSize="xs">
            ↑ /auth/users/me/ 接口的原始响应 (GET, 携带 Token)
          </Text>
        </Box>
      </Box>

      <ChecklistPanel checklist={props.checklist} />
    </VStack>
  );
}

function ChecklistPanel({ checklist }: { checklist: ChecklistState }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="blue.100"
      borderRadius="2xl"
      bg="white"
      shadow="md"
      overflow="hidden"
    >
      <Box px={6} pt={5} pb={3}>
        <Heading as="h3" size="md" color="gray.700">
          认证链路真实状态
        </Heading>
        <Text color="gray.500" mt={1} fontSize="sm">
          以下状态跟随真实接口调用结果变化，没有任何写死内容
        </Text>
      </Box>
      <Divider />
      <Box px={6} py={5}>
        <Stack spacing={3}>
          <CheckItem
            done={checklist.registerSucceeded}
            label={
              checklist.registerSucceeded
                ? "✅ 已通过 /auth/users/ (POST) 完成注册"
                : "⬜ 尚未调用注册接口"
            }
          />
          <CheckItem
            done={checklist.loginSucceeded}
            label={
              checklist.loginSucceeded
                ? "✅ 已通过 /auth/jwt/create/ (POST) 完成登录并拿到 tokens"
                : "⬜ 尚未成功调用登录接口"
            }
          />
          <CheckItem
            done={checklist.tokenPresent}
            label={
              checklist.tokenPresent
                ? "✅ localStorage 中存在 auth_token (登录令牌)"
                : "⬜ localStorage 中没有登录令牌"
            }
          />
          <CheckItem
            done={checklist.userFetched}
            label={
              checklist.userFetched
                ? "✅ 已通过 /auth/users/me/ (GET + Token 头) 获取到当前用户"
                : "⬜ 尚未成功获取当前用户信息"
            }
          />
          <CheckItem
            done={checklist.logoutPerformed}
            label={
              checklist.logoutPerformed
                ? "✅ 已执行过退出登录操作 (令牌被清除并回到未登录视图)"
                : "⬜ 尚未执行过退出登录"
            }
          />
        </Stack>
      </Box>
    </Box>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
    >
      <Text
        fontSize="xs"
        color="gray.500"
        textTransform="uppercase"
        fontWeight="semibold"
      >
        {label}
      </Text>
      <Text
        mt={1}
        color="gray.800"
        fontWeight="medium"
        fontSize="lg"
        wordBreak="break-all"
      >
        {value}
      </Text>
    </Box>
  );
}

function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <Flex
      p={3}
      bg={done ? "green.50" : "gray.50"}
      borderRadius="md"
      borderWidth="1px"
      borderColor={done ? "green.200" : "gray.200"}
    >
      <Text color={done ? "green.700" : "gray.600"} fontSize="sm">
        {label}
      </Text>
    </Flex>
  );
}

export default Home;
