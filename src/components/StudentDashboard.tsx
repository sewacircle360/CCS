import React, { useState } from 'react';
import { Teacher, Student, Appointment, TimetableSlot } from '../types';
import { Search, MapPin, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Filter, BookOpen, User, Phone, Sparkles } from 'lucide-react';

interface StudentDashboardProps {
  currentStudent: Student;
  teachers: Teacher[];
  appointments: Appointment[];
  timetables: TimetableSlot[];
  onBookAppointment: (newApt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentStudent,
  teachers,
  appointments,
  timetables,
  onBookAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'find_teacher' | 'my_appointments'>('find_teacher');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Selected teacher for Booking / Timetable view
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState<Teacher | null>(null);
  const [selectedTeacherForTimetable, setSelectedTeacherForTimetable] = useState<Teacher | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-08-18');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  const myAppointments = appointments.filter(a => a.studentUid === currentStudent.uid || a.studentEmail === currentStudent.email);

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = t.name.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q)) ||
      t.department.toLowerCase().includes(q) ||
      t.blockName.toLowerCase().includes(q) ||
      t.cabinNumber.toLowerCase().includes(q);

    const matchesDept = selectedDept === 'all' || t.department === selectedDept;
    const matchesAvailable = !onlyAvailable || t.status === 'available';

    return matchesQuery && matchesDept && matchesAvailable;
  });

  const handleOpenBooking = (teacher: Teacher) => {
    setSelectedTeacherForBooking(teacher);
    setBookingSubject(teacher.subjects[0] || '');
    setBookingReason('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForBooking) return;
    if (!bookingReason.trim()) {
      alert('Please enter reason for your cabin visit request.');
      return;
    }

    onBookAppointment({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentUid: currentStudent.uid,
      studentEmail: currentStudent.email,
      teacherId: selectedTeacherForBooking.id,
      teacherName: selectedTeacherForBooking.name,
      teacherCabin: `${selectedTeacherForBooking.cabinNumber}, Room ${selectedTeacherForBooking.roomNumber}`,
      teacherBlock: `${selectedTeacherForBooking.blockName} (${selectedTeacherForBooking.blockNumber})`,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      subject: bookingSubject,
      reason: bookingReason,
    });

    setSelectedTeacherForBooking(null);
    setActiveTab('my_appointments');
    alert(`Appointment Request Sent to ${selectedTeacherForBooking.name}! You can track approval in "My Appointments".`);
  };

  return (
    <div className="student-dashboard">
      {/* Student Welcome Card */}
      <div className="student-banner">
        <div>
          <h2>Student Connectivity Portal 🎓</h2>
          <p>Welcome back, <strong>{currentStudent.name}</strong> ({currentStudent.uid}) • {currentStudent.department}</p>
        </div>
        <div className="my-apt-quick-pill" onClick={() => setActiveTab('my_appointments')}>
          <Calendar size={16} />
          <span>My Appointments ({myAppointments.length})</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'find_teacher' ? 'active' : ''}`}
          onClick={() => setActiveTab('find_teacher')}
        >
          <Search size={18} />
          Find Teacher by Name, Subject or Cabin
        </button>

        <button
          className={`tab-btn ${activeTab === 'my_appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_appointments')}
        >
          <Calendar size={18} />
          My Appointment Tracker ({myAppointments.length})
        </button>
      </div>

      {/* Tab 1: Find Teacher Search */}
      {activeTab === 'find_teacher' && (
        <div className="find-teacher-section">
          {/* Search Controls */}
          <div className="search-filter-card">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon-lg" />
              <input
                type="text"
                placeholder="Search teacher by ABC name, subject (e.g. Data Structures, AI), or cabin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters-row">
              <div className="filter-item">
                <Filter size={14} />
                <span>Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="form-control select-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Computer Applications">Computer Applications</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Business School (USB)">Management (USB)</option>
                </select>
              </div>

              <label className="toggle-available">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                <span>🟢 Show Currently Available Teachers Only</span>
              </label>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="teachers-grid">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="card-top">
                  <img src={teacher.avatar} alt={teacher.name} className="teacher-img" />
                  <div className="teacher-meta">
                    <span className={`badge badge-${teacher.status}`}>
                      <span className={`pulse-dot ${teacher.status}`}></span>
                      {teacher.status.replace('_', ' ')}
                    </span>
                    <h3 className="t-name">{teacher.name}</h3>
                    <p className="t-desig">{teacher.designation}</p>
                    <p className="t-dept">{teacher.department}</p>
                  </div>
                </div>

                <div className="location-box">
                  <div className="loc-header">
                    <MapPin size={16} className="loc-icon" />
                    <strong>CABIN LOCATION:</strong>
                  </div>
                  <div className="loc-details">
                    <div className="block-tag">{teacher.blockName} ({teacher.blockNumber})</div>
                    <div className="room-cabin-tag">
                      Room <strong>{teacher.roomNumber}</strong> • <strong className="cabin-red">{teacher.cabinNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="subjects-section">
                  <div className="subjects-title">
                    <BookOpen size={14} /> Subjects Taught:
                  </div>
                  <div className="subjects-list">
                    {teacher.subjects.map((sub, i) => (
                      <span key={i} className="subject-pill">{sub}</span>
                    ))}
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedTeacherForTimetable(teacher)}
                  >
                    <Clock size={14} /> View Timetable
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenBooking(teacher)}
                  >
                    <Calendar size={14} /> Book Cabin Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: My Appointments Tracker */}
      {activeTab === 'my_appointments' && (
        <div className="my-apts-section">
          <h3>Your Cabin Appointment Requests</h3>
          <p className="sub-text">Track teacher responses, approved visit timings, or rejection reasons.</p>

          {myAppointments.length === 0 ? (
            <div className="empty-apts-card">
              <Calendar size={48} className="empty-icon" />
              <p>You haven't requested any cabin appointments yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('find_teacher')}
              >
                Find Teacher to Book Visit
              </button>
            </div>
          ) : (
            <div className="apts-list">
              {myAppointments.map((apt) => (
                <div key={apt.id} className={`student-apt-card status-${apt.status}`}>
                  <div className="apt-header">
                    <div>
                      <div className="teacher-title font-bold">{apt.teacherName}</div>
                      <div className="location-sub font-semibold">
                        <MapPin size={14} className="inline-icon" /> {apt.teacherBlock} • {apt.teacherCabin}
                      </div>
                    </div>

                    <span className={`badge badge-${apt.status} badge-lg`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="apt-body-grid">
                    <div>
                      <span className="field-label">Scheduled Date & Time Slot:</span>
                      <div className="field-value font-bold">{apt.date} at {apt.timeSlot}</div>
                    </div>

                    <div>
                      <span className="field-label">Subject / Topic:</span>
                      <div className="field-value">{apt.subject}</div>
                    </div>
                  </div>

                  <div className="apt-reason-text">
                    <strong>Your Reason for Visit:</strong> "{apt.reason}"
                  </div>

                  {/* Approved Guidance */}
                  {apt.status === 'approved' && (
                    <div className="approved-guidance-box">
                      <CheckCircle2 size={18} className="text-green" />
                      <div>
                        <strong>Appointment Approved!</strong> Please arrive at <strong>{apt.teacherCabin}</strong> in <strong>{apt.teacherBlock}</strong> at <strong>{apt.timeSlot}</strong>.
                      </div>
                    </div>
                  )}

                  {/* Rejected Reason */}
                  {apt.status === 'rejected' && apt.rejectionReason && (
                    <div className="rejection-reason-box">
                      <XCircle size={18} className="text-red" />
                      <div>
                        <strong>Teacher's Message / Rejection Reason:</strong>
                        <p className="reason-quote">"{apt.rejectionReason}"</p>
                      </div>
                    </div>
                  )}

                  {apt.status === 'pending' && (
                    <div className="pending-notice">
                      <Clock size={16} /> Pending review by teacher. You will be notified here once approved.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Appointment Modal */}
      {selectedTeacherForBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Cabin Appointment with {selectedTeacherForBooking.name}</h3>
            </div>
            <form onSubmit={handleSubmitBooking}>
              <div className="modal-body">
                <div className="teacher-mini-summary">
                  <MapPin size={16} className="loc-icon" />
                  <span>
                    Location: <strong>{selectedTeacherForBooking.blockName}</strong>, Room {selectedTeacherForBooking.roomNumber}, <strong>{selectedTeacherForBooking.cabinNumber}</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label>Select Date:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Time Slot:</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="form-control"
                  >
                    <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Subject / Course:</label>
                  <select
                    value={bookingSubject}
                    onChange={(e) => setBookingSubject(e.target.value)}
                    className="form-control"
                  >
                    {selectedTeacherForBooking.subjects.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                    <option value="General Academic / Project Doubt">General Academic / Project Doubt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason / Purpose of Cabin Visit:</label>
                  <textarea
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    placeholder="e.g. Want to clarify graph algorithms doubt for assignment & discuss major project proposal."
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedTeacherForBooking(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Visit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timetable Modal */}
      {selectedTeacherForTimetable && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <div>
                <h3>{selectedTeacherForTimetable.name} - Weekly Timetable</h3>
                <p className="modal-sub">
                  Location: {selectedTeacherForTimetable.blockName} • Room {selectedTeacherForTimetable.roomNumber} • {selectedTeacherForTimetable.cabinNumber}
                </p>
              </div>
            </div>
            <div className="modal-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Time Slot</th>
                    <th>Class / Activity</th>
                    <th>Location</th>
                    <th>Cabin Status</th>
                  </tr>
                </thead>
                <tbody>
                  {timetables
                    .filter(t => t.teacherId === selectedTeacherForTimetable.id)
                    .map((slot) => (
                      <tr key={slot.id}>
                        <td><strong>{slot.day}</strong></td>
                        <td>{slot.timeSlot}</td>
                        <td>{slot.activity}</td>
                        <td>{slot.location}</td>
                        <td>
                          {slot.isFree ? (
                            <span className="badge badge-available">🟢 Free in Cabin</span>
                          ) : (
                            <span className="badge badge-in_class">🟡 In Class / Busy</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedTeacherForTimetable(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const t = selectedTeacherForTimetable;
                  setSelectedTeacherForTimetable(null);
                  handleOpenBooking(t);
                }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .student-dashboard {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .student-banner {
          background: linear-gradient(135deg, #c8102e 0%, #8a0b1e 100%);
          color: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-md);
        }
        .student-banner h2 {
          color: #ffffff;
          font-size: 1.4rem;
        }
        .student-banner p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        .my-apt-quick-pill {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .my-apt-quick-pill:hover {
          background: rgba(255,255,255,0.3);
        }

        .tabs-bar {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid var(--border-light);
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

        .search-filter-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .search-input-wrapper {
          position: relative;
          width: 100%;
        }
        .search-icon-lg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--cu-red);
        }
        .search-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          font-size: 0.95rem;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-sm);
          transition: border-color 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--cu-red);
          box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.1);
        }
        .filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .filter-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .select-sm {
          width: auto;
          min-width: 200px;
        }
        .toggle-available {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }
        .teacher-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .teacher-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .card-top {
          display: flex;
          gap: 1rem;
        }
        .teacher-img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--cu-red);
        }
        .teacher-meta {
          flex: 1;
        }
        .t-name {
          font-size: 1.05rem;
          margin-top: 0.25rem;
        }
        .t-desig {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .t-dept {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--cu-red);
        }

        .location-box {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }
        .loc-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }
        .loc-icon { color: var(--cu-red); }
        .block-tag {
          font-weight: 700;
          color: var(--text-main);
        }
        .room-cabin-tag {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
        .cabin-red {
          color: var(--cu-red);
          background: var(--cu-red-light);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .subjects-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .subjects-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .subjects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .subject-pill {
          background: #f1f5f9;
          color: var(--text-main);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.775rem;
          font-weight: 600;
        }
        .card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        .card-actions button {
          flex: 1;
        }

        .apts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .student-apt-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--shadow-sm);
        }
        .student-apt-card.status-pending { border-left: 5px solid #3b82f6; }
        .student-apt-card.status-approved { border-left: 5px solid #10b981; }
        .student-apt-card.status-rejected { border-left: 5px solid #ef4444; }

        .apt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .teacher-title {
          font-size: 1.1rem;
          color: var(--text-main);
        }
        .location-sub {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
        .inline-icon {
          color: var(--cu-red);
          vertical-align: text-bottom;
        }
        .badge-lg {
          padding: 0.4rem 0.9rem;
          font-size: 0.825rem;
        }
        .apt-body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          background: #f8fafc;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }
        .field-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
        }
        .apt-reason-text {
          font-size: 0.875rem;
          color: var(--text-main);
        }
        .approved-guidance-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          padding: 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .rejection-reason-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          gap: 0.75rem;
        }
        .reason-quote {
          font-style: italic;
          margin-top: 0.25rem;
        }
        .pending-notice {
          font-size: 0.825rem;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .modal-lg {
          max-width: 800px;
        }
        .teacher-mini-summary {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};
