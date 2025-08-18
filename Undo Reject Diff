import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo2.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SortIcon from "@mui/icons-material/Sort";
import { HeaderData } from "../../../data";
import ImageComponent from "../../image/ImageComponent";
import { MobileMenu } from "./mobileMenu";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../feature/leafSlice";
import { fetchUserData } from "../../../helper/helper";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
export const Header = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const { activeTab, cart } = useSelector((state) => state.leaf);

  const handleSetActiveTab = (tab) => {
    dispatch(setActiveTab(tab));
  };
  const { access_leaf, name } = fetchUserData();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const hanldeLogout = () => {
    localStorage.removeItem("leafUser");
  };

  return (
    <div className="md:px-[8%] sm:px-[5%] px-2  flex justify-between gap-4  items-center sticky top-0 bg-white w-full z-50 shadow-sm">
      <Link to="/">
        <ImageComponent
          variant="circular"
          src={Logo}
          alt="logo"
          cardCss="sm:size-[90px] md:size-[90px] size-[60px]"
        />
      </Link>

      <div className="sm:flex items-center md:gap-10 sm:gap-4  gap-2 hidden ">
        {HeaderData.map((item) => (
          <Link
            onClick={() => handleSetActiveTab(item.title)}
            to={item?.link}
            key={item?.id}
            className={`md:text-[16px] whitespace-nowrap text-sm  ${
              activeTab === item.title
                ? "font-semibold text-black  "
                : "text-gray-700"
            }`}
          >
            {item?.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center md:gap-6 sm:gap-4 gap-4">
        <Link to="/cart" className="relative">
          <ShoppingCartOutlinedIcon />
          <span className="absolute -top-2 -right-1 bg-red-500 text-white font-semibold rounded-full text-sm px-1">
            {cart?.length ?? 0}
          </span>
        </Link>

        {access_leaf ? (
          <>
            <Tooltip onClick={handleClick} title={name} placement="top-start">
              <div className="bg-green-600 cursor-pointer rounded-full size-8 font-semibold  text-lg text-white flex items-center justify-center p-2">
                {name?.charAt(0).toUpperCase() ?? "T"}
              </div>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/profile">Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/order">Order</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/wishlist">Wishlist</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link onClick={hanldeLogout}>Logout</Link>
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
