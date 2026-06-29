import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Badge,
  Chip,
} from "@mui/material";
import { Send, Search, Phone, MoreHoriz, Edit, StarBorder } from "@mui/icons-material";
import { toast } from "react-toastify";
import chatApi from "../../api/chatApt";
import axiosConfig from "../../api/axiosConfig";

function Messages() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("Focused"); // Focused, Unread, All
  const [loading, setLoading] = useState(false);
  
  // Real database thread status states
  const [allUserMessages, setAllUserMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // Resolve the active customer object dynamically during render
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  // 1. Fetch all customers
  useEffect(() => {
    setLoading(true);
    axiosConfig
      .get("/customers")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCustomers(res.data);
          if (res.data.length > 0) {
            setSelectedCustomerId(res.data[0].id); // Select first customer ID by default
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load customers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Fetch all inbox & sent messages for thread calculations
  const fetchThreadData = async () => {
    const farmerId = localStorage.getItem("userId");
    if (!farmerId) return;

    try {
      const [inboxRes, sentRes] = await Promise.all([
        axiosConfig.get(`/messages/inbox?receiverType=FARMER&receiverId=${farmerId}`),
        axiosConfig.get(`/messages/sent?senderType=FARMER&senderId=${farmerId}`),
      ]);

      const inbox = Array.isArray(inboxRes.data) ? inboxRes.data : [];
      const sent = Array.isArray(sentRes.data) ? sentRes.data : [];
      setAllUserMessages([...inbox, ...sent]);
    } catch (err) {
      console.error("Failed to sync threads:", err);
    }
  };

  // 3. Fetch conversation messages for selected customer ID
  const loadConversation = () => {
    const farmerId = localStorage.getItem("userId");
    if (!farmerId || !selectedCustomerId) return;

    chatApi
      .getConversation("FARMER", farmerId, "CUSTOMER", selectedCustomerId)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((m) => ({
            id: m.id,
            text: m.content,
            sender: m.senderType.toLowerCase(), // "farmer" or "customer"
            time: m.sentAt
              ? new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Just now",
          }));
          setMessages(mapped);

          // Mark incoming unread messages as read
          res.data.forEach((m) => {
            if (m.senderType === "CUSTOMER" && m.senderId === selectedCustomerId && !m.read) {
              axiosConfig.put(`/messages/${m.id}/read`).catch((e) => console.error(e));
            }
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load conversation details:", err);
      });
  };

  // Setup periodic sync loops (re-sync when active customer ID changes)
  useEffect(() => {
    fetchThreadData();
    loadConversation();

    const interval = setInterval(() => {
      fetchThreadData();
      loadConversation();
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCustomerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedCustomerId) return;

    const farmerId = localStorage.getItem("userId");
    if (!farmerId) {
      toast.error("Please login first");
      return;
    }

    try {
      await chatApi.sendMessage({
        senderType: "FARMER",
        senderId: Number(farmerId),
        receiverType: "CUSTOMER",
        receiverId: Number(selectedCustomerId),
        content: inputText,
      });
      setInputText("");
      loadConversation();
      fetchThreadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message to database");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Compile thread statistics for each customer from database message logs
  const getCompiledCustomers = () => {
    return customers.map((c) => {
      const cMessages = allUserMessages.filter(
        (m) =>
          (m.senderType === "CUSTOMER" && m.senderId === c.id) ||
          (m.receiverType === "CUSTOMER" && m.receiverId === c.id)
      );

      // Sort by time
      const sorted = cMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      const hasMessages = sorted.length > 0;
      const lastMsg = hasMessages ? sorted[sorted.length - 1] : null;

      // Count unread messages received from this customer
      const unreadCount = cMessages.filter(
        (m) => m.senderType === "CUSTOMER" && m.senderId === c.id && !m.read
      ).length;

      let timeStr = "";
      if (lastMsg && lastMsg.sentAt) {
        const d = new Date(lastMsg.sentAt);
        timeStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
      }

      return {
        ...c,
        lastMessage: lastMsg ? lastMsg.content : "Tap to start conversation",
        lastMessageTime: timeStr,
        unreadCount,
        lastMessageDate: lastMsg ? new Date(lastMsg.sentAt) : new Date(0),
      };
    });
  };

  // Sort customers so that threads with the most recent messages rise to the top
  const getSortedCustomers = () => {
    const compiled = getCompiledCustomers();
    return compiled.sort((a, b) => b.lastMessageDate - a.lastMessageDate);
  };

  // Filter connections by search name and active categories
  const filteredCustomers = getSortedCustomers().filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.district && c.district.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterType === "Unread") {
      return matchesSearch && c.unreadCount > 0;
    }
    return matchesSearch;
  });

  return (
    <Box sx={{ p: 2, background: "#fafafa", height: "88vh" }}>
      <Box sx={{ display: "flex", gap: 3, height: "100%", overflow: "hidden" }}>
        
        {/* Left Messaging Sidebar */}
        <Box sx={{ width: "320px", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              bgcolor: "#ffffff",
            }}
          >
            {/* Header Controls */}
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight="800" sx={{ color: "#333" }}>
                Messaging
              </Typography>
              <Box>
                <IconButton size="small"><MoreHoriz /></IconButton>
                <IconButton size="small"><Edit /></IconButton>
              </Box>
            </Box>

            {/* Search Input Bar */}
            <Box sx={{ px: 2, pb: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" fontSize="small" sx={{ mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "#f3f6f8",
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            {/* Filter Tabs */}
            <Box sx={{ px: 2, pb: 2, display: "flex", gap: 1 }}>
              {["Focused", "Unread", "All Customers"].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => setFilterType(type)}
                  variant={filterType === type ? "contained" : "outlined"}
                  color={filterType === type ? "success" : "default"}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "16px",
                    fontSize: "0.75rem",
                    bgcolor: filterType === type ? "#0a66c2 !important" : "transparent",
                    color: filterType === type ? "#ffffff" : "#666",
                  }}
                />
              ))}
            </Box>

            <Divider />

            {/* Scrollable list of Customers */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress color="success" />
              </Box>
            ) : (
              <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomerId === cust.id;
                    const hasUnread = cust.unreadCount > 0;
                    
                    return (
                      <React.Fragment key={cust.id}>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() => setSelectedCustomerId(cust.id)}
                          sx={{
                            py: 1.5,
                            borderLeft: isSelected ? "4px solid #0a66c2" : "4px solid transparent",
                            bgcolor: isSelected ? "#f3f6f8 !important" : "transparent",
                            "&:hover": { bgcolor: "#f3f6f8" },
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 50, position: "relative" }}>
                            {/* Online green indicator badge */}
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                              variant="dot"
                              sx={{
                                "& .MuiBadge-badge": {
                                  backgroundColor: "#44b700",
                                  color: "#44b700",
                                  boxShadow: `0 0 0 2px #fff`,
                                  "&::after": {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    border: "1px solid currentColor",
                                    content: '""',
                                  },
                                },
                              }}
                            >
                              <Avatar sx={{ bgcolor: "#0a66c2", width: 42, height: 42, fontWeight: "bold" }}>
                                {cust.name.substring(0, 2).toUpperCase()}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <Typography variant="body2" fontWeight={hasUnread ? "800" : "600"} color="#2d2d2d" noWrap sx={{ maxWidth: "70%" }}>
                                  {cust.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {cust.lastMessageTime}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.2 }}>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: "80%" }}>
                                  {cust.lastMessage}
                                </Typography>
                                {hasUnread && (
                                  <Box sx={{ width: 16, height: 16, bgcolor: "#0a66c2", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "bold" }}>
                                    {cust.unreadCount}
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Box sx={{ p: 5, textAlign: "center" }}>
                    <Typography color="text.secondary" variant="body2">No connections found</Typography>
                  </Box>
                )}
              </List>
            )}
          </Paper>
        </Box>

        {/* Right Active Chat Viewport */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {selectedCustomer ? (
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: "#ffffff",
              }}
            >
              {/* Active Chat Header */}
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="700" color="#2d2d2d">
                    {selectedCustomer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Verified Buyer at {selectedCustomer.village || "Kothrud"}, {selectedCustomer.district || "Pune"} | Online
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => toast.info(`Calling ${selectedCustomer.name}...`)}><Phone /></IconButton>
                  <IconButton><StarBorder /></IconButton>
                  <IconButton><MoreHoriz /></IconButton>
                </Box>
              </Box>

              {/* Chat Message Window */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 3,
                  bgcolor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Contact Bio Header (LinkedIn style) */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 3, textAlign: "center" }}>
                  <Avatar sx={{ width: 65, height: 65, bgcolor: "#0a66c2", fontSize: "1.5rem", fontWeight: "bold", mb: 1 }}>
                    {selectedCustomer.name.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">{selectedCustomer.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "400px" }}>
                    Registered Consumer • Purchases fresh organic produce directly from local farm hubs.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Phone: {selectedCustomer.phoneNumber || "+91 99999-99999"}
                  </Typography>
                  <Divider sx={{ width: "100%", mt: 3 }} />
                </Box>

                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.sender === "farmer";
                    return (
                      <Box key={msg.id} sx={{ display: "flex", gap: 1.5, justifyContent: isMe ? "flex-end" : "flex-start", mb: 0.5 }}>
                        {!isMe && (
                          <Avatar sx={{ bgcolor: "#0a66c2", width: 28, height: 28, fontSize: "0.75rem", fontWeight: "bold" }}>
                            {selectedCustomer.name.substring(0, 2).toUpperCase()}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: "70%",
                            p: 1.8,
                            borderRadius: isMe ? "12px 12px 0px 12px" : "12px 12px 12px 0px",
                            bgcolor: isMe ? "#f3f6f8" : "#e8f5e9", // LinkedIn colors
                            color: "#2d2d2d",
                            border: isMe ? "1px solid #e0e0e0" : "1px solid #c5e1a5",
                          }}
                        >
                          {msg.text.startsWith("[Shared Post]") ? (() => {
                            const lines = msg.text.split("\n");
                            const author = lines.find(l => l.startsWith("author:"))?.replace("author:", "").trim() || "Farmer";
                            const price = lines.find(l => l.startsWith("price:"))?.replace("price:", "").trim();
                            const stock = lines.find(l => l.startsWith("stock:"))?.replace("stock:", "").trim();
                            const content = lines.find(l => l.startsWith("content:"))?.replace("content:", "").trim() || "";
                            const imgIdx = lines.findIndex(l => l.startsWith("image:"));
                            const image = imgIdx !== -1 ? lines.slice(imgIdx).join("\n").replace("image:", "").trim() : "";
                            
                            return (
                              <Box sx={{ width: 220, textAlign: "left" }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: "bold", letterSpacing: "0.2px" }}>
                                  📬 Shared Harvest Post
                                </Typography>
                                {image && (
                                  <Box
                                    component="img"
                                    src={image}
                                    sx={{ width: "100%", height: 110, objectFit: "cover", borderRadius: "8px", mb: 1 }}
                                  />
                                )}
                                <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 0.5, color: "#1b5e20" }}>
                                  {author}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "0.8rem", mb: 1.5, color: "#555", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {content}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                  {price && price !== "N/A" && (
                                    <Chip label={price} size="small" color="success" sx={{ height: 18, fontSize: "0.65rem", fontWeight: "bold" }} />
                                  )}
                                  {stock && stock !== "N/A" && (
                                    <Chip label={stock} size="small" color="warning" sx={{ height: 18, fontSize: "0.65rem", fontWeight: "bold" }} />
                                  )}
                                </Box>
                              </Box>
                            );
                          })() : (
                            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{msg.text}</Typography>
                          )}
                          <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5, color: "text.secondary", fontSize: "0.65rem" }}>
                            {msg.time}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography color="text.secondary" variant="body2">No conversation history. Send a message to start!</Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Chat Input Area */}
              <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", display: "flex", gap: 2, alignItems: "flex-end" }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  placeholder="Write a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#f3f6f8",
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  sx={{
                    bgcolor: "#0a66c2",
                    color: "white",
                    borderRadius: "8px",
                    width: 38,
                    height: 38,
                    "&:hover": { bgcolor: "#004182" },
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc", borderRadius: "12px" }}>
              <Typography color="text.secondary">Select a connection to start messaging.</Typography>
            </Paper>
          )}
        </Box>

      </Box>
    </Box>
  );
}

export default Messages;