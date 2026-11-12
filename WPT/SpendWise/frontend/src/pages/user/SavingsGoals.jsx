import { useState, useEffect } from "react";

import {
    Box,
    Typography,Card,CardContent,Grid,
    Button,
    Dialog,DialogTitle,
    DialogContent,DialogActions,
    TextField,LinearProgress,Chip,Divider,Table, TableBody,TableCell, TableContainer,TableHead,TableRow,Paper
} from "@mui/material";

import {
    Add,Savings, AccountBalanceWallet,TrendingUp,Edit,Delete,History
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function SavingsGoals() {

    const [goals, setGoals] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // CREATE GOAL STATES
    const [formData, setFormData] = useState({
        goalName: "",
        targetAmount: "",
        targetDate: "",
        description: ""
    });

    const [goalNameError, setGoalNameError] = useState("");

    // ADD MONEY STATES
    const [moneyOpen, setMoneyOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [amount, setAmount] = useState("");

    // EDIT GOAL STATES
    const [editOpen, setEditOpen] = useState(false);
    const [editGoalId, setEditGoalId] = useState(null);
    const [editGoalNameError, setEditGoalNameError] = useState("");

    const [editData, setEditData] = useState({
        goalName: "",
        targetAmount: "",
        targetDate: "",
        description: ""
    });

    // DELETE GOAL STATES
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteGoal, setDeleteGoal] = useState(null);

    // SAVINGS HISTORY STATES
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyGoal, setHistoryGoal] = useState(null);

    const token = localStorage.getItem("token");

    // FETCH SAVINGS GOALS
    const fetchGoals = async () => {
        try {
            const response = await api.get("/savings-goals", {
                headers: {
                    Authorization: `Bearer ${token}`
                }});
            setGoals(response.data.goals || []);
        } catch (error) {
            console.error("Error fetching savings goals:", error);
        }
    };

    useEffect(() => {fetchGoals();}, []);

    // VALIDATE GOAL NAME
    const validateGoalName = (name) => {
        const regex = /^[A-Za-z ]+$/;
        if (!name.trim()) {
            return "Goal name is required";
        }
        if (!regex.test(name.trim())) {
            return "Only letters and spaces are allowed";
        }
        return "";
    };

    // CREATE GOAL FORM INPUT
    const handleChange = (event) => {
        setFormData({...formData,[event.target.name]: event.target.value
        });
    };

    // OPEN CREATE GOAL DIALOG
    const handleOpen = () => {
        setFormData({
            goalName: "",
            targetAmount: "",
            targetDate: "",
            description: ""
        });
        setGoalNameError("");
        setOpen(true);
    };

    // CLOSE CREATE GOAL DIALOG
    const handleClose = () => {
        setOpen(false);
        setGoalNameError("");
    };

    // CREATE NEW GOAL
    const handleAddGoal = async () => {
        try {
            // Validate goal name
            const nameError = validateGoalName(formData.goalName);
            if (nameError) {
                setGoalNameError(nameError);
                return;
            }

            setGoalNameError("");
            // Validate other fields
            if (
                !formData.targetAmount ||!formData.targetDate ||Number(formData.targetAmount) <= 0) {
                alert("Please fill all required fields correctly.");
                return;
            }

            setLoading(true);
            const goalData = {
                goalName: formData.goalName.trim(),
                targetAmount: Number(formData.targetAmount),
                targetDate: formData.targetDate,
                description: formData.description
            };

            const response = await api.post(
                "/savings-goals",goalData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message ||"Savings goal created successfully!");
            setOpen(false);
            await fetchGoals();
        } catch (error) {
            alert(error.response?.data?.message ||"Failed to create savings goal." );

        } finally {
            setLoading(false);
        }
    };

    // OPEN ADD MONEY DIALOG
    const handleMoneyOpen = (goal) => {

        setSelectedGoal(goal);
        setAmount("");
        setMoneyOpen(true);
    };

    // CLOSE ADD MONEY DIALOG
    const handleMoneyClose = () => {

        setMoneyOpen(false);
        setSelectedGoal(null);
        setAmount("");
    };

    // ADD MONEY TO SAVINGS GOAL
    const handleAddMoney = async () => {
        try {
            const money = Number(amount);
            if (!amount || !Number.isFinite(money) || money <= 0) {
                alert("Please enter a valid amount greater than zero.");
                return;
            }

            if (money > Number(selectedGoal.remainingAmount)) {
                alert("Amount cannot be greater than the remaining target amount.");
                return;
            }

            setLoading(true);
            const response = await api.patch(`/savings-goals/${selectedGoal._id}/add-money`,
                { amount: money },
                {
                    headers: {Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message ||"Money added successfully!");

            handleMoneyClose();
            await fetchGoals();

        } catch (error) {
            alert(error.response?.data?.message ||"Failed to add money.");

        } finally {
            setLoading(false);
        }
    };

    // OPEN EDIT GOAL DIALOG
    const handleEditOpen = (goal) => {

        setEditGoalId(goal._id);
        setEditGoalNameError("");
        setEditData({
            goalName: goal.goalName,
            targetAmount: goal.targetAmount,
            targetDate: new Date(goal.targetDate)
                .toISOString().split("T")[0],
            description: goal.description || ""
        });
        setEditOpen(true);
    };

    // HANDLE EDIT FORM INPUT
    const handleEditChange = (event) => {

        setEditData({
            ...editData,[event.target.name]: event.target.value
        });
    };

    // CLOSE EDIT GOAL DIALOG
    const handleEditClose = () => {

        setEditOpen(false);
        setEditGoalId(null);
        setEditGoalNameError("");
    };

    // UPDATE SAVINGS GOAL
    const handleUpdateGoal = async () => {
        try {
            // Validate goal name
            const nameError = validateGoalName(editData.goalName);
            if (nameError) {
                setEditGoalNameError(nameError);
                return;
            }

            setEditGoalNameError("");

            // Validate other fields
            if (
                !editData.targetAmount ||
                !editData.targetDate ||
                Number(editData.targetAmount) <= 0 ) {
                alert("Please fill all required fields correctly.");
                return;
            }

            // Find current goal
            const currentGoal = goals.find(
                (goal) => goal._id === editGoalId);

            if (!currentGoal) {
                alert("Savings goal not found.");
                return;
            }

            // Target amount should not be less than saved amount
            if (Number(editData.targetAmount) <Number(currentGoal.savedAmount)) {
                alert("Target amount cannot be less than the amount already saved.");
                return;
            }

            setLoading(true);
            const updatedData = {
                goalName: editData.goalName.trim(),
                targetAmount: Number(editData.targetAmount),
                targetDate: editData.targetDate,
                description: editData.description
            };

            const response = await api.put(`/savings-goals/${editGoalId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }});

            alert(response.data.message ||"Savings goal updated successfully!");

            handleEditClose();
            await fetchGoals();

        } catch (error) {

            alert(error.response?.data?.message ||"Failed to update savings goal.");

        } finally {
            setLoading(false);
        }
    };

    // OPEN DELETE CONFIRMATION
    const handleDeleteOpen = (goal) => {

        setDeleteGoal(goal);
        setDeleteOpen(true);
    };

    // CLOSE DELETE CONFIRMATION
    const handleDeleteClose = () => {

        setDeleteOpen(false);
        setDeleteGoal(null);
    };

    // DELETE SAVINGS GOAL
    const handleDeleteGoal = async () => {

        try {
            setLoading(true);
            const response = await api.delete(
                `/savings-goals/${deleteGoal._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message ||"Savings goal deleted successfully!" );

            handleDeleteClose();
            await fetchGoals();

        } catch (error) {

            alert( error.response?.data?.message ||"Failed to delete savings goal.");

        } finally {
            setLoading(false);
        }
    };

    // OPEN SAVINGS HISTORY
    const handleHistoryOpen = (goal) => {

        setHistoryGoal(goal);
        setHistoryOpen(true);
    };

    // CLOSE SAVINGS HISTORY
    const handleHistoryClose = () => {

        setHistoryOpen(false);
        setHistoryGoal(null);
    };

    // FORMAT DATE AND TIME
    const formatDateTime = (date) => {

        if (!date) {
            return "Date unavailable";
        }

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    // SUMMARY CALCULATIONS
    const totalGoals = goals.length;

    const totalTarget = goals.reduce(
        (sum, goal) => sum + Number(goal.targetAmount || 0),0);

    const totalSaved = goals.reduce(
        (sum, goal) => sum + Number(goal.savedAmount || 0),0);
    return (
        <DashboardLayout>
            <Box>

                {/* PAGE HEADING */}
                <Box sx={{ display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 4}}>
                    <Box>
                        <Typography variant="h4"
                            fontWeight="bold"
                            color="#172033">
                            Savings Goals
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Set savings targets and track your progress.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpen} sx={{
                            backgroundColor: "#2563EB",
                            textTransform: "none",
                            borderRadius: 2,px: 3,py: 1.2}} >Add Savings Goal
                    </Button>
                </Box>

                {/* SUMMARY CARDS */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Savings sx={{ color: "#2563EB", fontSize: 35 }}/>
                                <Typography color="text.secondary" sx={{ mt: 2 }}>
                                    Total Goals
                                </Typography>

                                <Typography variant="h4" fontWeight="bold">
                                    {totalGoals}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <AccountBalanceWallet
                                    sx={{ color: "#7C3AED", fontSize: 35 }}/>

                                <Typography color="text.secondary" sx={{ mt: 2 }}>
                                    Total Target
                                </Typography>

                                <Typography variant="h4" fontWeight="bold">
                                    ₹{totalTarget.toLocaleString("en-IN")}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <TrendingUp sx={{ color: "#16A34A", fontSize: 35 }}/>

                                <Typography color="text.secondary" sx={{ mt: 2 }}>
                                    Total Saved
                                </Typography>

                                <Typography variant="h4" fontWeight="bold">
                                    ₹{totalSaved.toLocaleString("en-IN")}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* INDIVIDUAL GOALS */}
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Your Savings Goals
                </Typography>

                <Grid container spacing={3}>
                    {goals.length === 0 ? (

                        <Grid size={{ xs: 12 }}>

                            <Card sx={{borderRadius: 3,textAlign: "center",p: 5}}>
                                <Savings sx={{ fontSize: 55, color: "#94A3B8" }}/>
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    No Savings Goals Found
                                </Typography>

                                <Typography color="text.secondary">
                                    Create your first savings goal to start saving.
                                </Typography>
                            </Card>
                        </Grid>) : (
                        goals.map((goal) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}
                                key={goal._id} >

                                <Card sx={{
                                        borderRadius: 3,
                                        boxShadow: 2,
                                        border: "1px solid #E5E7EB",
                                        height: "100%"}}>

                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"}} >

                                            <Typography variant="h6" fontWeight="bold">
                                                {goal.goalName}
                                            </Typography>

                                            <Chip label={goal.status}
                                                color={goal.status === "completed"? "success": "primary"}size="small" />
                                        </Box>

                                        <Typography color="text.secondary"sx={{ mt: 1 }}>
                                            {goal.description || "Savings goal"}
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography color="text.secondary">Target Amount</Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight="bold">
                                            ₹{Number(goal.targetAmount).toLocaleString("en-IN")}
                                        </Typography>

                                        <Box sx={{ display: "flex",
                                                justifyContent: "space-between",mt: 2}}>
                                            <Box>

                                                <Typography variant="body2"color="text.secondary">Saved</Typography>
                                                <Typography
                                                    fontWeight="bold"
                                                    color="success.main">
                                                    ₹{Number(goal.savedAmount).toLocaleString("en-IN")}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: "right" }}>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary">
                                                    Remaining
                                                </Typography>

                                                <Typography
                                                    fontWeight="bold"
                                                    color="error.main">
                                                    ₹{Number(goal.remainingAmount).toLocaleString("en-IN")}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* PROGRESS BAR */}
                                        <Box sx={{ mt: 3 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(
                                                    Math.max(
                                                        Number(goal.progressPercentage || 0),
                                                        0),100 )}
                                                color="success"
                                                sx={{height: 9, borderRadius: 5 }}/>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 1 }}>
                                                {Number(
                                                    goal.progressPercentage || 0).toFixed(1)}% completed
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 2 }}>
                                            Target Date:{" "}
                                            {new Date(goal.targetDate).toLocaleDateString("en-IN")}
                                        </Typography>

                                        {/* VIEW HISTORY BUTTON */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<History />}
                                            onClick={() => handleHistoryOpen(goal)}
                                            sx={{
                                                mt: 3,
                                                textTransform: "none",
                                                borderRadius: 2,
                                                color: "#7C3AED",
                                                borderColor: "#7C3AED"
                                            }}>
                                            View Savings History
                                        </Button>

                                        {/* EDIT BUTTON */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            onClick={() => handleEditOpen(goal)}
                                            sx={{
                                                mt: 1.5,
                                                textTransform: "none",
                                                borderRadius: 2}}>
                                            Edit Goal
                                        </Button>

                                        {/* ADD MONEY BUTTON */}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<Add />}
                                            disabled={goal.status === "completed"}
                                            onClick={() => handleMoneyOpen(goal)}
                                            sx={{
                                                mt: 1.5,
                                                backgroundColor: "#16A34A",
                                                textTransform: "none",
                                                borderRadius: 2,
                                                "&:hover": {
                                                    backgroundColor: "#15803D"
                                                }}}>
                                            {goal.status === "completed"? "Goal Completed": "Add Money"}
                                        </Button>

                                        {/* DELETE BUTTON */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => handleDeleteOpen(goal)}
                                            sx={{mt: 1.5,
                                                textTransform: "none",
                                                borderRadius: 2}}>Delete Goal
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}

                </Grid>

                {/* CREATE GOAL DIALOG */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="sm">

                    <DialogTitle fontWeight="bold"> Create Savings Goal</DialogTitle>

                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Goal Name"
                            name="goalName"
                            value={formData.goalName}
                            onChange={(e) => {
                                handleChange(e);
                                setGoalNameError("");
                            }}
                            error={Boolean(goalNameError)}
                            helperText={goalNameError}
                            margin="normal"
                            placeholder="Example: Buy a Laptop"/>

                        <TextField
                            fullWidth
                            type="number"
                            label="Target Amount (₹)"
                            name="targetAmount"
                            value={formData.targetAmount}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 1 }}/>

                        <TextField
                            fullWidth
                            type="date"
                            label="Target Date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}/>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description (Optional)"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"/>

                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} color="inherit">
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleAddGoal}
                            disabled={loading}>
                            {loading ? "Saving..." : "Create Goal"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* EDIT GOAL DIALOG */}
                <Dialog
                    open={editOpen}
                    onClose={handleEditClose}
                    fullWidth
                    maxWidth="sm">

                    <DialogTitle fontWeight="bold">Edit Savings Goal</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Goal Name"
                            name="goalName"
                            value={editData.goalName}
                            onChange={(e) => {
                                handleEditChange(e);
                                setEditGoalNameError("");
                            }}
                            error={Boolean(editGoalNameError)}
                            helperText={editGoalNameError}
                            margin="normal"/>

                        <TextField
                            fullWidth
                            type="number"
                            label="Target Amount (₹)"
                            name="targetAmount"
                            value={editData.targetAmount}
                            onChange={handleEditChange}
                            margin="normal"
                            inputProps={{ min: 1 }}
                            helperText="Target amount cannot be less than the amount already saved."/>

                        <TextField
                            fullWidth
                            type="date"
                            label="Target Date"
                            name="targetDate"
                            value={editData.targetDate}
                            onChange={handleEditChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}/>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            margin="normal" />

                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleEditClose} color="inherit">
                            Cancel</Button>

                        <Button
                            variant="contained"
                            onClick={handleUpdateGoal}
                            disabled={loading}>
                            {loading ? "Updating..." : "Update Goal"}
                        </Button>

                    </DialogActions>
                </Dialog>

                {/* ADD MONEY DIALOG */}
                <Dialog
                    open={moneyOpen}
                    onClose={handleMoneyClose}
                    fullWidth
                    maxWidth="xs">

                    <DialogTitle fontWeight="bold">
                        Add Money to Savings
                    </DialogTitle>

                    <DialogContent>
                        {selectedGoal && (
                            <>
                                <Typography sx={{ mt: 1, mb: 2 }}>
                                    Goal: <strong>{selectedGoal.goalName}</strong>
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    variant="body2">Remaining Amount: ₹
                                    {Number(
                                        selectedGoal.remainingAmount).toLocaleString("en-IN")}
                                </Typography>

                                <TextField
                                    fullWidth
                                    autoFocus
                                    type="number"
                                    label="Amount to Save (₹)"
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    margin="normal"
                                    inputProps={{
                                        min: 1,
                                        max: selectedGoal.remainingAmount
                                    }}/>
                                </>)}

                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>

                        <Button onClick={handleMoneyClose} color="inherit">
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleAddMoney}
                            disabled={loading || !amount}
                            sx={{
                                backgroundColor: "#16A34A",
                                "&:hover": {
                                    backgroundColor: "#15803D"
                                }
                            }}>
                            {loading ? "Adding..." : "Add Money"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DELETE CONFIRMATION DIALOG */}
                <Dialog
                    open={deleteOpen}
                    onClose={handleDeleteClose}
                    fullWidth
                    maxWidth="xs">

                    <DialogTitle fontWeight="bold">Delete Savings Goal?</DialogTitle>

                    <DialogContent>
                        <Typography> Are you sure you want to delete{" "}
                            <strong>{deleteGoal?.goalName}</strong>?
                        </Typography>

                        <Typography color="error"
                            variant="body2"
                            sx={{ mt: 2 }}>This action cannot be undone.
                        </Typography>

                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleDeleteClose} color="inherit">
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteGoal}
                            disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                        </Button>

                    </DialogActions>
                </Dialog>

                {/* SAVINGS HISTORY DIALOG */}
                <Dialog open={historyOpen}
                    onClose={handleHistoryClose}
                    fullWidth
                    maxWidth="md">

                    <DialogTitle fontWeight="bold">
                        <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}>
                            <History color="primary" />
                            Savings Contribution History
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        {historyGoal && (
                            <>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ mt: 1 }} >
                                    {historyGoal.goalName}
                                </Typography>

                                <Grid container spacing={2} sx={{ my: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{p: 2,
                                                backgroundColor: "#EFF6FF",
                                                borderRadius: 2 }} >

                                            <Typography variant="body2"color="text.secondary">
                                                Target Amount
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold">
                                                ₹{Number(
                                                    historyGoal.targetAmount
                                                ).toLocaleString("en-IN")}
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{
                                                p: 2,
                                                backgroundColor: "#F0FDF4",
                                                borderRadius: 2
                                            }}>

                                            <Typography variant="body2"
                                                color="text.secondary">
                                                Total Saved
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                color="success.main">
                                                ₹{Number(
                                                    historyGoal.savedAmount
                                                ).toLocaleString("en-IN")}
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{
                                                p: 2,
                                                backgroundColor: "#F5F3FF",
                                                borderRadius: 2}}>

                                            <Typography variant="body2"
                                                color="text.secondary">
                                                Total Contributions
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold">
                                                {historyGoal.contributions?.length || 0}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ mb: 2 }}>Contribution Records
                                </Typography>

                                {historyGoal.contributions?.length > 0 ? (
                                    <TableContainer
                                        component={Paper}
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}>

                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{backgroundColor: "#F5F7FB"
                                                    }}>

                                                    <TableCell>
                                                        <strong>No.</strong>
                                                    </TableCell>

                                                    <TableCell>
                                                        <strong>Date & Time</strong>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <strong>Amount Added</strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {[...historyGoal.contributions]
                                                    .sort((a, b) =>
                                                            new Date(b.date) -
                                                            new Date(a.date)
                                                    )
                                                    .map((contribution, index) => (

                                                        <TableRow
                                                            key={contribution._id || index}
                                                        >

                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell>
                                                                {formatDateTime(contribution.date)}
                                                            </TableCell>

                                                            <TableCell
                                                                align="right"
                                                                sx={{
                                                                    color: "#16A34A",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >
                                                                + ₹{Number(
                                                                    contribution.amount
                                                                ).toLocaleString("en-IN")}
                                                            </TableCell>

                                                        </TableRow>
                                                    ))}
                                         </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: 5,
                                            backgroundColor: "#F9FAFB",
                                            borderRadius: 2
                                        }}>

                                        <History
                                            sx={{
                                                fontSize: 45,
                                                color: "#94A3B8"
                                            }}
                                        />

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 1 }}
                                        >
                                            No Contributions Yet
                                        </Typography>

                                        <Typography color="text.secondary">
                                            Add money to this goal to see your savings history here.
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}

                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>

                        <Button
                            variant="contained"
                            onClick={handleHistoryClose}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2
                            }}>Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>);
}
export default SavingsGoals;