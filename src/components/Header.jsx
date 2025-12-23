import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { toast } from "react-toastify";
import Enter from "./Enter";
import Create from "./Create";

import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import "./styles/Header.css";

const Header = () => {
  const { logout, user, loading } = useAuth();
  const [render, setRender] = useState(false);
  const [create, setCreate] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [anchorEl, setAnchorEl] = useState(null); // Desktop avatar menu

  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Profilingizga kirin yoki o'z profilingizni yarating");
    }
  }, [loading, user]);

  if (loading) return null;

  return (
    <>
      {render && <Enter change={setRender} create={setCreate} />}
      {create && <Create change={setCreate} render={setRender} />}

      <header className="header">

        {/* DESKTOP HEADER */}
        {!isMobile && (
          <div className="header-container desktop-only">
            <div className="header-left">
              <Link to="/" className="header-logo">Work</Link>
              <div className="header-search">
                <input type="text" placeholder="Izlew" />
              </div>
            </div>
            <div className="header-right">
              <Button size="small" variant="outlined" onClick={() => setRender(true)}>Kiriw</Button>
              <Button size="small" variant="contained" onClick={() => setCreate(true)}>Jaratıw</Button>
              
              <IconButton onClick={handleAvatarClick}>
                <Avatar className="avatar" sx={{overflow: "hidden",}}>
                  {user?.imgProfile ? (
                    <img src={user.imgProfile} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />
                  )}
                </Avatar>
              </IconButton>

              {/* Desktop Avatar Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleClose}>
                  <Link to="/Profile">
                    <PersonIcon style={{ marginRight: 8 }} /> Profilim
                  </Link>
                  
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/Settings">
                    <SettingsIcon style={{ marginRight: 8 }} /> Sazlamalar
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); }} style={{color: "red"}}>
                  <LogoutIcon style={{ marginRight: 8, color: "red" }} /> Shıǵıw
                </MenuItem>
              </Menu>
            </div>
          </div>
        )}

        {/* MOBILE HEADER */}
        {isMobile && (
          <>
            <div className="mobile-header">
              {/* LEFT – sidebar toggle */}
              <IconButton onClick={() => setSidebarOpen(true)}>
                <MenuIcon />
              </IconButton>

              {/* CENTER – logo */}
              <Link to="/" className="mobile-logo">Work</Link>

              {/* RIGHT – action toggle */}
              <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Avatar className="avatar">
                  {user?.imgProfile ? (
                    <img src={user.imgProfile} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  ) : (
                    user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />
                  )}
                </Avatar>
              </IconButton>

            </div>

            {/* MOBILE ACTION MENU – header ostida, full-width */}
            {mobileMenuOpen && (
              <div className="mobile-action-menu">
                <Button
                  size="large"
                  variant="outlined"
                  onClick={() => setRender(true)}
                  fullWidth
                >
                  Kiriw
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => setCreate(true)}
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  Jaratıw
                </Button>
              </div>
            )}

            {/* MOBILE SIDEBAR */}
            {sidebarOpen && (
              <div className="mobile-sidebar-overlay" onClick={() => setSidebarOpen(false)}>
                <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
                  <div className="sidebar-user">
                    <Avatar className="avatar large">
                      {user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                    </Avatar>
                    <p>{user?.name || "Guest"}</p>
                  </div>

                  <Link to="/Profile" className="menu-link" onClick={() => setSidebarOpen(false)}>
                    <PersonIcon /> Profilim
                  </Link>

                  <Link to="/Settings" className="menu-link" onClick={() => setSidebarOpen(false)}>
                    <SettingsIcon /> Sazlamalar
                  </Link>

                  <div className="menu-link logout" onClick={logout}>
                    <LogoutIcon /> Shıǵıw
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </header>
    </>
  );
};

export default Header;
