import {
  Avatar,
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
  FaLeaf,
  FaHeart,
  FaStar,
  FaUserFriends,
  FaBoxOpen,
  FaAward,
} from "react-icons/fa";

// ─── Wave (reused from HomePage) ─────────────────────────────────────────────
type WaveProps = { d: string; fill: string; position?: "bottom" | "top"; height?: string | number };
function Wave({ d, fill, position = "bottom", height = "120px" }: WaveProps) {
  const isBottom = position === "bottom";
  const heightNumber = typeof height === "number" ? height : parseInt(String(height), 10) || 120;
  const heightCss = typeof height === "number" ? `${height}px` : height;
  return (
    <Box
      position="absolute"
      {...(isBottom ? { bottom: 0 } : { top: 0 })}
      left={0}
      w="100%"
      overflow="hidden"
      lineHeight={0}
      h={heightCss}
      pointerEvents="none"
    >
      <svg
        viewBox={`0 0 1440 ${heightNumber}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path d={d} fill={fill} />
      </svg>
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <VStack spacing={2} align="center">
      <Box
        w={14}
        h={14}
        rounded="2xl"
        bg="whiteAlpha.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={1}
      >
        {icon}
      </Box>
      <Heading fontSize="3xl" fontWeight="extrabold" color="white">
        {value}
      </Heading>
      <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
        {label}
      </Text>
    </VStack>
  );
}

// ─── Value Card ───────────────────────────────────────────────────────────────
function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <VStack
      spacing={4}
      align="start"
      bg="white"
      rounded="2xl"
      p={6}
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
    >
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
      <Heading size="sm" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.500" fontSize="sm" lineHeight="tall">
        {text}
      </Text>
    </VStack>
  );
}

// ─── Team Member Card ─────────────────────────────────────────────────────────
function TeamCard({
  name,
  role,
  bio,
  avatar,
}: {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}) {
  return (
    <VStack
      spacing={4}
      align="center"
      textAlign="center"
      bg="white"
      rounded="2xl"
      p={6}
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
    >
      <Avatar
        size="xl"
        src={avatar}
        name={name}
        border="4px solid"
        borderColor="#f0f7e8"
      />
      <VStack spacing={1}>
        <Heading size="sm" color="gray.800">
          {name}
        </Heading>
        <Text fontSize="xs" fontWeight="semibold" color="#6b8f3f" textTransform="uppercase" letterSpacing="wide">
          {role}
        </Text>
      </VStack>
      <Text color="gray.500" fontSize="sm" lineHeight="tall">
        {bio}
      </Text>
    </VStack>
  );
}

// ─── Timeline Step ────────────────────────────────────────────────────────────
function TimelineStep({
  year,
  title,
  text,
  isLast,
}: {
  year: string;
  title: string;
  text: string;
  isLast?: boolean;
}) {
  return (
    <HStack align="start" spacing={6}>
      {/* Line + dot */}
      <VStack spacing={0} flexShrink={0} align="center">
        <Box
          w={10}
          h={10}
          rounded="full"
          bg="#6b8f3f"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="xs" fontWeight="bold" color="white">
            {year}
          </Text>
        </Box>
        {!isLast && <Box w="2px" h="60px" bg="gray.200" />}
      </VStack>
      {/* Content */}
      <VStack align="start" spacing={1} pb={isLast ? 0 : 8}>
        <Heading size="sm" color="gray.800">
          {title}
        </Heading>
        <Text color="gray.500" fontSize="sm" lineHeight="tall">
          {text}
        </Text>
      </VStack>
    </HStack>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        bgImage="linear-gradient(rgba(107,143,63,0.92), rgba(107,143,63,0.92)), url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        pt={{ base: 20, md: 28 }}
        pb={{ base: 32, md: 40 }}
      >
        <Container maxW="4xl" textAlign="center">
          <Box
            display="inline-block"
            bg="whiteAlpha.200"
            px={4}
            py={1}
            rounded="full"
            border="1px solid"
            borderColor="whiteAlpha.300"
            mb={5}
          >
            <Text fontSize="sm" fontWeight="semibold">
              🌱 Our Story
            </Text>
          </Box>
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="extrabold"
            lineHeight="shorter"
            letterSpacing="tight"
            mb={5}
          >
            We're on a Mission to Make{" "}
            <Text as="span" color="#f2b233">
              Healthy Eating Effortless
            </Text>
          </Heading>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            color="whiteAlpha.900"
            maxW="2xl"
            mx="auto"
            lineHeight="tall"
          >
            HealthyBite was born from a simple belief: everyone deserves access to
            nourishing, delicious food — without the stress of cooking or the guilt
            of fast food.
          </Text>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── STORY SPLIT ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={{ base: 10, md: 20 }}
            alignItems="center"
          >
            {/* Image */}
            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"
                alt="Fresh healthy food preparation"
                rounded="2xl"
                w="100%"
                maxH={{ base: "280px", md: "460px" }}
                objectFit="cover"
                shadow="xl"
              />
              {/* Floating badge */}
              <Box
                position="absolute"
                bottom={5}
                right={5}
                bg="white"
                rounded="xl"
                px={4}
                py={3}
                shadow="lg"
              >
                <VStack spacing={0} align="center">
                  <Text fontWeight="extrabold" fontSize="2xl" color="#6b8f3f">
                    2019
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Founded
                  </Text>
                </VStack>
              </Box>
            </Box>

            {/* Text */}
            <VStack align="start" spacing={5}>
              <Box bg="#f0f7e8" px={3} py={1} rounded="full">
                <Text fontSize="sm" color="#6b8f3f" fontWeight="semibold">
                  How We Started
                </Text>
              </Box>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} lineHeight="shorter">
                From a Small Kitchen to
                <br />
                Thousands of Doorsteps
              </Heading>
              <Text color="gray.500" lineHeight="tall">
                HealthyBite began in a small Lagos kitchen in 2019. Founders Taiwo
                and Ngozi — a nutritionist and a chef — were frustrated that eating
                well meant either spending hours cooking or paying premium prices at
                health restaurants.
              </Text>
              <Text color="gray.500" lineHeight="tall">
                They started preparing meal boxes for friends and family. Word
                spread fast. Within six months, they were delivering to over 300
                households across Lagos. Today, HealthyBite operates in 5 cities
                and has served over 2,400 satisfied customers — and we're just
                getting started.
              </Text>
              <HStack spacing={3} flexWrap="wrap">
                <Button
                  bg="#6b8f3f"
                  color="white"
                  rounded="full"
                  px={7}
                  _hover={{ bg: "#5a7a34" }}
                  onClick={() => navigate("/auth")}
                >
                  Join Our Community
                </Button>
                <Button
                  variant="outline"
                  borderColor="#6b8f3f"
                  color="#6b8f3f"
                  rounded="full"
                  px={7}
                  _hover={{ bg: "#f0f7e8" }}
                  as="a"
                  href="#team"
                >
                  Meet the Team
                </Button>
              </HStack>
            </VStack>
          </Grid>
        </Container>
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z" fill="#6b8f3f" height="160px" />
      </Box>

      {/* ── STATS STRIP ── */}
      <Box bg="#6b8f3f" py={{ base: 14, md: 20 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
            <StatCard
              icon={<Icon as={FaUserFriends} color="white" boxSize={6} />}
              value="2,400+"
              label="Happy Customers"
            />
            <StatCard
              icon={<Icon as={FaBoxOpen} color="white" boxSize={6} />}
              value="48,000+"
              label="Meals Delivered"
            />
            <StatCard
              icon={<Icon as={FaStar} color="white" boxSize={6} />}
              value="4.9/5"
              label="Average Rating"
            />
            <StatCard
              icon={<Icon as={FaAward} color="white" boxSize={6} />}
              value="5"
              label="Cities Served"
            />
          </SimpleGrid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#f6f3ee" />
      </Box>

      {/* ── VALUES ── */}
      <Box bg="#f6f3ee" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#6b8f3f" position="top" height="80px" />
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
              What We Stand For
            </Heading>
            <Text color="gray.500" maxW="md">
              Our values guide every meal we prepare and every delivery we make.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <ValueCard
              icon={<Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />}
              title="Real Ingredients Only"
              text="No preservatives, no shortcuts. Every meal is made with whole, fresh ingredients sourced from trusted local farmers and suppliers."
            />
            <ValueCard
              icon={<Icon as={FaHeart} color="#6b8f3f" boxSize={5} />}
              title="Nutrition First"
              text="Every recipe is reviewed by our in-house nutritionists to ensure the perfect balance of macros, vitamins, and minerals for your body."
            />
            <ValueCard
              icon={<Icon as={FaUserFriends} color="#6b8f3f" boxSize={5} />}
              title="Community & Access"
              text="We believe healthy food shouldn't be a luxury. Our flexible plans are designed to be affordable and accessible to everyone."
            />
          </SimpleGrid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── JOURNEY / TIMELINE ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 24 }}>
        <Container maxW="4xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
              Our Journey So Far
            </Heading>
            <Text color="gray.500" maxW="md">
              From humble beginnings to a growing movement.
            </Text>
          </VStack>
          <Box>
            <TimelineStep
              year="'19"
              title="Founded in Lagos"
              text="Taiwo and Ngozi launch HealthyBite from their home kitchen, delivering to 50 friends and colleagues."
            />
            <TimelineStep
              year="'20"
              title="First 1,000 Customers"
              text="Despite a challenging year, demand surged as people prioritised home-delivered healthy meals."
            />
            <TimelineStep
              year="'21"
              title="Expanded to Abuja & Port Harcourt"
              text="Opened two new city hubs and launched our nutritionist-reviewed weekly meal plans."
            />
            <TimelineStep
              year="'23"
              title="Launched the HealthyBite App"
              text="Customers can now order, customise, and track deliveries in real time through our new platform."
            />
            <TimelineStep
              year="'25"
              title="2,400+ Customers & Growing"
              text="Serving five cities, 48,000+ meals delivered, and a 4.9-star average rating. The best is yet to come."
              isLast
            />
          </Box>
        </Container>
      </Box>

      {/* ── TEAM ── */}
      <Box id="team" bg="#f6f3ee" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
              Meet the Team
            </Heading>
            <Text color="gray.500" maxW="md">
              The passionate people behind every meal.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <TeamCard
              name="Taiwo Adeyemi"
              role="Co-Founder & CEO"
              bio="Certified nutritionist with 10+ years helping people build sustainable healthy habits through food."
              avatar="https://i.pravatar.cc/150?u=taiwo-hb"
            />
            <TeamCard
              name="Ngozi Okafor"
              role="Co-Founder & Head Chef"
              bio="Trained at Le Cordon Bleu. Ngozi leads our culinary team and personally reviews every new recipe."
              avatar="https://i.pravatar.cc/150?u=ngozi-hb"
            />
            <TeamCard
              name="Emeka Eze"
              role="Head of Operations"
              bio="Former logistics lead at a top e-commerce company. Emeka ensures every delivery arrives fresh and on time."
              avatar="https://i.pravatar.cc/150?u=emeka-hb"
            />
            <TeamCard
              name="Fatima Bello"
              role="Nutrition Scientist"
              bio="PhD in Food Science. Fatima ensures every meal meets the highest standards for health and balance."
              avatar="https://i.pravatar.cc/150?u=fatima-hb"
            />
          </SimpleGrid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#6b8f3f" />
      </Box>

      {/* ── CTA ── */}
      <Box
        bg="#6b8f3f"
        py={{ base: 16, md: 20 }}
        position="relative"
        overflow="hidden"
        textAlign="center"
      >
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#f6f3ee" position="top" height="80px" />
        <Container maxW="2xl">
          <VStack spacing={5}>
            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              color="white"
              fontWeight="extrabold"
              lineHeight="shorter"
            >
              Ready to Start Your
              <Text as="span" color="#f2b233">
                {" "}Healthy Journey?
              </Text>
            </Heading>
            <Text color="whiteAlpha.800" fontSize={{ base: "md", md: "lg" }}>
              Join 2,400+ customers eating better, feeling better, and loving every bite.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                bg="#f2b233"
                color="white"
                size="lg"
                rounded="full"
                px={10}
                _hover={{ bg: "#e2a324", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                onClick={() => navigate("/auth")}
              >
                Get Started Today
              </Button>
              <Button
                variant="outline"
                borderColor="white"
                color="white"
                size="lg"
                rounded="full"
                px={10}
                _hover={{ bg: "whiteAlpha.200" }}
                as="a"
                href="/#meals"
              >
                View Our Menu
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}