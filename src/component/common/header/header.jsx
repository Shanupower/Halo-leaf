import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../../../assets/Logo3.png";
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
import { getDisplayInitials, getDisplayName } from "../../../utils/display-initials";
import { PATHS } from "../../../routes/paths";
import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect } from "react";

export const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { cart } = useSelector((state) => state.leaf);
  const reduxName = useSelector((state) => state.leaf.user.name);
  const { access_leaf, name: storedName } = fetchUserData();
  const displayName = getDisplayName(reduxName || storedName);
  const initials = getDisplayInitials(displayName);

  const [scrolled, setScrolled] = useState(false);
  const cartCount = cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const hasSolidHeader = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSetActiveTab = (tab) => dispatch(setActiveTab(tab));
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("leafUser");
    localStorage.removeItem("access_token");
    handleClose();
    window.location.href = PATHS.home;
  };

  return (
    <div
      data-app-header
      className={`
        fixed top-0 left-0 w-full z-50
    flex items-center justify-between
    px-4 py-2 md:px-[8%] sm:px-[5%]
    transition-all duration-300
    ${hasSolidHeader
      ? "bg-white/90 backdrop-blur-xl border-b border-green-100 shadow-sm"
      : "bg-white/10 backdrop-blur-sm"}
  `}
    >
      {/* Logo */}
      <Link to={PATHS.home} className="relative z-10">
        <ImageComponent
          variant="circular"
          src={Logo}
          alt="HaloLeaf logo"
          cardCss="size-[56px] sm:size-[72px] md:size-[78px] group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="relative z-10 hidden items-center gap-2 rounded-full border border-green-100 bg-white/75 px-2 py-2 shadow-sm sm:flex">
        {HeaderData.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            onClick={() => handleSetActiveTab(item.title)}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-800"
              }`
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>

      {/* Cart + User + MobileMenu */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <Link
          to={PATHS.cart}
          aria-label="Shopping cart"
          className="relative inline-flex size-11 items-center justify-center rounded-full border border-green-100 bg-white/85 text-gray-800 shadow-sm transition hover:bg-green-50 hover:text-green-800"
        >
          <ShoppingCartOutlinedIcon />
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-green-700 px-1.5 py-0.5 text-center text-xs font-bold text-white">
            {cartCount}
          </span>
        </Link>

        {access_leaf ? (
          <>
            <Tooltip title={displayName || "Account"} placement="bottom">
              <div
                role="button"
                tabIndex={0}
                aria-label={displayName ? `Account for ${displayName}` : "Account menu"}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(e);
                  }
                }}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-green-700 font-semibold text-white shadow-sm transition hover:bg-gray-950"
              >
                {initials}
              </div>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Link to={PATHS.profile}>Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to={PATHS.order}>Orders</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to={PATHS.wishlist}>Wishlist</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link
            to={PATHS.signIn}
            aria-label="Account"
            className="inline-flex size-11 items-center justify-center rounded-full border border-green-100 bg-white/85 text-gray-800 shadow-sm transition hover:bg-green-50 hover:text-green-800"
          >
            <PersonOutlineIcon />
          </Link>
        )}

        <MobileMenu />
      </div>
    </div>
  );
};
