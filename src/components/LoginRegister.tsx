import React, { useState } from 'react';
import { User, Teacher, Student, UserRole } from '../types';
import { ALL_BLOCK_CODES, TEACHER_ROLE_DESIGNATIONS } from '../mockData';
import { Shield, UserCheck, GraduationCap, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Key, Eye, EyeOff, Send, ShieldCheck, RefreshCw } from 'lucide-react';

interface LoginRegisterProps {
  users: User[];
  teachers: Teacher[];
  students: Student[];
  onLoginSuccess: (user: User) => void;
  onRegisterTeacher: (teacherData: Omit<Teacher, 'id' | 'status' | 'verified'>, password: string) => void;
  onRegisterStudent: (studentData: Omit<Student, 'id'>, password: string) => void;
}

export const LoginRegister: React.FC<LoginRegisterProps> = ({
  users,
  teachers,
  students,
  onLoginSuccess,
  onRegisterTeacher,
  onRegisterStudent,
}) => {
  const [portalRole, setPortalRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);

  // Unified Smart Auth State
  const [identifierInput, setIdentifierInput] = useState(''); // Email or Ecode
  const [passwordInput, setPasswordInput] = useState('');
  const [authStep, setAuthStep] = useState<'enter_id' | 'enter_password' | 'otp_verify' | 'set_new_password' | 'create_new_account'>('enter_id');

  // Matched State
  const [matchedTeacher, setMatchedTeacher] = useState<Teacher | null>(null);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Teacher Registration Form State (If completely new)
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tDept, setTDept] = useState('Computer Science & Engineering');
  const [tBlockNumber, setTBlockNumber] = useState('Block B3');
  const [tRoomNumber, setTRoomNumber] = useState('304 A');
  const [tCabinNumber, setTCabinNumber] = useState('Cabin 304 A');
  const [tSubjects, setTSubjects] = useState('Computer Science');
  const [tDesignation, setTDesignation] = useState('Assistant Professor');

  // Student Registration Form State
  const [sName, setSName] = useState('');
  const [sUid, setSUid] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sDept, setSDept] = useState('Computer Science & Engineering');
  const [sSemVal, setSSemVal] = useState('Semester 5');
  const [sYearVal, setSYearVal] = useState('Year 3 (3rd Year)');

  // Helper for password validation
  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 6) return 'Password must be at least 6 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least 1 Uppercase letter (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least 1 Lowercase letter (a-z).';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return 'Password must contain at least 1 Special Symbol (e.g. @, #, $, !).';
    return null;
  };

  // STEP 1: Handle Smart Identification (Check Ecode/Email)
  const handleCheckIdentifier = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const query = identifierInput.trim().toLowerCase();

    if (!query) {
      setErrorMessage('Please enter your Email Address or Employee Ecode.');
      return;
    }

    // Admin Access Direct Check
    if (portalRole === 'admin') {
      if (query === 'sewacircle360@gmail.com') {
        setAuthStep('enter_password');
        return;
      } else {
        setErrorMessage('Invalid Admin Email Address.');
        return;
      }
    }

    // Check if account is ALREADY activated in users
    const existingUser = users.find(
      u => u.email.toLowerCase() === query || (portalRole === 'teacher' && u.profileId === `cu-${query}`)
    );

    if (existingUser) {
      setMatchedUser(existingUser);
      setAuthStep('enter_password');
      return;
    }

    // If Teacher: Check in pre-loaded PDF faculty database
    if (portalRole === 'teacher') {
      const foundTeacher = teachers.find(
        t => t.empId.toLowerCase() === query || t.email.toLowerCase() === query
      );

      if (foundTeacher) {
        setMatchedTeacher(foundTeacher);
        // Send OTP for security before password setup!
        sendEmailOtp(foundTeacher.email);
        return;
      } else {
        // Teacher not in PDF database -> Go to Create New Account
        setMatchedTeacher(null);
        setAuthStep('create_new_account');
        return;
      }
    }

    // If Student: If not registered -> Go to Create New Account
    if (portalRole === 'student') {
      setAuthStep('create_new_account');
    }
  };

  // Generate 6-Digit Email OTP
  const sendEmailOtp = (targetEmail: string) => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setAuthStep('otp_verify');
    setSuccessMessage(`🔒 Security OTP Code sent to ${targetEmail}! (For Demo: Your OTP Code is ${randomOtp})`);
  };

  // STEP 2: Verify 6-Digit OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (userEnteredOtp.trim() !== generatedOtp) {
      setErrorMessage('Invalid 6-Digit OTP Code! Please check the code sent to your email.');
      return;
    }

    setSuccessMessage('✓ OTP Code Verified Successfully! Set your account password below.');
    setAuthStep('set_new_password');
  };

  // STEP 3: Complete Password Setup & Activation for Pre-Loaded Teacher
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const pwdErr = validatePasswordStrength(passwordInput);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    if (matchedTeacher) {
      onRegisterTeacher({
        userId: '',
        name: matchedTeacher.name,
        empId: matchedTeacher.empId,
        email: matchedTeacher.email,
        phone: matchedTeacher.phone,
        department: matchedTeacher.department,
        blockName: matchedTeacher.blockName,
        blockNumber: matchedTeacher.blockNumber,
        roomNumber: matchedTeacher.roomNumber,
        cabinNumber: matchedTeacher.cabinNumber,
        subjects: matchedTeacher.subjects,
        avatar: matchedTeacher.avatar,
        designation: matchedTeacher.designation,
      }, passwordInput);
    }
  };

  // STEP 4: Login Submit (Existing User)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (portalRole === 'admin') {
      if (identifierInput.trim().toLowerCase() === 'sewacircle360@gmail.com' && passwordInput === 'Admin@123') {
        const adminUser: User = {
          id: 'admin-master',
          email: 'sewacircle360@gmail.com',
          role: 'admin',
          name: 'CU System Master Admin',
          profileId: 'admin-master',
        };
        onLoginSuccess(adminUser);
        return;
      } else {
        setErrorMessage('Invalid Admin Password!');
        return;
      }
    }

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== passwordInput) {
        setErrorMessage('Incorrect password! Please try again.');
        return;
      }
      onLoginSuccess(matchedUser);
    }
  };

  // STEP 5: New Teacher Registration
  const handleRegisterTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const pwdErr = validatePasswordStrength(passwordInput);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    const subjectsArray = tSubjects.split(',').map(s => s.trim()).filter(Boolean);
    onRegisterTeacher({
      userId: '',
      name: tName,
      empId: identifierInput,
      email: identifierInput.includes('@') ? identifierInput : `${identifierInput}@cumail.in`,
      phone: tPhone || '+91 98765 00000',
      department: tDept,
      blockName: `Chandigarh University ${tBlockNumber}`,
      blockNumber: tBlockNumber,
      roomNumber: tRoomNumber,
      cabinNumber: tCabinNumber,
      subjects: subjectsArray,
      avatar: '',
      designation: tDesignation,
    }, passwordInput);
  };

  // STEP 6: New Student Registration
  const handleRegisterStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const pwdErr = validatePasswordStrength(passwordInput);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    const combinedSemester = `${sSemVal} (${sYearVal})`;

    onRegisterStudent({
      userId: '',
      name: sName,
      uid: sUid || identifierInput,
      email: identifierInput.includes('@') ? identifierInput : `${identifierInput}@cuchd.in`,
      department: sDept,
      semester: combinedSemester,
      phone: sPhone || '+91 98222 00000',
    }, passwordInput);
  };

  const handleResetForm = () => {
    setAuthStep('enter_id');
    setIdentifierInput('');
    setPasswordInput('');
    setUserEnteredOtp('');
    setMatchedTeacher(null);
    setMatchedUser(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Top Header Branding */}
        <div className="auth-header">
          <div className="cu-logo-badge">
            <span className="cu-letters">CU</span>
          </div>
          <div>
            <h1 className="auth-title">Campus Connectivity System</h1>
            <p className="auth-subtitle">Chandigarh University Cabin & Location Directory Portal</p>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="portal-tabs">
          <button
            className={`portal-tab ${portalRole === 'student' ? 'active' : ''}`}
            onClick={() => { setPortalRole('student'); handleResetForm(); }}
          >
            <GraduationCap size={18} />
            <span>Student</span>
          </button>

          <button
            className={`portal-tab ${portalRole === 'teacher' ? 'active' : ''}`}
            onClick={() => { setPortalRole('teacher'); handleResetForm(); }}
          >
            <UserCheck size={18} />
            <span>Teacher / Faculty</span>
          </button>

          <button
            className={`portal-tab ${portalRole === 'admin' ? 'active' : ''}`}
            onClick={() => { setPortalRole('admin'); handleResetForm(); }}
          >
            <Shield size={18} />
            <span>Admin</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* UNIFIED STEP 1: ENTER EMAIL OR ECODE */}
        {authStep === 'enter_id' && (
          <form onSubmit={handleCheckIdentifier} className="auth-form">
            <div className="form-group">
              <label>
                <Mail size={16} /> Enter Official Email Address or Employee Ecode:
              </label>
              <input
                type="text"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                placeholder={
                  portalRole === 'admin'
                    ? "sewacircle360@gmail.com"
                    : portalRole === 'teacher'
                    ? "e.g. 6220, 8657, 12999 or teacher@cumail.in"
                    : "e.g. 24BCS10812 or student@cuchd.in"
                }
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <span>Continue & Verify Account</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* UNIFIED STEP 2: ENTER PASSWORD FOR EXISTING ACTIVATED USER */}
        {authStep === 'enter_password' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="user-found-notice">
              <CheckCircle2 size={18} className="text-green" />
              <span>Welcome Back! Account found for <strong>{identifierInput}</strong>.</span>
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Enter Your Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter your password"
                  className="form-control password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <span>Sign In to {portalRole.toUpperCase()} Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <button type="button" className="btn btn-secondary btn-block" onClick={handleResetForm}>
              Back to Start
            </button>
          </form>
        )}

        {/* UNIFIED STEP 3: OTP VERIFICATION FOR OFFICIAL FACULTY PROFILE */}
        {authStep === 'otp_verify' && matchedTeacher && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="matched-card">
              <ShieldCheck size={24} className="text-green" />
              <div>
                <div className="matched-name">{matchedTeacher.name} (Ecode: {matchedTeacher.empId})</div>
                <div className="matched-sub">{matchedTeacher.designation} • {matchedTeacher.blockNumber}, Room {matchedTeacher.roomNumber}</div>
              </div>
            </div>

            <div className="otp-box-card">
              <label><Send size={16} /> Enter 6-Digit Email Security OTP *</label>
              <input
                type="text"
                value={userEnteredOtp}
                onChange={(e) => setUserEnteredOtp(e.target.value.trim())}
                placeholder="Enter 6-Digit OTP (e.g. 482910)"
                className="form-control otp-input"
                maxLength={6}
                required
              />
              <div className="otp-resend-row">
                <button type="button" className="btn-link" onClick={() => sendEmailOtp(matchedTeacher.email)}>
                  <RefreshCw size={14} /> Resend OTP Code
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Verify OTP Code
            </button>

            <button type="button" className="btn btn-secondary btn-block" onClick={handleResetForm}>
              Back to Start
            </button>
          </form>
        )}

        {/* UNIFIED STEP 4: SET NEW PASSWORD AFTER OTP VERIFICATION */}
        {authStep === 'set_new_password' && (
          <form onSubmit={handleSetNewPassword} className="auth-form">
            <div className="matched-card">
              <CheckCircle2 size={24} className="text-green" />
              <div>
                <div className="matched-name">Verified: {matchedTeacher?.name}</div>
                <div className="matched-sub">Set your password below to activate your official cabin profile.</div>
              </div>
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Set Account Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Set password (min 6 chars, 1 Big, 1 small, 1 symbol)"
                  className="form-control password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small className="pwd-rule-text">Rules: Min 6 chars, 1 Uppercase (A-Z), 1 Lowercase (a-z), 1 Symbol.</small>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Activate Profile & Sign In
            </button>
          </form>
        )}

        {/* UNIFIED STEP 5: CREATE NEW ACCOUNT (IF NOT IN DATABASE) */}
        {authStep === 'create_new_account' && (
          <div>
            <div className="new-account-banner">
              <Sparkles size={16} />
              <span>No pre-loaded profile found for <strong>{identifierInput}</strong>. Complete registration below to create your account!</span>
            </div>

            {portalRole === 'teacher' ? (
              <form onSubmit={handleRegisterTeacherSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      placeholder="e.g. Dr. Faculty Name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label><Lock size={16} /> Set Account Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Set Password"
                      className="form-control password-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Department</label>
                    <select
                      value={tDept}
                      onChange={(e) => setTDept(e.target.value)}
                      className="form-control"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Computer Applications">Computer Applications</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Faculty Role / Designation *</label>
                    <select
                      value={tDesignation}
                      onChange={(e) => setTDesignation(e.target.value)}
                      className="form-control"
                      required
                    >
                      {TEACHER_ROLE_DESIGNATIONS.map((roleOpt, idx) => (
                        <option key={idx} value={roleOpt}>{roleOpt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="location-section-title">
                  📍 Cabin Location & Campus Block
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Select CU Block *</label>
                    <select
                      value={tBlockNumber}
                      onChange={(e) => setTBlockNumber(e.target.value)}
                      className="form-control"
                      required
                    >
                      {ALL_BLOCK_CODES.map((blkCode, idx) => (
                        <option key={idx} value={blkCode}>{blkCode}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Room Number</label>
                    <input
                      type="text"
                      value={tRoomNumber}
                      onChange={(e) => setTRoomNumber(e.target.value)}
                      placeholder="e.g. 304 A"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Cabin Number</label>
                    <input
                      type="text"
                      value={tCabinNumber}
                      onChange={(e) => setTCabinNumber(e.target.value)}
                      placeholder="e.g. Cabin 304 A"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Complete Registration & Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterStudentSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label>Student Full Name *</label>
                    <input
                      type="text"
                      value={sName}
                      onChange={(e) => setSName(e.target.value)}
                      placeholder="e.g. DEEPAK"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Student UID *</label>
                    <input
                      type="text"
                      value={sUid}
                      onChange={(e) => setSUid(e.target.value)}
                      placeholder="e.g. 24BCS10812"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label><Lock size={16} /> Set Account Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Set Password"
                      className="form-control password-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Semester *</label>
                    <select
                      value={sSemVal}
                      onChange={(e) => setSSemVal(e.target.value)}
                      className="form-control"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => `Semester ${i + 1}`).map((sem, idx) => (
                        <option key={idx} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Academic Year *</label>
                    <select
                      value={sYearVal}
                      onChange={(e) => setSYearVal(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="Year 1 (1st Year)">Year 1 (1st Year)</option>
                      <option value="Year 2 (2nd Year)">Year 2 (2nd Year)</option>
                      <option value="Year 3 (3rd Year)">Year 3 (3rd Year)</option>
                      <option value="Year 4 (4th Year)">Year 4 (4th Year)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Register Student Account
                </button>
              </form>
            )}

            <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '0.75rem' }} onClick={handleResetForm}>
              Back to Start
            </button>
          </div>
        )}
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .auth-card {
          background: #ffffff;
          width: 100%;
          max-width: 640px;
          border-radius: var(--radius-lg);
          padding: 2.25rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
          border: 1px solid var(--border-light);
        }
        .auth-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .cu-logo-badge {
          width: 50px;
          height: 50px;
          background: var(--cu-red-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 900;
          font-size: 1.4rem;
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
        }
        .auth-title {
          font-size: 1.25rem;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }
        .auth-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .portal-tabs {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }
        .portal-tab {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.65rem 0.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s;
        }
        .portal-tab.active {
          background: #ffffff;
          color: var(--cu-red);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          font-weight: 700;
        }

        .user-found-notice {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .new-account-banner {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .otp-box-card {
          background: #f8fafc;
          border: 1.5px solid #bfdbfe;
          padding: 1.25rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .otp-input {
          font-size: 1.3rem !important;
          letter-spacing: 0.35rem;
          text-align: center;
          font-weight: 800;
          color: var(--cu-red);
        }
        .otp-resend-row {
          display: flex;
          justify-content: flex-end;
        }
        .btn-link {
          background: transparent;
          border: none;
          color: #2563eb;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .alert-box {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .alert-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }
        .alert-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #059669;
        }

        .matched-card {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .matched-name {
          font-weight: 700;
          color: #065f46;
          font-size: 0.9rem;
        }
        .matched-sub {
          font-size: 0.8rem;
          color: #047857;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .btn-block {
          width: 100%;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .location-section-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--cu-red);
          background: var(--cu-red-light);
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .password-input {
          padding-right: 2.75rem !important;
        }
        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          border-radius: 6px;
          z-index: 10;
          transition: color 0.2s, background 0.2s;
        }
        .password-toggle-btn:hover {
          color: var(--cu-red);
          background: #f1f5f9;
        }
        .pwd-rule-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};
