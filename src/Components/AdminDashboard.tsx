import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
  Select,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartBar,
  FaLeaf,
  FaSignOutAlt,
  FaTrash,
  FaUser,
  FaUsers,
  FaUtensils,
  FaEdit,
  FaPlus,
  FaShieldAlt,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const API = "http://localhost:5000/api/admin";
const token = () => localStorage.getItem("token") || "";
const authHeader = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <Box bg="white" rounded="xl" shadow="sm" p={5} border="1px solid" borderColor="gray.100">
      <HStack justify="space-between" mb={3}>
        <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>
        <Flex w={9} h={9} rounded="lg" bg={`${color}.50`} align="center" justify="center">
          <Icon as={icon} color={`${color}.500`} boxSize={4} />
        </Flex>
      </HStack>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800">{value}</Text>
    </Box>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "yellow", confirmed: "blue", delivered: "green", cancelled: "red",
  };
  return <Badge colorScheme={map[status] || "gray"} rounded="full" px={2}>{status}</Badge>;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Meal modal
  const { isOpen: mealOpen, onOpen: openMeal, onClose: closeMeal } = useDisclosure();
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [mealForm, setMealForm] = useState({ title: "", content: "", price: "", img: "", category: "popular" });

  const fetchData = async (sec: string) => {
    setLoading(true);
    try {
      if (sec === "overview") {
        const res = await fetch(`${API}/stats`, { headers: authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } else if (sec === "users") {
        const res = await fetch(`${API}/users`, { headers: authHeader() });
        setUsers(await res.json());
      } else if (sec === "meals") {
        const res = await fetch(`${API}/meals`, { headers: authHeader() });
        setMeals(await res.json());
      } else if (sec === "orders") {
        const res = await fetch(`${API}/orders`, { headers: authHeader() });
        setOrders(await res.json());
      }
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(section); }, [section]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE", headers: authHeader() });
    setUsers(users.filter((u) => u._id !== id));
    toast({ title: "User deleted.", status: "success", duration: 2000, isClosable: true });
  };

  const handleToggleAdmin = async (id: string) => {
    const res = await fetch(`${API}/users/${id}/toggle-admin`, { method: "PATCH", headers: authHeader() });
    const data = await res.json();
    setUsers(users.map((u) => u._id === id ? { ...u, isAdmin: data.isAdmin } : u));
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Delete this meal?")) return;
    await fetch(`${API}/meals/${id}`, { method: "DELETE", headers: authHeader() });
    setMeals(meals.filter((m) => m._id !== id));
    toast({ title: "Meal deleted.", status: "success", duration: 2000, isClosable: true });
  };

  const handleSaveMeal = async () => {
    const method = editingMeal ? "PUT" : "POST";
    const url = editingMeal ? `${API}/meals/${editingMeal._id}` : `${API}/meals`;
    const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify({ ...mealForm, price: Number(mealForm.price) }) });
    const data = await res.json();
    if (editingMeal) {
      setMeals(meals.map((m) => m._id === editingMeal._id ? data : m));
    } else {
      setMeals([data, ...meals]);
    }
   closeMeal();
    toast({ title: editingMeal ? "Meal updated." : "Meal added.", status: "success", duration: 2000, isClosable: true });
    fetchData("meals"); 
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const res = await fetch(`${API}/orders/${id}/status`, { method: "PATCH", headers: authHeader(), body: JSON.stringify({ status }) });
    const data = await res.json();
    setOrders(orders.map((o) => o._id === id ? { ...o, status: data.status } : o));
  };

  const navItems = [
    { id: "overview", label: "Overview",  icon: FaChartBar },
    { id: "users",    label: "Users",     icon: FaUsers    },
    { id: "meals",    label: "Meals",     icon: FaUtensils },
    { id: "orders",   label: "Orders",    icon: FaBoxOpen  },
  ];

  return (
    <Flex minH="100vh" bg="#f7f8fa">

      {/* ── Sidebar ── */}
      <Box
        w={{ base: "60px", md: "220px" }}
        bg="#1e3a0f"
        py={6}
        px={{ base: 2, md: 4 }}
        position="sticky"
        top={0}
        h="100vh"
        display="flex"
        flexDirection="column"
      >
        {/* Logo */}
        <HStack spacing={2} mb={10} px={2} display={{ base: "none", md: "flex" }}>
          <Icon as={FaLeaf} color="#f2b233" boxSize={5} />
          <Text fontWeight="extrabold" fontSize="lg" color="white" letterSpacing="tight">
            Healthy<Text as="span" color="#f2b233">Bite</Text>
          </Text>
        </HStack>
        <Box display={{ base: "flex", md: "none" }} justifyContent="center" mb={8}>
          <Icon as={FaLeaf} color="#f2b233" boxSize={6} />
        </Box>

        {/* Nav */}
        <VStack spacing={1} align="stretch" flex={1}>
          {navItems.map((item) => (
            <HStack
              key={item.id}
              spacing={3}
              px={3}
              py={2.5}
              rounded="lg"
              cursor="pointer"
              bg={section === item.id ? "whiteAlpha.200" : "transparent"}
              color={section === item.id ? "white" : "whiteAlpha.600"}
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
              transition="all 0.15s"
              onClick={() => setSection(item.id)}
              justify={{ base: "center", md: "start" }}
            >
              <Icon as={item.icon} boxSize={4} flexShrink={0} />
              <Text fontSize="sm" fontWeight="medium" display={{ base: "none", md: "block" }}>{item.label}</Text>
            </HStack>
          ))}
        </VStack>

        {/* Bottom */}
        <VStack spacing={1} align="stretch">
          <HStack
            spacing={3}
            px={3}
            py={2.5}
            rounded="lg"
            cursor="pointer"
            color="whiteAlpha.500"
            _hover={{ bg: "whiteAlpha.100", color: "white" }}
            transition="all 0.15s"
            onClick={() => navigate("/")}
            justify={{ base: "center", md: "start" }}
          >
            <Icon as={FaSignOutAlt} boxSize={4} />
            <Text fontSize="sm" display={{ base: "none", md: "block" }}>Back to site</Text>
          </HStack>
        </VStack>
      </Box>

      {/* ── Main content ── */}
      <Box flex={1} p={{ base: 4, md: 8 }} overflowY="auto">

        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={0}>
            <Heading fontSize="xl" color="gray.800" fontWeight="bold">
              {navItems.find((n) => n.id === section)?.label || "Dashboard"}
            </Heading>
            <Text fontSize="sm" color="gray.400">HealthyBite Admin Panel</Text>
          </VStack>
          <HStack spacing={3}>
            <Avatar size="sm" bg="#6b8f3f" icon={<Icon as={FaUser} />} />
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" display={{ base: "none", md: "block" }}>Admin</Text>
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="60vh">
            <Spinner size="xl" color="#6b8f3f" thickness="4px" />
          </Flex>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {section === "overview" && stats && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <StatCard label="Total Users"   value={stats.totalUsers}                       icon={FaUsers}    color="blue"   />
                  <StatCard label="Total Meals"   value={stats.totalMeals}                       icon={FaUtensils} color="green"  />
                  <StatCard label="Total Orders"  value={stats.totalOrders}                      icon={FaBoxOpen}  color="orange" />
                  <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`}    icon={FaChartBar} color="purple" />
                </SimpleGrid>

                {/* Orders chart */}
                <Box bg="white" rounded="xl" shadow="sm" p={6} border="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.700" mb={4}>Orders — Last 7 Days</Text>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stats.ordersByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#6b8f3f" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {/* Revenue chart */}
                <Box bg="white" rounded="xl" shadow="sm" p={6} border="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.700" mb={4}>Revenue — Last 7 Days</Text>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.ordersByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#f2b233" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* Top meals */}
                <Box bg="white" rounded="xl" shadow="sm" p={6} border="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.700" mb={4}>Top Ordered Meals</Text>
                  <VStack spacing={3} align="stretch">
                    {stats.topMeals.map((m: any, i: number) => (
                      <HStack key={m._id} justify="space-between">
                        <HStack spacing={3}>
                          <Flex w={7} h={7} rounded="full" bg="#f0f7e8" align="center" justify="center">
                            <Text fontSize="xs" fontWeight="bold" color="#6b8f3f">{i + 1}</Text>
                          </Flex>
                          <Text fontSize="sm" color="gray.700">{m.name || "Unknown meal"}</Text>
                        </HStack>
                        <Badge colorScheme="green">{m.count} orders</Badge>
                      </HStack>
                    ))}
                    {stats.topMeals.length === 0 && <Text fontSize="sm" color="gray.400">No orders yet.</Text>}
                  </VStack>
                </Box>
              </VStack>
            )}

            {/* ── USERS ── */}
            {section === "users" && (
              <Box bg="white" rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
                <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.700">All Users ({users.length})</Text>
                </Box>
                <Box overflowX="auto">
                  <Table size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Joined</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((u) => (
                        <Tr key={u._id} _hover={{ bg: "gray.50" }}>
                          <Td>
                            <HStack spacing={2}>
                              <Avatar size="xs" name={u.name} bg="#6b8f3f" color="white" />
                              <Text fontSize="sm" fontWeight="medium">{u.name || "—"}</Text>
                            </HStack>
                          </Td>
                          <Td fontSize="sm" color="gray.600">{u.email}</Td>
                          <Td>
                            <Badge colorScheme={u.isAdmin ? "green" : "gray"} rounded="full">
                              {u.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </Td>
                          <Td fontSize="sm" color="gray.500">{new Date(u.createdAt).toLocaleDateString()}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="Toggle admin"
                                icon={<Icon as={FaShieldAlt} />}
                                size="xs"
                                colorScheme={u.isAdmin ? "green" : "gray"}
                                variant="ghost"
                                onClick={() => handleToggleAdmin(u._id)}
                              />
                              <IconButton
                                aria-label="Delete user"
                                icon={<Icon as={FaTrash} />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDeleteUser(u._id)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}

            {/* ── MEALS ── */}
            {section === "meals" && (
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">All Meals ({meals.length})</Text>
                  <Button
                    size="sm"
                    bg="#6b8f3f"
                    color="white"
                    leftIcon={<Icon as={FaPlus} />}
                    _hover={{ bg: "#5a7a34" }}
                    onClick={() => {
                      setEditingMeal(null);
                      setMealForm({ title: "", content: "", price: "", img: "", category: "popular" });
                      openMeal();
                    }}
                  >
                    Add Meal
                  </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {meals.map((m) => (
                    <Box key={m._id} bg="white" rounded="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
                      <Image src={m.img} alt={m.title} h="140px" w="100%" objectFit="cover" />
                      <Box p={4}>
                        <Text fontWeight="bold" fontSize="sm" mb={1}>{m.title}</Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={2} mb={2}>{m.content}</Text>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="#6b8f3f">${m.price}</Text>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Edit"
                              icon={<Icon as={FaEdit} />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => {
                                setEditingMeal(m);
                                setMealForm({ title: m.title, content: m.content, price: m.price, img: m.img, category: m.category });
                                openMeal();
                              }}
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<Icon as={FaTrash} />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteMeal(m._id)}
                            />
                          </HStack>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* ── ORDERS ── */}
            {section === "orders" && (
              <Box bg="white" rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
                <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.700">All Orders ({orders.length})</Text>
                </Box>
                <Box overflowX="auto">
                  <Table size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Customer</Th>
                        <Th>Items</Th>
                        <Th>Total</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                        <Th>Update</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orders.map((o) => (
                        <Tr key={o._id} _hover={{ bg: "gray.50" }}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">{o.userId?.name || "Guest"}</Text>
                              <Text fontSize="xs" color="gray.400">{o.userId?.email}</Text>
                            </VStack>
                          </Td>
                          <Td fontSize="sm" color="gray.600">{o.items?.length} item(s)</Td>
                          <Td fontSize="sm" fontWeight="bold" color="#6b8f3f">${o.totalAmount?.toFixed(2)}</Td>
                          <Td><StatusBadge status={o.status} /></Td>
                          <Td fontSize="xs" color="gray.400">{new Date(o.createdAt).toLocaleDateString()}</Td>
                          <Td>
                            <Select
                              size="xs"
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              rounded="md"
                              w="120px"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </Select>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* ── Meal Modal ── */}
      <Modal isOpen={mealOpen} onClose={closeMeal} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent rounded="2xl">
          <ModalHeader>{editingMeal ? "Edit Meal" : "Add New Meal"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Title</FormLabel>
                <Input size="sm" rounded="md" value={mealForm.title} onChange={(e) => setMealForm({ ...mealForm, title: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Description</FormLabel>
                <Input size="sm" rounded="md" value={mealForm.content} onChange={(e) => setMealForm({ ...mealForm, content: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Price ($)</FormLabel>
                <Input size="sm" rounded="md" type="number" value={mealForm.price} onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Image URL</FormLabel>
                <Input size="sm" rounded="md" value={mealForm.img} onChange={(e) => setMealForm({ ...mealForm, img: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Category</FormLabel>
                <Select size="sm" rounded="md" value={mealForm.category} onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}>
                  <option value="popular">Popular</option>
                  <option value="extra">Extra</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" variant="ghost" onClick={closeMeal}>Cancel</Button>
            <Button size="sm" bg="#6b8f3f" color="white" _hover={{ bg: "#5a7a34" }} onClick={handleSaveMeal}>
              {editingMeal ? "Save Changes" : "Add Meal"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}