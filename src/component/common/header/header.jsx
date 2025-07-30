import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo2.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { HeaderData } from "../../../data";
import ImageComponent from "../../image/ImageComponent";
import { MobileMenu } from "./mobileMenu";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../feature/leafSlice";
import { fetchUserData } from "../../../helper/helper";
import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export const Header = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { activeTab, cart } = useSelector((state) => state.leaf);
  const { access_leaf, name } = fetchUserData();

  // New: track whether we've scrolled past 50px
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Particles init (unchanged) …
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  const particlesOptions = { /* your existing particles config */ };

  const handleSetActiveTab = (tab) => dispatch(setActiveTab(tab));
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => localStorage.removeItem("leafUser");

  return (
    <div
      className={`
        ${scrolled ? "sticky" : "absolute"} top-0 left-0 w-full z-50
    flex items-center justify-between
    px-4 md:px-[8%] sm:px-[5%]
    transition-all duration-300
    ${scrolled
      ? "bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-md"
      : "bg-transparent"}
  `}
    >
      {/* Particles in the background */}
      <Particles
        id="tsparticles-header"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        init={particlesInit}
        options={particlesOptions}
      />

      {/* Logo */}
      <Link to="/">
        <ImageComponent
          variant="circular"
          src={Logo}
          alt="logo"
          cardCss="sm:size-[90px] md:size-[90px] size-[60px] group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6">
        {HeaderData.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            onClick={() => handleSetActiveTab(item.title)}
            className={`text-sm md:text-base whitespace-nowrap ${
              activeTab === item.title ? "font-semibold text-black" : "text-gray-700"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Cart + User + MobileMenu */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/cart" className="relative">
          <ShoppingCartOutlinedIcon />
          <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
            {cart?.length || 0}
          </span>
        </Link>

        {access_leaf ? (
          <>
            <Tooltip title={name} placement="bottom">
              <div
                onClick={handleClick}
                className="bg-green-600 rounded-full text-white w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Link to="/profile">Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/order">Orders</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/wishlist">Wishlist</Link>
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link to="/sign-in">
            <PersonOutlineIcon />
          </Link>
        )}

        <MobileMenu />
      </div>
    </div>
  );
};
