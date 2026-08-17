const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection URI from .env file or default
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/ccs_db?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ================= SCHEMAS & MODELS ================= //

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  profileId: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 2. Teacher Schema
const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  empId: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true }, // HOD, ACO, AO, Project Coordinator, etc.
  blockName: { type: String, required: true },
  blockNumber: { type: String, required: true }, // Block A1 to Block D8
  roomNumber: { type: String, required: true },
  cabinNumber: { type: String, required: true },
  subjects: [{ type: String }],
  status: { type: String, enum: ['available', 'in_class', 'in_meeting', 'away'], default: 'available' },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

// 3. Student Schema
const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String },
  phone: { type: String }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// 4. Appointment Schema
const appointmentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentUid: { type: String, required: true },
  studentEmail: { type: String, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherCabin: { type: String, required: true },
  teacherBlock: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  subject: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// ================= REST API ROUTES ================= //

// Health Check
app.get('/', (req, res) => {
  res.send('CU CCS Backend API Running with MongoDB Atlas!');
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Fixed Admin Credentials Check
    if (role === 'admin') {
      if (email === 'sewacircle360@gmail.com' && password === 'Admin@123') {
        return res.json({
          user: { id: 'admin-master', email, name: 'CU Super Admin', role: 'admin' }
        });
      }
      return res.status(401).json({ error: 'Invalid Admin Credentials' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Teacher
app.post('/api/auth/register-teacher', async (req, res) => {
  try {
    const { name, email, password, empId, department, designation, blockNumber, roomNumber, cabinNumber, subjects, phone } = req.body;
    
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'teacher'
    });

    const newTeacher = await Teacher.create({
      userId: newUser._id,
      name,
      empId,
      email: email.toLowerCase(),
      phone,
      department,
      designation,
      blockName: `Chandigarh University ${blockNumber}`,
      blockNumber,
      roomNumber,
      cabinNumber,
      subjects,
      status: 'available'
    });

    newUser.profileId = newTeacher._id;
    await newUser.save();

    res.json({ user: newUser, teacher: newTeacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Student
app.post('/api/auth/register-student', async (req, res) => {
  try {
    const { name, email, password, uid, department, semester, phone } = req.body;
    
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student'
    });

    const newStudent = await Student.create({
      userId: newUser._id,
      name,
      uid,
      email: email.toLowerCase(),
      department,
      semester,
      phone
    });

    newUser.profileId = newStudent._id;
    await newUser.save();

    res.json({ user: newUser, student: newStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Teachers (Search & Filter)
app.get('/api/teachers', async (req, res) => {
  try {
    const { search, department, status } = req.query;
    let query = {};
    
    if (department && department !== 'all') {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subjects: { $regex: search, $options: 'i' } },
        { cabinNumber: { $regex: search, $options: 'i' } },
        { blockNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(query);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Teacher Live Status
app.put('/api/teachers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book Appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Respond to Appointment (Approve / Reject)
app.patch('/api/appointments/:id/respond', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { studentUid, teacherId } = req.query;
    let query = {};
    if (studentUid) query.studentUid = studentUid;
    if (teacherId) query.teacherId = teacherId;

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CCS Backend Server running on port ${PORT}`);
});
