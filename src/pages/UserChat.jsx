import { Box, Container, Typography, TextField, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DehazeIcon from "@mui/icons-material/Dehaze";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api/axios";
import People from "../components/People";

const UserChat = () => {
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [me, setMe] = useState();
  const [conversations, setConversations] = useState([]);
  const [showContacts, setShowContacts] = useState(true);
  const [userFor, setUserFor] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);


  const open = Boolean(anchorEl);

  // Socket.io
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      extraHeaders: { token: localStorage.getItem("token") },
    });
    setConnection(socket);
    return () => socket.disconnect();
  }, []);



  // Fetch me & conversations
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const meRes = await api.get("/me", { headers: { "x-auth-token": localStorage.getItem("token") } });
        setMe(meRes.data);

        const convRes = await api.get("/getAll", { headers: { "x-auth-token": localStorage.getItem("token") } });
        setConversations(convRes.data?.conversations || []);
      } catch (err) { console.log(err); }
    };
    fetchInitial();
  }, []);

  // Join conversation room
  useEffect(() => {
    if (!connection || !active) return;
    connection.emit("joinConversation", active);
  }, [connection, active]);

  // Load messages
  useEffect(() => {
    if (!active) return;
    const loadMessages = async () => {
      try {
        const res = await api.get(`/messages/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
        setMessages(res.data.messages);
      } catch (err) { console.log(err); }
    };
    loadMessages();
  }, [active]);

  // Send message
  const handleSend = () => {
    if (!newMessage.trim() || !me || !connection || !active) return;
    connection.emit("sendMessage", { conversationId: active, senderId: me._id, text: newMessage });
    setNewMessage("");
  };

  // Receive message
  useEffect(() => {
    if (!connection) return;

    const handler = (m) => {

      // 1) Agar active chatning ichida bo‘lsa → faqat messages ga qo‘shiladi
      if (m.conversationId === active) {
        setMessages(prev => [...prev, m]);
      }

      // 2) Conversations ichida unreadCount oshirish
      setConversations(prev =>
        prev.map(c =>
          c._id === m.conversationId
            ? { ...c, unreadCount: c._id === active ? 0 : (c.unreadCount || 0) + 1 }
            : c
        )
      );
    };

    connection.on("receiveMessage", handler);
    return () => connection.off("receiveMessage", handler);
  }, [connection, active]);


  // Fetch active user info
  useEffect(() => {
    if (!active || !me) return;
    const conv = conversations.find(c => c._id === active);
    const otherId = conv?.members.find(m => m !== me._id);
    if (!otherId) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/userFor/${otherId}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
        setUserFor(res.data.user);
      } catch (err) { console.log(err); }
    };
    fetchUser();
  }, [active, conversations, me]);

  useEffect(() => {
    if (!active) return;

    // API orqali backendga: unreadCount = 0
    const markAsRead = async () => {
      try {
        await api.put(`/messages/markAsRead/${active}`, {}, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        // Local state – conversationsni ham yangilash
        setConversations(prev =>
          prev.map(c =>
            c._id === active ? { ...c, unreadCount: 0 } : c
          )
        );

      } catch (err) { console.log(err); }
    };

    markAsRead();
  }, [active]);


  const getInitials = (name) => name?.split(" ").map(n => n[0].toUpperCase()).join("").slice(0, 2);

  // Menu handlers
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClear = async () => {
    if (!active) return;
    const yes = confirm("Chatti tazalawdi qaleysizbe?");
    if (!yes) return;
    try {
      const res = await api.delete(`/clearMessages/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
      if (res.data.message === "Tazalandi") { setMessages([]); toast.success("Tazalandi"); }
    } catch (err) { console.log(err); }
  };

  const handleDelete = async () => {
    if (!active) return;
    const yes = confirm("Chatti oshiriwdi qaleysizbe?");
    if (!yes) return;
    try {
      const res = await api.delete(`/deleteConversation/${active}`, { headers: { "x-auth-token": localStorage.getItem("token") } });
      if (res.data.message === "Oshirildi") {
        setConversations(prev => prev.filter(c => c._id !== active));
        setActive(null);
        setMessages([]);
        toast.success("Oshirildi");
        setShowContacts(true);
      }
    } catch (err) { console.log(err); }
  };

  return (
    <Container sx={{ display: "flex", height: "100vh", p: 0, overflow: "hidden", background: "#f0fdf4" }}>
      {/* Contacts panel */}
      <Box sx={{
        width: { xs: showContacts ? "80%" : "0", sm: "30%" },
        height: "100%",
        transition: "0.3s",
        overflow: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.2)",
        position: { xs: "absolute", sm: "relative" },
        zIndex: 20,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        backgroundColor: "rgba(255,255,255,0.45)",
        boxShadow: "2px 0 24px rgba(0,0,0,0.15)",
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: "1.4rem",
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>Chats</Typography>
          <IconButton sx={{ display: { xs: "block", sm: "none" } }} onClick={() => setShowContacts(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {conversations.length > 0 ? conversations.map(c => (
            <People key={String(c._id)} conversation={c} person={me} active={active === c._id} onClick={() => setActive(c._id)} />
          )) : <Typography sx={{ p: 2, color: "#4ade80" }}>Chat jaratilmagan</Typography>}
        </Box>
      </Box>

      {/* Chat panel */}
      <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "70%" }, display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        {/* Header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          borderBottom: "1px solid #ddd",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          position: "relative",
          flexWrap: "wrap",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ display: { xs: "block", sm: "none" } }} onClick={() => setShowContacts(true)}>
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>

            {userFor && (
              <Avatar
                src={userFor?.imgProfile ? userFor.imgProfile : undefined}
                alt={userFor?.name}
                sx={{
                  width: { xs: 50, sm: 60 },
                  height: { xs: 50, sm: 60 },
                  fontSize: { xs: 18, sm: 22 },
                  fontWeight: 700,
                  backgroundColor: userFor?.imgProfile ? "transparent" : "#555",
                  color: "#fff",
                  border: "3px solid #fff",
                  "&:hover": { transform: "scale(1.1)" },
                  transition: "0.3s",
                }}
              >
                {!userFor?.imgProfile && getInitials(userFor?.name)}
              </Avatar>
            )}

            <Typography color="#fff" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              {userFor?.name} {userFor?.lastName}
            </Typography>
          </Box>

          <Box>
            <IconButton onClick={handleClick} sx={{ color: "#fff" }}>
              <DehazeIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClear}><CloseIcon /> Shatti tazalaw</MenuItem>
              <MenuItem onClick={handleDelete}><DeleteIcon /> Shatti oshiriw</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {messages.map(m => {
            const isMe = m.senderId === me?._id;
            return (
              <Box key={m._id} sx={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "#f0fdf4",
                color: isMe ? "#fff" : "#1a1a1a",
                p: "12px 16px",
                maxWidth: "70%",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                wordBreak: "break-word",
                transition: "0.3s",
              }}>{m.text}</Box>
            );
          })}
        </Box>

        {/* Input */}
        <Box sx={{ display: "flex", gap: 1, p: 2, background: "#fff", borderTop: "1px solid #e0e0e0" }}>
          <TextField fullWidth placeholder="Xabar jiberiw..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
          <Button variant="contained" onClick={handleSend} sx={{ backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a", transform: "scale(1.05)" }, borderRadius: 3 }}>
            <SendIcon sx={{ color: "#fff" }} />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserChat;
