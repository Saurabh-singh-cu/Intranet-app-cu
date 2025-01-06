import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "antd";
import styles from "./RegisterModal.module.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RegisterModal = ({ isOpen, onClose, erId, eventName, posterUrl }) => {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);

  const getThemeColor = (organiser) => {
    switch (organiser.toUpperCase()) {
      case "CLUB":
        return "#D86C31";
      case "DEPARTMENT":
      case "DEPARTMENT SOCIETY":
        return "#74ACE5";
      case "COMMUNITY":
        return "#D19EDE";
      case "PROFESSIONAL":
      case "PROFESSIONAL SOCIETY":
        return "#86A868";
      default:
        return "#4682B4";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        er_id: erId,
        membership_identifier: memberId?.toLocaleLowerCase(),
      };

      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/event-joinee-create/",
        payload
      );

      if (response.status === 201) {
        const {
          event_name,
          member_name,
          member_uid,
          Organiser,
          Organised_By,
          start_date,
          end_date,
          start_time,
          end_time,
          qr_image_base64,
        } = response.data;

        const themeColor = getThemeColor(Organiser);
        const pdf = new jsPDF();

        // Create PDF (same as before)
        pdf.setFillColor(240, 248, 255);
        pdf.rect(
          0,
          0,
          pdf.internal.pageSize.width,
          pdf.internal.pageSize.height,
          "F"
        );

        pdf.setFillColor(themeColor);
        pdf.rect(0, 0, pdf.internal.pageSize.width, 40, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.text("ENTRY PASS", pdf.internal.pageSize.width / 2, 25, {
          align: "center",
        });

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(16);
        pdf.text(`EVENT: ${event_name.toUpperCase()}`, 20, 60);

        const memberData = [
          ["MEMBER NAME", member_name.toUpperCase()],
          ["MEMBER UID", member_uid.toUpperCase()],
          ["ORGANISER", Organiser.toUpperCase()],
          ["ORGANISED BY", Organised_By.toUpperCase()],
          ["START DATE", start_date],
          ["END DATE", end_date],
          ["START TIME", start_time],
          ["END TIME", end_time],
        ];

        pdf.autoTable({
          startY: 70,
          head: [["DETAIL", "VALUE"]],
          body: memberData,
          theme: "grid",
          headStyles: { fillColor: themeColor, textColor: 255 },
          alternateRowStyles: { fillColor: [240, 248, 255] },
          margin: { top: 70, right: 90 },
          tableWidth: 120,
        });

        const qrImage = `data:image/png;base64,${qr_image_base64}`;
        pdf.addImage(qrImage, "PNG", 150, 70, 50, 50);

        pdf.setFillColor(themeColor);
        pdf.rect(
          0,
          pdf.internal.pageSize.height - 20,
          pdf.internal.pageSize.width,
          20,
          "F"
        );
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text(
          "Thank you for registering!",
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: "center" }
        );

        pdf.save(`${event_name}_${member_name}.pdf`);

        onClose();
        setMemberId("");
        
        Swal.fire({
          title: "Success!",
          text: "You have successfully registered for the event. A PDF has been downloaded.",
          icon: "success",
          confirmButtonColor: "#74ACE5", // Example color
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.membership_identifier ||
          "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Event Registration"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className={styles.modalContent}
    >
      <div className={styles.registrationForm}>
        <div className={styles.eventDetails}>
          <img src={posterUrl} alt={eventName} className={styles.eventPoster} />

          <div className={styles.eventInfo}>
            <h3>{eventName}</h3>
            <p>Please enter your UID or Membership Code to register</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="memberId" className={styles.formLabel}>
              UID / Membership Code
            </label>
            <input
              id="memberId"
              type="text"
              className={styles.formInput}
              value={memberId?.toLocaleLowerCase()}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Membership Code / UID"
              required
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !memberId}
              className={`${styles.submitButton} ${
                loading ? styles.loading : ""
              }`}
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RegisterModal;
