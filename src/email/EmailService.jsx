import React, { useState, useRef } from 'react';
import './EmailService.css';

const EmailService = () => {
  const [formData, setFormData] = useState({
    emails: [],
    subject: '',
    message: ''
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const processEmail = (email) => {
    email = email.trim();
    if (!email) return null;
    if (!email.includes('@')) {
      email = `${email}@cuchd.in`;
    }
    return isValidEmail(email) ? email : null;
  };

  const addEmails = (text) => {
    const newEmails = text
      .split(/[\n,]+/)
      .map(processEmail)
      .filter(Boolean);

    setFormData(prevState => ({
      ...prevState,
      emails: [...new Set([...prevState.emails, ...newEmails])]
    }));
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmails(inputValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addEmails(pastedText);
  };

  const removeEmail = (emailToRemove) => {
    setFormData(prevState => ({
      ...prevState,
      emails: prevState.emails.filter(email => email !== emailToRemove)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Email sent:', formData);
      setFormData({ emails: [], subject: '', message: '' });
      setInputValue('');
      alert('Email sent successfully!');
    } catch (error) {
      alert('Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-service-container">
      <div className="email-service-card">
        <h1 className="email-service-title"> Email Service</h1>
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group-mail">
            <label htmlFor="emails">Email Addresses</label>
            <div className="email-input-container" onClick={() => inputRef.current.focus()}>
               
              {formData.emails.map((email, index) => (
                <span key={index} className="email-tag">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)} className="remove-email">&times;</button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                id="emails"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Enter or paste email addresses, press Enter to add"
              />
            </div>
            <p className="email-count">Total Valid Emails: {formData.emails.length}</p>
          </div>

          <div className="form-group-mail">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              required
            />
          </div>

          <div className="form-group-mail">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here"
              required
              rows="6"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || formData.emails.length === 0}
          >
            {isLoading ? <div className="loader"></div> : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailService;

