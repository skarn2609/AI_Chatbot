import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
  Card,
  Grid,
  Avatar,
} from "@mui/material";

// Import the person and computer icons
import personIcon from "../icons/png_1.jpg";
import computerIcon from "../icons/png_2.jpg";

const ChatBot = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Media query
  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  // States
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/v1/openai/chatbot", { text });

      // Append user input and chatbot response to chats
      const newChats = [
        ...chats,
        { role: "user", text },
        { role: "bot", text: data },
      ];

      setChats(newChats);
      setText("");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box
      width={isNotMobile ? "40%" : "80%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >
      <Collapse in={error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      <Typography variant="h3">Ask Chatbot</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mt: 2,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {chats.map((chat, index) => (
          <Grid
            container
            key={index}
            justifyContent={chat.role === "user" ? "flex-start" : "flex-end"}
            alignItems="center"
          >
            <Grid item xs={2}>
              {/* Person Icon */}
              {chat.role === "user" && (
                <Avatar
                  alt="Person Icon"
                  src={personIcon}
                  sx={{ width: 48, height: 48, bgcolor: "gray" }}
                />
              )}
              {/* Computer Icon */}
              {chat.role === "bot" && (
                <Avatar
                  alt="Computer Icon"
                  src={computerIcon}
                  sx={{ width: 48, height: 48, bgcolor: "#B2EBF2" }}
                />
              )}
            </Grid>
            <Grid item xs={10}>
              <Card
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor:
                    chat.role === "user"
                      ? theme.palette.primary.light
                      : theme.palette.secondary.light,
                  color: chat.role === "user" ? "white" : "black",
                }}
              >
                {chat.text}
              </Card>
            </Grid>
          </Grid>
        ))}
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          placeholder="Add your text"
          type="text"
          multiline
          required
          margin="normal"
          fullWidth
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
        >
          Chat
        </Button>

        <Typography mt={2}>
          Not the tool you're looking for? <Link to="/">GO BACK</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default ChatBot;
