import React, { useEffect, useState } from "react";
import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import FileManager from "./pages/FileManager";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Setting from "./pages/Setting";
import AcademicAffairsForm from "./components/form/AcademicAffairsForm";
import NavBar from "./pages/NavBar";
import Login from "./pages/Login";
import EntityTable from "./components/form/EntityTable";
import ClubList from "./pages/ClubList";
import SpecificCard from "./pages/SpecificCard";
import EntityRegistrationForm from "./components/form/EntityRegistrationForm";
import RegisteredEntities from "./components/form/RegisteredEntities";
import JoinNow from "./components/form/JoinNow";
import Payment from "./components/form/Payment";
import DeptList from "./pages/DeptList";
import CommList from "./pages/CommList";
import AdminDashboard from "./pages/AdminDashboard";
import StudentSecretary from "./pages/StudentSecretary";
import StudentUpdatedPage from "./pages/secretary/StudentUpdatedPage";
import ProfessionalSociety from "./pages/ProfessionalSocietyList";
import JoinNowDetail from "./pages/JoinNowDetail";
import RegisterNewEntity from "./components/form/RegisterNewEntity";
import FacultyDashboard from "./pages/FacultyDashboard";
import MediaRequest from "./pages/MediaRequest";
import Home from "./pages/Home";
import UploadEventRequest from "./components/form/UploadEventRequest";
import AdminEventApproval from "./components/form/AdminEventApproval";
import ProtectedRoute from "./components/ProtectedRoutes";
import PageNotFound from "./PageNotFound";
import EventPublishedRequest from "./components/form/EventPublishedRequest";
import EventPublished from "./components/form/EventPublished";
import RegisteredMemberList from "./components/form/RegisteredMemberList";
import Swal from "sweetalert2";
import MarkAttendance from "./pages/MarkAttendance";

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudentSecretary, setIsStudentSecretary] = useState(false);
  const [isFaculty, setIsFaculty] = useState(false);
  const [user, setUser] = useState([]);
  const [tokenExpire, setTokenExpire] = useState(false);

  const handleLogin = () => {
    console.log("Login success");
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage?.getItem("user"));
    setUser(getUser);
    console.log(getUser, "USERERERRERRERRE");
    setIsAdmin(getUser?.role_name === "Admin");
    setIsStudentSecretary(getUser?.role_name === "Student Secretary");
    setIsFaculty(getUser?.role_name === "Faculty Advisory");
  }, []);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    // Check if there is no internet connection
    if (!navigator.onLine) {
      // Display a Swal notification if offline
      Swal.fire({
        title: "No Internet Connection",
        text: "You are not connected to the internet.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    // Optional: Listen for changes in the network status
    window.addEventListener("offline", () => {
      Swal.fire({
        title: "No Internet Connection",
        text: "You are now offline.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    });

    window.addEventListener("online", () => {
      Swal.fire({
        title: "Back Online",
        text: "You are now connected to the internet.",
        icon: "success",
        confirmButtonText: "OK",
      });
    });

    // Cleanup event listeners when component is unmounted
    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);

  //token expire function

  useEffect(() => {
    const getTockenExpiration = JSON.parse(localStorage.getItem(`user`));
    setTokenExpire(getTockenExpiration?.token_expiration_time);

    const currentTime = Date.now();
    console.log(currentTime - tokenExpire, "TIM LEFT")
    if (tokenExpire && currentTime >= tokenExpire) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      {!isLoginPage && (
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <div style={{ display: "flex" }}>
        {isLoggedIn && (isAdmin || isStudentSecretary || isFaculty) && (
          <SideBar />
        )}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<Dashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/dummy"
              element={<StudentUpdatedPage onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-approval-request"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <AdminEventApproval onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-published-request"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <EventPublishedRequest onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-published"
              element={
                <ProtectedRoute allowedRoles={["Faculty Advisory"]} user={user}>
                  <EventPublished onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registered-members-list"
              element={
                <ProtectedRoute
                  allowedRoles={["Student Secretary"]}
                  user={user}
                >
                  <RegisteredMemberList onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/mark-event-attendance"
              element={
                <ProtectedRoute
                  allowedRoles={["Student Secretary"]}
                  user={user}
                >
                  <MarkAttendance onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/home"
              element={<Home onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/student-secretary-dashboard"
              element={<Dashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/faculty-advisory-dashboard"
              element={<FacultyDashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/upload-event-request"
              element={<UploadEventRequest onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/join-now"
              element={<JoinNow onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/media-request"
              element={<MediaRequest onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/Register-New-Entity"
              element={<RegisterNewEntity onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/paynow"
              element={<Payment onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/configuration"
              // element={
              //   isLoggedIn ? (
              //     <Users />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <Users />
                  ) : (
                    <Dashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />

            <Route
              path="/entityTable"
              // element={
              //   isLoggedIn ? (
              //     <EntityTable />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <EntityTable />
                  ) : (
                    <Dashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/file-manager"
              element={
                isLoggedIn ? (
                  <FileManager />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/order"
              element={
                isLoggedIn ? (
                  <Order />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/saved"
              element={
                isLoggedIn ? (
                  <Saved />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn ? (
                  <Setting />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route path="/clubs" element={<ClubList />} />
            <Route path="/mark-event-attendance" element={<MarkAttendance />} />
            <Route path="/department-society" element={<DeptList />} />
            <Route
              path="/professional-society"
              element={<ProfessionalSociety />}
            />
            <Route path="/communities" element={<CommList />} />
            <Route path="/communities" element={<CommList />} />
            <Route
              path="/join-now-detailed-page/"
              element={<JoinNowDetail />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route
              path="/af"
              element={
                isLoggedIn ? (
                  <AcademicAffairsForm />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/EntityRegistrationForm"
              element={
                isLoggedIn ? (
                  <EntityRegistrationForm />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/registered-entities"
              // element={
              //   isLoggedIn ? (
              //     <RegisteredEntities />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <RegisteredEntities />
                  ) : (
                    <Dashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      {showLogin && (
        <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
