import { Box, Container, Typography, TextField, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api/axios";
import SendIcon from '@mui/icons-material/Send';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import DehazeIcon from '@mui/icons-material/Dehaze';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from "react-toastify";

import People from "../components/People";

const UserChat = () => {

  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [me, setMe] = useState();
  const [conversations, setConversations] = useState([]);

  // mobile mode controllers
  const [mobileMode, setMobileMode] = useState("contacts"); 
  // "contacts" | "chat"

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  //===========================================
  // SOCKET
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
      extraHeaders: { "token": localStorage.getItem("token") },
    });
    setConnection(socket);
  }, []);

  //===========================================
  // Fetch user & conversations
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const meRes = await api.get("/me", { headers: { "x-auth-token": localStorage.getItem("token") } });
        setMe(meRes.data);

        const conv = await api.get("/getAll", { headers: { "x-auth-token": localStorage.getItem("token") } });
        setConversations(conv.data?.conversations || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchInitial();
  }, []);

  //===========================================
  // Join room
  useEffect(() => {
    if (!connection || !active) return;
    connection.emit("joinConversation", active);
  }, [connection, active]);

  //===========================================
  // Load messages for selected chat
  useEffect(() => {
    if (!active) return;
    const load = async () => {
      try {
        const res = await api.get(`/messages/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
        setMessages(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, [active]);

  //===========================================
  // SEND message
  const handleSend = () => {
    if (!newMessage.trim() || !me) return;

    connection.emit("sendMessage", {
      conversationId: active,
      senderId: me._id,
      text: newMessage
    });

    setNewMessage("");
  };

  //===========================================
  // RECEIVE message
  useEffect(() => {
    if (!connection) return;
    connection.on("receiveMessage", (m) => {
      if (m.conversationId === active) {
        setMessages(prev => [...prev, m]);
      }
    });
    return () => connection.off("receiveMessage");
  }, [connection, active]);

  //===========================================
  // Menu handlers
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  //===========================================
  const handleClear = async () => {
    const yes = confirm("Chatti tazalawdi qaleysizbe?");
    if (!yes) return;

    try {
      const res = await api.delete(`/clearMessages/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
      if (res.data.message === "Tazalandi") {
        toast.success("Tazalandi");
        setMessages([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const yes = confirm("Chatti oshiriwdi qaleysizbe?");
    if (!yes) return;

    try {
      const del = await api.delete(`/deleteConversation/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });

      if (del.data.message === "Oshirildi") {
        toast.success("Oshirildi");

        // remove
        setConversations(prev => prev.filter(c => c._id !== active));
        setActive(null);
        setMessages([]);

        // mobile mode back to contacts
        setMobileMode("contacts");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //===========================================
  // RESPONSIVE LAYOUT STARTS HERE
  return (
    <Container maxWidth="xl" sx={{
      display: "flex",
      height: "100vh",
      padding: 0,
      overflow: "hidden"
    }}>

      {/* CONTACTS PANEL */}
      <Box sx={{
        width: { xs: mobileMode === "contacts" ? "100%" : "0%", md: "30%" },
        display: { xs: mobileMode === "contacts" ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRight: "1px solid #e5e5e5",
        transition: "0.3s"
      }}>

        <Typography sx={{
          fontWeight: 600,
          fontSize: "1.5rem",
          background: "linear-gradient(135deg,#81FBB8,#28C76F)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          Chat <QuestionAnswerIcon />
        </Typography>

        <Box sx={{
          flex: 1,
          overflowY: "auto",
          padding: "5px",
          "&::-webkit-scrollbar": { width: "4px" }
        }}>
          {conversations.length > 0 ? conversations.map(c => (
            <People
              key={c._id}
              conversation={c}
              person={me}
              active={active === c._id}
              onClick={() => {
                setActive(c._id);
                setMobileMode("chat");
              }}
            />
          )) : <Typography sx={{ paddingLeft: "10px" }}>Heshkim menen baylanıspaǵansız</Typography>}
        </Box>

      </Box>

      {/* CHAT PANEL */}
      <Box sx={{
        width: { xs: mobileMode === "chat" ? "100%" : "0%", md: "70%" },
        display: { xs: mobileMode === "chat" ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        backgroundColor: "#fafafa",
        transition: "0.3s"
      }}>

        <Box sx={{
          padding: "1rem",
          backgroundColor: "#81FBB8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* back button for mobile */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Button onClick={() => setMobileMode("contacts")}>
                <ArrowBackIcon />
              </Button>
            </Box>

            <Typography>Xabarlar</Typography>
          </Box>

          <Button onClick={handleClick}>
            <DehazeIcon />
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClear}>
              <CloseIcon /> Shatti tazalaw
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon /> Shatti oshiriw
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "1rem",
          paddingBottom: "90px",
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem"
        }}>
          {messages.map(m => {
            const isMe = m.senderId === me?._id;
            return (
              <Box key={m._id} sx={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#81FBB8" : "#fff",
                padding: "10px 14px",
                borderRadius: isMe ? "15px 15px 0 15px" : "15px 15px 15px 0",
                maxWidth: "70%"
              }}>
                {m.text}
              </Box>
            );
          })}
        </Box>

        {/* input area */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          borderTop: "1px solid #e5e5e5",
          backgroundColor: "#fff"
        }}>
          <TextField
            fullWidth
            placeholder="Xabar jiberiw..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSend} variant="contained">
            <SendIcon />
          </Button>
        </Box>

      </Box>

    </Container>
  );
};

export default UserChat;
