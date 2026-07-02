import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Flex,
  Icon,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  Collapse,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./shared/header";
import CartDrawer from "./CartDrawer";
import Footer from "./shared/footer";
import { FaLeaf, FaRegCalendar, FaTruck, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";

// ─── Types ───────
type Meal = {
  _id: string;
  title: string;
  content: string;
  price: number;
  img: string;
  category: string;
};

// ─── Meal Card ──────
function MealCard({title, content, price, img, onAdd, onView }: { _id: string; title: string; content: string; price: number; img: string; onAdd: () => void; onView: () => void }) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      shadow="md"
      p={4}
      transition="transform 0.2s, shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <Image src={img} alt={title} rounded="xl" w="100%" h="200px" objectFit="cover" mb={3} cursor="pointer" onClick={onView} />
      <Heading size="sm" textAlign="center" mb={2}>{title}</Heading>
      <Text color="gray.500" fontSize="sm" mb={3} noOfLines={2}>{content}</Text>
      <HStack justify="space-between" align="center">
        <Text fontWeight="bold" color="#6b8f3f" fontSize="lg">${price}</Text>
        <Button size="sm" bg="#f2b233" color="white" rounded="full" _hover={{ bg: "#e2a324" }} onClick={onAdd}>
          Add to Cart
        </Button>
      </HStack>
    </Box>
  );
}

// ─── Wave ─────
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

