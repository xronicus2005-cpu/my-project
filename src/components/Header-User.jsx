import { Container, Box, Typography, TextField, Button, Avatar, IconButton, Menu, Badge } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import { useAuth } from "../hooksForBackend/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { api } from "../api/axios.js"

import "./styles/HeaderUser.css";

const HeaderUser = () => {
  const [notOpen, willOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connection, setConnection] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const { logout, user, loading } = useAuth();

  const open = Boolean(notOpen);
  const handleClick = (event) => willOpen(event.currentTarget);
  const handleClose = () => willOpen(null);

  const colors = ["#37474F", "#9C27B0", "#00BCD4", "#FF7043", "#e91e63", "#2E7D32"];
  let currentColorOfAvatar = user?.sex === "erkek" ? colors[0] : user?.sex === "hayal" ? colors[4] : colors[5];

  // Socket connection
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      extraHeaders: { token: localStorage.getItem("token") },
    });
    setConnection(socket);
    return () => socket.disconnect();
  }, []);

  // Fetch initial unread messages count
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const res = await api.get("/conversations/unreadCount", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) { console.log(err); }
    };
    fetchUnread();
  }, [user]);

  // Listen new messages via socket
  useEffect(() => {
    if (!connection) return;
    const handler = (message) => {
      if (!message.readBy?.includes(user._id)) {
        setUnreadCount(prev => prev + 1);
      }
    };
    connection.on("receiveMessage", handler);
    return () => connection.off("receiveMessage", handler);
  }, [connection, user]);

  // Reset unread counter
  const handleOpenChat = () => {
    setUnreadCount(0);
  };

  if (loading) return <Container sx={{ marginTop: "2rem" }}><p>Tekserilip atir...</p></Container>;

  return (
    <header className="header">
      <div className="header-container">
        {/* LEFT */}
        <div className="header-left">
          <Link to="/" className="header-logo">Work</Link>
          <div className="header-search">
            <input type="text" placeholder="Izlew" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="header-right">

          {/* Mail icon with badge */}
          <div style={{ marginRight: "15px" }}>
            <Link to="/chat">
              <Badge badgeContent={unreadCount} color="error">
                <MailIcon fontSize="large" />
              </Badge>
            </Link>
          </div>

          {/* Desktop avatar */}
          <button onClick={handleClick} className="header-avatar-btn desktop-avatar">
            <Avatar style={{ backgroundColor: currentColorOfAvatar }} className="header-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </button>

          {/* Mobile menu toggle */}
          <div className="mobile-menu-toggle">
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon fontSize="large" color="black" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      <Menu
        anchorEl={notOpen}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link onClick={handleClose} className="menu-link menu-flex" to={"/Profile"}>
          <PersonIcon className="menu-icon" />
          <span>Profilim</span>
        </Link>

        <Link onClick={handleClose} className="menu-link menu-flex" to={"/Settings"}>
          <SettingsIcon className="menu-icon" />
          <span>Sazlamalar</span>
        </Link>

        <div onClick={logout} className="menu-link logout-link menu-flex">
          <LogoutIcon className="menu-icon logout-red" />
          <span>Shıǵıw</span>
        </div>
      </Menu>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={handleClick} className="header-avatar-btn mobile-avatar">
            <Avatar style={{ backgroundColor: currentColorOfAvatar }} className="header-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </button>
          <Link to="/chat" onClick={handleOpenChat} className="menu-link">Chat</Link>
          <Link to="/Profile" className="menu-link">Profilim</Link>
          <Link to="/Settings" className="menu-link">Sazlamalar</Link>
          <div onClick={logout} className="menu-link logout-link">Shıǵıw</div>
        </div>
      )}
    </header>
  );
};

export default HeaderUser;
