import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLeaf, FaLock, FaCheckCircle } from "react-icons/fa";

function PasswordInput({
  placeholder = "Enter new password",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
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
        transition="all 0.2s"
      />
      <InputRightElement>
        <Icon
          as={show ? FaEyeSlash : FaEye}
          color="gray.400"
          cursor="pointer"
          onClick={() => setShow((s) => !s)}
          _hover={{ color: "#6b8f3f" }}
          transition="color 0.2s"
        />
      </InputRightElement>
    </InputGroup>
  );
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [params] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const token = params.get("token");

  // Password strength indicator
  const getStrength = (p: string) => {
    if (p.length === 0) return { label: "", color: "gray.200", width: "0%" };
    if (p.length < 6)   return { label: "Too short", color: "red.400", width: "25%" };
    if (p.length < 8)   return { label: "Weak", color: "orange.400", width: "50%" };
    if (p.length < 12)  return { label: "Good", color: "yellow.400", width: "75%" };
    return               { label: "Strong", color: "#6b8f3f", width: "100%" };
  };
  const strength = getStrength(password);

  const handleReset = async () => {
    if (!password || !confirm) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (!token) {
      toast({ title: "Invalid or missing reset token.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="#fbfaf7">

      {/* ── Left image panel ── */}
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex={1}
        direction="column"
        align="center"
        justify="center"
        position="relative"
        overflow="hidden"
      >
        {/* Background image */}
        <Box
          position="absolute"
          inset={0}
          bgImage="url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop')"
          bgSize="cover"
          bgPosition="center"
          style={{ filter: "blur(2px)", transform: "scale(1.05)" }}
        />
        {/* Overlay */}
        <Box position="absolute" inset={0} bg="rgba(30, 58, 15, 0.82)" />

        {/* Content */}
        <VStack spacing={6} zIndex={1} color="white" textAlign="center" px={16} maxW="sm">
          <Flex align="center" gap={3}>
            <Icon as={FaLeaf} boxSize={8} />
            <Text fontWeight="extrabold" fontSize="3xl" letterSpacing="tight">
              Healthy<Text as="span" color="#f2b233">Bite</Text>
            </Text>
          </Flex>

          {/* Lock icon with ring */}
          <Flex
            w={24}
            h={24}
            rounded="full"
            bg="whiteAlpha.200"
            border="2px solid"
            borderColor="whiteAlpha.300"
            align="center"
            justify="center"
          >
            <Icon as={FaLock} boxSize={10} color="white" />
          </Flex>

          <VStack spacing={2}>
            <Heading fontSize="2xl" fontWeight="bold" color="white">
              Secure your account
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.800" lineHeight="tall">
              Choose a strong password to keep your HealthyBite account safe and your meals on the way.
            </Text>
          </VStack>

          {/* Tips */}
          <VStack
            align="start"
            spacing={3}
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            rounded="xl"
            px={5}
            py={4}
            w="full"
          >
            <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">
              Password tips
            </Text>
            {[
              "At least 8 characters long",
              "Mix of letters, numbers & symbols",
              "Avoid using your name or email",
            ].map((tip) => (
              <HStack key={tip} spacing={2}>
                <Icon as={FaCheckCircle} color="#f2b233" boxSize={3} flexShrink={0} />
                <Text fontSize="sm" color="whiteAlpha.900">{tip}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Flex>

      {/* ── Right form panel ── */}
      <Flex
        flex={{ base: 1, lg: "0 0 480px" }}
        direction="column"
        align="center"
        justify="center"
        px={{ base: 6, md: 12 }}
        py={12}
        bg="white"
      >
        {/* Logo — mobile only */}
        <Flex
          display={{ base: "flex", lg: "none" }}
          align="center"
          gap={2}
          mb={8}
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />
          <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f" letterSpacing="tight">
            Healthy<Text as="span" color="#f2b233">Bite</Text>
          </Text>
        </Flex>

        <Box w="100%" maxW="400px">

          {success ? (
            /* ── Success state ── */
            <VStack spacing={6} textAlign="center" py={8}>
              <Flex
                w={20}
                h={20}
                rounded="full"
                bg="#f0f7e8"
                align="center"
                justify="center"
              >
                <Icon as={FaCheckCircle} boxSize={10} color="#6b8f3f" />
              </Flex>
              <VStack spacing={2}>
                <Heading fontSize="2xl" color="gray.800">Password reset!</Heading>
                <Text fontSize="sm" color="gray.500" lineHeight="tall">
                  Your password has been updated successfully. You can now log in with your new password.
                </Text>
              </VStack>
              <Button
                w="full"
                bg="#6b8f3f"
                color="white"
                size="lg"
                rounded="md"
                _hover={{ bg: "#5a7a34" }}
                onClick={() => navigate("/auth")}
              >
                Go to Login
              </Button>
            </VStack>
          ) : (
            /* ── Form state ── */
            <VStack spacing={8} align="stretch">
              <VStack align="start" spacing={1}>
                <Heading fontSize="2xl" color="gray.800">Set new password</Heading>
                <Text fontSize="sm" color="gray.500">
                  Your new password must be different from previous ones.
                </Text>
              </VStack>

              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">New password</FormLabel>
                  <PasswordInput value={password} onChange={setPassword} />
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <Box mt={2}>
                      <Box h="4px" bg="gray.100" rounded="full" overflow="hidden">
                        <Box
                          h="full"
                          bg={strength.color}
                          w={strength.width}
                          rounded="full"
                          transition="all 0.3s"
                        />
                      </Box>
                      <Text fontSize="xs" color={strength.color} mt={1} fontWeight="medium">
                        {strength.label}
                      </Text>
                    </Box>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Confirm password</FormLabel>
                  <PasswordInput placeholder="Re-enter new password" value={confirm} onChange={setConfirm} />
                  {/* Match indicator */}
                  {confirm.length > 0 && (
                    <HStack mt={1} spacing={1}>
                      <Icon
                        as={FaCheckCircle}
                        boxSize={3}
                        color={password === confirm ? "#6b8f3f" : "red.400"}
                      />
                      <Text
                        fontSize="xs"
                        color={password === confirm ? "#6b8f3f" : "red.400"}
                        fontWeight="medium"
                      >
                        {password === confirm ? "Passwords match" : "Passwords don't match"}
                      </Text>
                    </HStack>
                  )}
                </FormControl>

                <Button
                  w="full"
                  bg="#6b8f3f"
                  color="white"
                  size="lg"
                  rounded="md"
                  isLoading={loading}
                  loadingText="Resetting…"
                  _hover={{ bg: "#5a7a34" }}
                  transition="background 0.2s"
                  onClick={handleReset}
                >
                  Reset Password
                </Button>

                <Text
                  fontSize="xs"
                  color="gray.400"
                  cursor="pointer"
                  textAlign="center"
                  _hover={{ color: "#6b8f3f" }}
                  onClick={() => navigate("/auth")}
                >
                  ← Back to Login
                </Text>
              </VStack>
            </VStack>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}