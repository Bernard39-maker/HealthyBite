import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Collapse,
  useDisclosure,
  // Link,
} from "@chakra-ui/react";
import Header from "./shared/header";
import Footer from "./shared/footer";
import { Link } from "react-router-dom";

import { FaRegCalendar, FaTruckFast, FaClock } from "react-icons/fa6";export default function HomePage() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box w="100%" overflowX="hidden">
      <Header />
      {/* HERO */}
      <Box bg="#6b8f3f" color="white" position="relative" overflow="hidden">
        <Container
          maxW="100%"
          px={{ base: 6, md: 20 }}
          py={{ base: 12, md: 20 }}
        >
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={{ base: 10, md: 16 }}
            alignItems="center"
          >
            {/* Text */}
            <VStack align="start" spacing={5}>
              <Heading
                fontSize={{ base: "3xl", md: "6xl" }}
                fontWeight="bold"
                lineHeight="short"
              >
                Eat Healthy,
                <br />
                Live Better
              </Heading>
              <Text fontSize={{ base: "md", md: "2xl" }} maxW="md">
                Delicious and nutritious meals delivered right to your door.
              </Text>
              <HStack spacing={4}>
                <Button
                  bg="#f2b233"
                  color="white"
                  size="lg"
                  rounded="md"
                  _hover={{ bg: "#e2a324" }}
                >
                  Get Started
                </Button>

                <Button
                  as={Link}
                  to="#meal"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  size="lg"
                  cursor={"pointer"}
                  rounded="md"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  View Menu
                </Button>
              </HStack>
            </VStack>

            {/* Hero Image */}
            <Image
              src="https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop"
              alt="Healthy meal"
              rounded="2xl"
              w="100%"
              maxH={{ base: "300px", md: "500px" }}
              objectFit="cover"
            />
          </Grid>
        </Container>

        {/* Hero → Features Wave */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          w="100%"
          overflow="hidden"
          lineHeight={0}
          h="120px"
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z"
              fill="#fbfaf7"
            />
          </svg>
        </Box>
      </Box>

      {/* FEATURES */}
      <Box
        id="features"
        bg="#fbfaf7"
        py={{ base: 16, md: 0 }} // more top/bottom space on mobile
        position="relative"
        overflow="hidden"
      >
        <Container
          maxW="7xl"
          px={{ base: 6, md: 20 }}
          pb={{ base: 24, md: 2 }} // generous bottom padding – prevents cut-off
        >
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 12, md: 16 }}
            mb={{ base: 20, md: 24 }} // extra margin below grid
          >
{/* Feature 1: Fresh Ingredients */}
<VStack
  spacing={5}
  align={{ base: "center", md: "start" }}
  textAlign={{ base: "center", md: "start" }}
>
  <FaTruckFast size={48} color="#6b8f3f" />
  <Heading size="md">Fresh Ingredients</Heading>
  <Text color="gray.600" maxW="sm">
    We use only the freshest, high-quality ingredients in every meal.
  </Text>
</VStack>

{/* Feature 2: Flexible Plans */}
<VStack
  spacing={5}
  align={{ base: "center", md: "start" }}
  textAlign={{ base: "center", md: "start" }}
>
  <FaRegCalendar size={48} color="#6b8f3f" />
  <Heading size="md">Flexible Plans</Heading>
  <Text color="gray.600" maxW="sm">
    Choose a meal plan that fits your lifestyle — cancel anytime.
  </Text>
</VStack>

{/* Feature 3: Fast Delivery */}
<VStack
  spacing={5}
  align={{ base: "center", md: "start" }}
  textAlign={{ base: "center", md: "start" }}
>
  <FaClock size={48} color="#6b8f3f" />
  <Heading size="md">Fast Delivery</Heading>
  <Text color="gray.600" maxW="sm">
    Enjoy quick and reliable meal delivery to your doorstep.
  </Text>
