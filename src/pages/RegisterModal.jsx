import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal } from 'antd';
import styles from './RegisterModal.module.css';

const RegisterModal = ({ isOpen, onClose, eventId, eventName, posterUrl }) => {
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('api/register-now/', {
        eventId,
        memberId
      });

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully registered for the event.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        onClose();
        setMemberId('');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
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
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Enter your ID"
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
              className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RegisterModal;

