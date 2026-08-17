import React, { useState } from 'react';
import { Teacher, Appointment, TimetableSlot, TeacherStatus } from '../types';
import { ALL_BLOCK_CODES, TEACHER_ROLE_DESIGNATIONS } from '../mockData';
import { MapPin, Clock, Calendar, CheckCircle2, XCircle, UserCheck, Plus, AlertCircle, Sparkles, Award } from 'lucide-react';

interface TeacherDashboardProps {
  currentTeacher: Teacher;
  appointments: Appointment[];
  timetables: TimetableSlot[];
  onUpdateTeacher: (updated: Teacher) => void;
  onApproveAppointment: (appointmentId: string) => void;
  onRejectAppointment: (appointmentId: string, reason: string) => void;
  onAddTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onDeleteTimetableSlot: (slotId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentTeacher,
  appointments,
  timetables,
  onUpdateTeacher,
  onApproveAppointment,
  onRejectAppointment,
  onAddTimetableSlot,
  onDeleteTimetableSlot,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'timetable' | 'location'>('appointments');
  const [rejectingAptId, setRejectingAptId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Location & Profile Form state
  const [designation, setDesignation] = useState(currentTeacher.designation || 'HOD (Head of Department)');
  const [blockNumber, setBlockNumber] = useState(currentTeacher.blockNumber || 'Block A3');
  const [roomNumber, setRoomNumber] = useState(currentTeacher.roomNumber);
  const [cabinNumber, setCabinNumber] = useState(currentTeacher.cabinNumber);
  const [phone, setPhone] = useState(currentTeacher.phone);

  // New Timetable slot state
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [newActivity, setNewActivity] = useState('');
  const [newLocation, setNewLocation] = useState(currentTeacher.cabinNumber);
  const [newIsFree, setNewIsFree] = useState(true);

  const teacherAppointments = appointments.filter(a => a.teacherId === currentTeacher.id);
  const teacherTimetable = timetables.filter(t => t.teacherId === currentTeacher.id);

  const handleStatusChange = (newStatus: TeacherStatus) => {
    onUpdateTeacher({
      ...currentTeacher,
      status: newStatus,
    });
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      ...currentTeacher,
      designation,
      blockName: `Chandigarh University ${blockNumber}`,
      blockNumber,
      roomNumber,
      cabinNumber,
      phone,
    });
    alert('Profile, Designation & Cabin Location Updated Successfully!');
  };

