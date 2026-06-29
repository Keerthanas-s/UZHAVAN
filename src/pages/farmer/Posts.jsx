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
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Collapse,
  Divider,
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
  CameraAlt,
  Close,
  Delete,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostPrice, setNewPostPrice] = useState("");
  const [newPostStock, setNewPostStock] = useState("");
  
  // Story management states
  const [openStoryDialog, setOpenStoryDialog] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [openAddStoryDialog, setOpenAddStoryDialog] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState("");
  const [newStoryCaption, setNewStoryCaption] = useState("");

  // Dynamic comments and expansion maps
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const [profileName, setProfileName] = useState("Farmer");

  // Share Dialog States
  const [sharePost, setSharePost] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Fetch logged-in farmer profile name
  const fetchProfileName = () => {
    const farmerId = localStorage.getItem("userId");
    if (!farmerId) return;

    axiosConfig
      .get(`/farmers/${farmerId}`)
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
      .get(`/posts?userType=FARMER&userId=${userId}`)
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
      .get(`/stories?userType=FARMER&userId=${userId}`)
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
      const res = await axiosConfig.post(`/posts/${postId}/like?userType=FARMER&userId=${userId}`);
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) {
      toast.error("Please add some description");
      return;
    }

    const farmerId = localStorage.getItem("userId");
    const payload = {
      authorName: profileName,
      farmerId: Number(farmerId),
      content: newPostText,
      price: newPostPrice ? `₹${newPostPrice}/kg` : null,
      stock: newPostStock ? `${newPostStock} kg available` : null,
      imageUrl: newPostImage || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600",
    };

    try {
      await axiosConfig.post("/posts", payload);
      toast.success("Post published successfully");
      setNewPostText("");
      setNewPostImage("");
      setNewPostPrice("");
      setNewPostStock("");
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post");
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!newStoryImage.trim()) {
      toast.error("Please select a photo or enter a story image URL");
      return;
    }

    const farmerId = localStorage.getItem("userId");
    const payload = {
      farmerId: Number(farmerId),
      authorName: profileName,
      imageUrl: newStoryImage,
      caption: newStoryCaption,
    };

    try {
      await axiosConfig.post("/stories", payload);
      toast.success("Story posted successfully!");
      setNewStoryImage("");
      setNewStoryCaption("");
      setOpenAddStoryDialog(false);
      loadStories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload story");
    }
  };

  const handleStoryLike = async (storyId) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axiosConfig.post(`/stories/${storyId}/like?userType=FARMER&userId=${userId}`);
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

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await axiosConfig.delete(`/stories/${storyId}`);
      toast.success("Story deleted");
      setOpenStoryDialog(false);
      loadStories();
    } catch (err) {
      console.error(err);
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

    const farmerId = localStorage.getItem("userId");
    const payload = {
      authorName: profileName,
      authorType: "FARMER",
      authorId: Number(farmerId),
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

  // Open Share Dialog and fetch customers list
  const handleOpenShare = (post) => {
    setSharePost(post);
    setLoadingCustomers(true);
    axiosConfig
      .get("/customers")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCustomers(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCustomers(false));
  };

  // Share post message to DM
  const handleShareToCustomer = async (customer) => {
    if (!sharePost) return;
    const userId = localStorage.getItem("userId");

    const messageText = `[Shared Post]
id: ${sharePost.id}
author: ${sharePost.authorName}
price: ${sharePost.price || "N/A"}
stock: ${sharePost.stock || "N/A"}
content: ${sharePost.content}
image: ${sharePost.imageUrl || ""}`;

    const payload = {
      senderType: "FARMER",
      senderId: Number(userId),
      receiverType: "CUSTOMER",
      receiverId: Number(customer.id),
      content: messageText,
    };

    try {
      await axiosConfig.post("/messages", payload);
      toast.success(`Post shared in chat with ${customer.name}!`);
      setSharePost(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to share post in messages");
    }
  };

  const handlePostFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1 }}>
        Community Feed & Stories 🌾
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Advertise crops, share organic farming tips, and check consumer comment boards.
      </Typography>

      {/* Stories Section */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4, bgcolor: "#ffffff", overflowX: "auto" }}>
        <Box sx={{ display: "flex", gap: 3.5, px: 1 }}>
          {/* Add story button */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => setOpenAddStoryDialog(true)}>
            <Avatar sx={{ width: 65, height: 65, border: "3px dashed #2e7d32", bgcolor: "#f1f8e9", color: "#2e7d32" }}>
              <CameraAlt />
            </Avatar>
            <Typography variant="caption" sx={{ mt: 1, fontWeight: "600" }}>Add Story</Typography>
          </Box>

          {/* Stories list */}
          {stories.map((story) => (
            <Box
              key={story.id}
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
              onClick={() => {
                setActiveStory(story);
                setOpenStoryDialog(true);
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
          ))}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column: Create Post */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", bgcolor: "#ffffff" }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 2, color: "#1b5e20" }}>
              Advertise Your Harvest
            </Typography>
            <form onSubmit={handleCreatePost}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What are you harvesting today?"
                placeholder="Describe quality, variety, or harvest timing..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price (₹/kg)"
                    type="number"
                    value={newPostPrice}
                    onChange={(e) => setNewPostPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity (kg)"
                    type="number"
                    value={newPostStock}
                    onChange={(e) => setNewPostStock(e.target.value)}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Image Link (Unsplash URL etc.)"
                  placeholder="Paste image link here..."
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">Or upload picture from local media:</Typography>
                  <Button variant="outlined" color="success" size="small" component="label" sx={{ textTransform: "none", borderRadius: "8px" }}>
                    Choose File
                    <input type="file" accept="image/*" hidden onChange={handlePostFileSelect} />
                  </Button>
                </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                startIcon={<Send />}
                sx={{ borderRadius: "12px", py: 1.5, fontWeight: "bold" }}
              >
                Publish Post
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Right Column: Dynamic Feed */}
        <Grid item xs={12} md={7}>
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
                    No harvests advertised yet. Publish the first post!
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Add Story Dialog */}
      <Dialog open={openAddStoryDialog} onClose={() => setOpenAddStoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "800", color: "#1b5e20" }}>Publish Farm Story 📸</DialogTitle>
        <form onSubmit={handleCreateStory}>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Image Link (Unsplash crop photo etc.)"
                placeholder="Paste story picture link here..."
                value={newStoryImage}
                onChange={(e) => setNewStoryImage(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary">Or upload picture from local media:</Typography>
                <Button variant="outlined" color="success" size="small" component="label" sx={{ textTransform: "none", borderRadius: "8px" }}>
                  Choose File
                  <input type="file" accept="image/*" hidden onChange={handleStoryFileSelect} />
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Story Text overlay / Caption"
              placeholder="E.g. Harvesting fresh organic brinjals now!"
              value={newStoryCaption}
              onChange={(e) => setNewStoryCaption(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddStoryDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="success" sx={{ fontWeight: "bold" }}>
              Publish Story
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Direct Messaging Share Post Dialog */}
      <Dialog open={!!sharePost} onClose={() => setSharePost(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "800", color: "#1b5e20", pb: 1 }}>Share Post in Messages ✈️</DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Choose a customer contact to send this harvest details directly.
          </Typography>
          {loadingCustomers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={30} color="success" /></Box>
          ) : (
            <List sx={{ pt: 0 }}>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <ListItemButton key={c.id} onClick={() => handleShareToCustomer(c)} sx={{ borderRadius: "10px", mb: 0.5 }}>
                    <Avatar sx={{ bgcolor: "#0a66c2", mr: 2, width: 36, height: 36 }}>
                      {c.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <ListItemText primary={c.name} secondary={c.district || "Customer"} />
                  </ListItemButton>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                  No active customers found.
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
              <Box>
                <IconButton onClick={() => handleDeleteStory(activeStory.id)} sx={{ color: "white", mr: 0.5 }}>
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setOpenStoryDialog(false)} sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </Box>
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

            {/* Story Footer Panel (Likes & delete layout) */}
            <Box
              sx={{
                p: 2.5,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <IconButton onClick={() => handleStoryLike(activeStory.id)} sx={{ color: "white", p: 0.5 }}>
                  {activeStory.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <Typography variant="caption" sx={{ fontWeight: "bold", color: "white" }}>
                  {activeStory.likesCount} Likes
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default Posts;
