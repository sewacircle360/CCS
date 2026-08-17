import React, { useState, useEffect } from 'react';
import { UserRole, Teacher, Student, Appointment, TimetableSlot, User } from './types';
import { INITIAL_USERS, INITIAL_BLOCKS } from './mockData';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { LoginRegister } from './components/LoginRegister';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';

// Auto-wipe old cached mock data once to ensure 100% clean database
const MOCK_DATA_VERSION = 'v3_clean_empty';
if (localStorage.getItem('cu_ccs_data_version') !== MOCK_DATA_VERSION) {
  localStorage.removeItem('cu_ccs_teachers');
  localStorage.removeItem('cu_ccs_students');
  localStorage.removeItem('cu_ccs_appointments');
  localStorage.removeItem('cu_ccs_timetables');
  localStorage.removeItem('cu_ccs_users');
  localStorage.setItem('cu_ccs_data_version', MOCK_DATA_VERSION);
}

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cu_ccs_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cu_ccs_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('cu_ccs_teachers');
    return saved ? JSON.parse(saved) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cu_ccs_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('cu_ccs_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [timetables, setTimetables] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('cu_ccs_timetables');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to Supabase & LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cu_ccs_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cu_ccs_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cu_ccs_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cu_ccs_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('cu_ccs_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cu_ccs_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('cu_ccs_timetables', JSON.stringify(timetables));
  }, [timetables]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Register Handlers with Supabase Sync
  const handleRegisterTeacher = async (
    teacherData: Omit<Teacher, 'id' | 'status' | 'verified'>,
    password: string
  ) => {
    const newTechId = `tech-${Date.now().toString().slice(-4)}`;
    const newUserId = `user-tech-${Date.now().toString().slice(-4)}`;

    const newTeacher: Teacher = {
      ...teacherData,
      id: newTechId,
      userId: newUserId,
      status: 'available',
      verified: true,
    };

    const newUser: User = {
      id: newUserId,
      email: teacherData.email,
      password: password,
      role: 'teacher',
      name: teacherData.name,
      profileId: newTechId,
    };

    setTeachers(prev => [newTeacher, ...prev]);
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Sync to Supabase cloud in background
    try {
      await supabase.from('users').insert({
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        name: newUser.name,
        profile_id: newTechId,
      });
      await supabase.from('teachers').insert({
        name: newTeacher.name,
        emp_id: newTeacher.empId,
        email: newTeacher.email,
        phone: newTeacher.phone,
        department: newTeacher.department,
        designation: newTeacher.designation,
        block_name: newTeacher.blockName,
        block_number: newTeacher.blockNumber,
        room_number: newTeacher.roomNumber,
        cabin_number: newTeacher.cabinNumber,
        subjects: newTeacher.subjects,
        status: newTeacher.status,
      });
    } catch (e) {
      console.log('Supabase Sync:', e);
    }
  };

  const handleRegisterStudent = async (
    studentData: Omit<Student, 'id'>,
    password: string
  ) => {
    const newStudId = `stud-${Date.now().toString().slice(-4)}`;
    const newUserId = `user-stud-${Date.now().toString().slice(-4)}`;

    const newStudent: Student = {
      ...studentData,
      id: newStudId,
      userId: newUserId,
    };

    const newUser: User = {
      id: newUserId,
      email: studentData.email,
      password: password,
      role: 'student',
      name: studentData.name,
      profileId: newStudId,
    };

    setStudents(prev => [newStudent, ...prev]);
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Sync to Supabase cloud in background
    try {
      await supabase.from('users').insert({
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        name: newUser.name,
        profile_id: newStudId,
      });
      await supabase.from('students').insert({
        name: newStudent.name,
        uid: newStudent.uid,
        email: newStudent.email,
        department: newStudent.department,
        semester: newStudent.semester,
        phone: newStudent.phone,
      });
    } catch (e) {
      console.log('Supabase Sync:', e);
    }
  };

  // Teacher Handlers
  const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    try {
      await supabase.from('teachers').update({
        status: updatedTeacher.status,
        designation: updatedTeacher.designation,
        block_number: updatedTeacher.blockNumber,
        room_number: updatedTeacher.roomNumber,
        cabin_number: updatedTeacher.cabinNumber,
      }).eq('email', updatedTeacher.email);
    } catch (e) {
      console.log('Supabase status sync:', e);
    }
  };

  const handleVerifyTeacher = (teacherId: string) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, verified: !t.verified } : t));
  };

  // Appointment Handlers
  const handleApproveAppointment = async (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'approved', rejectionReason: undefined };
      }
      return apt;
    }));
  };

  const handleRejectAppointment = async (appointmentId: string, reason: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'rejected', rejectionReason: reason };
      }
      return apt;
    }));
  };

  const handleBookAppointment = async (newAptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    setAppointments(prev => [newApt, ...prev]);

    try {
      await supabase.from('appointments').insert({
        student_id: newApt.studentId,
        student_name: newApt.studentName,
        student_uid: newApt.studentUid,
        student_email: newApt.studentEmail,
        teacher_id: newApt.teacherId,
        teacher_name: newApt.teacherName,
        teacher_cabin: newApt.teacherCabin,
        teacher_block: newApt.teacherBlock,
        date: newApt.date,
        time_slot: newApt.timeSlot,
        subject: newApt.subject,
        reason: newApt.reason,
        status: 'pending',
      });
    } catch (e) {
      console.log('Supabase Appointment Sync:', e);
    }
  };

  // Timetable Handlers
  const handleAddTimetableSlot = (newSlotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...newSlotData,
      id: `tt-${Date.now().toString().slice(-4)}`,
    };
    setTimetables(prev => [...prev, newSlot]);
  };

  const handleDeleteTimetableSlot = (slotId: string) => {
    setTimetables(prev => prev.filter(s => s.id !== slotId));
  };

  // Get active teacher or student profile
  const activeTeacher = currentUser?.role === 'teacher'
    ? teachers.find(t => t.id === currentUser.profileId || t.email === currentUser.email)
    : null;

  const activeStudent = currentUser?.role === 'student'
    ? students.find(s => s.id === currentUser.profileId || s.email === currentUser.email)
    : null;

  return (
    <div className="app-container">
      {/* CU Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View: Login/Register if not authenticated, else Dashboard */}
      {!currentUser ? (
        <LoginRegister
          users={users}
          teachers={teachers}
          students={students}
          onLoginSuccess={handleLoginSuccess}
          onRegisterTeacher={handleRegisterTeacher}
          onRegisterStudent={handleRegisterStudent}
        />
      ) : (
        <main className="main-content">
          {currentUser.role === 'admin' && (
            <AdminDashboard
              teachers={teachers}
              students={students}
              appointments={appointments}
              blocks={INITIAL_BLOCKS}
              onVerifyTeacher={handleVerifyTeacher}
              onAddTeacher={() => alert('Teachers can register using the Teacher Registration portal on the login page.')}
              onAddStudent={() => alert('Students can register using the Student Registration portal on the login page.')}
            />
          )}

          {currentUser.role === 'teacher' && (
            activeTeacher ? (
              <TeacherDashboard
                currentTeacher={activeTeacher}
                appointments={appointments}
                timetables={timetables}
                onUpdateTeacher={handleUpdateTeacher}
                onApproveAppointment={handleApproveAppointment}
                onRejectAppointment={handleRejectAppointment}
                onAddTimetableSlot={handleAddTimetableSlot}
                onDeleteTimetableSlot={handleDeleteTimetableSlot}
              />
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>No Teacher Profile Linked</h3>
                <p>Please register your teacher profile from the registration page.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleLogout}>Back to Login / Register</button>
              </div>
            )
          )}

          {currentUser.role === 'student' && (
            activeStudent ? (
              <StudentDashboard
                currentStudent={activeStudent}
                teachers={teachers}
                appointments={appointments}
                timetables={timetables}
                onBookAppointment={handleBookAppointment}
              />
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>No Student Profile Linked</h3>
                <p>Please register your student profile from the registration page.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleLogout}>Back to Login / Register</button>
              </div>
            )
          )}
        </main>
      )}
    </div>
  );
};

export default App;
