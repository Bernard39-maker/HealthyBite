import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./shared/header";
import Footer from "./shared/footer";
import { FaSearch, FaClock, FaArrowRight } from "react-icons/fa";

type WaveProps = { d: string; fill: string; position?: "bottom" | "top"; height?: string | number };
function Wave({ d, fill, position = "bottom", height = "120px" }: WaveProps) {
  const isBottom = position === "bottom";
  const heightNumber = typeof height === "number" ? height : parseInt(String(height), 10) || 120;
  const heightCss = typeof height === "number" ? `${height}px` : height;
  return (
    <Box position="absolute" {...(isBottom ? { bottom: 0 } : { top: 0 })} left={0} w="100%" overflow="hidden" lineHeight={0} h={heightCss} pointerEvents="none">
      <svg viewBox={`0 0 1440 ${heightNumber}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <path d={d} fill={fill} />
      </svg>
    </Box>
  );
}

const categories = ["All", "Nutrition", "Recipes", "Wellness", "Meal Prep", "Weight Loss"];

const posts = [
  { id: 1, title: "10 High-Protein Meals That Actually Taste Amazing", excerpt: "Tired of bland chicken and broccoli? These protein-packed meals are as delicious as they are nutritious — and we deliver all of them.", category: "Nutrition", readTime: "5 min read", date: "May 28, 2026", img: "https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=800&auto=format&fit=crop", author: "Fatima Bello", avatar: "https://i.pravatar.cc/40?u=fatima-hb", featured: true },
  { id: 2, title: "Why Meal Prepping on Sundays Is the Secret to a Healthy Week", excerpt: "A structured Sunday routine can completely transform how you eat from Monday to Friday. Here's exactly how to do it.", category: "Meal Prep", readTime: "7 min read", date: "May 20, 2026", img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop", author: "Ngozi Okafor", avatar: "https://i.pravatar.cc/40?u=ngozi-hb" },
  { id: 3, title: "The Truth About Carbs: What Nigerian Diets Get Right", excerpt: "Carbohydrates have a bad reputation, but traditional Nigerian staples like ofada rice and unripe plantain are actually excellent choices.", category: "Nutrition", readTime: "6 min read", date: "May 14, 2026", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", author: "Fatima Bello", avatar: "https://i.pravatar.cc/40?u=fatima-hb" },
  { id: 4, title: "How to Lose Weight Without Skipping Meals", excerpt: "Calorie restriction doesn't work long-term. Here's the science-backed approach our nutritionists recommend for sustainable weight loss.", category: "Weight Loss", readTime: "8 min read", date: "May 7, 2026", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop", author: "Taiwo Adeyemi", avatar: "https://i.pravatar.cc/40?u=taiwo-hb" },
  { id: 5, title: "5 Quick Smoothie Recipes for Busy Mornings", excerpt: "When you're rushing out the door, these five smoothies take under 3 minutes and give you serious energy to start your day.", category: "Recipes", readTime: "4 min read", date: "Apr 29, 2026", img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop", author: "Ngozi Okafor", avatar: "https://i.pravatar.cc/40?u=ngozi-hb" },
  { id: 6, title: "Sleep, Stress, and Eating: The Surprising Connection", excerpt: "Poor sleep doesn't just make you tired — it changes what you crave and how your body stores fat. Here's what to do about it.", category: "Wellness", readTime: "6 min read", date: "Apr 22, 2026", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop", author: "Fatima Bello", avatar: "https://i.pravatar.cc/40?u=fatima-hb" },
];

function PostCard({ title, excerpt, category, readTime, date, img, author, avatar }: typeof posts[0]) {
  return (
    <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden" transition="transform 0.2s, box-shadow 0.2s" _hover={{ transform: "translateY(-4px)", shadow: "md" }}>
      <Image src={img} alt={title} w="100%" h="200px" objectFit="cover" />
      <VStack align="start" spacing={3} p={5}>
        <HStack>
          <Badge bg="#f0f7e8" color="#6b8f3f" rounded="full" px={3} py={0.5} fontSize="xs" fontWeight="semibold">{category}</Badge>
          <HStack spacing={1}><Icon as={FaClock} color="gray.300" boxSize={3} /><Text fontSize="xs" color="gray.400">{readTime}</Text></HStack>
        </HStack>
        <Heading size="sm" color="gray.800" lineHeight="short" noOfLines={2}>{title}</Heading>
        <Text color="gray.500" fontSize="sm" lineHeight="tall" noOfLines={2}>{excerpt}</Text>
        <HStack justify="space-between" w="100%" pt={1}>
          <HStack spacing={2}>
            <Avatar size="xs" src={avatar} name={author} />
            <Text fontSize="xs" color="gray.500">{author} · {date}</Text>
          </HStack>
          <Icon as={FaArrowRight} color="#6b8f3f" boxSize={3.5} />
        </HStack>
      </VStack>
    </Box>
  );
}

export default function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const featured = posts.find((p) => p.featured);
  const filtered = posts
    .filter((p) => !p.featured)
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box w="100%">
      <Header />

      {/* Hero */}
      <Box color="white" position="relative" overflow="hidden" bgImage="linear-gradient(rgba(107,143,63,0.92), rgba(107,143,63,0.92)), url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1600&auto=format&fit=crop')" bgSize="cover" bgPosition="center" pt={{ base: 20, md: 28 }} pb={{ base: 32, md: 40 }} textAlign="center">
        <Container maxW="3xl">
          <Box display="inline-block" bg="whiteAlpha.200" px={4} py={1} rounded="full" border="1px solid" borderColor="whiteAlpha.300" mb={5}>
            <Text fontSize="sm" fontWeight="semibold">📖 The HealthyBite Blog</Text>
          </Box>
          <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="extrabold" lineHeight="shorter" letterSpacing="tight" mb={5}>
            Eat Smarter,{" "}<Text as="span" color="#f2b233">Live Better</Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color="whiteAlpha.900" lineHeight="tall" mb={8}>
            Nutrition tips, healthy recipes, and wellness insights from our team of experts.
          </Text>
          {/* Search */}
          <InputGroup maxW="md" mx="auto">
            <InputLeftElement pointerEvents="none" h="100%">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              color="gray.800"
              rounded="full"
              border="none"
              _placeholder={{ color: "gray.400" }}
              _focus={{ boxShadow: "0 0 0 3px #f2b233" }}
              size="lg"
              pl={10}
            />
          </InputGroup>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      <Box bg="#fbfaf7" py={{ base: 12, md: 20 }} position="relative" overflow="hidden">
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>

          {/* Featured post */}
          {featured && (
            <Box mb={14}>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color="#6b8f3f" mb={4}>Featured Article</Text>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={0} rounded="2xl" overflow="hidden" shadow="lg" border="1px solid" borderColor="gray.100" bg="white" transition="transform 0.2s, box-shadow 0.2s" _hover={{ transform: "translateY(-4px)", shadow: "xl" }}>
                <Image src={featured.img} alt={featured.title} w="100%" h={{ base: "220px", md: "100%" }} objectFit="cover" />
                <VStack align="start" spacing={4} p={8} justify="center">
                  <HStack>
                    <Badge bg="#f0f7e8" color="#6b8f3f" rounded="full" px={3} py={0.5} fontSize="xs" fontWeight="semibold">{featured.category}</Badge>
                    <HStack spacing={1}><Icon as={FaClock} color="gray.300" boxSize={3} /><Text fontSize="xs" color="gray.400">{featured.readTime}</Text></HStack>
                  </HStack>
                  <Heading fontSize={{ base: "xl", md: "2xl" }} color="gray.800" lineHeight="shorter">{featured.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="tall">{featured.excerpt}</Text>
                  <HStack spacing={2}>
                    <Avatar size="sm" src={featured.avatar} name={featured.author} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700">{featured.author}</Text>
                      <Text fontSize="xs" color="gray.400">{featured.date}</Text>
                    </VStack>
                  </HStack>
                  <Button bg="#6b8f3f" color="white" rounded="full" px={7} size="sm" _hover={{ bg: "#5a7a34" }} rightIcon={<FaArrowRight />}>Read Article</Button>
                </VStack>
              </Grid>
            </Box>
          )}

          {/* Category filter */}
          <HStack spacing={2} mb={8} flexWrap="wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                rounded="full"
                px={5}
                bg={activeCategory === cat ? "#6b8f3f" : "white"}
                color={activeCategory === cat ? "white" : "gray.600"}
                border="1px solid"
                borderColor={activeCategory === cat ? "#6b8f3f" : "gray.200"}
                _hover={{ bg: activeCategory === cat ? "#5a7a34" : "gray.50" }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </HStack>

          {/* Posts grid */}
          {filtered.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filtered.map((post) => <PostCard key={post.id} {...post} />)}
            </SimpleGrid>
          ) : (
            <VStack py={16} spacing={3} textAlign="center">
              <Text fontSize="3xl">🥗</Text>
              <Heading size="sm" color="gray.600">No articles found</Heading>
              <Text color="gray.400" fontSize="sm">Try a different search or category.</Text>
            </VStack>
          )}
        </Container>
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z" fill="#6b8f3f" height="160px" />
      </Box>

      {/* Newsletter CTA */}
      <Box bg="#6b8f3f" py={{ base: 14, md: 20 }} position="relative" overflow="hidden" textAlign="center">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="2xl">
          <VStack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="white" fontWeight="extrabold">
              Never Miss a{" "}<Text as="span" color="#f2b233">Healthy Tip</Text>
            </Heading>
            <Text color="whiteAlpha.800">Get our best articles and recipes delivered straight to your inbox every week.</Text>
            <Button bg="#f2b233" color="white" size="lg" rounded="full" px={10} _hover={{ bg: "#e2a324", transform: "translateY(-1px)" }} transition="all 0.2s" onClick={() => navigate("#footer")}>
              Subscribe below ↓
            </Button>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}