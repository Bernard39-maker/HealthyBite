import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

const ADMIN_EMAIL = "bernardunimke4@gmail.com";

const Links = [
  { name: "Home",    href: "/"        },
  { name: "Menu",    href: "/menu"    },
  { name: "About",   href: "/about"   },
  { name: "Contact", href: "/contact" },
];

const NavLink: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => (
  <Link
    href={href}
    px={4} py={2}
    fontSize="md" fontWeight="semibold" color="gray.700" rounded="md" position="relative"
    _hover={{ textDecoration: "none", color: "#6b8f3f" }}
    sx={{
      "&::after": {
        content: '""', position: "absolute", bottom: "2px", left: "50%",
        transform: "translateX(-50%)", width: "0%", height: "2px",
        bg: "#6b8f3f", borderRadius: "full", transition: "width 0.25s ease",
      },
      "&:hover::after": { width: "60%" },
    }}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const token = localStorage.getItem("token");

  let userName = "";
  let userEmail = "";
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userName  = payload.name  || "";
      userEmail = payload.email || "";
    }
  } catch (err) {
    // ignore malformed token
  }

  const isAdmin = userEmail === ADMIN_EMAIL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Box
        as="header" bg="white" borderBottom="1px solid" borderColor="gray.100"
        position="sticky" top={0} zIndex={200}
      >
        <Flex
          maxW="7xl" mx="auto" px={{ base: 5, md: 10 }}
          h={20} alignItems="center" justifyContent="space-between"
        >
          {/* Logo */}
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={2} align="center">
              <Text fontSize="xl" lineHeight={1}>🌿</Text>
              <Text fontWeight="extrabold" fontSize="2xl" color="#6b8f3f" letterSpacing="tight">
                Healthy<Text as="span" color="#f2b233">Bite</Text>
              </Text>
            </HStack>
          </Link>

          {/* Desktop nav */}
          <HStack spacing={2} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
            ))}
          </HStack>

          {/* Desktop CTA */}
          <HStack spacing={2} display={{ base: "none", md: "flex" }}>
            {token ? (
              <Menu>
                <MenuButton>
                  <HStack
                    spacing={2} cursor="pointer" px={3} py={1.5} rounded="full"
                    border="1px solid" borderColor="gray.200"
                    _hover={{ bg: "gray.50" }} transition="background 0.2s"
                  >
                    <Avatar size="xs" name={userName} bg="#6b8f3f" color="white" />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {userName || "Account"}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList rounded="xl" shadow="lg" border="1px solid" borderColor="gray.100" py={2} minW="190px">
                  <MenuItem
                    icon={<Icon as={FaUser} color="#6b8f3f" boxSize={3.5} />}
                    fontSize="sm" fontWeight="medium" _hover={{ bg: "#f0f7e8" }}
                    onClick={() => window.location.href = "/profile"}
                  >
                    My Profile
                  </MenuItem>

                  {/* ── Admin only ── */}
                  {isAdmin && (
                    <MenuItem
                      icon={<Icon as={FaTachometerAlt} color="#6b8f3f" boxSize={3.5} />}
                      fontSize="sm" fontWeight="medium" _hover={{ bg: "#f0f7e8" }}
                      onClick={() => window.location.href = "/admin"}
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}

                  <MenuDivider />
                  <MenuItem
                    icon={<Icon as={FaSignOutAlt} color="red.400" boxSize={3.5} />}
                    fontSize="sm" fontWeight="medium" color="red.400" _hover={{ bg: "red.50" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={2}>
                <Box
                  as="a" href="/auth" px={4} py={2} fontSize="sm" fontWeight="semibold"
                  color="#6b8f3f" rounded="md" border="1px solid" borderColor="#6b8f3f"
                  _hover={{ bg: "#f0f7e8", textDecoration: "none" }} transition="background 0.2s"
                >
                  Login
                </Box>
                <Box
                  as="a" href="/auth" px={5} py={2} fontSize="sm" fontWeight="semibold"
                  color="white" bg="#6b8f3f" rounded="md"
                  _hover={{ bg: "#5a7a34", textDecoration: "none" }} transition="background 0.2s"
                >
                  Order Now
                </Box>
              </HStack>
            )}
          </HStack>

          {/* Hamburger */}
          <IconButton
            size="md" variant="ghost"
            icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={6} h={6} />}
            aria-label="Toggle Menu" display={{ md: "none" }} color="gray.600" onClick={onToggle}
          />
        </Flex>
      </Box>

      {/* Backdrop */}
      <Box
        display={{ base: isOpen ? "block" : "none", md: "none" }}
        position="fixed" inset={0} top="80px" bg="blackAlpha.400" zIndex={198}
        onClick={onToggle}
        sx={{
          animation: "fadeIn 0.18s ease",
          "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      {/* Mobile drawer */}
      <Box
        display={{ base: "flex", md: "none" }} flexDirection="column"
        position="fixed" top="80px" right={0} h="auto" w="75%" bg="white"
        zIndex={199} px={5} pt={4} pb={6} boxShadow="-4px 4px 24px rgba(0,0,0,0.12)"
        borderBottomLeftRadius="xl"
        sx={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Stack spacing={1} mb={4}>
          {Links.map((link) => (
            <Link
              key={link.name} href={link.href} onClick={onToggle}
              px={4} py={3} fontSize="md" fontWeight="semibold" color="gray.700" rounded="md"
              _hover={{ bg: "#f0f7e8", color: "#6b8f3f", textDecoration: "none" }} transition="all 0.15s"
            >
              {link.name}
            </Link>
          ))}
        </Stack>

        <Stack spacing={2}>
          {token ? (
            <>
              <Box
                as="a" href="/profile" onClick={onToggle}
                display="flex" alignItems="center" gap={2}
                px={4} py={3} fontSize="sm" fontWeight="semibold" color="#6b8f3f"
                rounded="md" border="1px solid" borderColor="#6b8f3f"
                _hover={{ bg: "#f0f7e8", textDecoration: "none" }}
              >
                <Icon as={FaUser} boxSize={3.5} />
                My Profile
              </Box>

              {/* ── Admin only (mobile) ── */}
              {isAdmin && (
                <Box
                  as="a" href="/admin" onClick={onToggle}
                  display="flex" alignItems="center" gap={2}
                  px={4} py={3} fontSize="sm" fontWeight="semibold" color="white"
                  bg="#6b8f3f" rounded="md" _hover={{ bg: "#5a7a34", textDecoration: "none" }}
                >
                  <Icon as={FaTachometerAlt} boxSize={3.5} />
                  Admin Dashboard
                </Box>
              )}

              <Box
                as="button" w="full" display="flex" alignItems="center" justifyContent="center"
                gap={2} px={4} py={3} fontSize="sm" fontWeight="semibold"
                color="white" bg="red.400" rounded="md" _hover={{ bg: "red.500" }}
                transition="background 0.2s" onClick={handleLogout}
              >
                <Icon as={FaSignOutAlt} boxSize={3.5} />
                Logout
              </Box>
            </>
          ) : (
            <>
              <Box
                as="a" href="/auth" onClick={onToggle} display="block" textAlign="center"
                px={4} py={3} fontSize="md" fontWeight="semibold" color="#6b8f3f"
                rounded="md" border="1px solid" borderColor="#6b8f3f"
                _hover={{ bg: "#f0f7e8", textDecoration: "none" }}
              >
                Login
              </Box>
              <Box
                as="a" href="#meals" onClick={onToggle} display="block" textAlign="center"
                px={4} py={3} fontSize="md" fontWeight="semibold" color="white"
                bg="#6b8f3f" rounded="md" _hover={{ bg: "#5a7a34", textDecoration: "none" }}
                transition="background 0.2s"
              >
                Order Now
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}