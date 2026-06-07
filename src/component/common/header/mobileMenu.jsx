import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { HeaderData } from "../../../data";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";

export const MobileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const activeTab = useSelector((state) => state.leaf.activeTab);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="sm:hidden block">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Open menu"
        className="inline-flex items-center justify-center"
      >
        <MenuIcon />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {HeaderData.map((item) => (
          <MenuItem key={item.id} onClick={handleClose} component={Link} to={item.link}>
            <span
              className={`${
                activeTab === item.title
                  ? "font-semibold text-black  "
                  : "text-gray-700"
              } `}
            >
              {item.title}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
