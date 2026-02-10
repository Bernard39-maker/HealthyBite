import { Flex, Spinner,Text } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Components/Home";

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        height="100vh"
        width="100vw"
        bg="white"
        direction="column"
        gap={6}
      >
        <Spinner
          thickness="4px"
          speed="0.85s"
          emptyColor="gray.200"
          color="#6b8f3f"           // matches your brand green from earlier menu
          size="xl"                 // xl = quite visible but not overwhelming
        />
        {/* Optional: add friendly loading text */}
        <Text fontSize="lg" color="gray.600" fontWeight="medium">
          Preparing your healthy meals...
        </Text>
      </Flex>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add more routes later if needed */}
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}