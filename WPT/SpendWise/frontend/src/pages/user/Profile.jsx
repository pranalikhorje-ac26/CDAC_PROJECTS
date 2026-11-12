import { useState, useRef } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import {
  Person,
  PhotoCamera,
  Edit,
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    phone_no: user.phone_no || "",
  });

  const fileInputRef = useRef(null);

  // UPLOAD PROFILE PICTURE
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      // UPDATE PROFILE PAGE
      setProfileImage(imageData);

      // SAVE IMAGE IN LOCAL STORAGE
      localStorage.setItem("profileImage", imageData);

      // NOTIFY NAVBAR IMMEDIATELY
      window.dispatchEvent(
        new CustomEvent("profileImageUpdated", {
          detail: imageData,
        })
      );

      alert("Profile picture updated successfully!");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same image again
    event.target.value = "";
  };

  // OPEN EDIT PROFILE DIALOG
  const handleEditOpen = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone_no: user.phone_no || "",
    });

    setEditOpen(true);
  };

  // HANDLE INPUT CHANGES
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // UPDATE PROFILE IN MONGODB
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const response = await api.put(
        "/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // NOTIFY NAVBAR ABOUT USER DETAILS
      window.dispatchEvent(
        new CustomEvent("profileUserUpdated", {
          detail: updatedUser,
        })
      );

      setEditOpen(false);

      alert("Profile updated successfully!");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box>

        {/* PAGE HEADING */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            My Profile
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            View and manage your account information.
          </Typography>
        </Box>

        {/* PROFILE CARD */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 650,
              borderRadius: 4,
              boxShadow: 3,
              border: "1px solid #E5E7EB",
            }}
          >
            <CardContent sx={{ p: 4 }}>

              {/* PROFILE PICTURE */}
              <Box sx={{ textAlign: "center", mb: 3 }}>

                <Box
                  sx={{
                    position: "relative",
                    width: 110,
                    height: 110,
                    margin: "auto",
                  }}
                >
                  <Avatar
                    src={profileImage || undefined}
                    onClick={() => fileInputRef.current.click()}
                    sx={{
                      width: 110,
                      height: 110,
                      backgroundColor: "#2563EB",
                      margin: "auto",
                      cursor: "pointer",
                      border: "4px solid #DBEAFE",
                    }}
                  >
                    {!profileImage && (
                      <Person sx={{ fontSize: 65 }} />
                    )}
                  </Avatar>

                  {/* CAMERA ICON */}
                  <Box
                    onClick={() => fileInputRef.current.click()}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      backgroundColor: "#2563EB",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "3px solid white",
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 18 }} />
                  </Box>
                </Box>

                {/* HIDDEN FILE INPUT */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                <Button
                  size="small"
                  onClick={() => fileInputRef.current.click()}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    color: "#2563EB",
                  }}
                >
                  Change Profile Picture
                </Button>

                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {user.username || user.name || "User"}
                </Typography>

                <Typography color="text.secondary">
                  {user.role || "User"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* USER INFORMATION */}
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  Full Name
                </Typography>

                <Typography color="text.secondary">
                  {user.username || user.name || "Not available"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  Email Address
                </Typography>

                <Typography color="text.secondary">
                  {user.email || "Not available"}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography fontWeight="bold">
                  Mobile Number
                </Typography>

                <Typography color="text.secondary">
                  {user.phone_no || "Not available"}
                </Typography>
              </Box>

              {/* EDIT PROFILE BUTTON */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<Edit />}
                onClick={handleEditOpen}
                sx={{
                  backgroundColor: "#2563EB",
                  borderRadius: 2,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#1D4ED8",
                  },
                }}
              >
                Edit Profile
              </Button>

            </CardContent>
          </Card>
        </Box>

        {/* EDIT PROFILE DIALOG */}
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle fontWeight="bold">
            Edit Profile
          </DialogTitle>

          <DialogContent>

            <TextField
              fullWidth
              label="Full Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              margin="normal"
              helperText="Enter your number with +91 country code."
            />

          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setEditOpen(false)}
              color="inherit"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </DashboardLayout>
  );
}

export default Profile;
