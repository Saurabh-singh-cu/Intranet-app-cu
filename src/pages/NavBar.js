import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import logonew from "../assets/images/intralogonew.jpeg";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import "./NavBar.css";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
    console.log(getuser, "USER NAME");
  }, []);

  const renderJoinNow = () => {
    window.location.href = "/join-now";
  };

  const navigatetohome = () => {
    if (userName?.role_name === "Admin") {
      window.location.href = "/admin-dashboard";
    } else if (userName?.role_name === "Student Secretary") {
      window.location.href = "/student-secretary-dashboard";
    } else {
      window.location.href = "/";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      extra: "⌘P",
    },
    {
      key: "3",
      label: "Task",
      extra: "⌘B",
    },
    {
      key: "4",
      label: `${userName?.role_name}`,
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          style={{ cursor: "pointer" }}
          onClick={navigatetohome}
          className="logoooo"
        >
          <img style={{ width: "136px", height: "34px" }} src={logonew} />
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search & Bookmark your page"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="navbar-right">
        {(isLoggedIn === true && userName?.role_name === "Student Secretary") ||
        userName?.role_name === "Admin" ? null : (
          <>
            {" "}
            <button onClick={renderJoinNow} className="btn dimButton btn-11">
              Join Now
            </button>
          </>
        )}
        {isLoggedIn === true &&
        userName?.role_name === "Student Secretary" ? null : (
          <>
            {" "}
            <button className="icon-button desktop-only">
              <span>
                <FaBell />
              </span>
            </button>
            <button className="icon-button desktop-only">
              <span>
                <MdMessage />
              </span>
            </button>
            {isLoggedIn === false ? null : (
              <>
                {" "}
                <button className="icon-button desktop-only">
                  <span>
                    <IoSettings />
                  </span>
                </button>
              </>
            )}
          </>
        )}

        {isLoggedIn === true && userName ? (
          <button className="icon-button desktop-only">
            <span className="greenDot"></span>
            <Dropdown
              menu={{
                items,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <span className="userOnNav">{userName?.user_name} </span>
                </Space>
              </a>
            </Dropdown>
          </button>
        ) : null}

        <div className="user-profile desktop-only">
          <span
            style={{ cursor: "pointer" }}
            onClick={handleLoginLogout}
            className="user-name"
          >
            {isLoggedIn ? (
              <div className="logout1">
                Log out{" "}
                <span style={{ marginLeft: "10px" }}>
                  <IoIosLogOut />
                </span>
              </div>
            ) : (
              <div className="logout1">Login</div>
            )}
          </span>
        </div>

        <button className="menu-button mobile-only" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <input
            type="text"
            placeholder="Search & Bookmark your page"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="icon-button">
            <span className="menu-show-">
              <FaBell />
            </span>
            <span className="menu-show-">Notifications</span>
          </button>
          <button className="icon-button">
            <span className="menu-show-">
              <MdMessage />
            </span>
            <span className="menu-show-">Messages</span>
          </button>
          <button className="icon-button">
            <span className="menu-show-">
              <IoSettings />
            </span>
            <span className="menu-show-">Settings</span>
          </button>
          {isLoggedIn === true && userName ? (
            <button className="icon-button">
              <span className="greenDot"></span>
              <span className="userOnNav">Welcome {userName?.user_name}</span>
            </button>
          ) : null}
          <button className="icon-button" onClick={handleLoginLogout}>
            <span className="menu-show-">
              <IoIosLogOut />
            </span>
            <span className="menu-show-">
              {isLoggedIn ? "Log out" : "Login"}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
