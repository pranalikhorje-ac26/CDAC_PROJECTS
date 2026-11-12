import { useEffect, useState } from "react";

import {
  Box, Typography, Card,
  CardContent,Button,CircularProgress,Alert,Stack, Chip,Paper,
  Table,TableBody,TableCell,TableContainer,
  TableHead,TableRow,IconButton, Tooltip,Dialog,
  DialogTitle,DialogContent,DialogActions,MenuItem,TextField,
} from "@mui/material";

import OutgoingMailIcon from "@mui/icons-material/OutgoingMail";
import RefreshIcon from "@mui/icons-material/Refresh";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // FETCH CONTACT MESSAGES
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/contact");

      setMessages(response.data.messages || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||"Unable to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // UPDATE MESSAGE STATUS
  const handleStatusChange = async (messageId, status) => {
    try {
      setError("");

      const response = await api.patch(
        `/contact/${messageId}/status`,
        { status }
      );

      const updatedMessage = response.data.data;

      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message._id === messageId ? updatedMessage : message) );

      if (selectedMessage?._id === messageId) {
        setSelectedMessage(updatedMessage);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update message status.");
    }
  };

  // OPEN DELETE CONFIRMATION
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteOpen(true);
  };

  // DELETE MESSAGE
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      await api.delete(`/contact/${messageToDelete._id}`);

      setMessages((previousMessages) =>
        previousMessages.filter(
          (message) => message._id !== messageToDelete._id)
      );

      if (selectedMessage?._id === messageToDelete._id) {
        setViewOpen(false);
        setSelectedMessage(null);
      }

      setDeleteOpen(false);
      setMessageToDelete(null);
    } catch (err) {
      setError( err.response?.data?.message || "Unable to delete contact message.");
    }
  };

  // OPEN MESSAGE DETAILS
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setViewOpen(true);
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // STATUS COUNTS
  const totalMessages = messages.length;

  const newMessages = messages.filter(
    (message) => message.status === "new"
  ).length;

  const readMessages = messages.filter(
    (message) => message.status === "read"
  ).length;

  const repliedMessages = messages.filter(
    (message) => message.status === "replied"
  ).length;

  // STATUS CHIP
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "primary";
      case "read":
        return "warning";
      case "replied":
        return "success";
      default:
        return "default";
    }
  };

  // SUMMARY CARDS
  const summaryCards = [
    {
      title: "Total Messages",
      value: totalMessages,
      icon: <OutgoingMailIcon />,
      color: "#2563EB",
      background: "#DBEAFE",
    },
    {
      title: "New Messages",
      value: newMessages,
      icon: <MarkEmailUnreadIcon />,
      color: "#DC2626",
      background: "#FEE2E2",
    },
    {
      title: "Read Messages",
      value: readMessages,
      icon: <MarkEmailReadIcon />,
      color: "#D97706",
      background: "#FEF3C7",
    },
    {
      title: "Replied Messages",
      value: repliedMessages,
      icon: <ReplyIcon />,
      color: "#16A34A",
      background: "#DCFCE7",
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>

        {/* PAGE HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                backgroundColor: "#DBEAFE",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <OutgoingMailIcon sx={{ fontSize: 30 }} />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                color="#172033"
              >
                Contact Messages
              </Typography>

              <Typography color="text.secondary">
                View and manage messages received from users.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMessages}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1.2,
            }}
          >
            Refresh Messages
          </Button>
        </Box>

        {/* ERROR MESSAGE */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* SUMMARY CARDS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {summaryCards.map((item) => (
            <Card
              key={item.title}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {item.title}
                  </Typography>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      backgroundColor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: item.color }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* CONTACT MESSAGES TABLE */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #E5E7EB",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#172033"
              mb={3}
            >
              All Contact Messages
            </Typography>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 250,
                }}
              >
                <CircularProgress />
              </Box>
            ) : messages.length === 0 ? (
              <Alert severity="info">
                No contact messages received yet.
              </Alert>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: "#F8FAFC" }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>
                        Name
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        Email
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        Subject
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        Date
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        Status
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{ fontWeight: 700 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {messages.map((message) => (
                      <TableRow
                        key={message._id}
                        hover
                      >
                        <TableCell>
                          <Typography fontWeight={600}>
                            {message.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {message.email}
                        </TableCell>

                        <TableCell>
                          {message.subject}
                        </TableCell>

                        <TableCell>
                          {formatDate(message.createdAt)}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={message.status || "new"}
                            color={getStatusColor(message.status)}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                          >
                            <Tooltip title="View Message">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleViewMessage(message)
                                }
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Message">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDeleteClick(message)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <TextField
                            select
                            size="small"
                            value={message.status || "new"}
                            onChange={(e) =>
                              handleStatusChange(
                                message._id,
                                e.target.value
                              )
                            }
                            sx={{
                              mt: 1,
                              width: 120,
                              "& .MuiSelect-select": {
                                py: 0.7,
                                fontSize: 12,
                              },
                            }}
                          >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="read">Read</MenuItem>
                            <MenuItem value="replied">Replied</MenuItem>
                          </TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* VIEW MESSAGE DIALOG */}
        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            Message Details

            <IconButton onClick={() => setViewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {selectedMessage && (
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Name
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedMessage.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Email
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedMessage.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Subject
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedMessage.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Date
                  </Typography>
                  <Typography>
                    {formatDate(selectedMessage.createdAt)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    Message
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {selectedMessage.message}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    Update Status
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={selectedMessage.status || "new"}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedMessage._id,
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="replied">Replied</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setViewOpen(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG */}
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle fontWeight={700}>
            Delete Contact Message?
          </DialogTitle>

          <DialogContent>
            <Typography color="text.secondary">
              Are you sure you want to delete this contact message?
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setDeleteOpen(false)}
              color="inherit"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteMessage}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </DashboardLayout>
  );
}

export default AdminContactMessages;