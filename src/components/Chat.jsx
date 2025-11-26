import { Box, Container, Typography, TextField, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { api } from "../api/axios";
import People from "./People";

const Chat = () => {
  const { id } = useParams();

  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [me, setMe] = useState();
  const [conversations, setConversations] = useState([]);

  // Responsive toggle
  const [showContacts, setShowContacts] = useState(false);

  // SOCKET CONNECT
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
      extraHeaders: { token: localStorage.getItem("token") },
    });
    setConnection(socket);

    // cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper: dedupe array of objects by _id
  const dedupeById = (arr) => {
    if (!Array.isArray(arr)) return [];
    return Array.from(new Map(arr.map(item => [String(item._id), item])).values());
  };

  // INITIAL FETCH (me + conversations) + dedupe conversations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get("/me", { headers: { "x-auth-token": localStorage.getItem("token") } });
        setMe(meRes.data);

        const allConv = await api.get("/getAll", { headers: { "x-auth-token": localStorage.getItem("token") } });
        const convs = allConv.data?.conversations || [];

        // dedupe by _id before setting
        setConversations(dedupeById(convs));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // OPEN CHAT IF ID RECEIVED
  useEffect(() => {
    if (!connection || !id || !me) return;

    const exist = conversations.find(
      (c) => Array.isArray(c.members) && c.members.includes(id) && c.members.includes(me._id)
    );

    if (exist) {
      setActive(exist._id);
      return;
    }

    // create only if it doesn't exist already (avoid race duplicates)
    const createConv = async () => {
      try {
        const res = await api.post(`/getOrCreate/${id}`, {}, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        const conv = res.data.conversation;
        if (!conv) return;

        // add only if not present
        setConversations(prev => {
          const found = prev.find(p => String(p._id) === String(conv._id));
          if (found) return prev;
          return dedupeById([ ...prev, conv ]);
        });

        setActive(conv._id);
      } catch (err) {
        console.log(err);
      }
    };
    createConv();
  }, [connection, id, conversations, me]);

  // JOIN ROOM
  useEffect(() => {
    if (connection && active) {
      connection.emit("joinConversation", active);
    }
  }, [connection, active]);

  // FETCH MESSAGES (dedupe before set)
  useEffect(() => {
    if (!active) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${active}`, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        const msgs = res.data.messages || [];
        setMessages(dedupeById(msgs));
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [active]);

  // SEND
  const handleSend = () => {
    if (!newMessage.trim() || !me || !connection || !active) return;
    const payload = {
      conversationId: active,
      senderId: me._id,
      text: newMessage,
    };
    connection.emit("sendMessage", payload);
    setNewMessage("");
    // optimistically add message? optional — if server echoes, dedupe on receive will handle duplicates.
  };

  // RECEIVE (dedupe on add)
  useEffect(() => {
    if (!connection) return;
    const handler = (message) => {
      // ensure message has conversationId and _id
      if (!message || !message._id) return;
      // only append if message belongs to current active conversation
      if (message.conversationId !== active) return;

      setMessages(prev => {
        const exists = prev.find(m => String(m._id) === String(message._id));
        if (exists) return prev;
        return [...prev, message];
      });
    };

    connection.on("receiveMessage", handler);
    return () => {
      connection.off("receiveMessage", handler);
    };
  }, [connection, active]);

  // UI
  return (
    <Container
      sx={{
        display: "flex",
        height: "100vh",
        p: 0,
        overflow: "hidden"
      }}
    >

      {/* ================= CONTACTS PANEL (LEFT) ================= */}
      <Box sx={{
        width: { xs: showContacts ? "80%" : "0", sm: "30%" },
        backgroundColor: "white",
        height: "100%",
        transition: "0.3s",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        position: { xs: "absolute", sm: "relative" },
        zIndex: 20,
      }}>

        {/* Header inside contacts */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.4rem",
              background: "linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Chats
            <QuestionAnswerIcon />
          </Typography>

          {/* Close button for mobile */}
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setShowContacts(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* People list */}
        <Box sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
          "&::-webkit-scrollbar": { width: "4px" },
        }}>
          {conversations.length > 0 ? conversations.map(c => (
            <People
              key={String(c._id)}               // safe to use _id after dedupe
              conversation={c}
              person={me}
              active={active === c._id}
              onClick={() => {
                setActive(c._id);
                setShowContacts(false); // mobile auto close
              }}
            />
          )) : (
            <Typography sx={{ p: 2 }}>Chat jaratilmagan</Typography>
          )}
        </Box>
      </Box>

      {/* ================= MESSAGES PANEL (RIGHT) ================= */}
      <Box sx={{
        flexGrow: 1,
        width: { xs: "100%", sm: "70%" },
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative"
      }}>

        {/* Header */}
        <Box sx={{
          p: 2,
          background: "#81FBB8",
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid #ddd",
        }}>
          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setShowContacts(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 600 }}>Xabarlar</Typography>
        </Box>

        {/* Messages */}
        <Box sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          gap: "10px",
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { width: "6px" }
        }}>
          {messages.map(m => {
            const isMe = String(m.senderId) === String(me?._id);
            return (
              <Box key={String(m._id)} sx={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#81FBB8" : "#fff",
                color: isMe ? "#033a1e" : "#333",
                p: "10px 14px",
                maxWidth: "65%",
                borderRadius: isMe ? "15px 15px 0 15px" : "15px 15px 15px 0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}>
                {m.text}
              </Box>
            );
          })}
        </Box>

        {/* Input Area */}
        <Box sx={{
          display: "flex",
          gap: 1,
          p: 2,
          background: "#fff",
          borderTop: "1px solid #ddd",
        }}>
          <TextField
            fullWidth
            placeholder="Xabar jiberiw..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" onClick={handleSend} style={{backgroundColor: "#81FBB8"}}>
            <SendIcon style={{color: "black"}}/>
          </Button>
        </Box>

      </Box>

    </Container>
  );
};

export default Chat;
