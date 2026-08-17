import React, { useState } from 'react';
import { Teacher, Student } from '../types';
import { UserCheck, GraduationCap, X } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onRegisterTeacher: (teacher: Omit<Teacher, 'id' | 'status' | 'verified'>) => void;
  onRegisterStudent: (student: Omit<Student, 'id'>) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  onClose,
  onRegisterTeacher,
  onRegisterStudent,
}) => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');

  // Teacher Form State
  const [tName, setTName] = useState('');
  const [tEmpId, setTEmpId] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tDept, setTDept] = useState('Computer Science & Engineering');
  const [tBlockName, setTBlockName] = useState('Academic Block A3');
  const [tBlockNumber, setTBlockNumber] = useState('Block A3');
  const [tRoomNumber, setTRoomNumber] = useState('402');
  const [tCabinNumber, setTCabinNumber] = useState('Cabin C-15');
  const [tSubjects, setTSubjects] = useState('Data Structures, Operating Systems');
  const [tDesignation, setTDesignation] = useState('Assistant Professor');

  // Student Form State
  const [sName, setSName] = useState('');
  const [sUid, setSUid] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sDept, setSDept] = useState('Computer Science & Engineering');
  const [sSemester, setSSemester] = useState('4th Semester (2nd Year)');

  const handleSubmitTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tEmpId || !tEmail) {
      alert('Please fill out required fields');
      return;
    }
    const subjectsArray = tSubjects.split(',').map(s => s.trim()).filter(Boolean);
    onRegisterTeacher({
      name: tName,
      empId: tEmpId,
      email: tEmail,
      phone: tPhone || '+91 98000 00000',
      department: tDept,
      blockName: tBlockName,
      blockNumber: tBlockNumber,
      roomNumber: tRoomNumber,
      cabinNumber: tCabinNumber,
      subjects: subjectsArray,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      designation: tDesignation,
    });
    alert(`Faculty Registration Submitted for ${tName}! Cabin assigned: ${tCabinNumber}`);
    onClose();
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sUid || !sEmail) {
      alert('Please fill out required fields');
      return;
    }
    onRegisterStudent({
      name: sName,
      uid: sUid,
      email: sEmail,
      phone: sPhone || '+91 97000 00000',
      department: sDept,
      semester: sSemester,
    });
    alert(`Student Account Created for ${sName} (${sUid})!`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <h3>Chandigarh University User Registration</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Role selector inside registration modal */}
          <div className="role-selector-tab">
            <button
              className={`reg-tab ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => setRole('teacher')}
            >
              <UserCheck size={18} />
              Register Faculty / Teacher
            </button>
            <button
              className={`reg-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              <GraduationCap size={18} />
              Register Student
            </button>
          </div>

          {/* Teacher Registration Form */}
          {role === 'teacher' && (
            <form onSubmit={handleSubmitTeacher} className="reg-form">
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
                  <label>CU Employee ID *</label>
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
                  <label>Official Email (@cumail.in) *</label>
                  <input
                    type="email"
                    value={tEmail}
                    onChange={(e) => setTEmail(e.target.value)}
                    placeholder="rajesh.sharma@cumail.in"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Mobile Number / Contact</label>
                  <input
                    type="text"
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="form-control"
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
                    <option value="Computer Applications">Computer Applications (BCA/MCA)</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Business School (USB)">Management (USB)</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Designation</label>
                  <input
                    type="text"
                    value={tDesignation}
                    onChange={(e) => setTDesignation(e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Location Details Sub-Header */}
              <div className="location-section-title">
                📍 Cabin & Block Location Details (Crucial for Student Visits)
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Block Name</label>
                  <input
                    type="text"
                    value={tBlockName}
                    onChange={(e) => setTBlockName(e.target.value)}
                    placeholder="e.g. Academic Block A3"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Block Code</label>
                  <input
                    type="text"
                    value={tBlockNumber}
                    onChange={(e) => setTBlockNumber(e.target.value)}
                    placeholder="e.g. Block A3"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
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
                <label>Subjects / Courses Taught (Comma Separated)</label>
                <input
                  type="text"
                  value={tSubjects}
                  onChange={(e) => setTSubjects(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms, Java, Web Dev"
                  className="form-control"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Faculty Member</button>
              </div>
            </form>
          )}

          {/* Student Registration Form */}
          {role === 'student' && (
            <form onSubmit={handleSubmitStudent} className="reg-form">
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
                  <label>CU Student UID / Roll No *</label>
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
                  <label>Student Email (@cuchd.in) *</label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    placeholder="21bcs10045@cuchd.in"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    value={sPhone}
                    onChange={(e) => setSPhone(e.target.value)}
                    placeholder="+91 98222 11004"
                    className="form-control"
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
                <div className="form-group flex-1">
                  <label>Semester / Year</label>
                  <input
                    type="text"
                    value={sSemester}
                    onChange={(e) => setSSemester(e.target.value)}
                    placeholder="e.g. 6th Semester (3rd Year)"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Student Account</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
        }
        .role-selector-tab {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
        }
        .reg-tab {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .reg-tab.active {
          background: #ffffff;
          color: var(--cu-red);
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          font-weight: 700;
        }
        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .location-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--cu-red);
          background: var(--cu-red-light);
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};
