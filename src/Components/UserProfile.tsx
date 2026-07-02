import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaLeaf,
  FaSignOutAlt,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const API = `${apiBase}/api/profile`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  "Content-Type": "application/json",
});

// ─── Password input ───────────────────────────────────────────────────────────
function PasswordInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        _hover={{ borderColor: "#6b8f3f" }}
        _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
        rounded="md"
      />
      <InputRightElement>
        <Icon as={show ? FaEyeSlash : FaEye} color="gray.400" cursor="pointer" onClick={() => setShow((s) => !s)} />
      </InputRightElement>
    </InputGroup>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // ── Fetch profile ──
  useEffect(() => {
    fetch(API, { headers: authHeader() })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setAvatar(data.avatar || "");
        setAvatarPreview(data.avatar || "");
      })
      .catch(() => toast({ title: "Failed to load profile.", status: "error", duration: 3000, isClosable: true }))
      .finally(() => setLoading(false));
  }, []);

  // ── Avatar upload (base64 preview, URL input) ──
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be under 2MB.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  // ── Save profile ──
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ name, email, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data);
      toast({ title: "Profile updated! ✅", status: "success", duration: 3000, isClosable: true });
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "New passwords do not match.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch(`${API}/change-password`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Password changed successfully! 🔒", status: "success", duration: 3000, isClosable: true });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setChangingPassword(false);
    }
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#fbfaf7">
        <VStack spacing={4}>
          <Icon as={FaLeaf} color="#6b8f3f" boxSize={10} />
          <Text color="gray.500">Loading your profile...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="#fbfaf7">

      {/* ── Top bar ── */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100" px={{ base: 4, md: 10 }} py={4}>
        <Flex maxW="6xl" mx="auto" justify="space-between" align="center">
          <HStack spacing={2} cursor="pointer" onClick={() => navigate("/")}>
            <Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />
            <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f" letterSpacing="tight">
              Healthy<Text as="span" color="#f2b233">Bite</Text>
            </Text>
          </HStack>
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Icon as={FaHome} />}
              color="gray.600"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Icon as={FaSignOutAlt} />}
              color="red.400"
              _hover={{ bg: "red.50" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="5xl" py={10} px={{ base: 4, md: 8 }}>
        <Flex gap={8} direction={{ base: "column", md: "row" }} align="start">

          {/* ── Left: Avatar card ── */}
          <Box
            bg="white"
            rounded="2xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            p={6}
            w={{ base: "100%", md: "260px" }}
            flexShrink={0}
          >
            <VStack spacing={4}>
              {/* Avatar with upload overlay */}
              <Box position="relative">
                <Avatar
                  size="2xl"
                  name={user?.name}
                  src={avatarPreview || undefined}
                  bg="#6b8f3f"
                  color="white"
                />
                <Box
                  as="label"
                  htmlFor="avatar-upload"
                  position="absolute"
                  bottom={0}
                  right={0}
                  w={8}
                  h={8}
                  bg="#6b8f3f"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  border="2px solid white"
                  _hover={{ bg: "#5a7a34" }}
                  transition="background 0.2s"
                >
                  <Icon as={FaCamera} color="white" boxSize={3} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarFile}
                  />
                </Box>
              </Box>

              <VStack spacing={1} textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="gray.800">{user?.name || "User"}</Text>
                <Text fontSize="sm" color="gray.400">{user?.email}</Text>
                <Badge colorScheme={user?.isAdmin ? "green" : "gray"} rounded="full" px={2} mt={1}>
                  {user?.isAdmin ? "Admin" : "Member"}
                </Badge>
              </VStack>

              <Divider />

              {/* Quick links */}
              <VStack spacing={1} align="stretch" w="full">
                {[
                  { icon: FaUser,      label: "Edit Profile"    },
                  { icon: FaShieldAlt, label: "Security"        },
                  { icon: FaEnvelope,  label: "Notifications"   },
                ].map((item) => (
                  <HStack
                    key={item.label}
                    spacing={3}
                    px={3}
                    py={2}
                    rounded="lg"
                    color="gray.600"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    _hover={{ bg: "#f0f7e8", color: "#6b8f3f" }}
                    transition="all 0.15s"
                  >
                    <Icon as={item.icon} boxSize={3.5} />
                    <Text>{item.label}</Text>
                  </HStack>
                ))}

                <HStack
                  spacing={3}
                  px={3}
                  py={2}
                  rounded="lg"
                  color="red.400"
                  fontSize="sm"
                  fontWeight="medium"
                  cursor="pointer"
                  _hover={{ bg: "red.50" }}
                  transition="all 0.15s"
                  onClick={handleLogout}
                >
                  <Icon as={FaSignOutAlt} boxSize={3.5} />
                  <Text>Logout</Text>
                </HStack>
              </VStack>

              <Text fontSize="xs" color="gray.300">
                Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </Text>
            </VStack>
          </Box>

          {/* ── Right: Tabs ── */}
          <Box flex={1}>
            <Tabs variant="unstyled">
              <TabList
                bg="white"
                rounded="xl"
                p={1}
                mb={6}
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
                gap={1}
              >
                {["Edit Profile", "Security", "Settings"].map((label) => (
                  <Tab
                    key={label}
                    rounded="lg"
                    fontWeight="semibold"
                    fontSize="sm"
                    color="gray.500"
                    flex={1}
                    py={2.5}
                    _selected={{ bg: "#6b8f3f", color: "white" }}
                    transition="all 0.2s"
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {/* ── Edit Profile ── */}
                <TabPanel p={0}>
                  <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
                    <VStack align="start" spacing={1} mb={6}>
                      <Heading fontSize="lg" color="gray.800">Personal Information</Heading>
                      <Text fontSize="sm" color="gray.400">Update your name, email and profile photo.</Text>
                    </VStack>

                    <VStack spacing={5} align="stretch">
                      {/* Avatar URL input */}
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Profile Photo URL</FormLabel>
                        <Input
                          placeholder="https://example.com/photo.jpg"
                          value={avatar.startsWith("data:") ? "" : avatar}
                          onChange={(e) => {
                            setAvatar(e.target.value);
                            setAvatarPreview(e.target.value);
                          }}
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "#6b8f3f" }}
                          _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                          rounded="md"
                          fontSize="sm"
                        />
                        <Text fontSize="xs" color="gray.400" mt={1}>Or click the camera icon on your avatar to upload a file.</Text>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Full name</FormLabel>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "#6b8f3f" }}
                          _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                          rounded="md"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Email address</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "#6b8f3f" }}
                          _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                          rounded="md"
                        />
                      </FormControl>

                      <Button
                        bg="#6b8f3f"
                        color="white"
                        rounded="md"
                        isLoading={saving}
                        loadingText="Saving…"
                        _hover={{ bg: "#5a7a34" }}
                        onClick={handleSaveProfile}
                        alignSelf="start"
                        px={8}
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </Box>
                </TabPanel>

                {/* ── Security ── */}
                <TabPanel p={0}>
                  <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
                    <VStack align="start" spacing={1} mb={6}>
                      <Heading fontSize="lg" color="gray.800">Change Password</Heading>
                      <Text fontSize="sm" color="gray.400">Keep your account secure with a strong password.</Text>
                    </VStack>

                    <VStack spacing={5} align="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Current password</FormLabel>
                        <PasswordInput placeholder="Enter current password" value={currentPassword} onChange={setCurrentPassword} />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">New password</FormLabel>
                        <PasswordInput placeholder="Min. 6 characters" value={newPassword} onChange={setNewPassword} />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Confirm new password</FormLabel>
                        <PasswordInput placeholder="Re-enter new password" value={confirmPassword} onChange={setConfirmPassword} />
                      </FormControl>

                      {/* Password match indicator */}
                      {confirmPassword.length > 0 && (
                        <Text fontSize="xs" color={newPassword === confirmPassword ? "#6b8f3f" : "red.400"} fontWeight="medium">
                          {newPassword === confirmPassword ? "✔ Passwords match" : "✖ Passwords don't match"}
                        </Text>
                      )}

                      <Button
                        bg="#6b8f3f"
                        color="white"
                        rounded="md"
                        isLoading={changingPassword}
                        loadingText="Updating…"
                        _hover={{ bg: "#5a7a34" }}
                        onClick={handleChangePassword}
                        alignSelf="start"
                        px={8}
                      >
                        Update Password
                      </Button>
                    </VStack>
                  </Box>
                </TabPanel>

                {/* ── Settings ── */}
                <TabPanel p={0}>
                  <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
                    <VStack align="start" spacing={1} mb={6}>
                      <Heading fontSize="lg" color="gray.800">Account Settings</Heading>
                      <Text fontSize="sm" color="gray.400">Manage your account preferences.</Text>
                    </VStack>

                    <VStack spacing={4} align="stretch">
                      {/* Danger zone */}
                      <Box border="1px solid" borderColor="red.100" rounded="xl" p={5} bg="red.50">
                        <VStack align="start" spacing={3}>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="sm" color="red.600">Danger Zone</Text>
                            <Text fontSize="xs" color="red.400">These actions are permanent and cannot be undone.</Text>
                          </VStack>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                                // TODO: wire up delete account API
                                toast({ title: "Account deletion coming soon.", status: "info", duration: 3000, isClosable: true });
                              }
                            }}
                          >
                            Delete Account
                          </Button>
                        </VStack>
                      </Box>

                      {/* Logout */}
                      <Box border="1px solid" borderColor="gray.100" rounded="xl" p={5}>
                        <HStack justify="space-between" align="center">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="sm" color="gray.700">Sign Out</Text>
                            <Text fontSize="xs" color="gray.400">Sign out of your HealthyBite account.</Text>
                          </VStack>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            leftIcon={<Icon as={FaSignOutAlt} />}
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}