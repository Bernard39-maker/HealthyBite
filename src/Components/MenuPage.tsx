import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { FaSearch, FaShoppingCart, FaLeaf } from "react-icons/fa";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import Header from "./shared/header";
import Footer from "./shared/footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  price: number;
};

type Category = { strCategory: string };
type Area = { strArea: string };

// ─── Price by category ───
const PRICE_MAP: Record<string, number> = {
  Seafood: 14.99, Beef: 13.99, Chicken: 12.99, Lamb: 15.99,
  Pork: 12.49, Pasta: 11.99, Vegetarian: 10.99, Vegan: 10.49,
  Dessert: 7.99, Breakfast: 9.99, Side: 6.99, Starter: 8.99,
  Goat: 14.49, Miscellaneous: 11.49,
};
const getPrice = (category: string) => PRICE_MAP[category] ?? 11.99;

// ─── Shuffle helper ─────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Meal detail modal ────────────────────────────────────────────────────────
function MealDetailModal({
  meal, isOpen, onClose, onAddToCart,
}: {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  const { addItem } = useCart();
  const toast = useToast();

  if (!meal) return null;

  const handleAdd = () => {
    addItem({ _id: meal.idMeal, title: meal.strMeal, price: meal.price, img: meal.strMealThumb });
    toast({ title: `${meal.strMeal} added to cart! 🛒`, status: "success", duration: 2000, isClosable: true });
    onClose();
    onAddToCart();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4} overflow="hidden">
        <Image src={meal.strMealThumb} alt={meal.strMeal} w="100%" h="220px" objectFit="cover" />
        <ModalCloseButton color="white" bg="blackAlpha.400" rounded="full" />
        <ModalHeader pb={1}>
          <Text fontWeight="bold" fontSize="xl">{meal.strMeal}</Text>
          <HStack spacing={2} mt={1} flexWrap="wrap">
            <Badge colorScheme="green" rounded="full">{meal.strCategory}</Badge>
            <Badge colorScheme="blue" rounded="full">{meal.strArea}</Badge>
            {meal.strTags && meal.strTags.split(",").slice(0, 2).map((t) => (
              <Badge key={t} colorScheme="orange" rounded="full">{t.trim()}</Badge>
            ))}
          </HStack>
        </ModalHeader>
        <ModalBody pb={6}>
          <Text fontSize="sm" color="gray.500" noOfLines={5} lineHeight="tall" mb={4}>
            {meal.strInstructions}
          </Text>
          <HStack justify="space-between" align="center">
            <Text fontWeight="extrabold" fontSize="2xl" color="#6b8f3f">${meal.price.toFixed(2)}</Text>
            <Button
              bg="#f2b233"
              color="white"
              rounded="md"
              leftIcon={<Icon as={FaShoppingCart} />}
              _hover={{ bg: "#e2a324" }}
              onClick={handleAdd}
            >
              Add to Cart
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// ─── Meal card ───────
function MealCard({ meal, onClick, onAddToCart }: { meal: Meal; onClick: () => void; onAddToCart: () => void }) {
  const { addItem } = useCart();
  const toast = useToast();

  return (
    <Box
      bg="white"
      rounded="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
      cursor="pointer"
      onClick={onClick}
    >
      <Box position="relative">
        <Image src={meal.strMealThumb} alt={meal.strMeal} w="100%" h="180px" objectFit="cover" />
        {meal.strArea && (
          <Badge position="absolute" top={2} left={2} bg="white" color="gray.700" rounded="full" px={2} fontSize="xs" shadow="sm">
            {meal.strArea}
          </Badge>
        )}
        {meal.strCategory && (
          <Badge position="absolute" top={2} right={2} bg="#6b8f3f" color="white" rounded="full" px={2} fontSize="xs">
            {meal.strCategory}
          </Badge>
        )}
      </Box>
      <Box p={4}>
        <Text fontWeight="bold" fontSize="sm" mb={1} noOfLines={1}>{meal.strMeal}</Text>
        <Text fontSize="xs" color="gray.400" mb={3} noOfLines={2}>{meal.strInstructions}</Text>
        <HStack justify="space-between" align="center">
          <Text fontWeight="extrabold" color="#6b8f3f">${meal.price.toFixed(2)}</Text>
          <Button
            size="xs"
            bg="#f2b233"
            color="white"
            rounded="full"
            _hover={{ bg: "#e2a324" }}
            onClick={(e) => {
              e.stopPropagation();
              addItem({ _id: meal.idMeal, title: meal.strMeal, price: meal.price, img: meal.strMealThumb });
              toast({ title: "Added to cart! 🛒", status: "success", duration: 1500, isClosable: true });
              onAddToCart();
            }}
          >
            Add to Cart
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MealSkeleton() {
  return (
    <Box bg="white" rounded="2xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
      <Skeleton h="180px" />
      <Box p={4}>
        <Skeleton h={4} mb={2} />
        <SkeletonText noOfLines={2} mb={3} />
        <Skeleton h={6} w="60%" />
      </Box>
    </Box>
  );
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Meal detail modal
  const { isOpen: mealOpen, onOpen: openMeal, onClose: closeMeal } = useDisclosure();
  // Cart drawer
  const { isOpen: cartOpen, onOpen: openCart, onClose: closeCart } = useDisclosure();

  const { count: cartCount } = useCart();

  // Fetch categories + areas once
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories.map((c: Category) => c.strCategory)));

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
      .then((r) => r.json())
      .then((d) => setAreas(d.meals.map((a: Area) => a.strArea)));
  }, []);

  // Fetch meals
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      if (search.trim()) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`);
        const data = await res.json();
        const raw = (data.meals || []).map((m: any) => ({ ...m, price: getPrice(m.strCategory) }));
        setMeals(raw);
        setLoading(false);
        return;
      }

      if (selectedCategory) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(selectedCategory)}`);
        const data = await res.json();
        const raw = (data.meals || []).slice(0, 20);
        const details = await Promise.all(
          raw.map((m: any) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
              .then((r) => r.json()).then((d) => d.meals?.[0])
          )
        );
        setMeals(details.filter(Boolean).map((m: any) => ({ ...m, price: getPrice(m.strCategory) })));
        setLoading(false);
        return;
      }

      if (selectedArea) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(selectedArea)}`);
        const data = await res.json();
        const raw = (data.meals || []).slice(0, 20);
        const details = await Promise.all(
          raw.map((m: any) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
              .then((r) => r.json()).then((d) => d.meals?.[0])
          )
        );
        setMeals(details.filter(Boolean).map((m: any) => ({ ...m, price: getPrice(m.strCategory) })));
        setLoading(false);
        return;
      }

      // ── Default: random mix every load ──
      const allCats = ["Chicken", "Seafood", "Vegetarian", "Beef", "Pasta", "Lamb", "Breakfast", "Dessert", "Goat", "Miscellaneous", "Pork", "Starter"];
      const allAreas = ["Nigerian", "Moroccan", "Indian", "Italian", "Japanese", "Chinese", "Mexican", "Jamaican", "French", "Greek", "Thai", "Egyptian", "Kenyan"];

      // Pick 4 random cats + 4 random areas each time
      const pickedCats = shuffle(allCats).slice(0, 4);
      const pickedAreas = shuffle(allAreas).slice(0, 4);

      const catPromises = pickedCats.map((c) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${c}`)
          .then((r) => r.json())
          .then((d) => shuffle(d.meals || []).slice(0, 4).map((m: any) => ({ ...m, strCategory: c, strArea: "", strInstructions: "Click to view details.", strTags: "", price: getPrice(c) })))
      );

      const areaPromises = pickedAreas.map((a) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`)
          .then((r) => r.json())
          .then((d) => shuffle(d.meals || []).slice(0, 3).map((m: any) => ({ ...m, strCategory: "", strArea: a, strInstructions: "Click to view details.", strTags: "", price: getPrice("Miscellaneous") })))
      );

      const [catResults, areaResults] = await Promise.all([Promise.all(catPromises), Promise.all(areaPromises)]);

      const allRaw = [...catResults.flat(), ...areaResults.flat()];
      const seen = new Set<string>();
      const unique = shuffle(allRaw).filter((m) => {
        if (seen.has(m.idMeal)) return false;
        seen.add(m.idMeal);
        return true;
      });

      setMeals(unique);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedArea]);

  useEffect(() => {
    const timer = setTimeout(fetchMeals, 400);
    return () => clearTimeout(timer);
  }, [fetchMeals]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? "" : cat);
    setSelectedArea("");
    setSearch("");
  };

  return (
    <Box minH="100vh" bg="#fbfaf7">
      <Header />

      {/* ── Hero ── */}
      <Box
        bgImage="linear-gradient(rgba(107,143,63,0.9), rgba(107,143,63,0.9)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        py={{ base: 12, md: 16 }}
        px={6}
      >
        <VStack spacing={4} textAlign="center" color="white">
          <HStack spacing={2}>
            <Icon as={FaLeaf} />
            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider">
              Explore Our Menu
            </Text>
          </HStack>
          <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="extrabold">
            Find Your Perfect Meal
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900" maxW="lg">
            Browse hundreds of healthy meals from around the world.
          </Text>
          <Box w="100%" maxW="500px" mt={2}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search meals e.g. Jollof, Pasta, Sushi..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedCategory(""); setSelectedArea(""); }}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
                rounded="xl"
                border="none"
                _focus={{ boxShadow: "0 0 0 3px rgba(242,178,51,0.4)" }}
              />
            </InputGroup>
          </Box>
        </VStack>
      </Box>

      <Container maxW="7xl" py={10} px={{ base: 4, md: 8 }}>
        {/* ── Filters ── */}
        <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}>
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedArea(""); setSearch(""); }}
            bg="white" rounded="lg" border="1px solid" borderColor="gray.200" maxW={{ md: "220px" }}
            _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Select
            placeholder="All Countries"
            value={selectedArea}
            onChange={(e) => { setSelectedArea(e.target.value); setSelectedCategory(""); setSearch(""); }}
            bg="white" rounded="lg" border="1px solid" borderColor="gray.200" maxW={{ md: "220px" }}
            _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
          >
            {areas.map((a, i) => <option key={`${a}-${i}`} value={a}>{a}</option>)}
          </Select>

          {(selectedCategory || selectedArea || search) && (
            <Button variant="outline" borderColor="gray.300" color="gray.500" rounded="lg"
              onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedArea(""); }}>
              Clear filters
            </Button>
          )}

          <Text fontSize="sm" color="gray.400" ml="auto">
            {loading ? "Loading..." : `${meals.length} meals found`}
          </Text>
        </Flex>

        {/* ── Category pills ── */}
        <Wrap spacing={2} mb={8}>
          {categories.map((cat) => (
            <WrapItem key={cat}>
              <Button
                size="sm" rounded="full"
                variant={selectedCategory === cat ? "solid" : "outline"}
                bg={selectedCategory === cat ? "#6b8f3f" : "white"}
                color={selectedCategory === cat ? "white" : "gray.600"}
                borderColor="gray.200"
                _hover={{ bg: selectedCategory === cat ? "#5a7a34" : "#f0f7e8", borderColor: "#6b8f3f", color: "#6b8f3f" }}
                onClick={() => handleCategoryClick(cat)}
                transition="all 0.15s"
              >
                {cat}
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        {/* ── Results ── */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {Array(8).fill("").map((_, i) => <MealSkeleton key={i} />)}
          </SimpleGrid>
        ) : meals.length === 0 ? (
          <VStack py={20} spacing={4} textAlign="center">
            <Text fontSize="5xl">🍽️</Text>
            <Heading size="md" color="gray.600">No meals found</Heading>
            <Text color="gray.400">Try a different search or category.</Text>
            <Button bg="#6b8f3f" color="white" rounded="full"
              onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedArea(""); }}>
              Show All Meals
            </Button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {meals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                onClick={() => { setSelectedMeal(meal); openMeal(); }}
                onAddToCart={openCart}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <MealDetailModal meal={selectedMeal} isOpen={mealOpen} onClose={closeMeal} onAddToCart={openCart} />

      <Footer />

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
          {cartCount > 0 && (
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
              {cartCount}
            </Box>
          )}
        </Button>
      </Box>

      <CartDrawer isOpen={cartOpen} onClose={closeCart} />
    </Box>
  );
}