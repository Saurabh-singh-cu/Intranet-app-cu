import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MediaRequest.css";
import Swal from "sweetalert2";

const MediaRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regId, setRegId] = useState(null);

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (
            parsedUserData &&
            parsedUserData.faculty_advisory_details &&
            parsedUserData.faculty_advisory_details.reg_id
          ) {
            setRegId(parsedUserData.faculty_advisory_details.reg_id);
          } else {
            throw new Error("reg_id not found in user data");
          }
        } else {
          throw new Error("User data not found in localStorage");
        }
      } catch (err) {
        setError(`Failed to get user data: ${err.message}`);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (regId) {
      fetchEntityMedia(regId);
      console.log(regId, "RRRRRRRRRRRRRRRRRRRRRRRRR");
    }
  }, [regId]);

  const fetchEntityMedia = async (regId) => {
    try {
      const response = await axios.get(
        `http://172.17.2.247:8080/intranetapp/entity_media_pending/?reg_id=${regId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response.data);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError(
        `Error fetching entity media: ${
          error.response?.data?.detail || error.message
        }`
      );
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!regId) {
      Swal.fire({
        title: "Error",
        text: "Registration ID is not available",
        icon: "error",
      });
      return;
    }
    try {
      await axios.put(
        `http://172.17.2.247:8080/intranetapp/entity-media/${id}/update-status/?reg_id=${regId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        title: "Status Changed",
        icon: "success",
      });
      fetchEntityMedia();
    } catch (err) {
      const errorMessage = `Failed to update status: ${
        err.response?.data?.detail || err.message
      }`;
      setError(errorMessage);
      Swal.fire({
        title: "Status Change Failed",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  return (
    <div className="media-request-container">
      <h1>Media Requests</h1>
      {requests.length === 0 ? (
        <p className="no-requests">No media requests found.</p>
      ) : (
        <table className="media-request-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Banner</th>
              <th>Logo</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>
                  <div className="image-container">
                    <img
                      src={request.banner_url}
                      alt="Banner"
                      className="thumbnail"
                    />
                    <div className="image-hover">
                      <img
                        src={request.banner_url}
                        alt="Banner"
                        className="full-image"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="image-container">
                    <img
                      src={request.logo_url}
                      alt="Logo"
                      className="thumbnail"
                    />
                    <div className="image-hover">
                      <img
                        src={request.logo_url}
                        alt="Logo"
                        className="full-image"
                      />
                    </div>
                  </div>
                </td>
                <td>{request.status}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
                <td>{new Date(request.updated_at).toLocaleString()}</td>
                <td>
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleStatusChange(request.id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MediaRequest;
