export type UserRole = 'admin' | 'teacher' | 'student';

export type TeacherStatus = 'available' | 'in_class' | 'in_meeting' | 'away';

export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  name: string;
  profileId: string; // ID linking to Teacher or Student profile
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  empId: string;
  email: string;
  phone: string;
  department: string;
  blockName: string;
  blockNumber: string;
  roomNumber: string;
  cabinNumber: string;
  subjects: string[];
  status: TeacherStatus;
  avatar: string;
  designation: string;
  verified: boolean;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  uid: string;
  email: string;
  department: string;
  semester: string;
  phone: string;
}

export interface TimetableSlot {
  id: string;
  teacherId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  activity: string; // e.g. "Data Structures Class" or "Free / Cabin Hour"
  location: string; // e.g. "Room 302" or "Cabin C-14"
  isFree: boolean;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentUid: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  teacherCabin: string;
  teacherBlock: string;
  date: string;
  timeSlot: string;
  subject: string;
  reason: string;
  status: AppointmentStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface CampusBlock {
  id: string;
  name: string;
  blockCode: string;
  departments: string[];
  totalCabins: number;
}
