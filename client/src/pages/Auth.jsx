import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, 
  FiEyeOff, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertCircle,
  FiLock,
  FiMail,
  FiUser,
  FiPhone
} from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function Auth() {
  const { login, register, navigateTo } = useContext(AppContext);

  // Auth screen mode: 'login' | 'register' | 'mobile' | 'forgot'
  const [mode, setMode] = useState('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Mobile login states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clear notifications when switching modes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setConfirmPassword('');
    setMobileNumber('');
    setOtpSent(false);
    setOtpCode('');
  };

  // Validators
  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const validatePhone = (val) => {
    return /^\d{10}$/.test(val);
  };

  // Submit Handlers
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccessMsg('Login successful! Redirecting...');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email || !validateEmail(email)) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!phone || !validatePhone(phone)) {
      setErrorMsg('A valid 10-digit phone number is required.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await register(fullName, email, `+91 ${phone}`, password, 'Customer');
    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting...');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!mobileNumber || !validatePhone(mobileNumber)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    setOtpSent(true);
    setSuccessMsg(`Simulated OTP sent! Please use verification code: ${code}`);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode !== simulatedOtp) {
      setErrorMsg(`Invalid verification code. Please enter: ${simulatedOtp}`);
      return;
    }

    // Authenticate with seeded Admin credentials in live DB on OTP success
    const res = await login("olivia@orikam.com", "password123");
    if (res.success) {
      setSuccessMsg('OTP verified successfully! Redirecting...');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSuccessMsg('Reset link sent successfully! Check your inbox for reset instructions.');
  };

  // Card transitions
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div 
      className="min-h-screen w-full relative bg-cover bg-center flex flex-col font-sans text-left overflow-x-hidden"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200')` }}
    >
      {/* Dark warm overlay covering the entire screen */}
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs z-10 pointer-events-none"></div>

      {/* Main Content Grid: absolute on top of overlay */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto min-h-screen flex flex-col md:flex-row justify-between p-6 sm:p-8 md:p-12 lg:p-16 gap-8">
        
        {/* Left Side: Brand & Tagline Info */}
        <div className="flex flex-col justify-between md:w-1/2 text-white py-4 md:py-8">
          {/* Top Left Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer select-none bg-white/95 px-3 py-1.5 rounded-lg w-fit shadow-xs hover:bg-white transition-colors flex items-center justify-center"
          >
            <img src="/Logo.png" alt="Orikam Logo" className="h-7 object-contain" />
          </div>

          {/* Bottom Left Text */}
          <div className="mt-12 md:mt-auto max-w-lg mb-4 md:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-outfit leading-tight tracking-wide">
              Trusted Dental Solutions,<br />
              Built for Professionals
            </h2>
            <p className="text-white/80 text-[11px] sm:text-xs lg:text-sm mt-3 leading-relaxed font-semibold">
              Access certified dental equipment, smart ordering tools, and exclusive benefits—designed to support modern clinics and professionals.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Auth Card container */}
        <div className="flex-1 flex items-center justify-center md:justify-end md:w-1/2 py-4 relative z-30">
        
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col font-sans"
            >
              <h3 className="text-xl font-extrabold text-gray-800 font-outfit text-center">Login</h3>
              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold mt-1 text-center">Login or sign up now using your mobile number or email</p>
              
              {/* Feedback messages */}
              {errorMsg && (
                <div className="mt-3 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-red-100">
                  <FiAlertCircle className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mt-3 bg-green-50 text-green-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-green-100">
                  <FiCheckCircle className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailLoginSubmit} className="flex flex-col mt-5 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Password</label>
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-[10px] font-bold text-brand-red hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-3 rounded-lg mt-2 shadow-2xs hover:shadow transition-all cursor-pointer text-center font-outfit"
                >
                  Continue
                </button>
              </form>

              {/* Login with Mobile Number Text Link */}
              <button
                onClick={() => handleModeChange('mobile')}
                className="text-[10px] font-bold text-gray-600 hover:text-gray-900 mt-4 hover:underline text-center font-outfit"
              >
                Login With Mobile Number
              </button>

              {/* Social Login Separator */}
              <div className="flex items-center my-5 w-full">
                <div className="flex-1 border-t border-gray-100"></div>
                <span className="text-[10px] font-bold text-gray-300 px-3 uppercase tracking-wider font-outfit">OR</span>
                <div className="flex-1 border-t border-gray-100"></div>
              </div>

              {/* Social buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setSuccessMsg('Simulated Meta social login success!');
                    setTimeout(() => {
                      login({
                        name: "Olivia Rhye",
                        email: "olivia@orikam.com",
                        phone: "+91 98765 43210",
                        role: "Super Admin",
                        clinicName: "Rhye Dental Clinic",
                        gstin: "36AAAAA1111A1Z1"
                      });
                      navigateTo('home');
                    }, 1200);
                  }}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 flex items-center justify-center py-2.5 rounded-lg text-xs font-bold text-gray-600 transition-all cursor-pointer font-outfit"
                >
                  {/* Meta Logo SVG */}
                  <svg className="w-4 h-4 mr-2 text-[#0066FF]" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"/>
                  </svg>
                  <span>Login With Meta</span>
                </button>
                <button
                  onClick={() => {
                    setSuccessMsg('Simulated Google social login success!');
                    setTimeout(() => {
                      login({
                        name: "Olivia Rhye",
                        email: "olivia@orikam.com",
                        phone: "+91 98765 43210",
                        role: "Super Admin",
                        clinicName: "Rhye Dental Clinic",
                        gstin: "36AAAAA1111A1Z1"
                      });
                      navigateTo('home');
                    }, 1200);
                  }}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 flex items-center justify-center py-2.5 rounded-lg text-xs font-bold text-gray-600 transition-all cursor-pointer font-outfit"
                >
                  {/* Google Logo SVG */}
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.02h3.87c2.26-2.08 3.58-5.14 3.58-8.49z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.12C3.26 20.22 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.27a7.18 7.18 0 010-4.54V6.61H1.29a11.94 11.94 0 000 10.78l3.98-3.12z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 3.78 1.29 7.73l3.98 3.12c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Login With Google</span>
                </button>
              </div>

              {/* Sign Up Redirect */}
              <div className="mt-6 text-center text-xs font-semibold text-gray-500 font-outfit">
                Don't have an account?{' '}
                <button
                  onClick={() => handleModeChange('register')}
                  className="text-brand-red font-bold hover:underline"
                >
                  Create Account
                </button>
              </div>

              {/* Terms Footer */}
              <p className="text-[9px] text-gray-400 mt-6 leading-normal text-center max-w-[280px] mx-auto select-none">
                By logging or signing up, you agree to our{' '}
                <a href="#" className="text-blue-500 hover:underline">Terms</a> &{' '}
                <a href="#" className="text-blue-500 hover:underline">Policy</a>
              </p>
            </motion.div>
          )}

          {mode === 'mobile' && (
            <motion.div
              key="mobile"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col font-sans"
            >
              <div className="relative flex items-center justify-center mb-2">
                <button 
                  onClick={() => handleModeChange('login')}
                  className="absolute left-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <FiArrowLeft size={16} />
                </button>
                <h3 className="text-xl font-extrabold text-gray-800 font-outfit text-center">Login</h3>
              </div>
              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold text-center">
                {!otpSent ? 'Login or sign up now using your mobile number' : 'Enter verification code sent to your phone'}
              </p>

              {errorMsg && (
                <div className="mt-3 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-red-100">
                  <FiAlertCircle className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mt-3 bg-green-50 text-green-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-green-100">
                  <FiCheckCircle className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col mt-5 gap-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Mobile Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 border-r border-gray-200 pr-1.5">+91</span>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit number"
                        className="w-full pl-[70px] pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-3 rounded-lg mt-2 shadow-2xs hover:shadow transition-all cursor-pointer font-outfit"
                  >
                    Send One-Time OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col mt-5 gap-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">OTP Verification Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter verification code"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all text-center tracking-widest font-extrabold text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-3 rounded-lg mt-2 shadow-2xs hover:shadow transition-all cursor-pointer font-outfit"
                  >
                    Verify & Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setSuccessMsg('');
                      setErrorMsg('');
                    }}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 text-center hover:underline"
                  >
                    Change phone number
                  </button>
                </form>
              )}

              <button
                onClick={() => handleModeChange('login')}
                className="text-[10px] font-bold text-gray-600 hover:text-gray-900 mt-5 hover:underline text-center font-outfit"
              >
                Login With Email & Password
              </button>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col font-sans"
            >
              <div className="relative flex items-center justify-center mb-2">
                <button 
                  onClick={() => handleModeChange('login')}
                  className="absolute left-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <FiArrowLeft size={16} />
                </button>
                 <h3 className="text-xl font-extrabold text-gray-800 font-outfit text-center">SignUp</h3>
              </div>
              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold text-center">Join Orikam B2B clinical healthcare ecosystem</p>

              {errorMsg && (
                <div className="mt-3 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-red-100">
                  <FiAlertCircle className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mt-3 bg-green-50 text-green-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-green-100">
                  <FiCheckCircle className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="flex flex-col mt-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 border-r border-gray-200 pr-1.5">+91</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-[70px] pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password (min 6 chars)"
                      className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-2.5 rounded-lg mt-3 shadow-2xs hover:shadow transition-all cursor-pointer font-outfit"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-5 text-center text-xs font-semibold text-gray-500 font-outfit">
                Already have an account?{' '}
                <button
                  onClick={() => handleModeChange('login')}
                  className="text-brand-red font-bold hover:underline"
                >
                  Login Now
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col font-sans"
            >
              <div className="relative flex items-center justify-center mb-2">
                <button 
                  onClick={() => handleModeChange('login')}
                  className="absolute left-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <FiArrowLeft size={16} />
                </button>
                <h3 className="text-xl font-extrabold text-gray-800 font-outfit text-center">Reset Password</h3>
              </div>
              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold text-center">Enter your email to receive a password reset link</p>

              {errorMsg && (
                <div className="mt-3 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-red-100">
                  <FiAlertCircle className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mt-3 bg-green-50 text-green-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-green-100">
                  <FiCheckCircle className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col mt-5 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-3 rounded-lg mt-2 shadow-2xs hover:shadow transition-all cursor-pointer font-outfit"
                >
                  Send Reset Link
                </button>
              </form>

              <button
                onClick={() => handleModeChange('login')}
                className="text-[10px] font-bold text-gray-500 hover:text-gray-800 mt-5 hover:underline text-center font-outfit"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      </div>
    </div>
  );
}
