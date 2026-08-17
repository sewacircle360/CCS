import React, { useState } from 'react';
import { User, Teacher, Student, UserRole } from '../types';
import { ALL_BLOCK_CODES, TEACHER_ROLE_DESIGNATIONS } from '../mockData';
import { Shield, UserCheck, GraduationCap, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Teacher Register
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tEmpId, setTEmpId] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tDept, setTDept] = useState('Computer Science & Engineering');
  const [tBlockNumber, setTBlockNumber] = useState('Block A3');
  const [tRoomNumber, setTRoomNumber] = useState('402');
  const [tCabinNumber, setTCabinNumber] = useState('Cabin C-14');
  const [tSubjects, setTSubjects] = useState('Data Structures, Java');
  const [tDesignation, setTDesignation] = useState('HOD (Head of Department)');

  // Student Register
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sUid, setSUid] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sDept, setSDept] = useState('Computer Science & Engineering');
  const [sSemVal, setSSemVal] = useState('Semester 1');
  const [sYearVal, setSYearVal] = useState('Year 1 (1st Year)');

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
      setErrorMessage(`No ${portalRole} account registered with email "${loginEmail}". Please click "New Registration" below!`);
      return;
    }

    if (foundUser.password && foundUser.password !== loginPassword) {
      setErrorMessage('Incorrect password! Please check and try again.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  const handleRegisterTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!tName || !tEmail || !tPassword || !tEmpId) {
      setErrorMessage('Please fill out all required fields.');
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
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
            onClick={() => { setPortalRole('student'); setErrorMessage(''); }}
          >
            <GraduationCap size={18} />
            <span>Student</span>
          </button>

          <button
            className={`portal-tab ${portalRole === 'teacher' ? 'active' : ''}`}
            onClick={() => { setPortalRole('teacher'); setErrorMessage(''); }}
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

        {/* Mode Toggle (Login vs Register) - Only for Student and Teacher */}
        {portalRole !== 'admin' && (
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
                <Mail size={16} /> Email Address:
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter registered email address"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={16} /> Password:
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <span>Sign In to {portalRole.toUpperCase()} Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* FORM 2: TEACHER REGISTER */}
        {authMode === 'register' && portalRole === 'teacher' && (
          <form onSubmit={handleRegisterTeacherSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Employee ID *</label>
                <input
                  type="text"
                  value={tEmpId}
                  onChange={(e) => setTEmpId(e.target.value)}
                  placeholder="e.g. CU-EMP-1042"
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
                  placeholder="e.g. teacher.name@gmail.com"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Account Password *</label>
                <input
                  type="password"
                  value={tPassword}
                  onChange={(e) => setTPassword(e.target.value)}
                  placeholder="Set Password"
                  className="form-control"
                  required
                />
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
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Business School (USB)">Management (USB)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              {/* DESIGNATION / ROLE SELECTION */}
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
                  placeholder="e.g. 402"
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
                  placeholder="e.g. Cabin C-14"
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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Complete Teacher Registration
            </button>
          </form>
        )}

        {/* FORM 3: STUDENT REGISTER */}
        {authMode === 'register' && portalRole === 'student' && (
          <form onSubmit={handleRegisterStudentSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Student Full Name *</label>
                <input
                  type="text"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
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
                  placeholder="e.g. 21BCS10045"
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
                  placeholder="e.g. student.name@gmail.com"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Password *</label>
                <input
                  type="password"
                  value={sPassword}
                  onChange={(e) => setSPassword(e.target.value)}
                  placeholder="Set Password"
                  className="form-control"
                  required
                />
              </div>
            </div>

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
          font-size: 0.875rem;
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
