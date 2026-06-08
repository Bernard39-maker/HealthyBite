import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Icon, Text, VStack, Spinner } from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaLeaf } from "react-icons/fa";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const navigate = useNavigate();
  const token = params.get("token");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.ok || res.redirected) setStatus("success");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Flex minH="100vh" bg="#fbfaf7" align="center" justify="center" px={6}>
      <Box bg="white" rounded="2xl" shadow="md" p={10} w="100%" maxW="420px" textAlign="center">
        <Flex align="center" justify="center" gap={2} mb={8} cursor="pointer" onClick={() => navigate("/")}>
          <Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />
          <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f">
            Healthy<Text as="span" color="#f2b233">Bite</Text>
          </Text>
        </Flex>

        {status === "loading" && (
          <VStack spacing={4}>
            <Spinner size="xl" color="#6b8f3f" thickness="4px" />
            <Text color="gray.500">Verifying your email...</Text>
          </VStack>
        )}

        {status === "success" && (
          <VStack spacing={4}>
            <Icon as={FaCheckCircle} color="#6b8f3f" boxSize={14} />
            <Text fontWeight="bold" fontSize="xl" color="gray.800">Email Verified! 🎉</Text>
            <Text color="gray.500" fontSize="sm">Your account is now active. You can log in.</Text>
            <Button bg="#6b8f3f" color="white" rounded="md" w="full" onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
          </VStack>
        )}

        {status === "error" && (
          <VStack spacing={4}>
            <Icon as={FaTimesCircle} color="red.400" boxSize={14} />
            <Text fontWeight="bold" fontSize="xl" color="gray.800">Invalid Link</Text>
            <Text color="gray.500" fontSize="sm">This verification link is invalid or has already been used.</Text>
            <Button bg="#6b8f3f" color="white" rounded="md" w="full" onClick={() => navigate("/auth")}>
              Back to Login
            </Button>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}