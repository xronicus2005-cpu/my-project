import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { io } from "socket.io-client";
import { api } from "../api/axios";

import {
  Avatar,
  Badge,
  IconButton,
  Menu,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import "./styles/HeaderUser.css";

const HeaderUser = () => {
  const { user, logout, loading } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const open = Boolean(anchorEl);

  const colors = ["#37474F", "#e91e63", "#2E7D32"];
  const avatarColor =
    user?.sex === "erkek" ? colors[0] :
    user?.sex === "hayal" ? colors[1] :
    colors[2];

  /* SOCKET */
  useEffect(() => {
    const s = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      extraHeaders: { token: localStorage.getItem("token") },
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get("/conversations/unreadCount")
      .then(res => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.on("receiveMessage", () => {
      setUnreadCount(prev => prev + 1);
    });
    return () => socket.off("receiveMessage");
  }, [socket, user]);

  if (loading) return null;

  return (
    <header className="header">

      {/* ================= DESKTOP (AS-IS) ================= */}
      <div className="header-container desktop-header">
        <div className="header-left">
          <Link to="/" className="header-logo">Work</Link>

          <div className="header-search">
            <input type="text" placeholder="Izlew" />
          </div>
        </div>

        <div className="header-right">
          <Link to="/chat">
            <Badge badgeContent={unreadCount} color="error">
              <MailIcon />
            </Badge>
          </Link>

          <IconButton
            
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar style={{ backgroundColor: avatarColor }}>
              {user?.imgProfile ? (
                <img src={user.imgProfile} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />
              )}
            </Avatar>
          </IconButton>
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="mobile-header">
        <IconButton onClick={() => setMobileSidebar(true)}>
          <MenuIcon />
        </IconButton>

        <Link to="/" className="mobile-logo">Work</Link>

        <Link to="/chat">
          <Badge badgeContent={unreadCount} color="error">
            <MailIcon />
          </Badge>
        </Link>
      </div>

      {/* ================= DESKTOP MENU ================= */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <Link className="menu-link menu-flex" to="/Profile">
          <PersonIcon /> Profilim
        </Link>

        <Link className="menu-link menu-flex" to="/Settings">
          <SettingsIcon /> Sazlamalar
        </Link>

        <div className="menu-link menu-flex logout" onClick={logout}>
          <LogoutIcon /> Shıǵıw
        </div>
      </Menu>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileSidebar && (
        <div className="mobile-sidebar">
          <div className="sidebar-header">
            <Avatar style={{ backgroundColor: avatarColor }}>
              {user?.name?.[0] || <AccountCircleIcon />}
            </Avatar>

            <IconButton onClick={() => setMobileSidebar(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <Link to="/Profile" className="sidebar-link">Profilim</Link>
          <Link to="/Settings" className="sidebar-link">Sazlamalar</Link>
          <div onClick={logout} className="sidebar-link logout">Shıǵıw</div>
        </div>
      )}

    </header>
  );
};

export default HeaderUser;
