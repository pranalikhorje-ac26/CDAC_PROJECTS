import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  IconButton
} from "@mui/material";

import {
  Add,
  Category,
  Edit,
  Delete,
  AccountBalanceWallet
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // CATEGORY DIALOG
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // DELETE DIALOG
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ADD AMOUNT DIALOG
  const [amountOpen, setAmountOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [amountData, setAmountData] = useState({
    amount: "",
    description: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  // CATEGORY FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    amount: ""
  });

  // GET CATEGORIES AND TRANSACTIONS
  const fetchCategories = async () => {

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data.categories || []);

      const transactionResponse = await api.get("/transactions");

      setTransactions(
        transactionResponse.data.transactions || []
      );

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to fetch categories."
      );

    } finally {
      setLoading(false);
    }
  };

  // LOAD CATEGORIES
  useEffect(() => {
    fetchCategories();
  }, []);

  // CALCULATE TOTAL AMOUNT FOR EACH CATEGORY
  const getCategoryTotal = (categoryId) => {

    return transactions
      .filter((transaction) => {

        const transactionCategoryId =
          transaction.categoryId?._id ||
          transaction.categoryId;

        return transactionCategoryId === categoryId;

      })
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  };

  // FORMAT AMOUNT
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });
  };

  // OPEN ADD CATEGORY
  const handleOpenAdd = () => {

    setEditId(null);

    setFormData({
      name: "",
      type: "",
      description: "",
      amount: ""
    });

    setFormError("");
    setOpen(true);
  };

  // OPEN EDIT CATEGORY
  const handleEdit = (category) => {

    setEditId(category._id);

    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || "",
      amount: ""
    });

    setFormError("");
    setOpen(true);
  };

  // CLOSE CATEGORY DIALOG
  const handleClose = () => {

    if (!saving) {
      setOpen(false);
    }
  };

  // HANDLE CATEGORY INPUT
  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // ADD OR UPDATE CATEGORY
  const handleSubmit = async () => {

    const { name, type, description, amount } = formData;

    if (!name.trim()) {
      setFormError("Please enter category name.");
      return;
    }
    const categoryNameRegex = /^[A-Za-z][A-Za-z\s&'-]*$/;

if (!categoryNameRegex.test(name.trim())) {
    setFormError("Category name should contain only letters.");
    return;
}

    if (!type) {
      setFormError("Please select category type.");
      return;
    }

    // INITIAL AMOUNT VALIDATION
    if (!editId) {

      if (
        !amount ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
      ) {
        setFormError(
          "Please enter a valid amount greater than zero."
        );
        return;
      }
    }

    try {

      setSaving(true);
      setFormError("");

      const categoryData = {
        name: name.trim(),
        type,
        description: description.trim()
      };

      let response;

      if (editId) {

        // UPDATE CATEGORY
        response = await api.put(
          `/categories/${editId}`,
          categoryData
        );

      } else {

        // CREATE CATEGORY WITH INITIAL TRANSACTION
        response = await api.post(
          "/categories",
          {
            ...categoryData,
            amount: Number(amount)
          }
        );
      }

      setOpen(false);

      setSuccessMessage(
        response.data.message ||
        "Category saved successfully."
      );

      await fetchCategories();

    } catch (error) {

      setFormError(
        error.response?.data?.message ||
        "Failed to save category."
      );

    } finally {
      setSaving(false);
    }
  };

  // OPEN ADD AMOUNT DIALOG
  const handleAmountOpen = (category) => {

    setSelectedCategory(category);

    setAmountData({
      amount: "",
      description: ""
    });

    setFormError("");
    setAmountOpen(true);
  };

  // CLOSE ADD AMOUNT DIALOG
  const handleAmountClose = () => {

    if (!saving) {
      setAmountOpen(false);
      setSelectedCategory(null);
    }
  };

  // HANDLE ADD AMOUNT INPUT
  const handleAmountChange = (event) => {

    const { name, value } = event.target;

    setAmountData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // ADD AMOUNT TO EXISTING CATEGORY
  const handleAddAmount = async () => {

    const money = Number(amountData.amount);

    if (
      !amountData.amount ||
      !Number.isFinite(money) ||
      money <= 0
    ) {
      setFormError(
        "Please enter a valid amount greater than zero."
      );
      return;
    }

    try {

      setSaving(true);
      setFormError("");

      const response = await api.post(
        `/categories/${selectedCategory._id}/add-amount`,
        {
          amount: money,
          description: amountData.description.trim()
        }
      );

      setAmountOpen(false);
      setSelectedCategory(null);

      setSuccessMessage(
        response.data.message ||
        "Amount added successfully."
      );

      // REFRESH TRANSACTIONS AND CATEGORY TOTALS
      await fetchCategories();

    } catch (error) {

      setFormError(
        error.response?.data?.message ||
        "Failed to add amount."
      );

    } finally {
      setSaving(false);
    }
  };

  // OPEN DELETE CONFIRMATION
  const handleDeleteClick = (id) => {

    setDeleteId(id);
    setDeleteOpen(true);
  };

  // DELETE CATEGORY
  const handleDelete = async () => {

    try {

      setDeleting(true);

      const response = await api.delete(
        `/categories/${deleteId}`
      );

      setDeleteOpen(false);
      setDeleteId(null);

      setSuccessMessage(response.data.message);

      await fetchCategories();

    } catch (error) {

      setDeleteOpen(false);

      setSuccessMessage(
        error.response?.data?.message ||
        "Failed to delete category."
      );

    } finally {
      setDeleting(false);
    }
  };

  return (

    <DashboardLayout>

      <Box>

        {/* PAGE HEADER */}

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#172033"
        >
          Categories
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1, mb: 4 }}
        >
          Manage your income and expense categories.
        </Typography>

        {/* CATEGORY CARD */}

        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>

          <CardContent sx={{ p: 3 }}>

            {/* CARD HEADER */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2
              }}
            >

              <Typography
                variant="h6"
                fontWeight={800}
                color="#172033"
              >
                Your Categories
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAdd}
                sx={{ textTransform: "none" }}
              >
                Add Category
              </Button>

            </Box>

            {/* LOADING */}

            {loading && (
              <Box sx={{ textAlign: "center", py: 5 }}>

                <CircularProgress />

                <Typography sx={{ mt: 2 }}>
                  Loading categories...
                </Typography>

              </Box>
            )}

            {/* ERROR */}

            {!loading && error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {/* EMPTY CATEGORY LIST */}

            {!loading && !error && categories.length === 0 && (

              <Box sx={{ textAlign: "center", py: 5 }}>

                <Category
                  sx={{
                    fontSize: 55,
                    color: "#94A3B8"
                  }}
                />

                <Typography variant="h6" sx={{ mt: 2 }}>
                  No Categories Found
                </Typography>

                <Typography color="text.secondary">
                  Add your first category to organize your transactions.
                </Typography>

              </Box>
            )}

            {/* DISPLAY CATEGORIES */}

            {!loading && !error && categories.map((category) => (

              <Card
                key={category._id}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  transition: "0.3s",

                  "&:hover": {
                    boxShadow: 3,
                    borderColor: "#2563EB"
                  }
                }}
              >

                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >

                  {/* CATEGORY DETAILS */}

                  <Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "700 !important",
                        color: "black",
                        fontSize: "15px",
                        letterSpacing: "0.4px",
                        mb: 0.5
                      }}
                    >
                      {category.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {category.description || "No description"}
                    </Typography>

                    {/* TOTAL AMOUNT */}

                    <Typography
                      variant="body1"
                      fontWeight={800}
                      sx={{
                        mt: 1,
                        color: "#7C3AED",
                        fontSize: "16px"
                      }}
                    >
                      Total Amount: ₹
                      {formatAmount(
                        getCategoryTotal(category._id)
                      )}
                    </Typography>

                  </Box>

                  {/* CATEGORY ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap"
                    }}
                  >

                    <Chip
                      label={category.type}
                      color={
                        category.type === "income"
                          ? "success"
                          : "error"
                      }
                    />

                    {/* ADD AMOUNT BUTTON */}

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => handleAmountOpen(category)}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#FFF3B0",
                        color: "#755B00",
                        fontWeight: "bold",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#FFE58F",
                          boxShadow: "none"
                        }
                      }}
                    >
                      Add Amount
                    </Button>

                    {/* EDIT BUTTON */}

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                      title="Edit Category"
                    >
                      <Edit />
                    </IconButton>

                    {/* DELETE BUTTON */}

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(category._id)}
                      title="Delete Category"
                    >
                      <Delete />
                    </IconButton>

                  </Box>

                </CardContent>

              </Card>

            ))}

          </CardContent>

        </Card>

        {/* ADD / EDIT CATEGORY DIALOG */}

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >

          <DialogTitle fontWeight="bold">
            {editId ? "Edit Category" : "Add New Category"}
          </DialogTitle>

          <DialogContent>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            {/* CATEGORY NAME */}

            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              placeholder="Example: Food, Salary, Shopping"
            />

            {/* CATEGORY TYPE */}

            <TextField
              fullWidth
              select
              label="Category Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              margin="normal"
            >

              <MenuItem value="income">
                Income
              </MenuItem>

              <MenuItem value="expense">
                Expense
              </MenuItem>

            </TextField>

            {/* INITIAL AMOUNT */}

            {!editId && (

              <TextField
                fullWidth
                type="number"
                label="Initial Amount (₹)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                margin="normal"
                inputProps={{
                  min: 0.01,
                  step: 0.01
                }}
                helperText="This amount will automatically be recorded as a transaction."
              />

            )}

            {/* DESCRIPTION */}

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Enter category description"
            />

          </DialogContent>

          <DialogActions sx={{ p: 3 }}>

            <Button
              onClick={handleClose}
              color="inherit"
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update Category"
                  : "Save Category"
              }
            </Button>

          </DialogActions>

        </Dialog>

        {/* ADD AMOUNT DIALOG */}

        <Dialog
          open={amountOpen}
          onClose={handleAmountClose}
          fullWidth
          maxWidth="sm"
        >

          <DialogTitle fontWeight="bold">
            Add Amount
          </DialogTitle>

          <DialogContent>

            {selectedCategory && (

              <>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    mb: 2
                  }}
                >

                  <AccountBalanceWallet color="primary" />

                  <Typography>
                    Category: <strong>{selectedCategory.name}</strong>
                  </Typography>

                  <Chip
                    size="small"
                    label={selectedCategory.type}
                    color={
                      selectedCategory.type === "income"
                        ? "success"
                        : "error"
                    }
                  />

                </Box>

                {formError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  type="number"
                  label="Amount (₹)"
                  name="amount"
                  value={amountData.amount}
                  onChange={handleAmountChange}
                  margin="normal"
                  inputProps={{
                    min: 0.01,
                    step: 0.01
                  }}
                />

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  name="description"
                  value={amountData.description}
                  onChange={handleAmountChange}
                  margin="normal"
                  multiline
                  rows={3}
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  This amount will automatically appear in your Transactions history.
                </Alert>

              </>

            )}

          </DialogContent>

          <DialogActions sx={{ p: 3 }}>

            <Button
              onClick={handleAmountClose}
              color="inherit"
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleAddAmount}
              disabled={saving}
              sx={{
                backgroundColor: "#FFF3B0",
                color: "#755B00",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#FFE58F"
                }
              }}
            >
              {saving ? "Adding..." : "Add Amount"}
            </Button>

          </DialogActions>

        </Dialog>

        {/* DELETE CONFIRMATION DIALOG */}

        <Dialog
          open={deleteOpen}
          onClose={() => {
            if (!deleting) {
              setDeleteOpen(false);
            }
          }}
        >

          <DialogTitle>
            Delete Category?
          </DialogTitle>

          <DialogContent>

            <Typography>
              Are you sure you want to delete this category?
              This action cannot be undone.
            </Typography>

          </DialogContent>

          <DialogActions sx={{ p: 2 }}>

            <Button
              onClick={() => setDeleteOpen(false)}
              color="inherit"
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>

          </DialogActions>

        </Dialog>

        {/* SUCCESS MESSAGE */}

        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />

      </Box>

    </DashboardLayout>

  );
}

export default Categories;