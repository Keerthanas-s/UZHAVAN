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
  CircularProgress,
  Collapse,
  Divider,
  Dialog,
} from "@mui/material";
import {
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
  Share,
  Close,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dynamic comments and expansion maps
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});

  // Story states
  const [openStoryDialog, setOpenStoryDialog] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    axiosConfig
      .get("/posts?userType=ADMIN&userId=1")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts for admin:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadStories = () => {
    axiosConfig
      .get("/stories?userType=ADMIN&userId=1")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setStories(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stories for admin:", err);
      });
  };

  useEffect(() => {
    loadPosts();
    loadStories();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post for content moderation?")) return;
    try {
      await axiosConfig.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully (Moderated)");
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story for content moderation?")) return;
    try {
      await axiosConfig.delete(`/stories/${storyId}`);
      toast.success("Story moderated and deleted!");
      setOpenStoryDialog(false);
      loadStories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete story");
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

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1 }}>
        Feed Moderation Desk 🔑
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Monitor, review, and delete farmer community notice board advertisements and stories.
      </Typography>

      {/* Stories Section for Admin */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4, bgcolor: "#ffffff", overflowX: "auto" }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: "bold", color: "#666" }}>Live Farm Stories:</Typography>
        <Box sx={{ display: "flex", gap: 3.5, px: 1 }}>
          {stories.length > 0 ? (
            stories.map((story) => (
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
                    border: "3px solid #d32f2f", // Red border indicating admin review control
                    boxShadow: "0 2px 8px rgba(211,47,47,0.2)"
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, fontWeight: "600" }}>{story.authorName}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
              No active farm stories to moderate.
            </Typography>
          )}
        </Box>
      </Paper>

      <Box sx={{ maxWidth: "680px", mx: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress color="success" /></Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {posts.length > 0 ? (
              posts.map((post) => {
                const showComments = !!expandedComments[post.id];
                const commentsList = commentsMap[post.id] || [];

                return (
                  <Card key={post.id} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "#d32f2f" }}>
                          {post.authorName ? post.authorName.substring(0, 2).toUpperCase() : "FM"}
                        </Avatar>
                      }
                      action={
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutline />}
                          onClick={() => handleDeletePost(post.id)}
                          sx={{ borderRadius: "8px", fontWeight: "bold" }}
                        >
                          Delete
                        </Button>
                      }
                      title={post.authorName}
                      subheader={post.createdAt ? new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                      titleTypographyProps={{ fontWeight: "700" }}
                    />
                    {post.imageUrl && (
                      <CardMedia
                        component="img"
                        height="300"
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
                        <IconButton disabled>
                          <FavoriteBorder />
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
                      <IconButton onClick={() => toast.success("Copied link")}>
                        <Share />
                      </IconButton>
                    </CardActions>

                    {/* Collapsible comment section */}
                    <Collapse in={showComments} timeout="auto" unmountOnExit>
                      <Divider />
                      <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          {commentsList.length > 0 ? (
                            commentsList.map((comm) => (
                              <Box key={comm.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                <Avatar sx={{ bgcolor: comm.authorType === "FARMER" ? "#2e7d32" : "#0a66c2", width: 28, height: 28, fontSize: "0.75rem", fontWeight: "bold" }}>
                                  {comm.authorName.substring(0, 2).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="700" color="#333">
                                      {comm.authorName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      ({comm.authorType})
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.primary">
                                    {comm.content}
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", py: 1 }}>
                              No comments on this post.
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Collapse>
                  </Card>
                );
              })
            ) : (
              <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px" }}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight="700">
                  No crop postings listed yet.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>

      {/* Dynamic Story View Dialog for Admin Moderation */}
      <Dialog open={openStoryDialog} onClose={() => setOpenStoryDialog(false)} maxWidth="xs" fullWidth>
        {activeStory && (
          <Box sx={{ position: "relative", bgcolor: "black", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyBetween: "space-between", width: "100%", position: "absolute", zIndex: 1, p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                <Avatar sx={{ bgcolor: "#2e7d32" }}>
                  {activeStory.authorName.substring(0, 2).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">{activeStory.authorName}</Typography>
              </Box>
              <IconButton onClick={() => setOpenStoryDialog(false)} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Box>

            {/* Main story media image */}
            <Box
              component="img"
              src={activeStory.imageUrl}
              sx={{ width: "100%", height: "480px", objectFit: "cover" }}
            />

            {/* Story text overlay */}
            {activeStory.caption && (
              <Box
                sx={{
                  position: "absolute",
                  top: "35%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0, 0, 0, 0.65)",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  textAlign: "center",
                  maxWidth: "80%",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <Typography variant="body1" fontWeight="700">
                  {activeStory.caption}
                </Typography>
              </Box>
            )}

            {/* Story Moderation Footer */}
            <Box
              sx={{
                p: 2,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {activeStory.likesCount} Likes
              </Typography>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteStory(activeStory.id)}
                sx={{ borderRadius: "8px", fontWeight: "bold" }}
              >
                Moderate / Delete Story
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default Posts;
