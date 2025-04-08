import React, { useState } from 'react';
import '../component/login.css';
import logo from '../assets/logo.jpg';
import backgroundVideo from '../assets/video2.mp4'; // Make sure to add your video file

const Login = () => {
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobile: '',
    confirmPassword: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (authMode === 'login' || authMode === 'signup') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (authMode === 'otp') {
      if (!formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (!/^[0-9]{6}$/.test(formData.otp)) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      setTimeout(() => {
        if (authMode === 'login') {
          console.log(`${userType} login successful`, formData);
        } else if (authMode === 'signup') {
          console.log(`${userType} signup data submitted`, formData);
          setOtpSent(true);
          setAuthMode('otp');
        } else if (authMode === 'otp') {
          console.log('OTP verified, account created', formData);
          setFormData({
            email: '',
            password: '',
            name: '',
            mobile: '',
            confirmPassword: '',
            otp: ''
          });
          setAuthMode('login');
        } else if (authMode === 'forgot') {
          console.log('Password reset email sent', formData.email);
          setResetEmailSent(true);
        }
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${userType} logging in with ${provider}`);
  };

  const sendOTP = () => {
    if (/^[0-9]{10}$/.test(formData.mobile)) {
      console.log(`OTP sent to ${formData.mobile}`);
      setOtpSent(true);
    }
  };

  const renderUserTypeTabs = () => (
    <div className="user-type-tabs">
      <button className={`tab-button ${userType === 'admin' ? 'active' : ''}`} onClick={() => setUserType('admin')}>Admin</button>
      <button className={`tab-button ${userType === 'agent' ? 'active' : ''}`} onClick={() => setUserType('agent')}>Agent</button>
    </div>
  );

  const renderLoginForm = () => (
    <>
      <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Login</h2>
      {renderUserTypeTabs()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group password-group">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={errors.password ? 'error' : ''} />
          <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="forgot-password">
          <button type="button" onClick={() => setAuthMode('forgot')} className="text-button">Forgot password?</button>
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Login'}</button>
      </form>

      <div className="social-login">
        <p className="divider">Or continue with</p>
        <div className="social-icons">
          <button className="social-button google" onClick={() => handleSocialLogin('google')} title="Login with Google"><i className="fab fa-google"></i></button>
          <button className="social-button linkedin" onClick={() => handleSocialLogin('linkedin')} title="Login with LinkedIn"><i className="fab fa-linkedin-in"></i></button>
          <button className="social-button microsoft" onClick={() => handleSocialLogin('microsoft')} title="Login with Microsoft"><i className="fab fa-microsoft"></i></button>
        </div>
      </div>

      <div className="auth-footer">
        <p>Don't have an account? <button type="button" onClick={() => setAuthMode('signup')} className="toggle-auth">Sign Up</button></p>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Verify</h2>
      {renderUserTypeTabs()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={errors.name ? 'error' : ''} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="mobile-otp-group">
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" maxLength="10" className={errors.mobile ? 'error' : ''} />
            <button type="button" className="send-otp-button" onClick={sendOTP} disabled={!formData.mobile || formData.mobile.length !== 10}>Send OTP</button>
          </div>
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        {otpSent && (
          <div className="form-group">
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" maxLength="6" className={errors.otp ? 'error' : ''} />
            {errors.otp && <span className="error-message">{errors.otp}</span>}
          </div>
        )}

        <div className="form-group password-group">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={errors.password ? 'error' : ''} />
          <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className={errors.confirmPassword ? 'error' : ''} />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Sign Up'}</button>
      </form>

      <div className="auth-footer">
        <p>Already have an account? <button type="button" onClick={() => setAuthMode('login')} className="toggle-auth">Login</button></p>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <h2>Reset Password</h2>
      {resetEmailSent ? (
        <div className="reset-success">
          <p>We've sent a password reset link to <strong>{formData.email}</strong>.</p>
          <button type="button" className="auth-button" onClick={() => { setAuthMode('login'); setResetEmailSent(false); }}>Back to Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Send Reset Link'}</button>

          <div className="auth-footer">
            <p>Remember your password? <button type="button" onClick={() => setAuthMode('login')} className="toggle-auth">Login</button></p>
          </div>
        </form>
      )}
    </>
  );

  return (
    <div className="auth-container">
      {/* Background Video */}
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="auth-card">
        {/* Logo in top-left corner */}
        <img src={logo} alt="Logo" className="auth-logo" />

        <div className="auth-card-inner">
          <div className="auth-card-front">
            {authMode === 'login' && renderLoginForm()}
            {authMode === 'signup' && renderSignupForm()}
            {authMode === 'forgot' && renderForgotPasswordForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;