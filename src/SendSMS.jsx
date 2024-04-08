import React, { useState } from 'react';

const SendSMS = ({ closePopup }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendSMS = () => {
   
    const accountSid = 'AC509e4d11d06a3d7a5ddb6a449134018f';
    const authToken = '74961a3bdece9b0ec7cd8dbdcfb5cbf9';

    
    const fromPhoneNumber = '+447700159578';

    // 准备要发送的短信内容和接收者手机号码
    const body = message;
    const toPhoneNumber = phoneNumber;

    
    fetch('/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`
      },
      body: JSON.stringify({
        from: fromPhoneNumber,
        to: toPhoneNumber,
        body: body
      })
    })
    .then(response => {
      if (response.ok) {
        alert('Send message successfully!');
      } else {
        throw new Error('Failed to send message');
      }
    })
    .catch(error => {
      console.error('Send Message Error:', error);
      alert('Failed to send message');
    });
  };
  
  return (
    <div style={{ padding: '20px' }}>
      {/* 输入电话号码和消息内容的表单 */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="Enter phone number..."
        style={{
          width: '80%',
          padding: '10px',
          margin: '10px auto',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          outline: 'none',
        }}
      />
      <br />
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter your message..."
        style={{
          width: '80%',
          padding: '10px',
          margin: '10px auto',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          outline: 'none',
          resize: 'vertical',
        }}
      />
      <br />
      <button onClick={sendSMS}
        style={{
          padding: '10px 20px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          fontSize: '16px',
          backgroundColor: '#add8e6', // 浅蓝色
          color: '#fff',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background-color 0.3s ease',
        }}
      >Send SMS</button>
    </div>
  );
};

export default SendSMS;
