import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            setUsers(response.data.users || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // OPEN CONFIRMATION DIALOG
    const handleStatusClick = (user) => {
        setSelectedUser(user);
        setConfirmOpen(true);
        setSuccessMessage("");
    };

    // CLOSE DIALOG
    const handleCloseDialog = () => {
        if (actionLoading) return;

        setConfirmOpen(false);
        setSelectedUser(null);
    };

    // BLOCK / UNBLOCK USER
    const handleUpdateStatus = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");

            const newStatus = !selectedUser.isBlocked;

            const response = await api.patch(
                `/admin/users/${selectedUser._id}/status`,
                {
                    isBlocked: newStatus
                }
            );

            setSuccessMessage(
                response.data.message ||
                "User status updated successfully."
            );

            setConfirmOpen(false);
            setSelectedUser(null);

            await fetchUsers();

        } catch (err) {
            setError(err.response?.data?.message ||"Unable to update user status.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <DashboardLayout>

            <Box>

                {/* PAGE HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 4
                    }}
                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                        <PeopleIcon sx={{ fontSize: 40, color: "#2563EB" }} />

                        <Box>

                            <Typography variant="h4" fontWeight={700} color="#172033">
                                Manage Users
                            </Typography>

                            <Typography color="text.secondary">
                                View and manage registered SpendWise users.
                            </Typography>

                        </Box>

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                </Box>

                {/* SUCCESS MESSAGE */}
                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                        onClose={() => setSuccessMessage("")}
                    >
                        {successMessage}
                    </Alert>
                )}

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

                {/* TOTAL USERS */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #E5E7EB"
                    }}
                >

                    <CardContent>

                        <Typography color="text.secondary">
                            Total Registered Users
                        </Typography>

                        <Typography variant="h4" fontWeight={700} color="#2563EB">
                            {users.length}
                        </Typography>

                    </CardContent>

                </Card>

                {/* USER TABLE */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #E5E7EB"
                    }}
                >

                    <CardContent>

                        <Typography variant="h6" fontWeight={700} mb={3}>
                            Registered Users
                        </Typography>

                        {loading ? (

                            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                                <CircularProgress />
                            </Box>

                        ) : error && users.length === 0 ? (

                            <Alert severity="error">
                                {error}
                            </Alert>

                        ) : users.length === 0 ? (

                            <Typography color="text.secondary" textAlign="center" py={4}>
                                No registered users found.
                            </Typography>

                        ) : (

                            <TableContainer>

                                <Table>

                                    <TableHead>

                                        <TableRow sx={{ backgroundColor: "#F8FAFC" }}>

                                            <TableCell><b>Sr. No.</b></TableCell>
                                            <TableCell><b>Username</b></TableCell>
                                            <TableCell><b>Email</b></TableCell>
                                            <TableCell><b>Phone Number</b></TableCell>
                                            <TableCell><b>Role</b></TableCell>
                                            <TableCell><b>Account Status</b></TableCell>
                                            <TableCell><b>Action</b></TableCell>

                                        </TableRow>

                                    </TableHead>

                                    <TableBody>

                                        {users.map((user, index) => {

                                            const isBlocked = user.isBlocked === true;
                                            const isAdmin = user.role === "admin";

                                            return (

                                                <TableRow key={user._id} hover>

                                                    <TableCell>{index + 1}</TableCell>

                                                    <TableCell>{user.username}</TableCell>

                                                    <TableCell>{user.email}</TableCell>

                                                    <TableCell>{user.phone_no || "N/A"}</TableCell>

                                                    <TableCell>

                                                        <Chip
                                                            label={user.role}
                                                            size="small"
                                                            color={
                                                                isAdmin
                                                                    ? "primary"
                                                                    : user.role === "accountant"
                                                                        ? "warning"
                                                                        : "success"
                                                            }
                                                            sx={{ textTransform: "capitalize" }}
                                                        />

                                                    </TableCell>

                                                    {/* ACCOUNT STATUS */}
                                                    <TableCell>

                                                        <Chip
                                                            label={isBlocked ? "Blocked" : "Active"}
                                                            size="small"
                                                            color={isBlocked ? "error" : "success"}
                                                            variant="outlined"
                                                        />

                                                    </TableCell>

                                                    {/* ACTION */}
                                                    <TableCell>

                                                        {isAdmin ? (

                                                            <Chip
                                                                label="Protected"
                                                                size="small"
                                                                color="primary"
                                                            />

                                                        ) : (

                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color={isBlocked ? "success" : "error"}
                                                                startIcon={
                                                                    isBlocked
                                                                        ? <CheckCircleIcon />
                                                                        : <BlockIcon />
                                                                }
                                                                onClick={() => handleStatusClick(user)}
                                                                sx={{
                                                                    width: 85,
                                                                    minWidth: 85,
                                                                    height: 28,
                                                                    padding: "3px 6px",
                                                                    borderRadius: 2,
                                                                    fontSize: "10px",
                                                                    fontWeight: 600,
                                                                    textTransform: "uppercase",

                                                                    // Block = Red, Unblock = Light Yellow
                                                                    backgroundColor: isBlocked ? "#FFF59D" : "#DC2626",
                                                                    color: isBlocked ? "#854D0E" : "#FFFFFF",

                                                                    "&:hover": {
                                                                        backgroundColor: isBlocked ? "#FDE68A" : "#B91C1C"
                                                                    },

                                                                    "& .MuiButton-startIcon": {
                                                                        marginRight: "4px",
                                                                        marginLeft: 0,
                                                                        "& svg": {
                                                                            fontSize: 15
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {isBlocked ? "Unblock" : "Block"}
                                                            </Button>

                                                        )}

                                                    </TableCell>

                                                </TableRow>

                                            );

                                        })}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        )}

                    </CardContent>

                </Card>

                {/* CONFIRMATION DIALOG */}
                <Dialog
                    open={confirmOpen}
                    onClose={handleCloseDialog}
                    maxWidth="xs"
                    fullWidth
                >

                    <DialogTitle>
                        {selectedUser?.isBlocked
                            ? "Unblock User?"
                            : "Block User?"}
                    </DialogTitle>

                    <DialogContent>

                        <DialogContentText>
                            Are you sure you want to{" "}
                            {selectedUser?.isBlocked ? "unblock" : "block"}{" "}
                            <b>{selectedUser?.username}</b>?

                            {selectedUser?.isBlocked ? " This user will be able to log in again.": " This user will no longer be able to log in."}
                        </DialogContentText>

                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>

                        <Button
                            onClick={handleCloseDialog}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color={selectedUser?.isBlocked ? "success" : "error"}
                            onClick={handleUpdateStatus}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? "Please wait..."
                                : selectedUser?.isBlocked
                                    ? "Unblock User"
                                    : "Block User"}
                        </Button>

                    </DialogActions>

                </Dialog>

            </Box>

        </DashboardLayout>
    );
}

export default ManageUsers;