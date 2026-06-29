import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "./shared/header";
import Footer from "./shared/footer";
import {
  FaUserPlus,
  FaClipboardList,
  FaCreditCard,
  FaTruck,
  FaLeaf,
  FaShieldAlt,
  FaClock,
  FaStar,
} from "react-icons/fa";

// ─── Wave ─────────────────────────────────────────────────────────────────────
type WaveProps = { d: string; fill: string; position?: "bottom" | "top"; height?: string | number };
function Wave({ d, fill, position = "bottom", height = "120px" }: WaveProps) {
  const isBottom = position === "bottom";
  const h = typeof height === "number" ? height : parseInt(String(height), 10) || 120;
  const hCss = typeof height === "number" ? `${height}px` : height;
  return (
    <Box position="absolute" {...(isBottom ? { bottom: 0 } : { top: 0 })} left={0} w="100%" overflow="hidden" lineHeight={0} h={hCss} pointerEvents="none">
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <path d={d} fill={fill} />
      </svg>
    </Box>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({
  number,
  icon,
  title,
  text,
  isLast,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  isLast?: boolean;
}) {
  return (
    <Box position="relative">
      {/* Connector line between steps */}
      {!isLast && (
        <Box
          display={{ base: "none", md: "block" }}
          position="absolute"
          top="28px"
          left="calc(50% + 48px)"
          w="calc(100% - 48px)"
          h="2px"
          bgGradient="linear(to-r, #6b8f3f, #f2b233)"
          zIndex={0}
        />
      )}
      <VStack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
        {/* Number + Icon circle */}
        <Box position="relative">
          <Box
            w={14}
            h={14}
            rounded="full"
            bg="#6b8f3f"
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="lg"
          >
            {icon}
          </Box>
          <Box
            position="absolute"
            top={-2}
            right={-2}
            w={6}
            h={6}
            rounded="full"
            bg="#f2b233"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xs" fontWeight="extrabold" color="white">{number}</Text>
          </Box>
        </Box>
        <Heading size="sm" color="gray.800">{title}</Heading>
        <Text color="gray.500" fontSize="sm" lineHeight="tall" maxW="200px">{text}</Text>
      </VStack>
    </Box>
  );
}

// ─── Feature Row ──────────────────────────────────────────────────────────────
function FeatureRow({
  icon,
  title,
  text,
  image,
  reverse,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap={{ base: 8, md: 16 }}
      alignItems="center"
    >
      <Box order={{ base: 1, md: reverse ? 2 : 1 }}>
        <Image
          src={image}
          alt={title}
          rounded="2xl"
          w="100%"
          maxH={{ base: "240px", md: "380px" }}
          objectFit="cover"
          shadow="lg"
        />
      </Box>
      <VStack align="start" spacing={4} order={{ base: 2, md: reverse ? 1 : 2 }}>
        <Box
          w={12}
          h={12}
          rounded="xl"
          bg="#f0f7e8"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Heading fontSize={{ base: "xl", md: "2xl" }} color="gray.800" lineHeight="shorter">
          {title}
        </Heading>
        <Text color="gray.500" lineHeight="tall">{text}</Text>
      </VStack>
    </Grid>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        bgImage="linear-gradient(rgba(107,143,63,0.92), rgba(107,143,63,0.92)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        pt={{ base: 20, md: 28 }}
        pb={{ base: 32, md: 40 }}
        textAlign="center"
      >
        <Container maxW="3xl">
          <Box display="inline-block" bg="whiteAlpha.200" px={4} py={1} rounded="full" border="1px solid" borderColor="whiteAlpha.300" mb={5}>
            <Text fontSize="sm" fontWeight="semibold">⚡ Simple & Fast</Text>
          </Box>
          <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="extrabold" lineHeight="shorter" letterSpacing="tight" mb={5}>
            Healthy Meals in{" "}
            <Text as="span" color="#f2b233">4 Easy Steps</Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color="whiteAlpha.900" lineHeight="tall">
            From sign-up to doorstep delivery — we've made eating healthy as simple as possible.
          </Text>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── STEPS ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 24 }}>
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={16} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">How It Works</Heading>
            <Text color="gray.500" maxW="md">Four steps stand between you and a fresh, nutritious meal at your door.</Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 10, md: 6 }}>
            <StepCard
              number="1"
              icon={<Icon as={FaUserPlus} color="white" boxSize={6} />}
              title="Create Your Account"
              text="Sign up in under a minute. No credit card required to get started."
            />
            <StepCard
              number="2"
              icon={<Icon as={FaClipboardList} color="white" boxSize={6} />}
              title="Choose Your Meals"
              text="Browse our menu of nutritionist-crafted meals and pick your favourites."
            />
            <StepCard
              number="3"
              icon={<Icon as={FaCreditCard} color="white" boxSize={6} />}
              title="Place Your Order"
              text="Select your delivery time, confirm your address, and pay securely."
            />
            <StepCard
              number="4"
              icon={<Icon as={FaTruck} color="white" boxSize={6} />}
              title="Enjoy Your Delivery"
              text="Fresh meals arrive at your door, ready to eat — no cooking required."
              isLast
            />
          </SimpleGrid>

          {/* CTA under steps */}
          <VStack mt={16} spacing={4}>
            <Button
              bg="#6b8f3f"
              color="white"
              size="lg"
              rounded="full"
              px={10}
              _hover={{ bg: "#5a7a34", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              onClick={() => navigate("/auth")}
            >
              Get Started — It's Free
            </Button>
            <Text fontSize="sm" color="gray.400">No commitment. Cancel anytime.</Text>
          </VStack>
        </Container>
      </Box>

      {/* ── FEATURES ── */}
      <Box bg="#f6f3ee" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={16} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">Why It's Worth It</Heading>
            <Text color="gray.500" maxW="md">Everything we do is designed to make your life easier and healthier.</Text>
          </VStack>
          <VStack spacing={16}>
            <FeatureRow
              icon={<Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />}
              title="Meals Crafted by Nutrition Experts"
              text="Every meal on our menu is designed by registered nutritionists to give you the perfect balance of proteins, carbs, and healthy fats — no guesswork needed."
              image="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop"
            />
            <FeatureRow
              icon={<Icon as={FaClock} color="#6b8f3f" boxSize={5} />}
              title="Delivery That Fits Your Schedule"
              text="Pick your preferred delivery window — morning, afternoon, or evening. We work around your life, not the other way around."
              image="https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop"
              reverse
            />
            <FeatureRow
              icon={<Icon as={FaShieldAlt} color="#6b8f3f" boxSize={5} />}
              title="Safe, Secure & Transparent"
              text="All payments are encrypted and secure. You can see exactly what's in every meal — ingredients, calories, macros — before you order."
              image="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop"
            />
          </VStack>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#6b8f3f" />
      </Box>

      {/* ── TESTIMONIAL STRIP ── */}
      <Box bg="#6b8f3f" py={{ base: 14, md: 20 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#f6f3ee" position="top" height="80px" />
        <Container maxW="5xl" px={{ base: 6, md: 20 }} textAlign="center">
          <Icon as={FaStar} color="#f2b233" boxSize={8} mb={4} />
          <Heading fontSize={{ base: "xl", md: "3xl" }} color="white" fontWeight="extrabold" mb={4} lineHeight="shorter">
            "I signed up, picked my meals, and had food at my door the next morning. Easiest thing I've done all week."
          </Heading>
          <Text color="whiteAlpha.700" fontSize="sm">— Chidi A., Abuja · ⭐⭐⭐⭐⭐</Text>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── FINAL CTA ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 24 }} textAlign="center">
        <Container maxW="2xl">
          <VStack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} color="gray.800" fontWeight="extrabold" lineHeight="shorter">
              Ready to Try It?
            </Heading>
            <Text color="gray.500" fontSize={{ base: "md", md: "lg" }}>
              Join 2,400+ customers who've made healthy eating effortless.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                bg="#6b8f3f"
                color="white"
                size="lg"
                rounded="full"
                px={10}
                _hover={{ bg: "#5a7a34" }}
                onClick={() => navigate("/auth")}
              >
                Start Today
              </Button>
              <Button
                variant="outline"
                borderColor="#6b8f3f"
                color="#6b8f3f"
                size="lg"
                rounded="full"
                px={10}
                _hover={{ bg: "#f0f7e8" }}
                as="a"
                href="/meals"
              >
                Browse the Menu
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}