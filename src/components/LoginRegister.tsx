import React, { useState } from 'react';
import { User, Teacher, Student, UserRole } from '../types';
import { ALL_BLOCK_CODES, TEACHER_ROLE_DESIGNATIONS } from '../mockData';
import { Shield, UserCheck, GraduationCap, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Key, Eye, EyeOff } from 'lucide-react';

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
  const [authMode, setAuthMode] = useState<'login' | 'claim' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Visibility Toggles for ALL Password Fields
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showClaimPassword, setShowClaimPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Claim Faculty Profile Form (Using Ecode or Email)
  const [claimEcodeOrEmail, setClaimEcodeOrEmail] = useState('');
  const [claimPassword, setClaimPassword] = useState('');
  const [matchedTeacher, setMatchedTeacher] = useState<Teacher | null>(null);

  // Teacher Register
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tEmpId, setTEmpId] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tDept, setTDept] = useState('Computer Science & Engineering');
  const [tBlockNumber, setTBlockNumber] = useState('Block B3');
  const [tRoomNumber, setTRoomNumber] = useState('304 A');
  const [tCabinNumber, setTCabinNumber] = useState('Cabin 304 A');
  const [tSubjects, setTSubjects] = useState('Computer Science');
  const [tDesignation, setTDesignation] = useState('Assistant Professor');

  // Student Register
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sUid, setSUid] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sDept, setSDept] = useState('Computer Science & Engineering');
  const [sSemVal, setSSemVal] = useState('Semester 5');
  const [sYearVal, setSYearVal] = useState('Year 3 (3rd Year)');

  // Helper for password validation (At least 6 chars, 1 uppercase, 1 lowercase, 1 symbol)
  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least 1 Uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least 1 Lowercase letter (a-z).';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Password must contain at least 1 Special Symbol (e.g. @, #, $, !).';
    }
    return null;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Admin Credentials validation check
    if (portalRole === 'admin') {
      if (loginEmail.trim().toLowerCase() === 'sewacircle360@gmail.com' && loginPassword === 'Admin@123') {
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
        setErrorMessage('Invalid Admin Credentials! Please check Email and Password.');
        return;
      }
    }

    // Teacher or Student Login
    const foundUser = users.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.role === portalRole
    );

    if (!foundUser) {
      setErrorMessage(`No ${portalRole} account registered with email "${loginEmail}". Click "Activate Official Profile" or "New Registration"!`);
      return;
    }

    if (foundUser.password && foundUser.password !== loginPassword) {
      setErrorMessage('Incorrect password! Please check and try again.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  // Search for official pre-seeded profile by Ecode or Email
  const handleCheckEcode = (val: string) => {
    setClaimEcodeOrEmail(val);
    setErrorMessage('');
    const query = val.trim().toLowerCase();
    if (!query) {
      setMatchedTeacher(null);
      return;
    }
    const found = teachers.find(
      t => t.empId.toLowerCase() === query || t.email.toLowerCase() === query
    );
    setMatchedTeacher(found || null);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!matchedTeacher) {
      setErrorMessage(`No pre-loaded CU Faculty profile found for "${claimEcodeOrEmail}". Please verify your Employee Ecode or Email.`);
      return;
    }

    const pwdErr = validatePasswordStrength(claimPassword);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    // Check if user already activated
    const existingUser = users.find(u => u.email.toLowerCase() === matchedTeacher.email.toLowerCase());
    if (existingUser) {
      existingUser.password = claimPassword;
      onLoginSuccess(existingUser);
      return;
    }

    // Activate profile without creating duplicate teacher row!
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
    }, claimPassword);
  };

  const handleRegisterTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!tName || !tEmail || !tPassword || !tEmpId) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const pwdErr = validatePasswordStrength(tPassword);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    // Smart check: If teacher Ecode or Email already exists in PDF dataset, match and activate instead of creating duplicate!
    const preExisting = teachers.find(
      t => t.empId.toLowerCase() === tEmpId.trim().toLowerCase() || t.email.toLowerCase() === tEmail.trim().toLowerCase()
    );

    if (preExisting) {
      onRegisterTeacher({
        userId: '',
        name: preExisting.name,
        empId: preExisting.empId,
        email: preExisting.email,
        phone: tPhone || preExisting.phone,
        department: preExisting.department,
        blockName: preExisting.blockName,
        blockNumber: preExisting.blockNumber,
        roomNumber: preExisting.roomNumber,
        cabinNumber: preExisting.cabinNumber,
        subjects: preExisting.subjects,
        avatar: preExisting.avatar,
        designation: preExisting.designation,
      }, tPassword);
      return;
    }

    const subjectsArray = tSubjects.split(',').map(s => s.trim()).filter(Boolean);
    onRegisterTeacher({
      userId: '',
      name: tName,
      empId: tEmpId,
      email: tEmail,
      phone: tPhone || '+91 98765 00000',
      department: tDept,
      blockName: `Chandigarh University ${tBlockNumber}`,
      blockNumber: tBlockNumber,
      roomNumber: tRoomNumber,
      cabinNumber: tCabinNumber,
      subjects: subjectsArray,
      avatar: '',
      designation: tDesignation,
    }, tPassword);
  };

  const handleRegisterStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!sName || !sEmail || !sPassword || !sUid) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const pwdErr = validatePasswordStrength(sPassword);
    if (pwdErr) {
      setErrorMessage(pwdErr);
      return;
    }

    const combinedSemester = `${sSemVal} (${sYearVal})`;

    onRegisterStudent({
      userId: '',
      name: sName,
      uid: sUid,
      email: sEmail,
      department: sDept,
      semester: combinedSemester,
      phone: sPhone || '+91 98222 00000',
    }, sPassword);
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

        {/* Portal Switcher Tabs */}
        <div className="portal-tabs">
          <button
            className={`portal-tab ${portalRole === 'student' ? 'active' : ''}`}
            onClick={() => { setPortalRole('student'); setAuthMode('login'); setErrorMessage(''); }}
          >
            <GraduationCap size={18} />
            <span>Student</span>
          </button>

          <button
            className={`portal-tab ${portalRole === 'teacher' ? 'active' : ''}`}
            onClick={() => { setPortalRole('teacher'); setAuthMode('login'); setErrorMessage(''); }}
          >
            <UserCheck size={18} />
            <span>Teacher / Faculty</span>
          </button>

          <button
            className={`portal-tab ${portalRole === 'admin' ? 'active' : ''}`}
            onClick={() => { setPortalRole('admin'); setAuthMode('login'); setErrorMessage(''); }}
          >
            <Shield size={18} />
            <span>Admin</span>
          </button>
        </div>

        {/* Mode Toggle (Login vs Claim vs Register) */}
        {portalRole === 'teacher' && (
          <div className="auth-mode-toggle">
            <button
              className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            >
              Sign In
            </button>
            <button
              className={`mode-btn ${authMode === 'claim' ? 'active' : ''}`}
              onClick={() => { setAuthMode('claim'); setErrorMessage(''); }}
            >
              ⚡ Activate Official Profile
            </button>
            <button
              className={`mode-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            >
              New Registration
            </button>
          </div>
        )}

        {portalRole === 'student' && (
          <div className="auth-mode-toggle">
            <button
              className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            >
              Sign In to Account
            </button>
            <button
              className={`mode-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            >
              New Registration
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORM 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <Mail size={16} /> Email Address / Ecode:
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={
                  portalRole === 'admin'
                    ? "sewacircle360@gmail.com"
                    : portalRole === 'student'
                    ? "e.g. 24bcs10812@cuchd.in"
                    : "e.g. ad1.cse@cumail.in or gagandeep.e8657@cumail.in"
                }
                className="form-control"
                required
              />
            </div>

            {/* LOGIN PASSWORD WITH EYE TOGGLE */}
            <div className="form-group">
              <label>
                <Lock size={16} /> Password:
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-control password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  title={showLoginPassword ? "Hide Password" : "Show Password"}
                  aria-label="Toggle Password Visibility"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <span>Sign In to {portalRole.toUpperCase()} Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* FORM 2: CLAIM / ACTIVATE PRE-LOADED CU FACULTY PROFILE */}
        {authMode === 'claim' && portalRole === 'teacher' && (
          <form onSubmit={handleClaimSubmit} className="auth-form">
            <div className="claim-intro-card">
              <Sparkles size={18} className="text-red" />
              <div>
                <strong>Activate Your Official CU Faculty Profile</strong>
                <p>Enter your Employee Ecode (e.g. <code>6220</code>, <code>8657</code>, <code>12999</code>) or official email to claim your pre-seeded cabin profile.</p>
              </div>
            </div>

            <div className="form-group">
              <label><Key size={16} /> Enter Employee Ecode or Email Address *</label>
              <input
                type="text"
                value={claimEcodeOrEmail}
                onChange={(e) => handleCheckEcode(e.target.value)}
                placeholder="e.g. 6220 or gagandeep.e8657@cumail.in"
                className="form-control"
                required
              />
            </div>

            {/* Matched Profile Preview */}
            {matchedTeacher ? (
              <div className="matched-card">
                <CheckCircle2 size={20} className="text-green" />
                <div>
                  <div className="matched-name">{matchedTeacher.name} (Ecode: {matchedTeacher.empId})</div>
                  <div className="matched-sub">{matchedTeacher.designation} • {matchedTeacher.blockNumber}, Room {matchedTeacher.roomNumber} ({matchedTeacher.cabinNumber})</div>
                </div>
              </div>
            ) : claimEcodeOrEmail.length > 2 && (
              <div className="searching-hint">
                Searching official CU faculty database... Try Ecode <code>6220</code>, <code>8657</code>, <code>12999</code>, <code>12830</code>, <code>5922</code>
              </div>
            )}

            {/* CLAIM PASSWORD WITH EYE TOGGLE */}
            <div className="form-group">
              <label><Lock size={16} /> Set Password for Your Account *</label>
              <div className="password-input-wrapper">
                <input
                  type={showClaimPassword ? "text" : "password"}
                  value={claimPassword}
                  onChange={(e) => setClaimPassword(e.target.value)}
                  placeholder="Set password (min 6 chars, 1 Big, 1 small, 1 symbol)"
                  className="form-control password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowClaimPassword(!showClaimPassword)}
                  title={showClaimPassword ? "Hide Password" : "Show Password"}
                  aria-label="Toggle Password Visibility"
                >
                  {showClaimPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small className="pwd-rule-text">Password requires: min 6 chars, 1 Uppercase (A-Z), 1 Lowercase (a-z), 1 Symbol (@,#,$,etc.)</small>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Activate Profile & Sign In
            </button>
          </form>
        )}

        {/* FORM 3: TEACHER REGISTER */}
        {authMode === 'register' && portalRole === 'teacher' && (
          <form onSubmit={handleRegisterTeacherSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="e.g. Dr. Sandeep Singh Kang"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Employee Ecode *</label>
                <input
                  type="text"
                  value={tEmpId}
                  onChange={(e) => setTEmpId(e.target.value)}
                  placeholder="e.g. 6220"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={tEmail}
                  onChange={(e) => setTEmail(e.target.value)}
                  placeholder="e.g. ad1.cse@cumail.in"
                  className="form-control"
                  required
                />
              </div>

              {/* TEACHER REGISTER PASSWORD WITH EYE TOGGLE */}
              <div className="form-group flex-1">
                <label>Account Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showTeacherPassword ? "text" : "password"}
                    value={tPassword}
                    onChange={(e) => setTPassword(e.target.value)}
                    placeholder="Set Password"
                    className="form-control password-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                    title={showTeacherPassword ? "Hide Password" : "Show Password"}
                    aria-label="Toggle Password Visibility"
                  >
                    {showTeacherPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <small className="pwd-rule-text" style={{ marginTop: '-0.5rem' }}>Password rules: At least 6 characters, 1 Uppercase (A-Z), 1 Lowercase (a-z), 1 Symbol.</small>

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
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Business School (USB)">Management (USB)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
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
              📍 Cabin Location & Campus Block (A1-A3, B1-B4, C1-C3, D1-D8)
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Select CU Campus Block *</label>
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

            <div className="form-group">
              <label>Subjects Taught (Comma Separated)</label>
              <input
                type="text"
                value={tSubjects}
                onChange={(e) => setTSubjects(e.target.value)}
                placeholder="e.g. Data Structures, Operating Systems, Machine Learning"
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Complete Teacher Registration
            </button>
          </form>
        )}

        {/* FORM 4: STUDENT REGISTER */}
        {authMode === 'register' && portalRole === 'student' && (
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
                <label>Student UID / Roll No *</label>
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

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  placeholder="e.g. 24bcs10812@cuchd.in"
                  className="form-control"
                  required
                />
              </div>

              {/* STUDENT REGISTER PASSWORD WITH EYE TOGGLE */}
              <div className="form-group flex-1">
                <label>Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showStudentPassword ? "text" : "password"}
                    value={sPassword}
                    onChange={(e) => setSPassword(e.target.value)}
                    placeholder="Set Password (e.g. Deep@123)"
                    className="form-control password-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    title={showStudentPassword ? "Hide Password" : "Show Password"}
                    aria-label="Toggle Password Visibility"
                  >
                    {showStudentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <small className="pwd-rule-text" style={{ marginTop: '-0.5rem' }}>Password rules: Min 6 characters, 1 Uppercase (A-Z), 1 Lowercase (a-z), 1 Symbol (@, #, $).</small>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Department</label>
                <select
                  value={sDept}
                  onChange={(e) => setSDept(e.target.value)}
                  className="form-control"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                  <option value="Computer Applications">Computer Applications</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Business School (USB)">Management (USB)</option>
                </select>
              </div>

              {/* SEMESTER DROPDOWN (Sem 1 to 12) */}
              <div className="form-group flex-1">
                <label>Select Semester *</label>
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

              {/* ACADEMIC YEAR DROPDOWN (Year 1 to 6) */}
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
                  <option value="Year 5 (5th Year)">Year 5 (5th Year)</option>
                  <option value="Year 6 (6th Year)">Year 6 (6th Year)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Register Student Account
            </button>
          </form>
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
        .auth-mode-toggle {
          display: flex;
          border-bottom: 1.5px solid var(--border-light);
          margin-bottom: 1.25rem;
        }
        .mode-btn {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.65rem 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        .mode-btn.active {
          color: var(--cu-red);
          border-bottom-color: var(--cu-red);
          font-weight: 700;
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

        .claim-intro-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 0.85rem;
          border-radius: 8px;
          display: flex;
          gap: 0.75rem;
          font-size: 0.825rem;
          color: #1e40af;
          margin-bottom: 1rem;
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
        .searching-hint {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
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
          margin-top: 0.5rem;
        }
        .location-section-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--cu-red);
          background: var(--cu-red-light);
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};