</VStack>
          </SimpleGrid>

          {/* Wave – taller & smoother on mobile */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width="100%"
            height={{ base: "160px", md: "140px" }} // even taller on small screens
            overflow="hidden"
            lineHeight={0}
          >
            <svg
              viewBox="0 0 1440 180"
              preserveAspectRatio="none"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <path
                d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z"
                fill="#f6f3ee"
              />
            </svg>
          </Box>
        </Container>
      </Box>

      {/* ABOUT */}
      <Box id="about" bg="#f6f3ee" position="relative">
        <Container maxW="7xl" py={20}>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={12}
            alignItems="center"
          >
            {/* About Image */}
            <Image
              src="woman.png"
              alt="Woman preparing healthy meal"
              rounded="2xl"
              w="100%"
              maxH={{ base: "250px", md: "400px" }}
              objectFit="cover"
            />

            {/* About Text */}
            <VStack align="start" spacing={4}>
              <Heading>Healthy Eating Made Easy</Heading>
              <Text color="gray.600">
                At HealthyBite, we believe that eating healthy should be simple
                and convenient. Our meals are crafted by professional
                nutritionists and chefs to ensure you get a balanced diet
                without the hassle of cooking.
              </Text>
              <VStack align="start" spacing={2}>
                <Text>✔ Nutritionist-approved meals</Text>
                <Text>✔ Affordable plans for everyone</Text>
                <Text>✔ No cooking or cleaning required</Text>
              </VStack>
              <Button bg="#6b8f3f" color="white" rounded="full" px={8}>
                Learn More
              </Button>
            </VStack>
          </Grid>

          {/* About → Meals Wave */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="100%"
            overflow="hidden"
            lineHeight={0}
            h="120px"
          >
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <path
                d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z"
                fill="#fbfaf7"
              />
            </svg>
          </Box>
        </Container>
      </Box>

      <Box
        id="meals"
        // bg="#fbfaf7"
        py={20}
        position="relative"
        overflow="hidden"
      >
        {/* Curved top wave – decorative, same color family */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h={{ base: "80px", md: "150px" }}
          overflow="hidden"
          pointerEvents="none"
          zIndex={1}
        >
          <svg
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              d="M0,80 C360,20 1080,120 1440,60 L1440,0 L0,0 Z"
              fill="#e4c56a"
            />
          </svg>
        </Box>

        <Container maxW="7xl" position={"relative"} zIndex={"10000"}>
          <VStack spacing={10}>
            <VStack>
              <Heading mt={".1em"}>Our Most Popular Meals</Heading>
              <Text color="gray.600">
                Delicious and healthy meals loved by our customers.
              </Text>
            </VStack>

            {/* Popular meals - always visible */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
              {[
                {
                  title: "Grilled Chicken Bowl",
                  content:
                    "Grilled chicken, brown rice, broccoli, cherry tomatoes, and avocado",
                  price: "$12.99",
                  img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                },
                {
                  title: "Salmon & Quinoa",
                  content:
                    "Roasted salmon, quinoa, asparagus and mixed greens.",
                  price: "$13.99",
                  img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                },
                {
                  title: "Vegan Buddha Bowl",
                  content:
                    "Chickpea, quinoa, avocado, sweet potatoes, and mixed veggies",
                  price: "$11.99",
                  img: "https://donutfollowthecrowd.com/wp-content/uploads/2024/12/Sweet-Potato-Quinoa-Bowl3.jpg",
                },
                {
                  title: "Turkey & Sweet Potato",
                  content:
                    "Lean ground turkey, roasted sweet potatoes, and green beans",
                  price: "$11.99",
                  img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                },
              ].map((meal) => (
                <Box
                  key={meal.title}
                  bg="white"
                  rounded="2xl"
                  shadow="md"
                  p={4}
                >
                  <Image
                    src={meal.img}
                    alt={meal.title}
                    rounded="2xl"
                    w="100%"
                    h="200px"
                    objectFit="cover"
                    mb={3}
                  />
                  <Heading size="md" textAlign="center" mb={2}>
                    {meal.title}
                  </Heading>
                  <Text fontWeight="normal" mb={3} noOfLines={2}>
                    {meal.content}
                  </Text>
                  <Text fontWeight="bold" mb={3}>
                    {meal.price}
                  </Text>
                  <Button w="full" bg="#f2b233" color="white" rounded="full">
                    Order Now
                  </Button>
                </Box>
              ))}
            </SimpleGrid>

            {/* Toggle section for full menu */}
            <Collapse in={isOpen} animateOpacity>
              <VStack spacing={10} mt={12}>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
                  {[
                    {
                      title: "Shrimp Avocado Bowl",
                      content:
                        "Grilled shrimp, avocado, cucumber, edamame, and sesame dressing",
                      price: "$14.49",
                      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                    },
                    {
                      title: "Beef Stir-Fry Bowl",
                      content:
                        "Lean beef, bell peppers, broccoli, carrots, and brown rice",
                      price: "$13.49",
                      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                    },
                    {
                      title: "Mediterranean Falafel Bowl",
                      content:
                        "Falafel, hummus, tabbouleh, feta, olives, and tahini",
                      price: "$12.49",
                      img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                    },
                    {
                      title: "Tofu Veggie Power Bowl",
                      content:
                        "Crispy tofu, kale, roasted beets, quinoa, and lemon tahini",
                      price: "$11.49",
                      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=400&q=80",
                    },
                  ].map((meal) => (
                    <Box
                      key={meal.title}
                      bg="white"
                      rounded="2xl"
                      shadow="md"
                      p={4}
                    >
                      <Image
                        src={meal.img}
                        alt={meal.title}
                        rounded="2xl"
                        w="100%"
                        h="200px"
                        objectFit="cover"
                        mb={3}
                      />
                      <Heading size="md" textAlign="center" mb={2}>
                        {meal.title}
                      </Heading>
                      <Text fontWeight="normal" mb={3} noOfLines={2}>
                        {meal.content}
                      </Text>
                      <Text fontWeight="bold" mb={3}>
                        {meal.price}
                      </Text>
                      <Button
                        w="full"
                        bg="#f2b233"
                        color="white"
                        rounded="full"
                      >
                        Order Now
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Collapse>
            <Box
              position="absolute"
              bottom={0}
              left={0}
              w="100%"
              h={{ base: "80px", md: "150px" }}
              overflow="hidden"
              pointerEvents="none"
              zIndex={1}
            >
              <svg
                viewBox="0 0 1440 140"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%" }}
              >
                <path
                  d="M0,60 C360,120 1080,0 1440,70 L1440,140 L0,140 Z"
                  fill="#e4c56a"
                />
              </svg>
            </Box>

            {/* The toggle button */}
            <Button
              position={"relative"}
              bg="#6b8f3f"
              color="white"
              rounded="full"
              mt={"-0.1em"}
              px={10}
              size="lg"
              zIndex={"10000"}
              onClick={onToggle}
            >
              {isOpen ? "Hide Full Menu" : "View Full Menu"}
            </Button>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
