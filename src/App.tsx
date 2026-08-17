import React, { useState, useEffect } from 'react';
import { UserRole, Teacher, Student, Appointment, TimetableSlot, User, TeacherStatus } from './types';
import { INITIAL_USERS, INITIAL_BLOCKS } from './mockData';
import { OFFICIAL_CU_FACULTY_LIST } from './facultyData';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { LoginRegister } from './components/LoginRegister';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';

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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.log('Error parsing teachers:', e);
      }
    }
    return OFFICIAL_CU_FACULTY_LIST;
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

  // FETCH LIVE DATA FROM SUPABASE ON MOUNT & SUBSCRIBE TO REAL-TIME CHANGES
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        // Fetch Students from Supabase
        const { data: cloudStudents } = await supabase.from('students').select('*');
        if (cloudStudents && cloudStudents.length > 0) {
          const mappedStudents: Student[] = cloudStudents.map(s => ({
            id: s.id || `stud-${s.uid}`,
            userId: s.user_id || `user-${s.uid}`,
            name: s.name,
            uid: s.uid,
            email: s.email,
            department: s.department,
            semester: s.semester,
            phone: s.phone,
          }));
          setStudents(prev => {
            const combined = [...mappedStudents];
            prev.forEach(p => {
              if (!combined.some(c => c.email.toLowerCase() === p.email.toLowerCase() || c.uid === p.uid)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }

        // Fetch Teachers from Supabase
        const { data: cloudTeachers } = await supabase.from('teachers').select('*');
        if (cloudTeachers && cloudTeachers.length > 0) {
          const mappedTeachers: Teacher[] = cloudTeachers.map(t => ({
            id: t.id || `cu-${t.emp_id}`,
            userId: t.user_id || '',
            name: t.name,
            empId: t.emp_id,
            email: t.email,
            phone: t.phone,
            department: t.department,
            designation: t.designation,
            blockName: t.block_name || `Chandigarh University ${t.block_number}`,
            blockNumber: t.block_number,
            roomNumber: t.room_number,
            cabinNumber: t.cabin_number,
            subjects: t.subjects || ['Computer Science'],
            status: (t.status || 'available') as TeacherStatus,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            verified: true,
          }));

          setTeachers(prev => {
            const combined = [...mappedTeachers];
            OFFICIAL_CU_FACULTY_LIST.forEach(f => {
              if (!combined.some(c => c.email.toLowerCase() === f.email.toLowerCase() || c.empId === f.empId)) {
                combined.push(f);
              }
            });
            prev.forEach(p => {
              if (!combined.some(c => c.email.toLowerCase() === p.email.toLowerCase() || c.empId === p.empId)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }

        // Fetch Users from Supabase
        const { data: cloudUsers } = await supabase.from('users').select('*');
        if (cloudUsers && cloudUsers.length > 0) {
          const mappedUsers: User[] = cloudUsers.map(u => ({
            id: u.id,
            email: u.email,
            password: u.password,
            role: u.role as UserRole,
            name: u.name,
            profileId: u.profile_id,
          }));
          setUsers(prev => {
            const combined = [...mappedUsers];
            prev.forEach(p => {
              if (!combined.some(c => c.email.toLowerCase() === p.email.toLowerCase())) {
                combined.push(p);
              }
            });
            return combined;
          });
        }

        // Fetch Appointments from Supabase
        const { data: cloudApts } = await supabase.from('appointments').select('*');
        if (cloudApts && cloudApts.length > 0) {
          const mappedApts: Appointment[] = cloudApts.map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            studentUid: a.student_uid,
            studentEmail: a.student_email,
            teacherId: a.teacher_id,
            teacherName: a.teacher_name,
            teacherCabin: a.teacher_cabin,
            teacherBlock: a.teacher_block,
            date: a.date,
            timeSlot: a.time_slot,
            subject: a.subject,
            reason: a.reason,
            status: a.status,
            rejectionReason: a.rejection_reason,
            createdAt: a.created_at || new Date().toLocaleString(),
          }));
          setAppointments(mappedApts);
        }
      } catch (err) {
        console.log('Error loading Supabase cloud data:', err);
      }
    };

    fetchCloudData();

    // REALTIME SUBSCRIPTION FOR INSTANT LIVE UPDATES ACROSS ALL COMPUTERS/PHONES!
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchCloudData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync to LocalStorage
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
    if (teachers && teachers.length > 0) {
      localStorage.setItem('cu_ccs_teachers', JSON.stringify(teachers));
    }
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

    // Sync to Supabase cloud
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
      console.log('Supabase Sync error:', e);
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

    // Sync to Supabase cloud
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
      console.log('Supabase Sync error:', e);
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
      console.log('Supabase status sync error:', e);
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
    try {
      await supabase.from('appointments').update({ status: 'approved' }).eq('id', appointmentId);
    } catch (e) {
      console.log('Supabase approve error:', e);
    }
  };

  const handleRejectAppointment = async (appointmentId: string, reason: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'rejected', rejectionReason: reason };
      }
      return apt;
    }));
    try {
      await supabase.from('appointments').update({ status: 'rejected', rejection_reason: reason }).eq('id', appointmentId);
    } catch (e) {
      console.log('Supabase reject error:', e);
    }
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
      console.log('Supabase Appointment Sync error:', e);
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

  // Dynamic Resolution for Active Profile
  const activeTeacher: Teacher | null = currentUser?.role === 'teacher'
    ? (teachers.find(t => t.id === currentUser.profileId || t.email.toLowerCase() === currentUser.email.toLowerCase()) || {
        id: currentUser.profileId || `tech-${currentUser.id}`,
        userId: currentUser.id,
        name: currentUser.name,
        empId: 'CU-EMP-' + currentUser.id.slice(-4),
        email: currentUser.email,
        phone: '+91 98000 00000',
        department: 'Computer Science & Engineering',
        blockName: 'Chandigarh University Block B3',
        blockNumber: 'Block B3',
        roomNumber: '304 A',
        cabinNumber: 'Cabin 304 A',
        subjects: ['Computer Science'],
        status: 'available' as TeacherStatus,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        designation: 'Faculty Member / Teacher',
        verified: true,
      })
    : null;

  const activeStudent: Student | null = currentUser?.role === 'student'
    ? (students.find(s => s.id === currentUser.profileId || s.email.toLowerCase() === currentUser.email.toLowerCase()) || {
        id: currentUser.profileId || `stud-${currentUser.id}`,
        userId: currentUser.id,
        name: currentUser.name,
        uid: 'CU-UID-' + currentUser.id.slice(-4),
        email: currentUser.email,
        department: 'Computer Science & Engineering',
        semester: 'Semester 1 (Year 1)',
        phone: '+91 98000 00000',
      })
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

          {currentUser.role === 'teacher' && activeTeacher && (
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
          )}

          {currentUser.role === 'student' && activeStudent && (
            <StudentDashboard
              currentStudent={activeStudent}
              teachers={teachers}
              appointments={appointments}
              timetables={timetables}
              onBookAppointment={handleBookAppointment}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default App;
