import { Teacher, Student, Appointment, TimetableSlot, CampusBlock, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    email: 'sewacircle360@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'CU System Super Admin',
    profileId: 'admin-1',
  },
  {
    id: 'user-tech-1',
    email: 'rajesh.sharma@gmail.com',
    password: 'Teacher@123',
    role: 'teacher',
    name: 'Dr. Rajesh Sharma',
    profileId: 'tech-1',
  },
  {
    id: 'user-tech-2',
    email: 'ananya.verma@gmail.com',
    password: 'Teacher@123',
    role: 'teacher',
    name: 'Dr. Ananya Verma',
    profileId: 'tech-2',
  },
  {
    id: 'user-stud-1',
    email: 'aarav.mehta@gmail.com',
    password: 'Student@123',
    role: 'student',
    name: 'Aarav Mehta',
    profileId: 'stud-1',
  },
];

export const ALL_BLOCK_CODES = [
  'Block A1', 'Block A2', 'Block A3',
  'Block B1', 'Block B2', 'Block B3', 'Block B4',
  'Block C1', 'Block C2', 'Block C3',
  'Block D1', 'Block D2', 'Block D3', 'Block D4', 'Block D5', 'Block D6', 'Block D7', 'Block D8'
];

export const INITIAL_BLOCKS: CampusBlock[] = ALL_BLOCK_CODES.map((code, idx) => ({
  id: `blk-${idx + 1}`,
  name: `Chandigarh University ${code}`,
  blockCode: code,
  departments: idx % 2 === 0 ? ['Computer Science & Engineering', 'AI & Data Science'] : ['Management & Commerce', 'Mechanical / ECE'],
  totalCabins: 40 + (idx * 2),
}));

export const TEACHER_ROLE_DESIGNATIONS = [
  'HOD (Head of Department)',
  'ACO (Academic Coordinator)',
  'AO (Administrative Officer)',
  'Project Coordinator',
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Faculty Member / Teacher',
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tech-1',
    userId: 'user-tech-1',
    name: 'Dr. Rajesh Sharma',
    empId: 'CU-EMP-1042',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    blockName: 'Chandigarh University Block A3',
    blockNumber: 'Block A3',
    roomNumber: '402',
    cabinNumber: 'Cabin C-14',
    subjects: ['Data Structures & Algorithms', 'Advanced Java', 'Competitive Programming'],
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    designation: 'HOD (Head of Department)',
    verified: true,
  },
  {
    id: 'tech-2',
    userId: 'user-tech-2',
    name: 'Dr. Ananya Verma',
    empId: 'CU-EMP-2089',
    email: 'ananya.verma@gmail.com',
    phone: '+91 98123 45678',
    department: 'Artificial Intelligence & Data Science',
    blockName: 'Chandigarh University Block B2',
    blockNumber: 'Block B2',
    roomNumber: '308',
    cabinNumber: 'Cabin C-05',
    subjects: ['Machine Learning', 'Deep Learning', 'Python Programming'],
    status: 'in_class',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    designation: 'ACO (Academic Coordinator)',
    verified: true,
  },
  {
    id: 'tech-3',
    userId: 'user-tech-3',
    name: 'Prof. Vikramaditya Singh',
    empId: 'CU-EMP-3012',
    email: 'vikram.singh@gmail.com',
    phone: '+91 97654 32109',
    department: 'Computer Applications',
    blockName: 'Chandigarh University Block C1',
    blockNumber: 'Block C1',
    roomNumber: '215',
    cabinNumber: 'Cabin C-22',
    subjects: ['Database Management Systems (DBMS)', 'SQL & NoSQL'],
    status: 'in_meeting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    designation: 'Project Coordinator',
    verified: true,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    userId: 'user-stud-1',
    name: 'Aarav Mehta',
    uid: '21BCS10045',
    email: 'aarav.mehta@gmail.com',
    department: 'Computer Science & Engineering',
    semester: '6th Semester (3rd Year)',
    phone: '+91 98222 11004',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    studentId: 'stud-1',
    studentName: 'Aarav Mehta',
    studentUid: '21BCS10045',
    studentEmail: 'aarav.mehta@gmail.com',
    teacherId: 'tech-1',
    teacherName: 'Dr. Rajesh Sharma',
    teacherCabin: 'Cabin C-14, Room 402',
    teacherBlock: 'Block A3',
    date: '2026-08-18',
    timeSlot: '11:30 AM - 12:00 PM',
    subject: 'Data Structures & Algorithms',
    reason: 'Discussion regarding Major Project proposal & graph algorithms optimization doubt.',
    status: 'pending',
    createdAt: '2026-08-17 09:15 AM',
  },
];

export const INITIAL_TIMETABLES: TimetableSlot[] = [
  { id: 'tt-1', teacherId: 'tech-1', day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', activity: 'Data Structures Lecture (Section CSE-A)', location: 'Room 402, Block A3', isFree: false },
  { id: 'tt-2', teacherId: 'tech-1', day: 'Monday', timeSlot: '10:00 AM - 11:30 AM', activity: 'Free / Cabin Consultation Hours', location: 'Cabin C-14', isFree: true },
  { id: 'tt-3', teacherId: 'tech-1', day: 'Monday', timeSlot: '11:30 AM - 01:00 PM', activity: 'Advanced Java Lab', location: 'Lab 5, Block A3', isFree: false },
  { id: 'tt-4', teacherId: 'tech-1', day: 'Monday', timeSlot: '02:00 PM - 04:00 PM', activity: 'Available in Cabin for Student Doubts', location: 'Cabin C-14', isFree: true },
];
