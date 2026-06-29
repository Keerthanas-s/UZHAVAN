export const adminStats = {
  users: 260,
  farmers: 85,
  customers: 150,
  orders: 310,
  revenue: 96000,
};

export const recentOrders = [
  {
    id: "ORD101",
    customer: "Arjun",
    farmer: "Farmer Ramu",
    amount: 520,
    status: "Confirmed",
  },
  {
    id: "ORD102",
    customer: "Meena",
    farmer: "Farmer Anbu",
    amount: 650,
    status: "Pending",
  },
  {
    id: "ORD103",
    customer: "Karthik",
    farmer: "Farmer Selvi",
    amount: 390,
    status: "Delivered",
  },
];

export const farmersList = [
  {
    id: 1,
    name: "Farmer Ramu",
    products: 18,
    orders: 24,
    rating: 4.7,
  },
  {
    id: 2,
    name: "Farmer Anbu",
    products: 14,
    orders: 19,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Farmer Selvi",
    products: 22,
    orders: 37,
    rating: 4.9,
  },
];

export const buyersList = [
  {
    id: 1,
    name: "Meena",
    orders: 8,
    spend: 3200,
  },
  {
    id: 2,
    name: "Arjun",
    orders: 14,
    spend: 5400,
  },
  {
    id: 3,
    name: "Priya",
    orders: 5,
    spend: 1850,
  },
];

export const priceList = [
  {
    district: "Chennai",
    tomato: 44,
    potato: 28,
    onion: 51,
    cabbage: 32,
  },
  {
    district: "Madurai",
    tomato: 40,
    potato: 26,
    onion: 48,
    cabbage: 30,
  },
  {
    district: "Salem",
    tomato: 42,
    potato: 27,
    onion: 49,
    cabbage: 31,
  },
  {
    district: "Coimbatore",
    tomato: 43,
    potato: 29,
    onion: 50,
    cabbage: 33,
  },
];

export const productCatalog = [
  {
    id: "p1",
    name: "Tomato",
    category: "Vegetables",
    price: 42,
    available: 120,
    seller: "Farmer Ramu",
    location: "Chennai",
    rating: 4.8,
    description: "Fresh tomatoes harvested daily from local farms.",
  },
  {
    id: "p2",
    name: "Potato",
    category: "Vegetables",
    price: 26,
    available: 90,
    seller: "Farmer Anbu",
    location: "Madurai",
    rating: 4.5,
    description: "Clean potatoes packed and ready for cooking.",
  },
  {
    id: "p3",
    name: "Onion",
    category: "Vegetables",
    price: 50,
    available: 65,
    seller: "Farmer Selvi",
    location: "Salem",
    rating: 4.6,
    description: "Sweet onions grown with natural fertilizer.",
  },
  {
    id: "p4",
    name: "Cabbage",
    category: "Vegetables",
    price: 34,
    available: 40,
    seller: "Farmer Ramu",
    location: "Coimbatore",
    rating: 4.4,
    description: "Green cabbage perfect for salads and curries.",
  },
  {
    id: "p5",
    name: "Brinjal",
    category: "Vegetables",
    price: 48,
    available: 55,
    seller: "Farmer Anbu",
    location: "Chennai",
    rating: 4.6,
    description: "Fresh brinjals harvested from organic farms.",
  },
  {
    id: "p6",
    name: "Spinach",
    category: "Leafy Greens",
    price: 30,
    available: 70,
    seller: "Farmer Selvi",
    location: "Madurai",
    rating: 4.9,
    description: "Vitamin-rich spinach delivered same day.",
  },
];

export const categories = [
  "Vegetables",
  "Leafy Greens",
  "Fruits",
  "Organic",
];

export const topFarmers = [
  {
    id: 1,
    name: "Farmer Ramu",
    specialty: "Tomatoes",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Farmer Anbu",
    specialty: "Potatoes",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Farmer Selvi",
    specialty: "Leafy Greens",
    rating: 4.9,
  },
];

export const buyerMessages = [
  {
    id: 1,
    name: "Farmer Ramu",
    lastMessage: "Your order is packed and ready to ship.",
    unread: 2,
    time: "2h ago",
  },
  {
    id: 2,
    name: "Farmer Anbu",
    lastMessage: "Can you confirm the quantity?",
    unread: 0,
    time: "8h ago",
  },
  {
    id: 3,
    name: "Farmer Selvi",
    lastMessage: "Fresh spinach available today.",
    unread: 1,
    time: "1d ago",
  },
];

export const farmerMessages = [
  {
    id: 1,
    name: "Arjun",
    lastMessage: "Please confirm delivery time.",
    unread: 1,
    time: "3h ago",
  },
  {
    id: 2,
    name: "Meena",
    lastMessage: "I need 2 kg of tomato.",
    unread: 0,
    time: "5h ago",
  },
];

export const samplePosts = [
  {
    id: 1,
    author: "Farmer Ramu",
    text: "Fresh tomato harvest ready. Order now for same-day delivery!",
  },
  {
    id: 2,
    author: "Farmer Selvi",
    text: "Green spinach and cabbage supplied from the farm this morning.",
  },
];

export const storyUpdates = [
  {
    id: 1,
    title: "Tomato Harvest",
    detail: "Harvest started in Chennai farm.",
  },
  {
    id: 2,
    title: "New Stock",
    detail: "Potato and onion restocked today.",
  },
];

export const sampleOrders = [
  {
    id: "ORD120",
    customer: "Siva",
    farmer: "Farmer Anbu",
    product: "Potato",
    quantity: 6,
    amount: 156,
    status: "Pending",
  },
  {
    id: "ORD121",
    customer: "Priya",
    farmer: "Farmer Ramu",
    product: "Tomato",
    quantity: 10,
    amount: 420,
    status: "Confirmed",
  },
];

export const customerProfile = {
  name: "Meena",
  email: "meena@example.com",
  phone: "+91 98765 43210",
  address: "Anna Nagar, Chennai",
  totalSpend: 3800,
  orderCount: 18,
};

export const orderProgress = [
  { label: "Order Confirmed", completed: true },
  { label: "Packed", completed: true },
  { label: "Shipped", completed: false },
  { label: "Delivered", completed: false },
];
