import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "./shared/header";
import Footer from "./shared/footer";
import {
  FaHeart,
  FaLeaf,
  FaUserFriends,
  FaLaptop,
  FaMapMarkerAlt,
  FaClock,
  FaBriefcase,
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

// ─── Perk Card ────────────────────────────────────────────────────────────────
function PerkCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <VStack
      align="start"
      spacing={3}
      bg="white"
      rounded="2xl"
      p={6}
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-3px)", shadow: "md" }}
    >
      <Box w={11} h={11} rounded="xl" bg="#f0f7e8" display="flex" alignItems="center" justifyContent="center">
        {icon}
      </Box>
      <Heading size="sm" color="gray.800">{title}</Heading>
      <Text color="gray.500" fontSize="sm" lineHeight="tall">{text}</Text>
    </VStack>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({
  title,
  department,
  location,
  type,
  description,
}: {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      p={6}
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-3px)", shadow: "md" }}
    >
      <Grid templateColumns={{ base: "1fr", md: "1fr auto" }} gap={4} alignItems="start">
        <VStack align="start" spacing={3}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="semibold" color="#6b8f3f" textTransform="uppercase" letterSpacing="wide">
              {department}
            </Text>
            <Heading size="md" color="gray.800">{title}</Heading>
          </VStack>
          <HStack spacing={3} flexWrap="wrap">
            <HStack spacing={1}>
              <Icon as={FaMapMarkerAlt} color="gray.400" boxSize={3} />
              <Text fontSize="xs" color="gray.500">{location}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FaClock} color="gray.400" boxSize={3} />
              <Text fontSize="xs" color="gray.500">{type}</Text>
            </HStack>
          </HStack>
          <Text color="gray.500" fontSize="sm" lineHeight="tall">{description}</Text>
        </VStack>
        <Button
          bg="#6b8f3f"
          color="white"
          rounded="full"
          size="sm"
          px={6}
          _hover={{ bg: "#5a7a34" }}
          flexShrink={0}
          alignSelf={{ base: "start", md: "center" }}
          as="a"
          href="mailto:careers@healthybite.ng"
        >
          Apply Now
        </Button>
      </Grid>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CareersPage() {
  const navigate = useNavigate();

  const jobs = [
    {
      title: "Delivery Operations Coordinator",
      department: "Operations",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Help manage our last-mile delivery network across Lagos. You'll coordinate riders, optimise routes, and ensure every order arrives fresh and on time.",
    },
    {
      title: "Nutritionist & Menu Developer",
      department: "Food & Nutrition",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Design new meal plans and review existing recipes to ensure every dish meets our health and flavour standards. Work closely with the kitchen team.",
    },
    {
      title: "Frontend Engineer (React)",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and improve our customer-facing web app. You'll work across the full product — from the meal selection flow to the checkout and order tracking experience.",
    },
    {
      title: "Customer Success Associate",
      department: "Support",
      location: "Lagos / Remote",
      type: "Full-time",
      description: "Be the friendly voice of HealthyBite. Help customers with orders, resolve issues quickly, and collect feedback that shapes our product.",
    },
    {
      title: "Social Media & Content Creator",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      description: "Create engaging content across Instagram, X, and TikTok. You'll tell the HealthyBite story through photos, reels, and copy that inspires people to eat better.",
    },
    {
      title: "Kitchen Assistant",
      department: "Food & Nutrition",
      location: "Abuja, Nigeria",
      type: "Full-time",
      description: "Support our Abuja kitchen team in daily meal prep. Passion for food and attention to hygiene and quality are a must.",
    },
  ];

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        bgImage="linear-gradient(rgba(107,143,63,0.92), rgba(107,143,63,0.92)), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        pt={{ base: 20, md: 28 }}
        pb={{ base: 32, md: 40 }}
        textAlign="center"
      >
        <Container maxW="3xl">
          <Box display="inline-block" bg="whiteAlpha.200" px={4} py={1} rounded="full" border="1px solid" borderColor="whiteAlpha.300" mb={5}>
            <Text fontSize="sm" fontWeight="semibold">🌱 Join Our Team</Text>
          </Box>
          <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="extrabold" lineHeight="shorter" letterSpacing="tight" mb={5}>
            Help Us Build a{" "}
            <Text as="span" color="#f2b233">Healthier Nigeria</Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color="whiteAlpha.900" lineHeight="tall">
            We're a fast-growing team of food lovers, technologists, and health advocates on a mission to make nutritious eating effortless for everyone.
          </Text>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── MISSION ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 20 }}>
        <Container maxW="4xl" px={{ base: 6, md: 20 }} textAlign="center">
          <VStack spacing={5}>
            <Box bg="#f0f7e8" px={3} py={1} rounded="full">
              <Text fontSize="sm" color="#6b8f3f" fontWeight="semibold">Our Mission</Text>
            </Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800" lineHeight="shorter">
              We believe great work deserves a great environment
            </Heading>
            <Text color="gray.500" lineHeight="tall" fontSize={{ base: "md", md: "lg" }}>
              At HealthyBite, every role — from kitchen to code — contributes to the same goal: helping thousands of people eat better and live healthier. We move fast, support each other, and care deeply about the impact we have.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* ── PERKS ── */}
      <Box bg="#f6f3ee" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">Why Work With Us</Heading>
            <Text color="gray.500" maxW="md">We take care of our team the same way we take care of our customers.</Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <PerkCard
              icon={<Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />}
              title="Free HealthyBite Meals"
              text="All full-time staff get complimentary daily meals from our menu. Eat what we make — and tell us how to make it better."
            />
            <PerkCard
              icon={<Icon as={FaLaptop} color="#6b8f3f" boxSize={5} />}
              title="Flexible & Remote Work"
              text="Many of our roles are remote-friendly. We focus on output, not hours. Work where you do your best thinking."
            />
            <PerkCard
              icon={<Icon as={FaUserFriends} color="#6b8f3f" boxSize={5} />}
              title="Tight-Knit, Supportive Team"
              text="We're a small team that moves fast and supports each other. You'll have real ownership over your work from day one."
            />
            <PerkCard
              icon={<Icon as={FaHeart} color="#6b8f3f" boxSize={5} />}
              title="Health & Wellness Benefits"
              text="Health insurance, gym allowance, and mental wellness days. We walk the talk when it comes to healthy living."
            />
            <PerkCard
              icon={<Icon as={FaBriefcase} color="#6b8f3f" boxSize={5} />}
              title="Career Growth"
              text="We're scaling fast. Early team members grow with the company — many of our leads started in junior roles."
            />
            <PerkCard
              icon={<Icon as={FaClock} color="#6b8f3f" boxSize={5} />}
              title="Meaningful Impact"
              text="Every day your work helps real people eat better. That's a rare thing — and we don't take it for granted."
            />
          </SimpleGrid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── JOB LISTINGS ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 24 }}>
        <Container maxW="5xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">Open Roles</Heading>
            <Text color="gray.500" maxW="md">
              We're hiring across multiple teams. Don't see a perfect fit?{" "}
              <Box as="a" href="mailto:careers@healthybite.ng" color="#6b8f3f" fontWeight="semibold">
                Send us your CV anyway.
              </Box>
            </Text>
          </VStack>
          <VStack spacing={4} align="stretch">
            {jobs.map((job) => (
              <JobCard key={job.title} {...job} />
            ))}
          </VStack>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box bg="#6b8f3f" py={{ base: 16, md: 20 }} position="relative" overflow="hidden" textAlign="center">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="2xl">
          <VStack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} color="white" fontWeight="extrabold" lineHeight="shorter">
              Don't See Your Role?{" "}
              <Text as="span" color="#f2b233">Reach Out Anyway.</Text>
            </Heading>
            <Text color="whiteAlpha.800" fontSize={{ base: "md", md: "lg" }}>
              We're always looking for talented people who care about food and health. Drop us a line.
            </Text>
            <Button
              bg="#f2b233"
              color="white"
              size="lg"
              rounded="full"
              px={10}
              _hover={{ bg: "#e2a324", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              as="a"
              href="mailto:careers@healthybite.ng"
            >
              Email Us Your CV
            </Button>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}