// ─── Feature Card ───────
function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <VStack
      spacing={4}
      align={{ base: "center", md: "start" }}
      textAlign={{ base: "center", md: "start" }}
      bg="white"
      rounded="2xl"
      p={6}
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-3px)", shadow: "md" }}
    >
      <Box>{icon}</Box>
      <Heading size="md">{title}</Heading>
      <Text color="gray.500" fontSize="sm">{text}</Text>
    </VStack>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: cartOpen, onOpen: openCart, onClose: closeCart } = useDisclosure();
  const { isOpen: detailOpen, onOpen: openDetail, onClose: closeDetail } = useDisclosure();
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [extraMeals, setExtraMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
   const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

fetch(`${apiBase}/api/meals`)
  .then((res) => res.json())
  .then((data: Meal[]) => {
    setPopularMeals(data.filter((m) => m.category === "popular"));
    setExtraMeals(data.filter((m) => m.category === "extra"));
  })
      .catch((err) => console.error(err))
      .finally(() => setMealsLoading(false));
  }, []);

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        bgImage="linear-gradient(rgba(107,143,63,0.88), rgba(107,143,63,0.88)), url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
      >
        <Container maxW="100%" px={{ base: 6, md: 20 }} py={{ base: 16, md: 24 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 10, md: 16 }} alignItems="center">
            <VStack align="start" spacing={6}>
              {/* Tag */}
              <Box bg="whiteAlpha.200" px={4} py={1} rounded="full" border="1px solid" borderColor="whiteAlpha.300">
                <Text fontSize="sm" fontWeight="semibold">🌿 Fresh · Healthy · Delivered</Text>
              </Box>

              <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="extrabold" lineHeight="shorter" letterSpacing="tight">
                Eat Healthy,<br />
                <Text as="span" color="#f2b233">Live Better</Text>
              </Heading>

              <Text fontSize={{ base: "md", md: "xl" }} maxW="md" color="whiteAlpha.900" lineHeight="tall">
                Nutritionist-crafted meals made with fresh ingredients, delivered straight to your door. No cooking, no hassle.
              </Text>

              <HStack spacing={4} flexWrap="wrap">
                {!isLoggedIn && (
                  <Button
                    bg="#f2b233"
                    color="white"
                    size="lg"
                    rounded="md"
                    px={8}
                    _hover={{ bg: "#e2a324", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    onClick={() => navigate("/auth")}
                  >
                    Get Started
                  </Button>
                )}
                <Button
                  as="a"
                  href="#meals"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  size="lg"
                  rounded="md"
                  px={8}
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  View Menu
                </Button>
              </HStack>

              {/* Social proof */}
              <HStack spacing={4} pt={2}>
                <HStack spacing={-2}>
                  {["sarah-hb", "mike-hb", "jane-hb"].map((u) => (
                    <Avatar key={u} size="sm" src={`https://i.pravatar.cc/40?u=${u}`} border="2px solid white" />
                  ))}
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="bold">2,400+ happy customers</Text>
                  <HStack spacing={0.5}>
                    {Array(5).fill("").map((_, i) => <Text key={i} color="#f2b233" fontSize="xs">★</Text>)}
                    <Text fontSize="xs" color="whiteAlpha.800" ml={1}>4.9/5</Text>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop"
                alt="Healthy meal"
                rounded="2xl"
                w="100%"
                maxH={{ base: "300px", md: "500px" }}
                objectFit="cover"
                shadow="2xl"
              />
              {/* Floating badge */}
              <Box
                position="absolute"
                bottom={4}
                left={4}
                bg="white"
                rounded="xl"
                px={4}
                py={3}
                shadow="lg"
              >
                <HStack spacing={2}>
                  <Text fontSize="xl">🥗</Text>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold" color="gray.800">Today's Special</Text>
                    <Text fontSize="xs" color="gray.500">Grilled Salmon Bowl</Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </Grid>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── FEATURES ── */}
      <Box id="features" bg="#fbfaf7" py={{ base: 16, md: 20 }} position="relative" overflow="hidden">
        <Container maxW="7xl" px={{ base: 6, md: 20 }} pb={{ base: 24, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">Why Choose HealthyBite?</Heading>
            <Text color="gray.500" maxW="md">Everything you need for a healthier lifestyle, without the effort.</Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }} mb={{ base: 20, md: 24 }}>
            <FeatureCard icon={<FaLeaf size={40} color="#6b8f3f" />} title="Fresh Ingredients" text="We source only the freshest, high-quality ingredients for every meal we prepare." />
            <FeatureCard icon={<FaRegCalendar size={40} color="#6b8f3f" />} title="Flexible Plans" text="Choose a meal plan that fits your lifestyle and budget — pause or cancel anytime." />
            <FeatureCard icon={<FaTruck size={40} color="#6b8f3f" />} title="Fast Delivery" text="Hot, fresh meals delivered reliably to your doorstep exactly when you need them." />
          </SimpleGrid>
        </Container>
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z" fill="#f6f3ee" height="160px" />
      </Box>

      {/* ── ABOUT ── */}
      <Box id="about" bg="#f6f3ee" position="relative" pb="120px">
        <Container maxW="7xl" py={20}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={12} alignItems="center">
            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop"
                alt="Chef preparing healthy meal"
                rounded="2xl"
                w="100%"
                maxH={{ base: "250px", md: "420px" }}
                objectFit="cover"
              />
              {/* Floating stat */}
              <Box position="absolute" top={4} right={4} bg="white" rounded="xl" px={4} py={3} shadow="lg">
                <VStack spacing={0} align="center">
                  <Text fontWeight="extrabold" fontSize="2xl" color="#6b8f3f">98%</Text>
                  <Text fontSize="xs" color="gray.500">Satisfaction Rate</Text>
                </VStack>
              </Box>
            </Box>

            <VStack align="start" spacing={5}>
              <Box bg="#f0f7e8" px={3} py={1} rounded="full">
                <Text fontSize="sm" color="#6b8f3f" fontWeight="semibold">About HealthyBite</Text>
              </Box>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} lineHeight="shorter">Healthy Eating,<br />Made Effortless</Heading>
              <Text color="gray.500" lineHeight="tall">
                At HealthyBite, we believe that eating well shouldn't be complicated. Our meals are crafted by professional nutritionists and chefs to give you a perfectly balanced diet — without the hassle of cooking or cleaning.
              </Text>
              <VStack align="start" spacing={3}>
                {[
                  "Nutritionist-approved recipes",
                  "Affordable plans for every budget",
                  "No cooking or cleaning required",
                  "Delivered fresh to your door daily",
                ].map((item) => (
                  <HStack key={item} spacing={3}>
                    <Box w={5} h={5} rounded="full" bg="#f0f7e8" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                      <Text fontSize="xs" color="#6b8f3f">✔</Text>
                    </Box>
                    <Text fontSize="sm" color="gray.600">{item}</Text>
                  </HStack>
                ))}
              </VStack>
              <Button bg="#6b8f3f" color="white" rounded="full" px={8} _hover={{ bg: "#5a7a34" }} onClick={() => navigate("/about")}>
                Start Eating Healthy
              </Button>
            </VStack>
          </Grid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── MEALS ── */}
      <Box id="meals" py={20} position="relative" overflow="hidden">
        <Wave d="M0,80 C360,20 1080,120 1440,60 L1440,0 L0,0 Z" fill="#e4c56a" position="top" height="120px" />

        <Container maxW="7xl" position="relative" zIndex={10}>
          <VStack spacing={10}>
            <VStack textAlign="center" spacing={2}>
              <Heading mt="0.1em" fontSize={{ base: "2xl", md: "3xl" }}>Our Most Popular Meals</Heading>
              <Text color="gray.500">Fresh, delicious, and loved by thousands of customers.</Text>
            </VStack>

            {mealsLoading ? (
              <Flex justify="center" py={10}>
                <Spinner size="xl" color="#6b8f3f" thickness="4px" />
              </Flex>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="100%">
                  {popularMeals.length > 0 ? (
                    popularMeals.map((meal) => (
                      <MealCard
                        key={meal._id}
                        {...meal}
                        onAdd={() => { addItem({ _id: meal._id, title: meal.title, price: meal.price, img: meal.img }); openCart(); }}
                        onView={() => { setSelectedMeal(meal); openDetail(); }}
                      />
                    ))
                  ) : (
                    <Text color="gray.400" fontSize="sm">No popular meals yet.</Text>
                  )}
                </SimpleGrid>

                <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
                  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} mt={8}>
                    {extraMeals.map((meal) => (
                      <MealCard
                        key={meal._id}
                        {...meal}
                        onAdd={() => { addItem({ _id: meal._id, title: meal.title, price: meal.price, img: meal.img }); openCart(); }}
                        onView={() => { setSelectedMeal(meal); openDetail(); }}
                      />
                    ))}
                  </SimpleGrid>
                </Collapse>

                {extraMeals.length > 0 && (
                  <Button
                    bg="#6b8f3f"
                    color="white"
                    rounded="full"
                    px={10}
                    size="lg"
                    position="relative"
                    zIndex={10}
                    onClick={onToggle}
                    _hover={{ bg: "#5a7a34" }}
                  >
                    {isOpen ? "Hide Full Menu" : "View Full Menu"}
                  </Button>
                )}
              </>
            )}
          </VStack>
        </Container>
        <Wave d="M0,60 C360,120 1080,0 1440,70 L1440,140 L0,140 Z" fill="#e4c56a" height="140px" />
      </Box>

      {/* ── TESTIMONIALS ── */}
      <Box bg="#fbfaf7" py={{ base: 16, md: 20 }}>
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">What Our Customers Say</Heading>
            <Text color="gray.500">Real stories from real people who changed how they eat.</Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[
              { name: "Sarah M.", location: "Lagos", text: "HealthyBite completely changed how I eat. The meals are delicious and fresh — I've lost 8 pounds in just 6 weeks!", avatar: "sarah-hb" },
              { name: "David O.", location: "Abuja", text: "I was skeptical at first but the quality is incredible. Delivery is always on time and the portions are perfect.", avatar: "david-hb" },
              { name: "Amira K.", location: "Port Harcourt", text: "Before HealthyBite I skipped meals because I had no time to cook. Now I eat better than ever and feel so energetic!", avatar: "amira-hb" },
            ].map((t) => (
              <Box key={t.name} bg="white" rounded="2xl" p={6} shadow="sm" border="1px solid" borderColor="gray.100">
                <Text color="#f2b233" fontSize="2xl" mb={3}>❝</Text>
                <Text color="gray.600" fontSize="sm" lineHeight="tall" mb={4} fontStyle="italic">{t.text}</Text>
                <HStack spacing={3}>
                  <Avatar size="sm" src={`https://i.pravatar.cc/40?u=${t.avatar}`} name={t.name} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm" color="gray.800">{t.name}</Text>
                    <Text fontSize="xs" color="gray.400">{t.location} · ⭐⭐⭐⭐⭐</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>



      <Footer />

      {/* Meal detail modal */}
      <Modal isOpen={detailOpen} onClose={closeDetail} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent rounded="lg" overflow="hidden">
          <ModalHeader>{selectedMeal?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMeal && (
              <VStack spacing={4} align="stretch">
                <Image src={selectedMeal.img} alt={selectedMeal.title} w="100%" h={{ base: "200px", md: "360px" }} objectFit="cover" rounded="md" />
                <Text color="gray.600">{selectedMeal.content}</Text>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="#6b8f3f" fontSize="xl">${selectedMeal.price}</Text>
                  <Button bg="#6b8f3f" color="white" onClick={() => { addItem({ _id: selectedMeal._id, title: selectedMeal.title, price: selectedMeal.price, img: selectedMeal.img }); openCart(); closeDetail(); }}>Add to Cart</Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeDetail}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Floating cart button ── */}
      <Box position="fixed" bottom={6} right={6} zIndex={300}>
        <Button
          bg="#6b8f3f"
          color="white"
          rounded="full"
          w={14}
          h={14}
          shadow="lg"
          _hover={{ bg: "#5a7a34", transform: "scale(1.05)" }}
          transition="all 0.2s"
          onClick={openCart}
          position="relative"
        >
          <Icon as={FaShoppingCart} boxSize={5} />
          {count > 0 && (
            <Box
              position="absolute"
              top={-1}
              right={-1}
              bg="#f2b233"
              color="white"
              rounded="full"
              w={5}
              h={5}
              fontSize="xs"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {count}
            </Box>
          )}
        </Button>
      </Box>

      <CartDrawer isOpen={cartOpen} onClose={closeCart} />
    </Box>
  );
}