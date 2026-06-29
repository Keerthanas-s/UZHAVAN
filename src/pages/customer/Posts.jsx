import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogContent,
  CircularProgress,
  Collapse,
  Divider,
  DialogTitle,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Send,
  Close,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Story states
  const [openStoryDialog, setOpenStoryDialog] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [storyReplyText, setStoryReplyText] = useState("");

  // Dynamic comments and expansion maps
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const [profileName, setProfileName] = useState("Buyer");

  // Share dialog states
  const [sharePost, setSharePost] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);

  // Fetch logged-in customer profile name
  const fetchProfileName = () => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) return;

    axiosConfig
      .get(`/customers/${customerId}`)
      .then((res) => {
        if (res.data && res.data.name) {
          setProfileName(res.data.name);
        }
      })
      .catch((err) => console.error(err));
  };

  const loadPosts = () => {
    const userId = localStorage.getItem("userId");
    setLoading(true);

    axiosConfig
      .get(`/posts?userType=CUSTOMER&userId=${userId}`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadStories = () => {
    const userId = localStorage.getItem("userId");
    axiosConfig
      .get(`/stories?userType=CUSTOMER&userId=${userId}`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setStories(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stories:", err);
      });
  };

  useEffect(() => {
    fetchProfileName();
    loadPosts();
    loadStories();
  }, []);

  const handleLike = async (postId) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axiosConfig.post(`/posts/${postId}/like?userType=CUSTOMER&userId=${userId}`);
      const liked = res.data?.liked;
      
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              liked,
              likesCount: liked ? p.likesCount + 1 : p.likesCount - 1,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update like status");
    }
  };

  const handleStoryLike = async (storyId) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axiosConfig.post(`/stories/${storyId}/like?userType=CUSTOMER&userId=${userId}`);
      const liked = res.data?.liked;
      
      setStories((prev) =>
        prev.map((s) => {
          if (s.id === storyId) {
            return {
              ...s,
              liked,
              likesCount: liked ? s.likesCount + 1 : s.likesCount - 1,
            };
          }
          return s;
        })
      );
      
      if (activeStory && activeStory.id === storyId) {
        setActiveStory((prev) => ({
          ...prev,
          liked,
          likesCount: liked ? prev.likesCount + 1 : prev.likesCount - 1,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendStoryReply = async (storyId, farmerId) => {
    if (!storyReplyText || !storyReplyText.trim()) {
      toast.error("Please enter reply message text");
      return;
    }
    const customerId = localStorage.getItem("userId");
    const payload = {
      sender: "customer",
      receiver: "farmer",
      customerId: Number(customerId),
      farmerId: Number(farmerId),
      text: `[Story Reply]: ${storyReplyText.trim()}`,
    };

    try {
      await axiosConfig.post("/messages", payload);
      toast.success("Reply successfully sent to farmer chat!");
      setStoryReplyText("");
      setOpenStoryDialog(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to deliver story reply");
    }
  };

  // Toggle comments expander and fetch comments
  const handleToggleComments = async (postId) => {
    const isExpanded = !!expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded) {
      fetchComments(postId);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosConfig.get(`/posts/${postId}/comments`);
      if (res.data && Array.isArray(res.data)) {
        setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const customerId = localStorage.getItem("userId");
    const payload = {
      authorName: profileName,
      authorType: "CUSTOMER",
      authorId: Number(customerId),
      content: commentText.trim(),
    };

    try {
      await axiosConfig.post(`/posts/${postId}/comments`, payload);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);

      // Increment comments count locally
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return { ...p, commentsCount: p.commentsCount + 1 };
          }
          return p;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  // Open share desk and fetch farmers list
  const handleOpenShare = (post) => {
    setSharePost(post);
    setLoadingFarmers(true);
    axiosConfig
      .get("/farmers")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setFarmers(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingFarmers(false));
  };

  // Share post message to farmer DM
  const handleShareToFarmer = async (farmer) => {
    if (!sharePost) return;
    const customerId = localStorage.getItem("userId");

    const messageText = `[Shared Post]
id: ${sharePost.id}
author: ${sharePost.authorName}
price: ${sharePost.price || "N/A"}
stock: ${sharePost.stock || "N/A"}
content: ${sharePost.content}
image: ${sharePost.imageUrl || ""}`;

    const payload = {
      senderType: "CUSTOMER",
      senderId: Number(customerId),
      receiverType: "FARMER",
      receiverId: Number(farmer.id),
      content: messageText,
    };

    try {
      await axiosConfig.post("/messages", payload);
      toast.success(`Post shared in chat with ${farmer.name}!`);
      setSharePost(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to share post in messages");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1 }}>
        Farm Community Feed 🚜
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Check crop updates directly from local fields, like active harvests, or contact farmers directly.
      </Typography>

      {/* Stories Section */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4, bgcolor: "#ffffff", overflowX: "auto" }}>
        <Box sx={{ display: "flex", gap: 3.5, px: 1 }}>
          {stories.length > 0 ? (
            stories.map((story) => (
              <Box
                key={story.id}
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
                onClick={() => {
                  setActiveStory(story);
                  setOpenStoryDialog(true);
                  setStoryReplyText("");
                }}
              >
                <Avatar
                  src={story.imageUrl}
                  sx={{
                    width: 65,
                    height: 65,
                    border: "3px solid #2e7d32",
                    boxShadow: "0 2px 8px rgba(46,125,50,0.2)"
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, fontWeight: "600" }}>{story.authorName}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ py: 2, px: 2 }}>
              No farm stories active right now. Check back soon!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Feed Column */}
      <Box sx={{ maxWidth: "680px", mx: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress color="success" /></Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {posts.length > 0 ? (
              posts.map((post) => {
                const showComments = !!expandedComments[post.id];
                const commentsList = commentsMap[post.id] || [];
                const inputVal = commentInputs[post.id] || "";

                return (
                  <Card key={post.id} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "#2e7d32" }}>
                          {post.authorName ? post.authorName.substring(0, 2).toUpperCase() : "FM"}
                        </Avatar>
                      }
                      title={post.authorName}
                      subheader={post.createdAt ? new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                      titleTypographyProps={{ fontWeight: "700" }}
                    />
                    {post.imageUrl && (
                      <CardMedia
                        component="img"
                        height="320"
                        image={post.imageUrl}
                        alt="Crop harvest advertisement"
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                        {post.content}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {post.price && (
                          <Box sx={{ px: 2, py: 0.5, bgcolor: "#e8f5e9", color: "#2e7d32", borderRadius: "8px", fontWeight: "bold", fontSize: "0.85rem" }}>
                            Price: {post.price}
                          </Box>
                        )}
                        {post.stock && (
                          <Box sx={{ px: 2, py: 0.5, bgcolor: "#f9fbe7", color: "#827717", borderRadius: "8px", fontWeight: "bold", fontSize: "0.85rem" }}>
                            Stock: {post.stock}
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 1, justifyContent: "space-between", borderTop: "1px solid #f5f5f5" }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleLike(post.id)}>
                          {post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography variant="body2" sx={{ alignSelf: "center", mr: 2, fontWeight: "bold" }}>
                          {post.likesCount}
                        </Typography>
                        <IconButton onClick={() => handleToggleComments(post.id)}>
                          <ChatBubbleOutline />
                        </IconButton>
                        <Typography variant="body2" sx={{ alignSelf: "center", fontWeight: "bold" }}>
                          {post.commentsCount}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => handleOpenShare(post)} color="success">
                        <Share />
                      </IconButton>
                    </CardActions>

                    <Collapse in={showComments} timeout="auto" unmountOnExit>
                      <Divider />
                      <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Comments</Typography>
                        
                        {/* Comments feed list */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxH: 200, overflowY: "auto", mb: 2 }}>
                          {commentsList.length > 0 ? (
                            commentsList.map((comm) => (
                              <Box key={comm.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                <Avatar sx={{ bgcolor: comm.authorType === "CUSTOMER" ? "#0a66c2" : "#2e7d32", width: 28, height: 28, fontSize: "0.75rem" }}>
                                  {comm.authorName.substring(0, 2).toUpperCase()}
                                </Avatar>
                                <Box sx={{ bgcolor: "#ffffff", border: "1px solid #e8e8e8", p: 1, borderRadius: "10px", flex: 1 }}>
                                  <Typography variant="caption" fontWeight="bold" sx={{ display: "block" }}>{comm.authorName}</Typography>
                                  <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#333" }}>{comm.content}</Typography>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">No comments yet. Start the conversation!</Typography>
                          )}
                        </Box>

                        {/* Write Comment */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={inputVal}
                            onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }}
                          />
                          <IconButton onClick={() => handleAddComment(post.id)} color="success">
                            <Send fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Collapse>
                  </Card>
                );
              })
            ) : (
              <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px" }}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight="700">
                  No harvests advertised yet. Check back soon!
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>

      {/* Direct Messaging Share Post Dialog */}
      <Dialog open={!!sharePost} onClose={() => setSharePost(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "800", color: "#1b5e20", pb: 1 }}>Share Post in Messages ✈️</DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Choose a farmer contact to send this harvest details directly.
          </Typography>
          {loadingFarmers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={30} color="success" /></Box>
          ) : (
            <List sx={{ pt: 0 }}>
              {farmers.length > 0 ? (
                farmers.map((f) => (
                  <ListItemButton key={f.id} onClick={() => handleShareToFarmer(f)} sx={{ borderRadius: "10px", mb: 0.5 }}>
                    <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, width: 36, height: 36 }}>
                      {f.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <ListItemText primary={f.name} secondary={f.district || "Farmer"} />
                  </ListItemButton>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                  No active farmers found.
                </Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSharePost(null)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dynamic Story View Dialog (Mobile Screen Style Overlay) */}
      <Dialog
        open={openStoryDialog}
        onClose={() => setOpenStoryDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "380px",
            height: "670px",
            borderRadius: "20px",
            bgcolor: "#000",
            overflow: "hidden",
            position: "relative",
            m: 0
          }
        }}
      >
        {activeStory && (
          <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Background Image */}
            <Box
              component="img"
              src={activeStory.imageUrl}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 15%, transparent 80%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none"
              }}
            />

            {/* Header Info */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "absolute", top: 0, left: 0, right: 0, p: 2, zIndex: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                <Avatar sx={{ bgcolor: "#2e7d32", border: "1px solid white", width: 36, height: 36 }}>
                  {activeStory.authorName.substring(0, 2).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "white" }}>{activeStory.authorName}</Typography>
              </Box>
              <IconButton onClick={() => setOpenStoryDialog(false)} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Box>

            {/* Story Text Overlay Caption */}
            {activeStory.caption && (
              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0, 0, 0, 0.75)",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: "12px",
                  textAlign: "center",
                  maxWidth: "85%",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  wordBreak: "break-word"
                }}
              >
                <Typography variant="body2" fontWeight="700">
                  {activeStory.caption}
                </Typography>
              </Box>
            )}

            {/* Story Footer Panel (Likes & DM Reply textfield) */}
            <Box
              sx={{
                p: 2.5,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                <IconButton onClick={() => handleStoryLike(activeStory.id)} sx={{ color: "white", p: 0.5 }}>
                  {activeStory.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <Typography variant="caption" sx={{ fontWeight: "bold", color: "white" }}>
                  {activeStory.likesCount} Likes
                </Typography>
              </Box>

              {/* DM reply text box */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Reply to ${activeStory.authorName}...`}
                  value={storyReplyText}
                  onChange={(e) => setStoryReplyText(e.target.value)}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    input: { color: "white", py: 0.8, fontSize: "0.85rem" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      "& fieldset": { border: "1px solid rgba(255,255,255,0.35)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                    },
                  }}
                />
                <IconButton
                  color="success"
                  onClick={() => handleSendStoryReply(activeStory.id, activeStory.farmerId)}
                  sx={{ bgcolor: "#2e7d32", color: "white", width: 36, height: 36, "&:hover": { bgcolor: "#1b5e20" } }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default Posts;
