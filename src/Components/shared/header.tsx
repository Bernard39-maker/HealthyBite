import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "#meals" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const NavLink: React.FC<{ children: React.ReactNode; href: string }> = ({
  children,
  href,
}) => (
  <Link
    px={3}
    py={2}
    rounded="md"
    _hover={{ textDecoration: "none", bg: "gray.200" }}
    href={href}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="white"
      px={{ base: 4, md: 8 }}
      shadow="md"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" fontSize="xl" color="#6b8f3f">
          HealthyBite
        </Box>
        <HStack
          spacing={8}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          {Links.map((link) => (
            <NavLink key={link.name} href={link.href}>
              {link.name}
            </NavLink>
          ))}

          <Button
            bg="#f2b233"
            color="white"
            _hover={{ bg: "#e2a324" }}
            rounded="md"
          >
            Get Started
          </Button>
        </HStack>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}

            <Button
              bg="#f2b233"
              color="white"
              _hover={{ bg: "#e2a324" }}
              rounded="md"
              w="full"
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
