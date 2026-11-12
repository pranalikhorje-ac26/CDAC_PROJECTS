import { useState, useEffect, useRef } from "react";

import {
  Box,Typography, Card,
  CardContent,Grid,
  Button,Dialog,DialogTitle,
  DialogContent,DialogActions,
  TextField,MenuItem,LinearProgress,
  IconButton, Alert,
} from "@mui/material";

import {
  AccountBalanceWallet,Add,Edit,
  Delete,WarningAmber,
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // BUDGET EXCEEDED POPUP
  const [exceededBudgetAlert, setExceededBudgetAlert] = useState(null);

  const notifiedExceededBudgets = useRef(new Set());

  const currentDate = new Date();

  const [formData, setFormData] = useState({
    categoryId: "",
    monthlyLimit: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const token = localStorage.getItem("token");

  // FETCH BUDGETS
  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // FETCH EXPENSE CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allCategories = response.data.categories || [];

      setCategories(allCategories.filter(
          (category) => category.type?.toLowerCase() === "expense"));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // LOAD DATA
  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  // CHECK FOR EXCEEDED BUDGETS
  useEffect(() => {
    if (exceededBudgetAlert) return;

    const exceededBudget = budgets.find((budget) => {
      const spent = Number(budget.totalExpense || 0);
      const limit = Number(budget.monthlyLimit || 0);

      return (
        spent > limit &&
        !notifiedExceededBudgets.current.has(budget._id)
      );
    });

    if (exceededBudget) {
      notifiedExceededBudgets.current.add(exceededBudget._id);
      setExceededBudgetAlert(exceededBudget);
    }
  }, [budgets, exceededBudgetAlert]);

  // CLOSE EXCEEDED POPUP
  const handleCloseExceededAlert = () => {
    setExceededBudgetAlert(null);
  };

  // HANDLE FORM INPUT
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // OPEN ADD DIALOG
  const handleOpen = () => {
    setEditId(null);

    setFormData({
      categoryId: "",
      monthlyLimit: "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    });

    setOpen(true);
  };

  // OPEN EDIT DIALOG
  const handleEdit = (budget) => {
    setEditId(budget._id);

    setFormData({
      categoryId: budget.categoryId?._id || "",
      monthlyLimit: budget.monthlyLimit,
      month: budget.month,
      year: budget.year,
    });

    setOpen(true);
  };

  // CLOSE DIALOG
  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  // SAVE BUDGET
  const handleSaveBudget = async () => {
    try {
      if (!formData.categoryId || !formData.monthlyLimit ||Number(formData.monthlyLimit) <= 0) {
        alert("Please fill all fields with valid values.");
        return;
      }

      setLoading(true);

      const budgetData = {
        categoryId: formData.categoryId,
        monthlyLimit: Number(formData.monthlyLimit),
        month: Number(formData.month),
        year: Number(formData.year),
      };

      let response;

      if (editId) {
        response = await api.put(`/budgets/${editId}`,
          { monthlyLimit: budgetData.monthlyLimit },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await api.post("/budgets", budgetData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert(response.data.message);

      handleClose();
      await fetchBudgets();

    } catch (error) {
      alert(error.response?.data?.message ||"Unable to save budget." );
    } finally {
      setLoading(false);
    }
  };

  // DELETE BUDGET
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");

    if (!confirmDelete) return;
    try {
      const response = await api.delete(`/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);

      await fetchBudgets();

    } catch (error) {
      alert(error.response?.data?.message ||"Unable to delete budget.");
    }
  };

  // CALCULATE SUMMARY
  const totalBudget = budgets.reduce(
    (sum, budget) =>sum + Number(budget.monthlyLimit || 0), 0);

  const totalSpent = budgets.reduce(
    (sum, budget) =>sum + Number(budget.totalExpense || 0),0);

  // FORMAT CURRENCY
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  return (
    <DashboardLayout>
      <Box>

        {/* PAGE HEADER */}
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}>
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#172033">My Budget</Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}> Manage your monthly spending.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            sx={{backgroundColor: "#2563EB",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1.2,
              "&:hover": {backgroundColor: "#1D4ED8",},
            }}>Add Budget
          </Button>
        </Box>

        {/* SUMMARY CARDS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>

          {/* TOTAL BUDGET */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{
                borderRadius: 3,
                boxShadow: "none",
                border: "2px solid #86EFAC",
                backgroundColor: "#F0FDF4",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.15)",
                  borderColor: "#4ADE80",
                },
              }}>
              <CardContent sx={{ p: 2 }}>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "#166534" }}>Total Budget
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ mt: 0.5, color: "#15803D" }}>
                  ₹{formatAmount(totalBudget)}
                </Typography>

              </CardContent>
            </Card>
          </Grid>

          {/* TOTAL SPENT */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "none",
                border: "2px solid #FCA5A5",
                backgroundColor: "#FEF2F2",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(220, 38, 38, 0.15)",
                  borderColor: "#F87171",
                },
              }}>
              <CardContent sx={{ p: 2 }}>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "#991B1B" }}>
                  Total Spent
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ mt: 0.5, color: "#DC2626" }}>
                  ₹{formatAmount(totalSpent)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CATEGORY BUDGETS */}
        <Box>

          {budgets.length === 0 ? (

            <Card sx={{
                borderRadius: 3,
                textAlign: "center",
                p: 5,
                boxShadow: "none",
                border: "2px solid #CBD5E1",
              }} >
              <AccountBalanceWallet
                sx={{fontSize: 50,
                  color: "#94A3B8",
                }}/>

              <Typography variant="h6" sx={{ mt: 2 }}>
                No Budgets Found
              </Typography>

              <Typography color="text.secondary">
                Create your first budget to manage your expenses.
              </Typography>
            </Card>

          ) : (

            budgets.map((budget) => {

              const spent = Number(budget.totalExpense || 0);
              const limit = Number(budget.monthlyLimit || 0);

              const remaining = limit - spent;

              const exceeded =
                budget.exceeded === true || spent > limit;

              const percentage =
                limit > 0 ? (spent / limit) * 100 : 0;

              const progressValue = Math.min(Math.max(percentage, 0),100);

              return (

                <Card
                  key={budget._id}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: "none",
                    border: exceeded? "2px solid #FCA5A5": "2px solid #CBD5E1",
                    backgroundColor: exceeded? "#FFFAFA" : "#FFFFFF",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: exceeded? "0 8px 20px rgba(220, 38, 38, 0.12)": "0 8px 20px rgba(37, 99, 235, 0.12)",
                      borderColor: exceeded? "#EF4444": "#2563EB",
                    },
                  }}>

                  <CardContent sx={{ p: 2 }}>
                    {/* CATEGORY HEADER */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>

                      <Typography sx={{
                          fontWeight:600,
                        fontSize:"19px",
                          color: "#1E3A8A",
                          letterSpacing: "0.3px",
                        }}>
                        {budget.categoryId?.name || "Unknown Category"}
                      </Typography>

                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(budget)}
                          title="Edit Budget">
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(budget._id)}
                          title="Delete Budget">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* SPENT AND PERCENTAGE */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: "#DC2626" }}>
                        Spent: ₹{formatAmount(spent)}
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={exceeded ? "#DC2626" : "#1E3A8A"}>
                        {percentage.toFixed(1)}%
                      </Typography>

                    </Box>

                    {/* PROGRESS BAR */}
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        mt: 1.5,
                        height: 11,
                        borderRadius: 5,
                        backgroundColor: "#E5E7EB",

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          backgroundColor: exceeded? "#DC2626": "#2563EB",
                        },
                      }} />

                    {/* BUDGET AND REMAINING */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: "#2563EB" }}>
                        Budget: ₹{formatAmount(limit)}
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color: exceeded ? "#DC2626" : "#16A34A",
                        }}>
                        {remaining < 0? `Exceeded: ₹${formatAmount(Math.abs(remaining))}` : `Remaining: ₹${formatAmount(remaining)}`
                        }
                      </Typography>

                    </Box>

                    {/* MONTH AND YEAR */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{display: "block",mt: 0.8,}} >
                      {new Date(budget.year,budget.month - 1).toLocaleString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>

                    {/* EXCEEDED WARNING */}
                    {exceeded && (
                      <Alert severity="error"
                        sx={{
                          mt: 1.5,
                          py: 0,
                          border: "1px solid #FCA5A5",
                          "& .MuiAlert-message": {
                            fontWeight: "bold",
                          },
                        }}
                      >
                        Budget exceeded for this category!
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}

        </Box>

        {/* ADD / EDIT BUDGET DIALOG */}
        <Dialog open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm">

          <DialogTitle fontWeight="bold">
            {editId ? "Edit Budget" : "Add New Budget"}
          </DialogTitle>

          <DialogContent>

            <TextField
              select
              fullWidth
              label="Select Expense Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              margin="normal"
              disabled={Boolean(editId)}>

              {categories.map((category) => (
                <MenuItem
                  key={category._id}
                  value={category._id}>
                  {category.name}
                </MenuItem>
              ))}

            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Monthly Budget Limit (₹)"
              name="monthlyLimit"
              value={formData.monthlyLimit}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 1 }}/>

            <TextField
              select
              fullWidth
              label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              margin="normal"
              disabled={Boolean(editId)}>

              {["January","February","March","April",
                "May", "June","July","August","September",
                "October","November","December",].map((month, index) => (
                <MenuItem
                  key={index + 1}
                  value={index + 1}>
                  {month}
                </MenuItem>
              ))}

            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              margin="normal"
              disabled={Boolean(editId)}
              inputProps={{
                min: 2000,
                max: 2100,
              }}/>

          </DialogContent>
          <DialogActions sx={{ p: 3 }}>

            <Button onClick={handleClose}color="inherit">
              Cancel
            </Button>

            <Button variant="contained"onClick={handleSaveBudget}
              disabled={loading}>
              {loading ? "Saving..." : "Save Budget"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* BUDGET EXCEEDED POPUP */}
        <Dialog open={Boolean(exceededBudgetAlert)}
          onClose={handleCloseExceededAlert}
          fullWidth
          maxWidth="xs">

          <DialogTitle
            sx={{display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#DC2626",
              fontWeight: "bold",
            }}>
            <WarningAmber />
            Budget Exceeded!
          </DialogTitle>

          <DialogContent>
            {exceededBudgetAlert && (
              <Box>

                <Alert severity="error" sx={{ mb: 2 }}>
                  Your budget for{" "}
                  <strong>
                    {exceededBudgetAlert.categoryId?.name || "this category"}
                  </strong>{" "}
                  has been exceeded!
                </Alert>

                <Typography sx={{ mb: 1 }}>
                  Monthly Budget:{" "}
                  <strong>
                    ₹{formatAmount(exceededBudgetAlert.monthlyLimit)}
                  </strong>
                </Typography>

                <Typography sx={{ mb: 1 }}>
                  Total Spent:{" "}
                  <strong>
                    ₹{formatAmount(exceededBudgetAlert.totalExpense || 0)}
                  </strong>
                </Typography>

                <Typography
                  color="error"
                  fontWeight="bold">
                  Exceeded Amount: ₹
                  {formatAmount(
                    Number(exceededBudgetAlert.totalExpense || 0) -
                    Number(exceededBudgetAlert.monthlyLimit || 0)
                  )}
                </Typography>

                <Typography color="text.secondary"sx={{ mt: 2 }}>
                  Please review your spending and try to stay within your monthly budget.
                </Typography>
              </Box>
            )}

          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseExceededAlert}>
              OK, I Understand
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default Budgets;
