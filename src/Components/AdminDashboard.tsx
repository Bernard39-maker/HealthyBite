import {
  Avatar,
  Box,
  Button,
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
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaLeaf,
  FaSignOutAlt,
  FaTrash,
  FaUsers,
  FaUtensils,
  FaEdit,
  FaPlus,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaSearch,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

  type Meal = {
    _id?: string;
    title?: string;
    content?: string;
    price?: number | string;
    img?: string;
    category?: string;
    name?: string;
    count?: number;
  };

  type User = {
    _id?: string;
    name?: string;
    email?: string;
    isAdmin?: boolean;
    createdAt?: string;
  };

  type Order = {
    _id?: string;
    userId?: { name?: string; email?: string } | string;
    items?: unknown[];
    totalAmount?: number;
    status?: string;
    createdAt?: string;
  };

  type Stats = {
    totalUsers?: number;
    totalMeals?: number;
    totalOrders?: number;
    totalRevenue?: number;
    ordersByDay?: Array<{ _id?: string; count?: number; revenue?: number }>;
    topMeals?: Array<{ _id?: string; name?: string; count?: number }>;
  };

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ADMIN_API = `${API}/api/admin`;

const getToken = () => localStorage.getItem("token") || "";

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// ─── Tokens ────────
const C = {
  forest:   "#1a2e0a",
  green:    "#6b8f3f",
  greenLt:  "#8fb85a",
  amber:    "#f2b233",
  amberLt:  "#fcd97a",
  bg:       "#f5f6f8",
  card:     "#ffffff",
  border:   "#eaecef",
  text:     "#1a1f2e",
  muted:    "#8a93a2",
  danger:   "#e53e3e",
};

// ─── Sidebar nav items ──────
const NAV = [
  { id: "overview", label: "Overview",  icon: FaChartLine },
  { id: "meals",    label: "Meals",     icon: FaUtensils  },
  { id: "orders",   label: "Orders",    icon: FaBoxOpen   },
  { id: "users",    label: "Users",     icon: FaUsers     },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n?: number) {
  const v = typeof n === "number" ? n : 0;
  return v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(1)}K`
    : String(v);
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function Pill({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    pending:   ["#7c4d00", "#fff3cd"],
    confirmed: ["#1a56db", "#e1effe"],
    delivered: ["#166534", "#dcfce7"],
    cancelled: ["#9b1c1c", "#fee2e2"],
  };
  const [color, bg] = map[status] || ["#374151", "#f3f4f6"];
  return (
    <Box display="inline-flex" alignItems="center" gap="6px" px={3} py="3px" rounded="full" bg={bg}>
      <Box w="6px" h="6px" rounded="full" bg={color} flexShrink={0} />
      <Text fontSize="11px" fontWeight="700" color={color} textTransform="capitalize" letterSpacing="0.02em">
        {status}
      </Text>
    </Box>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string; value: string; sub?: string; accent: string; icon: React.ElementType;
}) {
  return (
    <Box
      bg={C.card} rounded="20px" p={6}
      border="1px solid" borderColor={C.border}
      position="relative" overflow="hidden"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
    >
      {/* bg blob */}
      <Box
        position="absolute" bottom="-24px" right="-24px"
        w="96px" h="96px" rounded="full"
        bg={accent} opacity={0.08}
        pointerEvents="none"
      />
      <Flex justify="space-between" align="start">
        <Box>
          <Text fontSize="12px" fontWeight="600" color={C.muted} textTransform="uppercase" letterSpacing="0.06em" mb={3}>
            {label}
          </Text>
          <Text fontSize="32px" fontWeight="800" color={C.text} lineHeight={1} mb={1}>
            {value}
          </Text>
          {sub && <Text fontSize="12px" color={C.muted}>{sub}</Text>}
        </Box>
        <Flex
          w="48px" h="48px" rounded="14px" align="center" justify="center"
          bg={accent} flexShrink={0}
        >
          <Icon as={icon} color="white" boxSize="18px" />
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg={C.card} border="1px solid" borderColor={C.border}
      rounded="12px" px={4} py={3}
      boxShadow="0 8px 24px rgba(0,0,0,0.1)"
    >
      <Text fontSize="11px" color={C.muted} mb={1}>{label}</Text>
      {payload.map((p) => (
        <Text key={p.name} fontSize="14px" fontWeight="700" color={p.color || C.green}>
          {p.name === "revenue" ? `₦${Number(p.value).toLocaleString()}` : `${p.value} orders`}
        </Text>
      ))}
    </Box>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function Empty({ emoji, msg }: { emoji: string; msg: string }) {
  return (
    <Flex direction="column" align="center" justify="center" py={16} gap={3}>
      <Text fontSize="40px">{emoji}</Text>
      <Text fontSize="14px" color={C.muted}>{msg}</Text>
    </Flex>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [section, setSection]               = useState("overview");
  const [stats, setStats]                   = useState<Stats | null>(null);
  const [users, setUsers]                   = useState<User[]>([]);
  const [meals, setMeals]                   = useState<Meal[]>([]);
  const [orders, setOrders]                 = useState<Order[]>([]);
  const [loading, setLoading]               = useState(false);
  const [collapsed, setCollapsed]           = useState(false);
  const [mealSearch, setMealSearch]         = useState("");
  const [orderSearch, setOrderSearch]       = useState("");
  const [userSearch, setUserSearch]         = useState("");
  const [orderPage, setOrderPage]           = useState(1);
  const [mealPage, setMealPage]             = useState(1);
  const PAGE = 8;

  const navigate = useNavigate();
  const toast    = useToast();

  const { isOpen: mealOpen, onOpen: openMeal, onClose: closeMeal } = useDisclosure();
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealForm, setMealForm]       = useState({
    title: "", content: "", price: "", img: "", category: "popular",
  });
  const [saving, setSaving] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (sec: string) => {
    setLoading(true);
    try {
      const map: Record<string, string> = {
        overview: `${ADMIN_API}/stats`,
        users:    `${ADMIN_API}/users`,
        meals:    `${ADMIN_API}/meals`,
        orders:   `${ADMIN_API}/orders`,
      };
      const res  = await fetch(map[sec], { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load.");
      if (sec === "overview") setStats(data);
      if (sec === "users")    setUsers(Array.isArray(data) ? data : []);
      if (sec === "meals")    setMeals(Array.isArray(data) ? data : []);
      if (sec === "orders")   setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchData(section); }, [section, fetchData]);

  // ── Meal CRUD ───
  const openAddMeal = () => {
    setEditingMeal(null);
    setMealForm({ title: "", content: "", price: "", img: "", category: "popular" });
    openMeal();
  };

  const openEditMeal = (m: Meal) => {
    setEditingMeal(m);
    setMealForm({ title: m.title || "", content: m.content || "", price: String(m.price || ""), img: m.img || "", category: m.category || "popular" });
    openMeal();
  };

  const handleSaveMeal = async () => {
    if (!mealForm.title || !mealForm.price) {
      toast({ title: "Title and price are required.", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    setSaving(true);
    try {
      const method = editingMeal ? "PUT" : "POST";
      const url    = editingMeal ? `${ADMIN_API}/meals/${editingMeal._id}` : `${ADMIN_API}/meals`;
      const res    = await fetch(url, {
        method,
        headers: authHeader(),
        body: JSON.stringify({ ...mealForm, price: Number(mealForm.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      if (editingMeal) setMeals((prev) => prev.map((m) => m._id === editingMeal._id ? data : m));
      else             setMeals((prev) => [data, ...prev]);
      closeMeal();
      toast({ title: editingMeal ? "Meal updated ✓" : "Meal added ✓", status: "success", duration: 2000, isClosable: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this meal?")) return;
    await fetch(`${ADMIN_API}/meals/${id}`, { method: "DELETE", headers: authHeader() });
    setMeals((prev) => prev.filter((m) => m._id !== id));
    toast({ title: "Meal deleted.", status: "success", duration: 2000, isClosable: true });
  };

  // ── User actions ──────────────────────────────────────────────────────────
  const handleDeleteUser = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this user?")) return;
    await fetch(`${ADMIN_API}/users/${id}`, { method: "DELETE", headers: authHeader() });
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast({ title: "User deleted.", status: "success", duration: 2000, isClosable: true });
  };

  const handleToggleAdmin = async (id?: string) => {
    if (!id) return;
    const res  = await fetch(`${ADMIN_API}/users/${id}/toggle-admin`, { method: "PATCH", headers: authHeader() });
    const data = await res.json();
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isAdmin: data.isAdmin } : u));
  };

  // ── Order status ────
  const handleOrderStatus = async (id?: string, status?: string) => {
    if (!id || !status) return;
    const res  = await fetch(`${ADMIN_API}/orders/${id}/status`, {
      method: "PATCH", headers: authHeader(), body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: data.status } : o));
  };

  // ── Filtered + paginated lists ────────────────────────────────────────────
  const filteredMeals  = meals.filter((m) =>
    m.title?.toLowerCase().includes(mealSearch.toLowerCase())
  );
  const filteredOrders = orders.filter((o) => {
    const name = typeof o.userId === 'object' && o.userId ? (o.userId.name || '') : '';
    const email = typeof o.userId === 'object' && o.userId ? (o.userId.email || '') : '';
    return name.toLowerCase().includes(orderSearch.toLowerCase()) || email.toLowerCase().includes(orderSearch.toLowerCase());
  });
  const filteredUsers  = users.filter((u) =>
    (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const mealPages  = Math.ceil(filteredMeals.length / PAGE) || 1;
  const orderPages = Math.ceil(filteredOrders.length / PAGE) || 1;
  const pagedMeals  = filteredMeals.slice((mealPage  - 1) * PAGE, mealPage  * PAGE);
  const pagedOrders = filteredOrders.slice((orderPage - 1) * PAGE, orderPage * PAGE);

  // ── Sidebar width ──────
  const SW = collapsed ? "72px" : "232px";

  return (
    <Flex minH="100vh" bg={C.bg} fontFamily="'Inter', system-ui, sans-serif">

      {/* ════════════════ SIDEBAR ════════════════ */}
      <Box
        w={SW} bg={C.forest} h="100vh"
        position="fixed" top={0} left={0}
        display="flex" flexDirection="column"
        transition="width 0.22s cubic-bezier(0.4,0,0.2,1)"
        zIndex={200} overflow="hidden"
      >
        {/* Logo row */}
        <Flex
          align="center" h="72px" px={collapsed ? 0 : 5}
          justify={collapsed ? "center" : "space-between"}
          borderBottom="1px solid" borderColor="whiteAlpha.100"
          flexShrink={0}
        >
          {!collapsed && (
            <HStack spacing={2}>
              <Flex w="28px" h="28px" rounded="8px" bg={C.green} align="center" justify="center">
                <Icon as={FaLeaf} color="white" boxSize="13px" />
              </Flex>
              <Text fontWeight="800" fontSize="15px" color="white" letterSpacing="-0.02em">
                Healthy<Text as="span" color={C.amber}>Bite</Text>
              </Text>
            </HStack>
          )}
          <IconButton
            aria-label="toggle"
            icon={<Icon as={collapsed ? FaChevronRight : FaChevronLeft} boxSize="11px" />}
            size="xs" variant="ghost" color="whiteAlpha.400"
            _hover={{ color: "white", bg: "whiteAlpha.100" }}
            rounded="8px"
            onClick={() => setCollapsed(!collapsed)}
          />
        </Flex>

        {/* Nav */}
        <VStack spacing="2px" align="stretch" flex={1} pt={4} px={collapsed ? 2 : 3} overflow="hidden">
          {NAV.map(({ id, label, icon }) => {
            const active = section === id;
            return (
              <Flex
                key={id}
                align="center" justify={collapsed ? "center" : "start"}
                gap={3} px={collapsed ? 0 : 3} py="10px"
                rounded="12px" cursor="pointer"
                bg={active ? "whiteAlpha.150" : "transparent"}
                color={active ? "white" : "whiteAlpha.500"}
                position="relative"
                _hover={{ bg: "whiteAlpha.100", color: "white" }}
                transition="all 0.15s"
                onClick={() => setSection(id)}
              >
                {active && (
                  <Box
                    position="absolute" left={0} top="20%" bottom="20%"
                    w="3px" rounded="full" bg={C.green}
                  />
                )}
                <Icon as={icon} boxSize="15px" flexShrink={0} />
                {!collapsed && (
                  <Text fontSize="13px" fontWeight={active ? "700" : "500"} letterSpacing="-0.01em">
                    {label}
                  </Text>
                )}
              </Flex>
            );
          })}
        </VStack>

        {/* Bottom actions */}
        <VStack spacing="2px" px={collapsed ? 2 : 3} pb={5} flexShrink={0}>
          <Flex
            align="center" justify={collapsed ? "center" : "start"}
            gap={3} px={collapsed ? 0 : 3} py="10px" rounded="12px" cursor="pointer"
            color="whiteAlpha.400" _hover={{ bg: "whiteAlpha.100", color: "white" }}
            transition="all 0.15s" onClick={() => navigate("/")}
          >
            <Icon as={FaHome} boxSize="14px" />
            {!collapsed && <Text fontSize="13px" fontWeight="500">Back to site</Text>}
          </Flex>
          <Flex
            align="center" justify={collapsed ? "center" : "start"}
            gap={3} px={collapsed ? 0 : 3} py="10px" rounded="12px" cursor="pointer"
            color="whiteAlpha.400" _hover={{ bg: "red.900", color: "red.300" }}
            transition="all 0.15s"
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
          >
            <Icon as={FaSignOutAlt} boxSize="14px" />
            {!collapsed && <Text fontSize="13px" fontWeight="500">Logout</Text>}
          </Flex>
        </VStack>
      </Box>

      {/* ════════════════ MAIN ════════════════ */}
      <Box flex={1} ml={SW} transition="margin-left 0.22s cubic-bezier(0.4,0,0.2,1)" minH="100vh">

        {/* Top bar */}
        <Flex
          h="72px" bg={C.card} px={8}
          align="center" justify="space-between"
          borderBottom="1px solid" borderColor={C.border}
          position="sticky" top={0} zIndex={99}
        >
          <Box>
            <Text fontSize="18px" fontWeight="800" color={C.text} letterSpacing="-0.03em">
              {NAV.find((n) => n.id === section)?.label || "Dashboard"}
            </Text>
            <Text fontSize="12px" color={C.muted}>HealthyBite Admin</Text>
          </Box>
          <HStack spacing={3}>
            <Box
              px={3} py={2} rounded="10px" bg={C.bg}
              border="1px solid" borderColor={C.border}
              display={{ base: "none", md: "block" }}
            >
              <Text fontSize="12px" color={C.muted}>
                {new Date().toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}
              </Text>
            </Box>
            <Flex
              align="center" gap={2} px={3} py={2}
              rounded="12px" border="1px solid" borderColor={C.border}
              bg={C.bg} cursor="default"
            >
              <Avatar size="xs" name="Bernard" bg={C.green} color="white" />
              <Box display={{ base: "none", md: "block" }}>
                <Text fontSize="12px" fontWeight="700" color={C.text} lineHeight={1.2}>Bernard</Text>
                <Text fontSize="10px" color={C.muted}>Super Admin</Text>
              </Box>
            </Flex>
          </HStack>
        </Flex>

        {/* Page content */}
        <Box p={{ base: 4, md: 8 }}>
          {loading ? (
            <Flex justify="center" align="center" h="60vh" direction="column" gap={4}>
              <Spinner size="lg" color={C.green} thickness="3px" speed="0.7s" />
              <Text fontSize="13px" color={C.muted}>Loading…</Text>
            </Flex>
          ) : (
            <>

              {/* ══════════ OVERVIEW ══════════ */}
              {section === "overview" && stats && (
                <VStack spacing={6} align="stretch">

                  {/* Stat cards */}
                  <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
                    <StatCard label="Total Users"   value={fmt(stats.totalUsers)}                         sub={`${stats.totalUsers} registered`}       accent={C.green}  icon={FaUsers}    />
                    <StatCard label="Menu Items"    value={fmt(stats.totalMeals)}                         sub="meals available"                         accent="#8b5cf6"  icon={FaUtensils} />
                    <StatCard label="Total Orders"  value={fmt(stats.totalOrders)}                        sub="all time"                                accent={C.amber}  icon={FaBoxOpen}  />
                    <StatCard label="Revenue"       value={`₦${fmt(stats.totalRevenue)}`}                 sub="total earned"                            accent="#0ea5e9"  icon={FaChartLine}/>
                  </SimpleGrid>

                  {/* Charts */}
                  <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4}>

                    {/* Orders area */}
                    <Box bg={C.card} rounded="20px" p={6} border="1px solid" borderColor={C.border}>
                      <Flex justify="space-between" align="center" mb={6}>
                        <Box>
                          <Text fontSize="14px" fontWeight="700" color={C.text}>Orders Trend</Text>
                          <Text fontSize="12px" color={C.muted}>Last 7 days</Text>
                        </Box>
                        <Box px={3} py={1} bg="#f0f7e8" rounded="full">
                          <Text fontSize="11px" fontWeight="700" color={C.green}>This week</Text>
                        </Box>
                      </Flex>
                      <ResponsiveContainer width="100%" height={190}>
                        <AreaChart data={stats.ordersByDay || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%"   stopColor={C.green} stopOpacity={0.18} />
                              <stop offset="100%" stopColor={C.green} stopOpacity={0}    />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                          <XAxis dataKey="_id" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTip />} />
                          <Area
                            type="monotone" dataKey="count" stroke={C.green} strokeWidth={2.5}
                            fill="url(#og)"
                            dot={{ r: 4, fill: C.green, stroke: "white", strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>

                    {/* Revenue bars */}
                    <Box bg={C.card} rounded="20px" p={6} border="1px solid" borderColor={C.border}>
                      <Flex justify="space-between" align="center" mb={6}>
                        <Box>
                          <Text fontSize="14px" fontWeight="700" color={C.text}>Revenue</Text>
                          <Text fontSize="12px" color={C.muted}>Last 7 days · NGN</Text>
                        </Box>
                        <Box px={3} py={1} bg="#fef9ec" rounded="full">
                          <Text fontSize="11px" fontWeight="700" color={C.amber}>₦ NGN</Text>
                        </Box>
                      </Flex>
                      <ResponsiveContainer width="100%" height={190}>
                        <BarChart data={stats.ordersByDay || []} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                          <XAxis dataKey="_id" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTip />} />
                          <Bar dataKey="revenue" fill={C.amber} radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>

                  {/* Top meals */}
                  <Box bg={C.card} rounded="20px" p={6} border="1px solid" borderColor={C.border}>
                    <Text fontSize="14px" fontWeight="700" color={C.text} mb={5}>🍽️ Top Ordered Meals</Text>
                    {(stats.topMeals || []).length === 0 ? (
                      <Empty emoji="📭" msg="No orders yet — meals will appear here." />
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {(stats.topMeals || []).map((m, i: number) => {
                          const max = stats.topMeals?.[0]?.count ?? 1;
                          const pct = Math.round(((m.count ?? 0) / max) * 100);
                          const accent = [C.green, C.amber, "#8b5cf6", "#0ea5e9", "#ef4444"][i % 5];
                          return (
                            <Box key={m._id || i}>
                              <Flex justify="space-between" mb="6px">
                                <HStack spacing={2}>
                                  <Flex
                                    w="22px" h="22px" rounded="6px"
                                    bg={`${accent}20`} align="center" justify="center" flexShrink={0}
                                  >
                                    <Text fontSize="10px" fontWeight="800" color={accent}>{i + 1}</Text>
                                  </Flex>
                                  <Text fontSize="13px" color={C.text} fontWeight="600">{m.name || "Unknown"}</Text>
                                </HStack>
                                <Text fontSize="12px" fontWeight="700" color={C.muted}>{m.count} orders</Text>
                              </Flex>
                              <Box h="6px" bg={C.bg} rounded="full" overflow="hidden">
                                <Box h="100%" w={`${pct}%`} bg={accent} rounded="full" transition="width 0.6s ease" />
                              </Box>
                            </Box>
                          );
                        })}
                      </VStack>
                    )}
                  </Box>
                </VStack>
              )}

              {/* ══════════ MEALS ══════════ */}
              {section === "meals" && (
                <VStack spacing={5} align="stretch">
                  {/* Toolbar */}
                  <Flex justify="space-between" align="center" gap={3} wrap="wrap">
                    <Box position="relative" flex={1} maxW="340px">
                      <Icon as={FaSearch} position="absolute" left={3} top="50%" transform="translateY(-50%)" color={C.muted} boxSize="12px" zIndex={1} />
                      <Input
                        pl={9} size="sm" rounded="10px" bg={C.card}
                        border="1px solid" borderColor={C.border}
                        placeholder="Search meals…" fontSize="13px"
                        value={mealSearch}
                        onChange={(e) => { setMealSearch(e.target.value); setMealPage(1); }}
                        _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                      />
                    </Box>
                    <Button
                      size="sm" bg={C.green} color="white" rounded="10px"
                      leftIcon={<Icon as={FaPlus} boxSize="11px" />}
                      _hover={{ bg: "#5a7a34" }}
                      boxShadow={`0 4px 14px ${C.green}55`}
                      onClick={openAddMeal}
                      fontSize="13px" fontWeight="700"
                    >
                      Add Meal
                    </Button>
                  </Flex>

                  {/* Count */}
                  <Text fontSize="12px" color={C.muted}>
                    Showing {pagedMeals.length} of {filteredMeals.length} meal{filteredMeals.length !== 1 ? "s" : ""}
                  </Text>

                  {filteredMeals.length === 0 ? (
                    <Empty emoji="🍽️" msg="No meals found. Add your first meal above." />
                  ) : (
                    <>
                      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={4}>
                        {pagedMeals.map((m) => (
                          <Box
                            key={m._id} bg={C.card} rounded="18px" overflow="hidden"
                            border="1px solid" borderColor={C.border}
                            transition="transform 0.2s, box-shadow 0.2s"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                          >
                            <Box position="relative" h="148px" bg="gray.100">
                              <Image
                                src={m.img} alt={m.title}
                                w="100%" h="100%" objectFit="cover"
                                fallback={
                                  <Flex h="100%" align="center" justify="center" bg="gray.50">
                                    <Text fontSize="32px">🍽️</Text>
                                  </Flex>
                                }
                              />
                              <Box
                                position="absolute" top={3} left={3}
                                px="8px" py="3px" bg="white" rounded="8px"
                                boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                              >
                                <Text fontSize="10px" fontWeight="700" color={C.green} textTransform="capitalize">
                                  {m.category}
                                </Text>
                              </Box>
                            </Box>
                            <Box p={4}>
                              <Text fontWeight="700" fontSize="13px" color={C.text} mb="4px" noOfLines={1}>
                                {m.title}
                              </Text>
                              <Text fontSize="11px" color={C.muted} noOfLines={2} mb={3} lineHeight={1.5}>
                                {m.content}
                              </Text>
                              <Flex justify="space-between" align="center">
                                <Text fontWeight="800" color={C.green} fontSize="15px">₦{Number(m.price).toLocaleString()}</Text>
                                <HStack spacing={1}>
                                  <IconButton
                                    aria-label="Edit" icon={<Icon as={FaEdit} boxSize="11px" />}
                                    size="xs" variant="ghost" color="#3b82f6"
                                    _hover={{ bg: "#eff6ff" }} rounded="8px"
                                    onClick={() => openEditMeal(m)}
                                  />
                                  <IconButton
                                    aria-label="Delete" icon={<Icon as={FaTrash} boxSize="11px" />}
                                    size="xs" variant="ghost" color={C.danger}
                                    _hover={{ bg: "#fef2f2" }} rounded="8px"
                                    onClick={() => handleDeleteMeal(m._id)}
                                  />
                                </HStack>
                              </Flex>
                            </Box>
                          </Box>
                        ))}
                      </SimpleGrid>

                      {/* Pagination */}
                      {mealPages > 1 && (
                        <Flex justify="center" align="center" gap={3} pt={2}>
                          <IconButton
                            aria-label="prev" icon={<Icon as={FaChevronLeft} boxSize="11px" />}
                            size="sm" rounded="10px" variant="outline" borderColor={C.border}
                            isDisabled={mealPage === 1}
                            onClick={() => setMealPage((p) => p - 1)}
                          />
                          <Text fontSize="13px" color={C.muted}>
                            {mealPage} / {mealPages}
                          </Text>
                          <IconButton
                            aria-label="next" icon={<Icon as={FaChevronRight} boxSize="11px" />}
                            size="sm" rounded="10px" variant="outline" borderColor={C.border}
                            isDisabled={mealPage === mealPages}
                            onClick={() => setMealPage((p) => p + 1)}
                          />
                        </Flex>
                      )}
                    </>
                  )}
                </VStack>
              )}

              {/* ══════════ ORDERS ══════════ */}
              {section === "orders" && (
                <VStack spacing={5} align="stretch">
                  {/* Toolbar */}
                  <Box position="relative" maxW="340px">
                    <Icon as={FaSearch} position="absolute" left={3} top="50%" transform="translateY(-50%)" color={C.muted} boxSize="12px" zIndex={1} />
                    <Input
                      pl={9} size="sm" rounded="10px" bg={C.card}
                      border="1px solid" borderColor={C.border}
                      placeholder="Search by customer…" fontSize="13px"
                      value={orderSearch}
                      onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                      _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                    />
                  </Box>

                  <Box bg={C.card} rounded="20px" border="1px solid" borderColor={C.border} overflow="hidden">
                    <Box px={6} py={4} borderBottom="1px solid" borderColor={C.border}>
                      <Text fontSize="14px" fontWeight="700" color={C.text}>All Orders</Text>
                      <Text fontSize="12px" color={C.muted}>{filteredOrders.length} total</Text>
                    </Box>

                    {filteredOrders.length === 0 ? (
                      <Empty emoji="📦" msg="No orders yet." />
                    ) : (
                      <Box overflowX="auto">
                        <Table size="sm">
                          <Thead>
                            <Tr bg={C.bg}>
                              {["Customer", "Items", "Total", "Status", "Date", "Update"].map((h) => (
                                <Th key={h} fontSize="10px" color={C.muted} textTransform="uppercase"
                                  letterSpacing="0.06em" py={3} fontWeight="700" borderColor={C.border}>
                                  {h}
                                </Th>
                              ))}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {pagedOrders.map((o) => (
                              <Tr key={o._id} _hover={{ bg: C.bg }} transition="background 0.12s">
                                <Td borderColor={C.border} py={3}>
                                  <HStack spacing={3}>
                                    {
                                      (() => {
                                        const name = typeof o.userId === 'object' && o.userId ? (o.userId.name || 'Guest') : (typeof o.userId === 'string' ? o.userId : 'Guest');
                                        const email = typeof o.userId === 'object' && o.userId ? (o.userId.email || '—') : '—';
                                        return (
                                          <>
                                            <Avatar size="sm" name={name} bg={C.green} color="white" />
                                            <Box>
                                              <Text fontSize="13px" fontWeight="600" color={C.text}>{name}</Text>
                                              <Text fontSize="11px" color={C.muted}>{email}</Text>
                                            </Box>
                                          </>
                                        );
                                      })()
                                    }
                                  </HStack>
                                </Td>
                                <Td borderColor={C.border}>
                                  <Text fontSize="13px" color={C.text} fontWeight="500">{o.items?.length ?? 0}</Text>
                                </Td>
                                <Td borderColor={C.border}>
                                  <Text fontSize="13px" fontWeight="700" color={C.green}>
                                    ₦{Number(o.totalAmount || 0).toLocaleString()}
                                  </Text>
                                </Td>
                                <Td borderColor={C.border}><Pill status={o.status ?? 'pending'} /></Td>
                                <Td borderColor={C.border}>
                                  <Text fontSize="12px" color={C.muted}>
                                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : '—'}
                                  </Text>
                                </Td>
                                <Td borderColor={C.border}>
                                    <Select
                                    size="xs" value={o.status ?? 'pending'} w="130px"
                                    rounded="8px" fontSize="12px" fontWeight="600"
                                    bg={C.bg} border="1px solid" borderColor={C.border}
                                    _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                                    onChange={(e) => handleOrderStatus(o._id, e.target.value)}
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
                    )}
                  </Box>

                  {orderPages > 1 && (
                    <Flex justify="center" align="center" gap={3}>
                      <IconButton
                        aria-label="prev" icon={<Icon as={FaChevronLeft} boxSize="11px" />}
                        size="sm" rounded="10px" variant="outline" borderColor={C.border}
                        isDisabled={orderPage === 1}
                        onClick={() => setOrderPage((p) => p - 1)}
                      />
                      <Text fontSize="13px" color={C.muted}>{orderPage} / {orderPages}</Text>
                      <IconButton
                        aria-label="next" icon={<Icon as={FaChevronRight} boxSize="11px" />}
                        size="sm" rounded="10px" variant="outline" borderColor={C.border}
                        isDisabled={orderPage === orderPages}
                        onClick={() => setOrderPage((p) => p + 1)}
                      />
                    </Flex>
                  )}
                </VStack>
              )}

              {/* ══════════ USERS ══════════ */}
              {section === "users" && (
                <VStack spacing={5} align="stretch">
                  <Box position="relative" maxW="340px">
                    <Icon as={FaSearch} position="absolute" left={3} top="50%" transform="translateY(-50%)" color={C.muted} boxSize="12px" zIndex={1} />
                    <Input
                      pl={9} size="sm" rounded="10px" bg={C.card}
                      border="1px solid" borderColor={C.border}
                      placeholder="Search users…" fontSize="13px"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                    />
                  </Box>

                  <Box bg={C.card} rounded="20px" border="1px solid" borderColor={C.border} overflow="hidden">
                    <Box px={6} py={4} borderBottom="1px solid" borderColor={C.border}>
                      <Text fontSize="14px" fontWeight="700" color={C.text}>All Users</Text>
                      <Text fontSize="12px" color={C.muted}>{filteredUsers.length} accounts</Text>
                    </Box>

                    {filteredUsers.length === 0 ? (
                      <Empty emoji="👥" msg="No users found." />
                    ) : (
                      <Box overflowX="auto">
                        <Table size="sm">
                          <Thead>
                            <Tr bg={C.bg}>
                              {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                                <Th key={h} fontSize="10px" color={C.muted} textTransform="uppercase"
                                  letterSpacing="0.06em" py={3} fontWeight="700" borderColor={C.border}>
                                  {h}
                                </Th>
                              ))}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredUsers.map((u) => (
                              <Tr key={u._id} _hover={{ bg: C.bg }} transition="background 0.12s">
                                <Td borderColor={C.border} py={3}>
                                  <HStack spacing={3}>
                                    <Avatar size="sm" name={u.name} bg={C.green} color="white" />
                                    <Text fontSize="13px" fontWeight="600" color={C.text}>{u.name || "—"}</Text>
                                  </HStack>
                                </Td>
                                <Td borderColor={C.border}>
                                  <Text fontSize="13px" color={C.muted}>{u.email}</Text>
                                </Td>
                                <Td borderColor={C.border}>
                                  <Box
                                    display="inline-flex" alignItems="center"
                                    px={3} py="3px" rounded="full"
                                    bg={u.isAdmin ? "#f0f7e8" : C.bg}
                                  >
                                    <Text fontSize="11px" fontWeight="700" color={u.isAdmin ? C.green : C.muted}>
                                      {u.isAdmin ? "Admin" : "User"}
                                    </Text>
                                  </Box>
                                </Td>
                                <Td borderColor={C.border}>
                                  <Text fontSize="12px" color={C.muted}>
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : '—'}
                                  </Text>
                                </Td>
                                <Td borderColor={C.border}>
                                  <HStack spacing={1}>
                                    <IconButton
                                      aria-label="Toggle admin" icon={<Icon as={FaShieldAlt} boxSize="11px" />}
                                      size="xs" variant="ghost" rounded="8px"
                                      color={u.isAdmin ? C.green : C.muted}
                                      _hover={{ bg: u.isAdmin ? "#f0f7e8" : C.bg }}
                                      onClick={() => handleToggleAdmin(u._id)}
                                    />
                                    <IconButton
                                      aria-label="Delete" icon={<Icon as={FaTrash} boxSize="11px" />}
                                      size="xs" variant="ghost" color={C.danger} rounded="8px"
                                      _hover={{ bg: "#fef2f2" }}
                                      onClick={() => handleDeleteUser(u._id)}
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </Box>
                </VStack>
              )}

            </>
          )}
        </Box>
      </Box>

      {/* ════════════════ MEAL MODAL ════════════════ */}
      <Modal isOpen={mealOpen} onClose={closeMeal} isCentered size="md" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(6px)" bg="blackAlpha.500" />
        <ModalContent rounded="20px" shadow="2xl" mx={4}>
          <ModalHeader
            fontSize="16px" fontWeight="800" color={C.text}
            borderBottom="1px solid" borderColor={C.border} py={4}
          >
            {editingMeal ? "Edit Meal" : "Add New Meal"}
          </ModalHeader>
          <ModalCloseButton rounded="10px" />
          <ModalBody py={5}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={C.muted} textTransform="uppercase" letterSpacing="0.05em" mb={1}>
                  Title
                </FormLabel>
                <Input
                  size="sm" rounded="10px" fontSize="13px"
                  placeholder="e.g. Jollof Rice with Chicken"
                  value={mealForm.title}
                  onChange={(e) => setMealForm({ ...mealForm, title: e.target.value })}
                  border="1px solid" borderColor={C.border}
                  _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={C.muted} textTransform="uppercase" letterSpacing="0.05em" mb={1}>
                  Description
                </FormLabel>
                <Textarea
                  size="sm" rounded="10px" fontSize="13px" rows={3} resize="none"
                  placeholder="Brief description of the meal…"
                  value={mealForm.content}
                  onChange={(e) => setMealForm({ ...mealForm, content: e.target.value })}
                  border="1px solid" borderColor={C.border}
                  _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={C.muted} textTransform="uppercase" letterSpacing="0.05em" mb={1}>
                  Price (₦)
                </FormLabel>
                <Input
                  size="sm" rounded="10px" fontSize="13px" type="number"
                  placeholder="e.g. 3500"
                  value={mealForm.price}
                  onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })}
                  border="1px solid" borderColor={C.border}
                  _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={C.muted} textTransform="uppercase" letterSpacing="0.05em" mb={1}>
                  Image URL
                </FormLabel>
                <Input
                  size="sm" rounded="10px" fontSize="13px"
                  placeholder="https://…"
                  value={mealForm.img}
                  onChange={(e) => setMealForm({ ...mealForm, img: e.target.value })}
                  border="1px solid" borderColor={C.border}
                  _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                />
                {/* Live preview */}
                {mealForm.img && (
                  <Box mt={2} rounded="12px" overflow="hidden" h="100px" bg="gray.50">
                    <Image
                      src={mealForm.img} alt="preview"
                      w="100%" h="100%" objectFit="cover"
                      fallback={
                        <Flex h="100%" align="center" justify="center">
                          <Text fontSize="12px" color={C.muted}>Invalid URL</Text>
                        </Flex>
                      }
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={C.muted} textTransform="uppercase" letterSpacing="0.05em" mb={1}>
                  Category
                </FormLabel>
                <Select
                  size="sm" rounded="10px" fontSize="13px"
                  value={mealForm.category}
                  onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                  border="1px solid" borderColor={C.border}
                  _focus={{ borderColor: C.green, boxShadow: `0 0 0 1px ${C.green}` }}
                >
                  <option value="popular">Popular</option>
                  <option value="extra">Extra</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={2} borderTop="1px solid" borderColor={C.border} py={4}>
            <Button size="sm" variant="ghost" rounded="10px" fontSize="13px" onClick={closeMeal}>
              Cancel
            </Button>
            <Button
              size="sm" bg={C.green} color="white" rounded="10px" fontSize="13px" fontWeight="700"
              _hover={{ bg: "#5a7a34" }} boxShadow={`0 4px 14px ${C.green}55`}
              isLoading={saving} loadingText="Saving…"
              onClick={handleSaveMeal}
            >
              {editingMeal ? "Save Changes" : "Add Meal"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
}