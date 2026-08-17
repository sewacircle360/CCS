import React, { useState } from 'react';
import { Teacher, Student, Appointment, CampusBlock } from '../types';
import { Users, UserCheck, GraduationCap, Calendar, Building2, CheckCircle2, XCircle, Search, Filter, ShieldCheck, MapPin } from 'lucide-react';

interface AdminDashboardProps {
  teachers: Teacher[];
  students: Student[];
  appointments: Appointment[];
  blocks: CampusBlock[];
  onVerifyTeacher: (teacherId: string) => void;
  onAddTeacher: () => void;
  onAddStudent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  teachers,
  students,
  appointments,
  blocks,
  onVerifyTeacher,
  onAddTeacher,
  onAddStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'appointments' | 'blocks'>('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;
  const approvedAppointmentsCount = appointments.filter(a => a.status === 'approved').length;
  const verifiedTeachersCount = teachers.filter(t => t.verified).length;

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.cabinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.empId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = deptFilter === 'all' || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="admin-dashboard">
      {/* Top Banner */}
      <div className="admin-banner">
        <div>
          <h2>Admin Control Center 🛡️</h2>
          <p>Chandigarh University Campus Connectivity & Cabin Infrastructure Directory</p>
        </div>
        <div className="banner-badge">
          <ShieldCheck size={18} />
          <span>CU System Master Access</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card border-red">
          <div className="stat-icon red"><UserCheck size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{teachers.length}</span>
            <span className="stat-label">Faculty Members ({verifiedTeachersCount} Verified)</span>
          </div>
        </div>

        <div className="stat-card border-blue">
          <div className="stat-icon blue"><GraduationCap size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{students.length}</span>
            <span className="stat-label">Registered Students</span>
          </div>
        </div>

        <div className="stat-card border-amber">
          <div className="stat-icon amber"><Calendar size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{appointments.length}</span>
            <span className="stat-label">Total Appointments ({pendingAppointmentsCount} Pending)</span>
          </div>
        </div>

        <div className="stat-card border-green">
          <div className="stat-icon green"><Building2 size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{blocks.reduce((acc, b) => acc + b.totalCabins, 0)}</span>
            <span className="stat-label">Total CU Cabins Managed</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            <UserCheck size={16} />
            Faculty / Teachers ({teachers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <GraduationCap size={16} />
            Students Directory ({students.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={16} />
            Master Appointments Audit ({appointments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'blocks' ? 'active' : ''}`}
            onClick={() => setActiveTab('blocks')}
          >
            <Building2 size={16} />
            Campus Blocks ({blocks.length})
          </button>
        </div>

        <div className="tab-actions">
          {activeTab === 'teachers' && (
            <button className="btn btn-primary btn-sm" onClick={onAddTeacher}>
              + Add Faculty
            </button>
          )}
          {activeTab === 'students' && (
            <button className="btn btn-primary btn-sm" onClick={onAddStudent}>
              + Register Student
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      {(activeTab === 'teachers' || activeTab === 'students') && (
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={activeTab === 'teachers' ? "Search teacher name, Emp ID, cabin, subject..." : "Search student name, UID, email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          {activeTab === 'teachers' && (
            <div className="dept-filter">
              <Filter size={16} />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="form-control select-dept"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Artificial Intelligence & Data Science">AI & DS</option>
                <option value="Computer Applications">BCA / MCA</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Business School (USB)">Management (USB)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 1: Teachers */}
      {activeTab === 'teachers' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty Name & Emp ID</th>
                <th>Department</th>
                <th>Block & Room</th>
                <th>Cabin Number</th>
                <th>Subjects Taught</th>
                <th>Live Status</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="user-profile-cell">
                      <img src={t.avatar} alt={t.name} className="avatar-img" />
                      <div>
                        <div className="user-name">{t.name}</div>
                        <div className="user-sub">{t.empId} • {t.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="dept-badge">{t.department}</span></td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} className="icon-red" />
                      <span><strong>{t.blockNumber}</strong>, Room {t.roomNumber}</span>
                    </div>
                  </td>
                  <td><strong className="cabin-highlight">{t.cabinNumber}</strong></td>
                  <td>
                    <div className="subjects-tags">
                      {t.subjects.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="tag-pill">{s}</span>
                      ))}
                      {t.subjects.length > 2 && (
                        <span className="tag-more">+{t.subjects.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${t.status}`}>
                      <span className={`pulse-dot ${t.status}`}></span>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {t.verified ? (
                      <span className="verified-tag"><CheckCircle2 size={16} className="text-green" /> Verified</span>
                    ) : (
                      <span className="unverified-tag"><XCircle size={16} className="text-muted" /> Unverified</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${t.verified ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => onVerifyTeacher(t.id)}
                    >
                      {t.verified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 2: Students */}
      {activeTab === 'students' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>UID / Roll No</th>
                <th>Email Address</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="uid-badge">{s.uid}</span></td>
                  <td>{s.email}</td>
                  <td>{s.department}</td>
                  <td>{s.semester}</td>
                  <td>{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Faculty</th>
                <th>Date & Time Slot</th>
                <th>Location Details</th>
                <th>Subject & Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div>
                      <strong>{apt.studentName}</strong>
                      <div className="user-sub">{apt.studentUid}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{apt.teacherName}</strong>
                      <div className="user-sub">{apt.teacherCabin}</div>
                    </div>
                  </td>
                  <td>
                    <div><strong>{apt.date}</strong></div>
                    <div className="user-sub">{apt.timeSlot}</div>
                  </td>
                  <td>{apt.teacherBlock}</td>
                  <td>
                    <div><strong>{apt.subject}</strong></div>
                    <div className="user-sub truncate-reason">{apt.reason}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status.toUpperCase()}
                    </span>
                    {apt.status === 'rejected' && apt.rejectionReason && (
                      <div className="rejection-note" title={apt.rejectionReason}>
                        Reason: {apt.rejectionReason}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 4: Blocks */}
      {activeTab === 'blocks' && (
        <div className="blocks-grid">
          {blocks.map((blk) => (
            <div key={blk.id} className="block-card">
              <div className="block-header">
                <div className="block-code">{blk.blockCode}</div>
                <Building2 size={24} className="block-icon" />
              </div>
              <h3 className="block-name">{blk.name}</h3>
              <div className="block-cabins-info">
                <span>Total Cabins: <strong>{blk.totalCabins} Cabins</strong></span>
              </div>
              <div className="block-depts">
                <label>Hosted Departments:</label>
                <ul>
                  {blk.departments.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-md);
        }
        .admin-banner h2 {
          color: #ffffff;
          font-size: 1.4rem;
        }
        .admin-banner p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .banner-badge {
          background: rgba(200, 16, 46, 0.2);
          border: 1px solid var(--cu-red);
          color: #ff8093;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          font-weight: 700;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .stat-card {
          background: #ffffff;
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.red { background: #fff0f2; color: var(--cu-red); }
        .stat-icon.blue { background: #eff6ff; color: #3b82f6; }
        .stat-icon.amber { background: #fffbeb; color: #f59e0b; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        
        .stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          display: block;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .admin-tabs-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--border-light);
          padding-bottom: 0.25rem;
        }
        .tabs {
          display: flex;
          gap: 0.5rem;
        }
        .tab-btn {
          border: none;
          background: transparent;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: var(--cu-red);
          border-bottom-color: var(--cu-red);
          font-weight: 700;
        }
        .filter-bar {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .search-box {
          position: relative;
          flex: 1;
        }
        .search-icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-box input {
          padding-left: 2.6rem;
        }
        .dept-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }
        .select-dept {
          width: 220px;
        }
        .table-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
        }
        .user-profile-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-light);
        }
        .user-name {
          font-weight: 700;
          color: var(--text-main);
        }
        .user-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .dept-badge {
          background: #f1f5f9;
          color: var(--text-main);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.775rem;
          font-weight: 600;
        }
        .cabin-highlight {
          color: var(--cu-red);
          background: var(--cu-red-light);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }
        .location-cell {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .icon-red { color: var(--cu-red); }
        .subjects-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .tag-pill {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .tag-more {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .verified-tag {
          color: #059669;
          font-weight: 600;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .unverified-tag {
          color: var(--text-muted);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .uid-badge {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-weight: 700;
          font-family: monospace;
        }
        .rejection-note {
          font-size: 0.75rem;
          color: #dc2626;
          margin-top: 0.25rem;
          font-style: italic;
        }
        .blocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .block-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .block-code {
          background: var(--cu-red);
          color: #ffffff;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.85rem;
        }
        .block-icon { color: var(--text-muted); }
        .block-name {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }
        .block-cabins-info {
          font-size: 0.875rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }
        .block-depts label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.4rem;
        }
        .block-depts ul {
          list-style: disc;
          padding-left: 1.2rem;
          font-size: 0.85rem;
        }
        .truncate-reason {
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};
