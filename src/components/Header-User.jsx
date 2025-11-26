import { Container, Box, Typography, TextField } from "@mui/material";
import { Button, Avatar, IconButton } from "@mui/material";
import { Menu } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";

import { useState, useEffect } from "react";
import { useAuth } from "../hooksForBackend/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./styles/HeaderUser.css";

const HeaderUser = () => {
  const [notOpen, willOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { logout, user, loading } = useAuth();

  const open = Boolean(notOpen);
  const handleClick = (event) => willOpen(event.currentTarget);
  const handleClose = () => willOpen(null);

  const colors = ["#37474F", "#9C27B0", "#00BCD4", "#FF7043", "#e91e63", "#55555"];
  let currentColorOfAvatar = null;

  if (user?.sex === "erkek") currentColorOfAvatar = colors[5];
  else if (user?.sex === "hayal") currentColorOfAvatar = colors[4];

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Profilinizga kirin yaki oz profilinizdi jaratin");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <Container sx={{ marginTop: "2rem" }}>
        <p>Tekserilip atir...</p>
      </Container>
    );
  }

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

          {/* Mail icon */}
          <Link to="/chat" className="mail-icon-link">
            <MailIcon className="mail-icon" />
          </Link>

          {/* Desktop avatar */}
          <button onClick={handleClick} className="header-avatar-btn desktop-avatar">
            <Avatar style={{ backgroundColor: currentColorOfAvatar }} className="header-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </button>

          {/* Mobile menu toggle */}
          <div className="mobile-menu-toggle">
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU (Avatar) */}
      <Menu
        anchorEl={notOpen}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link onClick={handleClose} className="menu-link" to={"/Profile"}>Profilim</Link>
        <Link onClick={handleClose} className="menu-link" to={"/Settings"}>Sazlamalar</Link>
        <div onClick={logout} className="menu-link logout-link">Shıǵıw</div>
      </Menu>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">

          {/* MOBILE Avatar */}
          <button onClick={handleClick} className="header-avatar-btn mobile-avatar">
            <Avatar style={{ backgroundColor: currentColorOfAvatar }} className="header-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </button>

          <Link to="/chat" className="menu-link">Chat</Link>
          <Link to="/Profile" className="menu-link">Profilim</Link>
          <Link to="/Settings" className="menu-link">Sazlamalar</Link>
          <div onClick={logout} className="menu-link logout-link">Shigiw</div>
        </div>
      )}

    </header>
  );
};

export default HeaderUser;
