import { useState } from "react";
import emailjs from "@emailjs/browser";

import {
  Box,Container,Typography, Paper, TextField,Button,Snackbar,Alert,
} from "@mui/material";

import Footer from "../components/Footer";
import api from "../services/api";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  // SEND MESSAGE FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // CHECK EMPTY FIELDS
    if (name.trim() === "" ||email.trim() === "" ||
      subject.trim() === "" ||message.trim() === "") {
      setError("Please fill all the fields.");
      return;
    }

    // EMAIL VALIDATION
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: SAVE MESSAGE IN MONGODB THROUGH BACKEND
      await api.post("/contact", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      // STEP 2: SEND EMAIL NOTIFICATION USING EMAILJS
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
          },
          {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          }
        );

        setNotificationMessage("Your message has been sent successfully!");
        setNotificationSeverity("success");

      } catch (emailError) {
        console.error("EmailJS Error:", emailError);

        setNotificationMessage("Your message was saved successfully, but the email notification could not be sent.");
        setNotificationSeverity("warning");
      }

      // SHOW NOTIFICATION
      setSuccess(true);

      // CLEAR FORM
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");

    } catch (err) {
      console.error("Contact Form Error:", err);
      setError(err.response?.data?.message ||"Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#F5F7FB", py: 6 }}>
        <Container maxWidth="md">

          {/* HEADING */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="#172554"> Contact Us</Typography>

            <Typography sx={{
                color: "text.secondary",mt: 1,pb: 2,
              }}>Have questions? We would love to hear from you.
            </Typography>
          </Box>

          {/* CONTACT FORM */}
          <Paper elevation={0}
            sx={{p: 4,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
            }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={3}>Send Us a Message</Typography>

            <Box component="form" onSubmit={handleSubmit}>

              {/* NAME */}
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}/>

              {/* EMAIL */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>

              {/* SUBJECT */}
              <TextField
                fullWidth
                label="Subject"
                margin="normal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              {/* MESSAGE */}
              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                margin="normal"
                value={message}
                onChange={(e) => setMessage(e.target.value)}/>

              {/* ERROR MESSAGE */}
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              {/* SEND BUTTON */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  backgroundColor: "#2563EB",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#1D4ED8",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 15px rgba(37, 99, 235, 0.25)",
                  },
                }} >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* SUCCESS / WARNING NOTIFICATION */}
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}>
        <Alert severity={notificationSeverity}
          variant="filled"
          onClose={() => setSuccess(false)}>
          {notificationMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </>);
}

export default Contact;