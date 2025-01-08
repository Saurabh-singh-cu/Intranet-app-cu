import { useState } from "react";

import Swal from "sweetalert2";

export const sendDynamicEmailsSwift = async (receiverEmails, subject, body) => {
  const formData = new FormData();
  formData.append("user_id", getUserId);
  try {
    let data = {
      receiver_emails: receiverEmails.map((email) => email),
      subject: subject,
      body: body,
    };

    const response = await fetch(
      `http://172.17.2.247:8080/intranetapp/send-email/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok || response.status === 200) {
      const resultCount = await response.json();
      Swal.fire({
        title: "Emails sent successfully!!",
        icon: "success",
        button: "Close",
      });
      return true;
    } else {
      const errorData = await response.json();
      Swal.fire({
        title: errorData?.message || "Error sending emails",
        button: "Close",
      });
      return false;
    }
  } catch (error) {
    console.error("Error sending emails:", error);
    Swal.fire({
      title: "Error sending emails",
      text: error?.message,
      icon: "error",
      button: "Close",
    });
    return false;
  }
};

const sendMail = () => {
    Swal.fire({
        text: "Allow user to copy paste from excel email and bind auto @cuchd.in auto at the back"
    })
}