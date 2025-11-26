import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Enter from "./Enter";
import Create from "./Create";
import { Menu, Avatar, Button, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles/Header.css";

const Header = () => {
  const { logout, user, loading } = useAuth();
  const [render, setRender] = useState(false);
  const [create, setCreate] = useState(false);
  const [notOpen, willOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const open = Boolean(notOpen);
  const handleClick = (event) => willOpen(event.currentTarget);
  const handleClose = () => willOpen(null);

  const colors = ["#37474F", "#9C27B0", "#00BCD4", "#FF7043", "#e91e63", "#2E7D32"];
  let currentColorOfAvatar = null;
  if (user?.sex === "erkek") currentColorOfAvatar = colors[5];
  else if (user?.sex === "hayal") currentColorOfAvatar = colors[4];

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Profilingizga kirin yaki oz profilingizdi jaratin");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="header-loading">
        <p>Tekshirilmoqda...</p>
      </div>
    );
  }

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

            <div className="header-search">
              <input type="text" placeholder="Izlew" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="header-right">

            {/* Desktop login/create buttons */}
            <div className="desktop-buttons">
              <Button
                onClick={() => setRender(true)}
                sx={{
                  backgroundColor: "#fff",
                  color: "#4CAF50",
                  border: "2px solid #4CAF50",
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                  }
                }}
              >
                Kiriw
              </Button>

              <Button
                onClick={() => setCreate(true)}
                sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
              >
                Jaratıw
              </Button>
            </div>

            {/* DESKTOP AVATAR */}
            <button onClick={handleClick} className="header-avatar-btn desktop-avatar">
              <Avatar
                style={{ backgroundColor: currentColorOfAvatar }}
                className="header-avatar"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </button>

            {/* MOBILE: Avatar + MenuIcon (yonma-yon) */}
            <div className="mobile-right">
              
              {/* Mobile Avatar */}
              <button onClick={handleClick} className="mobile-avatar-btn">
                <Avatar
                  style={{ backgroundColor: currentColorOfAvatar }}
                  className="header-avatar"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </button>

              {/* Mobile Menu Toggle */}
              <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <MenuIcon fontSize="large" />
              </IconButton>

            </div>

          </div>
        </div>

        {/* DROPDOWN — Avatar menusı */}
        <Menu
          anchorEl={notOpen}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Link onClick={handleClose} className="menu-link" to="/Profile">Profilim</Link>
          <Link onClick={handleClose} className="menu-link" to="/Settings">Sazlamalar</Link>
          <div onClick={logout} className="menu-link logout-link">Shıǵıw</div>
        </Menu>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="mobile-menu">

            <Button
              onClick={() => { setRender(true); setMobileMenuOpen(false); }}
              sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
            >
              Kiriw
            </Button>

            <Button
              onClick={() => { setCreate(true); setMobileMenuOpen(false); }}
              className="header-btn create-btn"
            >
              Jaratıw
            </Button>
          </div>
        )}

      </header>
    </>
  );
};

export default Header;
