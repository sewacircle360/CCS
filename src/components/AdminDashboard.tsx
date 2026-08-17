import React, { useState } from 'react';
import { Teacher, Student, Appointment, CampusBlock } from '../types';
import { Users, GraduationCap, Calendar, MapPin, CheckCircle2, XCircle, Search, Plus, Filter, Shield, AlertCircle } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const verifiedTeachersCount = teachers.filter(t => t.verified).length;
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;

  const filteredTeachers = teachers.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = t.name.toLowerCase().includes(q) ||
      t.empId.toLowerCase().includes(q) ||
      t.cabinNumber.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q)) ||
      t.designation.toLowerCase().includes(q);

    const matchesDept = selectedDept === 'all' || t.department === selectedDept;
    return matchesQuery && matchesDept;
  });

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <div className="admin-dashboard">
      {/* Admin Top Header Banner */}
      <div className="admin-banner">
        <div>
          <h2>Admin Control Center 🛡️</h2>
          <p>Chandigarh University Campus Connectivity & Cabin Infrastructure Directory</p>
        </div>
        <div className="admin-badge-pill">
          <Shield size={16} />
          <span>CU System Master Access</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Faculty Members ({verifiedTeachersCount} Verified)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gold">
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-label">Total Appointments ({pendingAppointmentsCount} Pending)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-value">1026</div>
            <div className="stat-label">Total CU Cabins Managed</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs-bar">
        <button
          className={`tab-item ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <Users size={16} /> Faculty / Teachers ({teachers.length})
        </button>

        <button
          className={`tab-item ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <GraduationCap size={16} /> Students Directory ({students.length})
        </button>

        <button
          className={`tab-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} /> Master Appointments Audit ({appointments.length})
        </button>

        <button
          className={`tab-item ${activeTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          <MapPin size={16} /> Campus Blocks ({blocks.length})
        </button>
      </div>

      {/* Search & Actions Bar */}
      <div className="table-controls-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={
              activeTab === 'teachers' ? "Search teacher name, Emp ID, cabin, subject..." :
              activeTab === 'students' ? "Search student name, UID, email..." : "Search..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control input-search"
          />
        </div>

        {activeTab === 'teachers' && (
          <div className="filter-controls">
            <Filter size={16} className="text-muted" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-control select-dept"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Artificial Intelligence & Data Science">AI & DS</option>
              <option value="Computer Applications">Computer Applications</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Business School (USB)">Management (USB)</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: TEACHERS TABLE */}
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
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No faculty profiles found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="user-cell">
                        <img src={t.avatar} alt={t.name} className="user-avatar" />
                        <div>
                          <div className="font-bold">{t.name}</div>
                          <div className="user-sub">
                            CU-EMP-{t.empId} • <span className="text-red font-semibold">{t.designation}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{t.department}</td>
                    <td>
                      <span className="font-bold">{t.blockNumber}</span>, Room {t.roomNumber}
                    </td>
                    <td>
                      <span className="cabin-tag">{t.cabinNumber}</span>
                    </td>
                    <td>
                      {t.subjects && t.subjects.length > 0 ? (
                        t.subjects.join(', ')
                      ) : (
                        <span className="text-muted-italic">Not Added Yet</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${t.status}`}>
                        <span className={`pulse-dot ${t.status}`}></span>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {t.verified ? (
                        <span className="text-green flex-center">
                          <CheckCircle2 size={16} /> Verified
                        </span>
                      ) : (
                        <span className="text-muted flex-center">
                          <AlertCircle size={16} /> Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${t.verified ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => onVerifyTeacher(t.id)}
                      >
                        {t.verified ? 'Unverify' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: STUDENTS TABLE */}
      {activeTab === 'students' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>UID / Roll No</th>
                <th>Email Address</th>
                <th>Department</th>
                <th>Semester / Year</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No registered students yet. Students can register using the Student portal on the login page.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="font-bold">{s.name}</div>
                    </td>
                    <td><span className="uid-tag">{s.uid}</span></td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.semester}</td>
                    <td>{s.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: MASTER APPOINTMENTS AUDIT */}
      {activeTab === 'appointments' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student (UID)</th>
                <th>Teacher & Cabin</th>
                <th>Date & Slot</th>
                <th>Subject / Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No appointments booked yet.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-bold">{a.studentName}</div>
                      <div className="user-sub">{a.studentUid} • {a.studentEmail}</div>
                    </td>
                    <td>
                      <div className="font-bold">{a.teacherName}</div>
                      <div className="user-sub">{a.teacherBlock} • {a.teacherCabin}</div>
                    </td>
                    <td>
                      <div className="font-bold">{a.date}</div>
                      <div className="user-sub">{a.timeSlot}</div>
                    </td>
                    <td>
                      <div><strong>{a.subject}</strong></div>
                      <div className="user-sub">"{a.reason}"</div>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status}`}>
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CAMPUS BLOCKS */}
      {activeTab === 'blocks' && (
        <div className="blocks-grid">
          {blocks.map((b) => (
            <div key={b.id} className="block-card card">
              <div className="block-header">
                <MapPin size={20} className="text-red" />
                <h3>{b.blockCode}</h3>
              </div>
              <p className="block-name">{b.name}</p>
              <div className="block-meta">
                <span>Total Cabins: <strong>{b.totalCabins}</strong></span>
              </div>
              <div className="depts-list">
                {b.departments.map((d, i) => (
                  <span key={i} className="dept-tag">{d}</span>
                ))}
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
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        .admin-badge-pill {
          background: rgba(200, 16, 46, 0.2);
          border: 1px solid rgba(200, 16, 46, 0.4);
          color: #ff4d6d;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 1rem;
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
        .stat-icon.red { background: var(--cu-red-light); color: var(--cu-red); }
        .stat-icon.blue { background: #eff6ff; color: #3b82f6; }
        .stat-icon.gold { background: #fffbeb; color: #d97706; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .admin-tabs-bar {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid var(--border-light);
        }
        .tab-item {
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
        .tab-item.active {
          color: var(--cu-red);
          border-bottom-color: var(--cu-red);
          font-weight: 700;
        }

        .table-controls-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
        }
        .search-bar {
          position: relative;
          flex: 1;
          max-width: 450px;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-search {
          padding-left: 2.5rem;
        }
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .select-dept {
          width: auto;
          min-width: 220px;
        }

        .table-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
        }
        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .cabin-tag {
          background: var(--cu-red-light);
          color: var(--cu-red);
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .uid-tag {
          background: #f1f5f9;
          color: var(--text-main);
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .text-green { color: #059669; }
        .text-red { color: var(--cu-red); }
        .text-muted-italic { color: #94a3b8; font-style: italic; font-size: 0.8rem; }
        .flex-center { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 600; }

        .blocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .block-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .block-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .block-name {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .block-meta {
          font-size: 0.85rem;
        }
        .depts-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.25rem;
        }
        .dept-tag {
          background: #f1f5f9;
          font-size: 0.725rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
