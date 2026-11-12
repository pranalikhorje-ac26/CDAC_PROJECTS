const ContactMessage = require("../models/ContactMessages");

// 1. Save Contact Message (PUBLIC)
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Check empty fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill all the fields.",
      });
    }

    // Create new contact message
    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    // Save message in MongoDB
    await newMessage.save();

    return res.status(201).json({
      message: "Your message has been sent successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to send message. Please try again.",
    });
  }
};


// 2. Get All Contact Messages (ADMIN)
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalMessages: messages.length,
      messages,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 3. Update Contact Message Status (ADMIN)
const updateContactMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["new", "read", "replied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status.",
      });
    }

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      messageId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message status updated successfully.",
      data: updatedMessage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 4. Delete Contact Message (ADMIN)
const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await ContactMessage.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Export all functions
module.exports = {
  sendMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};