  const handleConfirmReject = () => {
    if (!rejectingAptId) return;
    if (!rejectionReasonText.trim()) {
      alert('Please provide a reason for rejecting the appointment request.');
      return;
    }
    onRejectAppointment(rejectingAptId, rejectionReasonText);
    setRejectingAptId(null);
    setRejectionReasonText('');
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) {
      alert('Please enter slot activity or subject details');
      return;
    }
    onAddTimetableSlot({
      teacherId: currentTeacher.id,
      day: newDay,
      timeSlot: newTimeSlot,
      activity: newActivity,
      location: newLocation,
      isFree: newIsFree,
    });
    setNewActivity('');
    alert('Timetable Slot Added!');
  };

  return (
    <div className="teacher-dashboard">
      {/* Teacher Profile & Live Status Header */}
      <div className="teacher-header-card">
        <div className="profile-main">
          <img src={currentTeacher.avatar} alt={currentTeacher.name} className="teacher-avatar" />
          <div className="profile-info">
            <div className="teacher-name-badge">
              <h2>{currentTeacher.name}</h2>
              <span className="role-tag font-bold"><Award size={14} /> {currentTeacher.designation}</span>
              <span className="emp-tag">{currentTeacher.empId}</span>
            </div>
            <div className="teacher-dept">{currentTeacher.department}</div>
            
            <div className="cabin-pills-row">
              <span className="location-pill primary">
                <MapPin size={14} /> {currentTeacher.blockNumber}
              </span>
              <span className="location-pill secondary">
                Room {currentTeacher.roomNumber}
              </span>
              <span className="location-pill highlight">
                Cabin {currentTeacher.cabinNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Live Availability Switcher */}
        <div className="status-switcher-box">
          <label className="status-label">
            <Sparkles size={14} /> Set Your Real-Time Availability:
          </label>
          <div className="status-buttons">
            <button
              className={`status-btn available ${currentTeacher.status === 'available' ? 'active' : ''}`}
              onClick={() => handleStatusChange('available')}
            >
              🟢 Free in Cabin
            </button>

            <button
              className={`status-btn in_class ${currentTeacher.status === 'in_class' ? 'active' : ''}`}
              onClick={() => handleStatusChange('in_class')}
            >
              🟡 In Class
            </button>

            <button
              className={`status-btn in_meeting ${currentTeacher.status === 'in_meeting' ? 'active' : ''}`}
              onClick={() => handleStatusChange('in_meeting')}
            >
              🔴 In Meeting / Busy
            </button>

            <button
              className={`status-btn away ${currentTeacher.status === 'away' ? 'active' : ''}`}
              onClick={() => handleStatusChange('away')}
            >
              ⚪ Off Campus / Out
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={18} />
          Student Appointment Requests ({teacherAppointments.filter(a => a.status === 'pending').length} Pending)
        </button>

        <button
          className={`tab-item ${activeTab === 'timetable' ? 'active' : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          <Clock size={18} />
          Weekly Timetable & Free Slots ({teacherTimetable.length})
        </button>

        <button
          className={`tab-item ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          <MapPin size={18} />
          Edit Role/Designation & Cabin Location
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="section-card">
          <div className="section-header">
            <h3>Student Appointments Inbox</h3>
            <p>Review incoming requests from students to visit your cabin.</p>
          </div>

          {teacherAppointments.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} className="empty-icon" />
              <p>No appointment requests received yet.</p>
            </div>
          ) : (
            <div className="appointments-list">
              {teacherAppointments.map((apt) => (
                <div key={apt.id} className={`apt-card status-${apt.status}`}>
                  <div className="apt-top">
                    <div className="student-detail">
                      <div className="student-name">{apt.studentName}</div>
                      <div className="student-sub">{apt.studentUid} • {apt.studentEmail}</div>
                    </div>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="apt-meta-grid">
                    <div>
                      <span className="meta-label">Requested Date & Time:</span>
                      <strong className="meta-val">{apt.date} ({apt.timeSlot})</strong>
                    </div>
                    <div>
                      <span className="meta-label">Subject / Topic:</span>
                      <strong className="meta-val">{apt.subject}</strong>
                    </div>
                  </div>

                  <div className="apt-reason-box">
                    <strong>Student Reason:</strong> "{apt.reason}"
                  </div>

                  {apt.status === 'rejected' && apt.rejectionReason && (
                    <div className="rejection-box">
                      <AlertCircle size={14} />
                      <span><strong>Rejection Reason Sent:</strong> {apt.rejectionReason}</span>
                    </div>
                  )}

                  {apt.status === 'pending' && (
                    <div className="apt-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => onApproveAppointment(apt.id)}
                      >
                        <CheckCircle2 size={16} /> Approve Appointment
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setRejectingAptId(apt.id);
                          setRejectionReasonText('');
                        }}
                      >
                        <XCircle size={16} /> Reject with Reason
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Timetable Manager */}
      {activeTab === 'timetable' && (
        <div className="timetable-container">
          <div className="card add-slot-card">
            <h4>Add New Timetable Slot</h4>
            <form onSubmit={handleCreateSlot} className="slot-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Time Slot</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Activity / Subject Details</label>
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="e.g. Data Structures Lecture OR Free Cabin Consultation"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Location (Room/Cabin)</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Room 402 or Cabin C-14"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newIsFree}
                    onChange={(e) => setNewIsFree(e.target.checked)}
                  />
                  <span>Is Teacher Available / Free in Cabin during this slot?</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Save Timetable Slot
              </button>
            </form>
          </div>

          <div className="section-card">
            <h3>Your Weekly Schedule Grid</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Activity / Class</th>
                  <th>Location</th>
                  <th>Slot Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teacherTimetable.map((slot) => (
                  <tr key={slot.id}>
                    <td><strong>{slot.day}</strong></td>
                    <td>{slot.timeSlot}</td>
                    <td>{slot.activity}</td>
                    <td><span className="location-pill secondary">{slot.location}</span></td>
                    <td>
                      {slot.isFree ? (
                        <span className="badge badge-available">🟢 Free in Cabin</span>
                      ) : (
                        <span className="badge badge-in_class">🟡 Occupied / In Class</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteTimetableSlot(slot.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Edit Cabin Location & Role */}
      {activeTab === 'location' && (
        <div className="card location-edit-card">
          <div className="card-header">
            <h3>Update Your Designation, Role & Cabin Location</h3>
            <p>This information is shown to students and administrators across Chandigarh University.</p>
          </div>

          <form onSubmit={handleSaveLocation} className="location-form">
            <div className="form-group">
              <label>Faculty Role / Designation (HOD, ACO, AO, Project Coordinator, etc.)</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="form-control"
              >
                {TEACHER_ROLE_DESIGNATIONS.map((roleOpt, idx) => (
                  <option key={idx} value={roleOpt}>{roleOpt}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>CU Campus Block (A1-D8)</label>
                <select
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(e.target.value)}
                  className="form-control"
                >
                  {ALL_BLOCK_CODES.map((blk, idx) => (
                    <option key={idx} value={blk}>{blk}</option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 402"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Cabin Number</label>
                <input
                  type="text"
                  value={cabinNumber}
                  onChange={(e) => setCabinNumber(e.target.value)}
                  placeholder="e.g. Cabin C-14"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone / Contact Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Role & Location Details
            </button>
          </form>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingAptId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Provide Rejection Reason to Student</h3>
            </div>
            <div className="modal-body">
              <p className="modal-sub">
                Please enter the reason why you cannot accept this appointment slot. The student will see this note in their dashboard.
              </p>
              <div className="form-group">
                <label>Reason / Suggestion for Student:</label>
                <textarea
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  placeholder="e.g. In departmental meeting at 10:00 AM. Please re-book for 02:00 PM free slot."
                  className="form-control"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setRejectingAptId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmReject}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .teacher-dashboard {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .teacher-header-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .profile-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .teacher-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--cu-red);
        }
        .teacher-name-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .role-tag {
          background: var(--cu-red-light);
          color: var(--cu-red);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          border: 1px solid rgba(200,16,46,0.15);
        }
        .emp-tag {
          background: #f1f5f9;
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .teacher-dept {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }
        .cabin-pills-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
        }
        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .location-pill.primary {
          background: #eff6ff;
          color: #2563eb;
        }
        .location-pill.secondary {
          background: #f1f5f9;
          color: var(--text-main);
        }
        .location-pill.highlight {
          background: var(--cu-red-light);
          color: var(--cu-red);
          font-weight: 700;
        }
        .status-switcher-box {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-sm);
        }
        .status-label {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
        .status-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .status-btn {
          border: 1.5px solid var(--border-light);
          background: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .status-btn:hover {
          border-color: #cbd5e1;
        }
        .status-btn.available.active {
          background: var(--status-available-bg);
          border-color: var(--status-available);
          color: var(--status-available);
          font-weight: 700;
        }
        .status-btn.in_class.active {
          background: var(--status-class-bg);
          border-color: var(--status-class);
          color: var(--status-class);
          font-weight: 700;
        }
        .status-btn.in_meeting.active {
          background: var(--status-meeting-bg);
          border-color: var(--status-meeting);
          color: var(--status-meeting);
          font-weight: 700;
        }
        .status-btn.away.active {
          background: var(--status-away-bg);
          border-color: var(--status-away);
          color: var(--status-away);
          font-weight: 700;
        }

        .tabs-bar {
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
        .section-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .section-header {
          margin-bottom: 1.25rem;
        }
        .section-header p {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }
        .empty-icon {
          color: #cbd5e1;
          margin-bottom: 0.75rem;
        }
        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .apt-card {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .apt-card.status-pending { border-left: 4px solid #3b82f6; }
        .apt-card.status-approved { border-left: 4px solid #10b981; }
        .apt-card.status-rejected { border-left: 4px solid #ef4444; }

        .apt-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .student-name {
          font-weight: 700;
          font-size: 1rem;
        }
        .student-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .apt-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        .meta-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .meta-val {
          color: var(--text-main);
        }
        .apt-reason-box {
          font-size: 0.875rem;
          color: #334155;
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 0.65rem;
          border-radius: 6px;
        }
        .rejection-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.65rem;
          border-radius: 6px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .apt-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .timetable-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .add-slot-card {
          padding: 1.5rem;
        }
        .add-slot-card h4 {
          margin-bottom: 1rem;
        }
        .slot-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .location-edit-card {
          padding: 1.5rem;
        }
        .card-header {
          margin-bottom: 1.25rem;
        }
        .location-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .modal-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};
