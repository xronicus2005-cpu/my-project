import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { toast } from "react-toastify";
import Enter from "./Enter";
import Create from "./Create";

import { Menu, Avatar, Button, IconButton } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Profilingizga kirin yaki oz profilingizdi jaratin");
    }
  }, [loading, user]);

  if (loading) return null;

  return (
    <>
      {render && <Enter change={setRender} create={setCreate} />}
      {create && <Create change={setCreate} render={setRender} />}

      <header className="header">
        <div className="header-container">

          {/* LEFT */}
          <div className="header-left">
            <Link to="/" className="header-logo">
              Work
            </Link>

            {/* SEARCH */}
            <div className="header-search">
              <input type="text" placeholder="Izlew" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="header-right">

            {/* DESKTOP */}
            <div className="desktop-only">
              <Button
                size="small"
                variant="outlined"
                onClick={() => setRender(true)}
              >
                Kiriw
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={() => setCreate(true)}
              >
                Jaratıw
              </Button>

              <IconButton onClick={handleAvatarClick}>
                <Avatar className="avatar">
                  {user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </IconButton>
            </div>

            {/* MOBILE */}
            <div className="mobile-only">
              <IconButton onClick={handleAvatarClick}>
                <Avatar className="avatar small">
                  {user?.name ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </IconButton>

              <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <MenuIcon />
              </IconButton>
            </div>

          </div>
        </div>

        {/* AVATAR MENU */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Link to="/Profile" className="menu-link" onClick={handleClose}>
            <PersonIcon /> Profilim
          </Link>
          <Link to="/Settings" className="menu-link" onClick={handleClose}>
            <SettingsIcon /> Sazlamalar
          </Link>
          <div onClick={logout} className="menu-link logout">
            <LogoutIcon /> Shıǵıw
          </div>
        </Menu>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Button size="small" onClick={() => setRender(true)}>
              Kiriw
            </Button>
            <Button size="small" variant="contained" onClick={() => setCreate(true)}>
              Jaratıw
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
