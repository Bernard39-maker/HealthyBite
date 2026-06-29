import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Header from "./shared/header";
import Footer from "./shared/footer";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaCheckCircle,
} from "react-icons/fa";

// ─── Wave ─────────────────────────────────────────────────────────────────────
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

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
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
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-3px)", shadow: "md" }}
      w="100%"
    >
      <Box
        w={11}
        h={11}
        rounded="xl"
        bg="#f0f7e8"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {icon}
      </Box>
      <Text fontWeight="bold" fontSize="sm" color="gray.800">{title}</Text>
      {lines.map((line) => (
        <Text key={line} fontSize="sm" color="gray.500" lineHeight="short">{line}</Text>
      ))}
    </VStack>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        bgImage="linear-gradient(rgba(107,143,63,0.92), rgba(107,143,63,0.92)), url('https://images.unsplash.com/photo-1423347834838-5162bb452ca4?q=80&w=1600&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        pt={{ base: 20, md: 28 }}
        pb={{ base: 32, md: 40 }}
        textAlign="center"
      >
        <Container maxW="3xl">
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
            <Text fontSize="sm" fontWeight="semibold">📬 We'd Love to Hear From You</Text>
          </Box>
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="extrabold"
            lineHeight="shorter"
            letterSpacing="tight"
            mb={5}
          >
            Get in{" "}
            <Text as="span" color="#f2b233">Touch</Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color="whiteAlpha.900" lineHeight="tall">
            Questions about your order? Want to partner with us? Or just want to say hello?
            We typically respond within a few hours.
          </Text>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── CONTACT INFO CARDS ── */}
      <Box bg="#fbfaf7" pt={{ base: 12, md: 20 }} pb={{ base: 4, md: 8 }}>
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5}>
            <InfoCard
              icon={<Icon as={FaMapMarkerAlt} color="#6b8f3f" boxSize={5} />}
              title="Our Office"
              lines={["12 Wellness Avenue,", "Victoria Island, Lagos"]}
            />
            <InfoCard
              icon={<Icon as={FaPhoneAlt} color="#6b8f3f" boxSize={5} />}
              title="Phone"
              lines={["+234 801 234 5678", "+234 901 234 5678"]}
            />
            <InfoCard
              icon={<Icon as={FaEnvelope} color="#6b8f3f" boxSize={5} />}
              title="Email"
              lines={["hello@healthybite.ng", "support@healthybite.ng"]}
            />
            <InfoCard
              icon={<Icon as={FaClock} color="#6b8f3f" boxSize={5} />}
              title="Working Hours"
              lines={["Mon – Sat: 7am – 9pm", "Sunday: 9am – 6pm"]}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── FORM + MAP ── */}
      <Box bg="#fbfaf7" py={{ base: 12, md: 20 }} position="relative" overflow="hidden">
        <Container maxW="7xl" px={{ base: 6, md: 20 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 10, md: 14 }} alignItems="start">

            {/* ── Form ── */}
            <Box bg="white" rounded="2xl" p={{ base: 6, md: 8 }} shadow="md" border="1px solid" borderColor="gray.100">
              {submitted ? (
                <VStack spacing={5} py={10} textAlign="center">
                  <Icon as={FaCheckCircle} color="#6b8f3f" boxSize={14} />
                  <Heading size="md" color="gray.800">Message Sent!</Heading>
                  <Text color="gray.500" fontSize="sm" maxW="xs">
                    Thanks for reaching out, {form.name.split(" ")[0]}! Our team will get back to you within a few hours.
                  </Text>
                  <Button
                    bg="#6b8f3f"
                    color="white"
                    rounded="full"
                    px={8}
                    _hover={{ bg: "#5a7a34" }}
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  >
                    Send Another Message
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={5} align="stretch">
                  <VStack align="start" spacing={1} mb={2}>
                    <Heading size="md" color="gray.800">Send Us a Message</Heading>
                    <Text fontSize="sm" color="gray.400">We'll get back to you as soon as possible.</Text>
                  </VStack>

                  <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" color="gray.600" mb={1}>Full Name</FormLabel>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Taiwo Adeyemi"
                        rounded="xl"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
                        fontSize="sm"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" color="gray.600" mb={1}>Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        rounded="xl"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
                        fontSize="sm"
                      />
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600" mb={1}>Subject</FormLabel>
                    <Select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Select a topic"
                      rounded="xl"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
                      fontSize="sm"
                    >
                      <option value="order">Order Issue</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="meals">Meal Plans</option>
                      <option value="partnership">Partnership / Business</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="gray.600" mb={1}>Message</FormLabel>
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      rounded="xl"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
                      fontSize="sm"
                      rows={5}
                      resize="none"
                    />
                  </FormControl>

                  {error && (
                    <Box bg="red.50" border="1px solid" borderColor="red.200" rounded="xl" px={4} py={3}>
                      <Text fontSize="sm" color="red.600">{error}</Text>
                    </Box>
                  )}

                  <Button
                    bg="#6b8f3f"
                    color="white"
                    rounded="full"
                    size="lg"
                    w="100%"
                    _hover={{ bg: "#5a7a34" }}
                    onClick={handleSubmit}
                    isLoading={loading}
                    loadingText="Sending…"
                    isDisabled={!form.name || !form.email || !form.message}
                  >
                    Send Message
                  </Button>
                </VStack>
              )}
            </Box>

            {/* ── Right column: map + socials + WhatsApp ── */}
            <VStack spacing={6} align="stretch">
              {/* Map embed */}
              <Box rounded="2xl" overflow="hidden" shadow="md" border="1px solid" borderColor="gray.100" h="300px">
                <iframe
                  title="HealthyBite Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7282894741507!2d3.4208!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjUnNDEuMiJOIDPCsDI1JzE0LjkiRQ!5e0!3m2!1sen!2sng!4v1680000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>

              {/* WhatsApp CTA */}
              <Box
                bg="#25D366"
                rounded="2xl"
                p={5}
                shadow="sm"
                cursor="pointer"
                as="a"
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                display="block"
              >
                <HStack spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    rounded="xl"
                    bg="whiteAlpha.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon as={FaWhatsapp} color="white" boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color="white" fontSize="sm">Chat on WhatsApp</Text>
                    <Text color="whiteAlpha.800" fontSize="xs">
                      Fastest way to reach us — we reply in minutes.
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Social links */}
              <Box bg="white" rounded="2xl" p={5} shadow="sm" border="1px solid" borderColor="gray.100">
                <Text fontWeight="bold" fontSize="sm" color="gray.800" mb={4}>
                  Follow Us
                </Text>
                <VStack spacing={3} align="stretch">
                  {[
                    { icon: FaInstagram, label: "@healthybite.ng", color: "#E1306C", href: "https://instagram.com" },
                    { icon: FaTwitter, label: "@HealthyBiteNG", color: "#1DA1F2", href: "https://twitter.com" },
                    { icon: FaFacebook, label: "HealthyBite Nigeria", color: "#1877F2", href: "https://facebook.com" },
                  ].map(({ icon, label, color, href }) => (
                    <HStack
                      key={label}
                      spacing={3}
                      as="a"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      p={3}
                      rounded="xl"
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                    >
                      <Box
                        w={9}
                        h={9}
                        rounded="lg"
                        bg={`${color}18`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Icon as={icon} color={color} boxSize={4} />
                      </Box>
                      <Text fontSize="sm" color="gray.700" fontWeight="medium">{label}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </Container>
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z" fill="#6b8f3f" height="160px" />
      </Box>

      {/* ── FAQ STRIP ── */}
      <Box bg="#6b8f3f" py={{ base: 14, md: 20 }} position="relative" overflow="hidden">
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" fill="#fbfaf7" position="top" height="80px" />
        <Container maxW="5xl" px={{ base: 6, md: 20 }}>
          <VStack spacing={3} mb={10} textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="white">
              Quick Answers
            </Heading>
            <Text color="whiteAlpha.800" maxW="md">
              Most questions are answered here. Still need help? Send us a message above.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {[
              {
                q: "How do I track my order?",
                a: "Once your order is placed, you'll receive an SMS and email with a live tracking link.",
              },
              {
                q: "Can I change or cancel my order?",
                a: "Orders can be modified up to 2 hours before your delivery window. Contact us via WhatsApp for the fastest help.",
              },
              {
                q: "Do you cater to dietary restrictions?",
                a: "Yes! We offer vegan, gluten-free, low-carb, and diabetic-friendly options. Filter meals in your dashboard.",
              },
              {
                q: "What cities do you deliver to?",
                a: "We currently deliver in Lagos, Abuja, Port Harcourt, Ibadan, and Kano. More cities coming soon!",
              },
            ].map(({ q, a }) => (
              <Box key={q} bg="whiteAlpha.100" rounded="2xl" p={5} border="1px solid" borderColor="whiteAlpha.200">
                <Text fontWeight="bold" color="white" fontSize="sm" mb={2}>
                  {q}
                </Text>
                <Text color="whiteAlpha.800" fontSize="sm" lineHeight="tall">
                  {a}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      <Footer />
    </Box>
  );
}