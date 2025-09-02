import { useState } from 'react';
import { sendOtp, verifyOtp } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    if (!mobile) return setMessage('Enter mobile number');
    const res = await sendOtp(mobile);
    setMessage(res.message);
    setStep(2);
  };

  const handleVerifyOtp = async () => {
    const res = await verifyOtp(mobile, otp);
    if (res.ok) {
      if (typeof window !== 'undefined') {
        // Access localStorage only in browser
        localStorage.setItem('token', res.token);
        window.location.href = '/order';
      }
    } else {
      setMessage(res.message);
    }
  };


  return (
    <div className="page">
      <Header />
      <div className="card">
        <h2>Login with OTP</h2>
        {message && <p className="message">{message}</p>}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
