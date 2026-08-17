import { Teacher, Student, Appointment, TimetableSlot, CampusBlock, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-master',
    email: 'sewacircle360@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'CU System Master Admin',
    profileId: 'admin-master',
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
  departments: ['Computer Science & Engineering', 'AI & Data Science', 'Management', 'ECE', 'Mechanical'],
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

export const INITIAL_TEACHERS: Teacher[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_TIMETABLES: TimetableSlot[] = [];
