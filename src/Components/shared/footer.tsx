import { Box, Container, VStack, Text, Link, SimpleGrid, Input, Textarea, Button, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface FooterLinkProps {
  children: React.ReactNode;
  href?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ children, href = "#" }) => (
  <Link
    href={href}
    _hover={{ textDecoration: "underline", color: "yellow.200" }}
    fontSize="md" // make links bigger
    fontWeight="medium"
  >
    {children}
  </Link>
);

export default function Footer() {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: "Message sent!", status: "success", duration: 4000, isClosable: true });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({ title: "Failed to send message.", status: "error", duration: 4000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "An error occurred.", status: "error", duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="contact" bg="#6b8f3f" color="white" py={{ base: 6, md: 8 }}>
      <Container maxW="7xl">
        <SimpleGrid
          columns={{ base: 1, md: 4 }}
          spacing={{ base: 4, md: 6 }} // reduced spacing
        >
          {/* Logo & Description */}
          <VStack align={{ base: "start", md: "start" }} spacing={2}>
            <Text fontWeight="bold" fontSize="4xl">
              HealthyBite
            </Text>
            <Text maxW={{ base: "100%", md: "sm" }} fontSize="xl">
              Delicious and nutritious meals delivered right to your door. Healthy eating made easy!
            </Text>
          </VStack>

          {/* Company Links */}
          <VStack ml={{base:"0", md:"5em"}} align={{ base: "none", md: "start" }} spacing={1}>
            <Text fontWeight="bold" fontSize="2xl">Company</Text> {/* increased size */}
            <FooterLink>About</FooterLink>
            <FooterLink>Menu</FooterLink>
            <FooterLink>Contact</FooterLink>
          </VStack>

          {/* Support Links */}
          <VStack align={{ base: "none", md: "start" }} spacing={1}>
            <Text fontWeight="bold" fontSize="2xl">Support</Text> {/* increased size */}
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Help Center</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
          </VStack>

          {/* Contact Form */}
          <VStack mt={"-1em"} align={{ base: "center", md: "start" }} spacing={2} w="100%">
            <Text fontWeight="bold" fontSize="5xl">Contact Us</Text>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Stack spacing={2} w="100%">
                <Input
                  placeholder="Your Name"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.500" }}
                  size="sm"
                  rounded="md"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.500" }}
                  size="sm"
                  rounded="md"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  placeholder="Your Message"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.500" }}
                  size="sm"
                  rounded="md"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <Button
                  bg="#f2b233"
                  color="white"
                  _hover={{ bg: "#e2a324" }}
                  rounded="md"
                  w="full"
                  type="submit"
                  isLoading={loading}
                  size="sm"
                >
                  Send
                </Button>
              </Stack>
            </form>
          </VStack>
        </SimpleGrid>

        {/* Copyright */}
        <Text textAlign="center" mt={4} fontSize="xs" color="whiteAlpha.800">
          © {new Date().getFullYear()} HealthyBite. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
