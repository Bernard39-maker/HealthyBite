import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast({ title: "Please fill in all required fields.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Please log in to place an order.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            mealId: i._id,
            name: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount: total,
          address: form.address,
          phone: form.phone,
          customerName: form.name,
          note: form.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      clearCart();
      onClose();
      onSuccess();
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4} maxH="90vh">
        <ModalHeader borderBottom="1px solid" borderColor="gray.100" py={3}>
          <Text fontWeight="bold" fontSize="lg">Confirm Your Order</Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">{items.length} item(s) · ${total.toFixed(2)}</Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={4} overflowY="auto">
          {/* ── Two column layout on desktop ── */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
            {/* Left: delivery details */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Delivery Details</Text>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>Full name</FormLabel>
                <Input
                  size="sm"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  bg="gray.50" border="1px solid" borderColor="gray.200"
                  _hover={{ borderColor: "#6b8f3f" }}
                  _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                  rounded="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>Phone number</FormLabel>
                <Input
                  size="sm"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  bg="gray.50" border="1px solid" borderColor="gray.200"
                  _hover={{ borderColor: "#6b8f3f" }}
                  _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                  rounded="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>Delivery address</FormLabel>
                <Input
                  size="sm"
                  placeholder="123 Main St, Lagos"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  bg="gray.50" border="1px solid" borderColor="gray.200"
                  _hover={{ borderColor: "#6b8f3f" }}
                  _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                  rounded="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>
                  Delivery notes <Text as="span" color="gray.400">(optional)</Text>
                </FormLabel>
                <Textarea
                  size="sm"
                  placeholder="e.g. Leave at the gate, no spice..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  bg="gray.50" border="1px solid" borderColor="gray.200"
                  _hover={{ borderColor: "#6b8f3f" }}
                  _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f", bg: "white" }}
                  rounded="md"
                  rows={3}
                  resize="none"
                />
              </FormControl>
            </VStack>

            {/* Right: order summary */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Order Summary</Text>
              <Box bg="gray.50" rounded="xl" p={4} flex={1}>
                <VStack spacing={2} align="stretch">
                  {items.map((item) => (
                    <HStack key={item._id} justify="space-between">
                      <Text fontSize="xs" color="gray.600" noOfLines={1} flex={1}>{item.title} × {item.quantity}</Text>
                      <Text fontSize="xs" fontWeight="semibold" flexShrink={0}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </HStack>
                  ))}
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="sm" color="gray.800">Total</Text>
                    <Text fontWeight="extrabold" color="#6b8f3f" fontSize="lg">${total.toFixed(2)}</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.400" textAlign="center">Free delivery · Pay on delivery</Text>
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </ModalBody>

        <ModalFooter gap={2} borderTop="1px solid" borderColor="gray.100" py={3}>
          <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            bg="#6b8f3f"
            color="white"
            rounded="md"
            isLoading={loading}
            loadingText="Placing order…"
            _hover={{ bg: "#5a7a34" }}
            onClick={handleOrder}
            flex={1}
          >
            Place Order 🎉
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQty, total, count } = useCart();
  const { isOpen: checkoutOpen, onOpen: openCheckout, onClose: closeCheckout } = useDisclosure();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Please log in to place an order.", status: "warning", duration: 3000, isClosable: true });
      onClose();
      navigate("/auth");
      return;
    }
    openCheckout();
  };

  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      onClose();
    }, 3000);
    toast({
      title: "Order placed! 🎉",
      description: "We'll start preparing your meal right away.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="gray.100">
            <HStack spacing={2}>
              <Icon as={FaShoppingCart} color="#6b8f3f" />
              <Text fontWeight="bold">Your Cart</Text>
              {count > 0 && (
                <Box bg="#6b8f3f" color="white" rounded="full" px={2} py={0.5} fontSize="xs" fontWeight="bold">
                  {count}
                </Box>
              )}
            </HStack>
          </DrawerHeader>

          <DrawerBody py={4}>
            {orderSuccess ? (
              <Flex direction="column" align="center" justify="center" h="full" gap={4}>
                <Text fontSize="5xl">🎉</Text>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">Order Placed!</Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Your meal is being prepared. We'll deliver it fresh to your door!
                </Text>
              </Flex>
            ) : items.length === 0 ? (
              <Flex direction="column" align="center" justify="center" h="full" gap={4}>
                <Text fontSize="5xl">🛒</Text>
                <Text fontWeight="bold" color="gray.700">Your cart is empty</Text>
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  Add some delicious meals from our menu!
                </Text>
                <Button
                  size="sm"
                  bg="#6b8f3f"
                  color="white"
                  rounded="full"
                  _hover={{ bg: "#5a7a34" }}
                  onClick={onClose}
                >
                  Browse Menu
                </Button>
              </Flex>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <HStack key={item._id} spacing={3} align="start" p={3} bg="gray.50" rounded="xl">
                    <Image src={item.img} alt={item.title} w={16} h={16} rounded="lg" objectFit="cover" flexShrink={0} />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.800" noOfLines={1}>{item.title}</Text>
                      <Text fontSize="sm" fontWeight="bold" color="#6b8f3f">${(item.price * item.quantity).toFixed(2)}</Text>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Decrease"
                          icon={<Icon as={FaMinus} />}
                          size="xs"
                          rounded="full"
                          variant="outline"
                          borderColor="gray.300"
                          onClick={() => updateQty(item._id, item.quantity - 1)}
                        />
                        <Text fontSize="sm" fontWeight="bold" w={5} textAlign="center">{item.quantity}</Text>
                        <IconButton
                          aria-label="Increase"
                          icon={<Icon as={FaPlus} />}
                          size="xs"
                          rounded="full"
                          bg="#6b8f3f"
                          color="white"
                          _hover={{ bg: "#5a7a34" }}
                          onClick={() => updateQty(item._id, item.quantity + 1)}
                        />
                      </HStack>
                    </VStack>
                    <IconButton
                      aria-label="Remove"
                      icon={<Icon as={FaTrash} />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeItem(item._id)}
                    />
                  </HStack>
                ))}
              </VStack>
            )}
          </DrawerBody>

          {items.length > 0 && !orderSuccess && (
            <DrawerFooter borderTop="1px solid" borderColor="gray.100" flexDirection="column" gap={3}>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold" color="gray.700">Total</Text>
                <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f">${total.toFixed(2)}</Text>
              </HStack>
              <Button
                w="full"
                bg="#6b8f3f"
                color="white"
                size="lg"
                rounded="md"
                _hover={{ bg: "#5a7a34" }}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Text fontSize="xs" color="gray.400" textAlign="center">Free delivery on all orders · Pay on delivery</Text>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      <CheckoutModal isOpen={checkoutOpen} onClose={closeCheckout} onSuccess={handleOrderSuccess} />
    </>
  );
}