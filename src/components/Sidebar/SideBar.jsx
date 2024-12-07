
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch, BiCog } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
// import { IoSettingsOutline } from "react-icons/io5";
import { FaWpforms, FaCodePullRequest } from "react-icons/fa6";
import SidebarMenu from "./SidebarMenu";

const routes = [
  {
    path: "/admin-dashboard",
    name: "Dashboard",
    icon: <FaHome />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/student-secretary-dashboard",
    name: "Dashboard",
    icon: <FaHome style={{color:"#fff"}} />,
    allowedRoles: ["Student Secretary"]
  },
  {
    path: "/configuration",
    name: "Configuration",
    icon:<FaWpforms />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/EntityCreationForm",
    name: "Entity Creation Form",
    icon: <FaWpforms />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/EntityRegistrationForm",
    name: "Entity Registration Form",
    icon: <FaWpforms />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/entityTable",
    name: "Entity Request",
    icon: <FaCodePullRequest />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/registered-entities",
    name: "Registered Entities",
    icon: <FaCodePullRequest />,
    allowedRoles: ["Admin"]
  },
  {
    path: "/file-manager",
    name: "File Manager",
    icon: <AiTwotoneFileExclamation />,
    allowedRoles: ["Admin", "Student Secretary"],
    subRoutes: [
      {
        path: "/settings/profile",
        name: "Profile ",
        icon: <FaUser />,
      },
      {
        path: "/settings/2fa",
        name: "2FA",
        icon: <FaLock />,
      },
      {
        path: "/settings/billing",
        name: "Billing",
        icon: <FaMoneyBill />,
      },
    ],
  },
  {
    path: "/order",
    name: "Order",
    icon: <BsCartCheck />,
    allowedRoles: ["Admin", "Student Secretary"]
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <BiCog />,
    allowedRoles: ["Admin", "Student Secretary"],
    exact: true,
    subRoutes: [
      {
        path: "/settings/profile",
        name: "Profile ",
        icon: <FaUser />,
      },
      {
        path: "/settings/2fa",
        name: "2FA",
        icon: <FaLock />,
      },
      {
        path: "/settings/billing",
        name: "Billing",
        icon: <FaMoneyBill />,
      },
    ],
  },
  {
    path: "/saved",
    name: "Saved",
    icon: <AiFillHeart />,
    allowedRoles: ["Admin", "Student Secretary"]
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role_name) {
      setUserRole(user.role_name);
    }
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "270px",
      padding: "5px 15px",
      transition: {
        duration: 2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  const filteredRoutes = routes.filter(route => 
    route.allowedRoles && route.allowedRoles.includes(userRole)
  );

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "270px" : "50px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  {/* Logo content */}
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {filteredRoutes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;

