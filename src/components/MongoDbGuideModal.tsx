import React from 'react';
import { Database, Server, Cpu, QrCode, Bell, ShieldCheck, X, FileCode2, Layers } from 'lucide-react';

interface MongoDbGuideModalProps {
  onClose: () => void;
}

export const MongoDbGuideModal: React.FC<MongoDbGuideModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header header-red">
          <div className="title-with-icon">
            <Database size={22} className="text-white" />
            <div>
              <h3 className="text-white">MongoDB & Backend Production Architecture Guide</h3>
              <p className="subtitle-white">Suggestions for Chandigarh University Presentation & Full-Stack Deployment</p>
            </div>
          </div>
          <button className="close-btn-white" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body guide-body">
          {/* Executive Overview */}
          <div className="guide-card hero-card">
            <div className="hero-icon"><Layers size={28} /></div>
            <div>
              <h4>How This Demo Works vs Full MongoDB Integration</h4>
              <p>
                <strong>Current Demo:</strong> Runs instantly as an interactive web application with zero setup, persistent <code>LocalStorage</code>, and full Chandigarh University mock dataset.
                <br />
                <strong>Production Implementation:</strong> Connects to a <strong>MongoDB Atlas Cluster</strong> with Node.js/Express REST APIs and real-time Socket.io updates across campus networks.
              </p>
            </div>
          </div>

          {/* Section 1: Database Schemas */}
          <div className="guide-section">
            <h4 className="section-heading">
              <Database size={18} /> 1. MongoDB Collections & Schemas
            </h4>
            <div className="code-snippets-grid">
              <div className="code-box">
                <div className="code-title">teachers Collection</div>
                <pre>{`{
  _id: ObjectId("..."),
  name: "Dr. Rajesh Sharma",
  empId: "CU-EMP-1042",
  email: "rajesh.sharma@cumail.in",
  department: "Computer Science",
  blockName: "Academic Block A3",
  blockNumber: "Block A3",
  roomNumber: "402",
  cabinNumber: "Cabin C-14",
  status: "available", // available | in_class | in_meeting | away
  subjects: ["Data Structures", "Java"],
  verified: true
}`}</pre>
              </div>

              <div className="code-box">
                <div className="code-title">appointments Collection</div>
                <pre>{`{
  _id: ObjectId("..."),
  studentId: ObjectId("..."),
  studentUid: "21BCS10045",
  teacherId: ObjectId("..."),
  teacherCabin: "Cabin C-14",
  date: "2026-08-18",
  timeSlot: "11:30 AM - 12:00 PM",
  subject: "Data Structures",
  reason: "Major Project graph doubt",
  status: "rejected", // pending | approved | rejected
  rejectionReason: "In HOD meeting. Come at 2 PM."
}`}</pre>
              </div>
            </div>
          </div>

          {/* Section 2: Backend API Routes */}
          <div className="guide-section">
            <h4 className="section-heading">
              <Server size={18} /> 2. REST API Endpoints Needed (Express / Next.js)
            </h4>
            <ul className="api-list">
              <li>
                <span className="method-pill get">GET</span>
                <code>/api/teachers/search?q=DataStructures&status=available</code>
                <span className="desc">Find teachers by name, subject, or live availability status.</span>
              </li>
              <li>
                <span className="method-pill put">PUT</span>
                <code>/api/teachers/:id/status</code>
                <span className="desc">Teacher updates live status (Available 🟢, In Class 🟡, Busy 🔴).</span>
              </li>
              <li>
                <span className="method-pill post">POST</span>
                <code>/api/appointments/book</code>
                <span className="desc">Student submits cabin appointment request.</span>
              </li>
              <li>
                <span className="method-pill patch">PATCH</span>
                <code>/api/appointments/:id/respond</code>
                <span className="desc">Teacher approves or rejects request with custom message.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: High Value Features to Pitch to CU */}
          <div className="guide-section">
            <h4 className="section-heading">
              <ShieldCheck size={18} /> 3. Top Features to Pitch to CU Officials for Maximum Impact
            </h4>
            <div className="pitch-features-grid">
              <div className="pitch-card">
                <QrCode size={24} className="pitch-icon" />
                <h5>QR Code Cabin Door Check-in</h5>
                <p>Attach printed QR codes outside teacher cabins. When students arrive, they scan the QR code to auto check-in their approved appointment.</p>
              </div>

              <div className="pitch-card">
                <Bell size={24} className="pitch-icon" />
                <h5>WhatsApp / SMS / Web Push Alerts</h5>
                <p>Send instant SMS/WhatsApp notification to students when a teacher approves or rejects an appointment with reason.</p>
              </div>

              <div className="pitch-card">
                <Cpu size={24} className="pitch-icon" />
                <h5>Live Interactive Campus Map</h5>
                <p>Visual map of Chandigarh University highlighting Block A3, B2, C1, and guiding students turn-by-turn to the cabin room.</p>
              </div>

              <div className="pitch-card">
                <ShieldCheck size={24} className="pitch-icon" />
                <h5>CU Domain SSO Login</h5>
                <p>One-click login using Chandigarh University official student (<code>@cuchd.in</code>) and faculty (<code>@cumail.in</code>) Microsoft/Google accounts.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got It! Return to Live CCS Demo
          </button>
        </div>
      </div>

      <style>{`
        .header-red {
          background: linear-gradient(135deg, #c8102e 0%, #990000 100%) !important;
        }
        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .text-white { color: #ffffff !important; }
        .subtitle-white { color: rgba(255,255,255,0.85); font-size: 0.8rem; }
        .close-btn-white { background: transparent; border: none; color: #ffffff; cursor: pointer; }
        
        .guide-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .guide-card.hero-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .hero-icon { color: #2563eb; }
        .hero-card h4 { color: #1e3a8a; font-size: 0.95rem; margin-bottom: 0.25rem; }
        .hero-card p { font-size: 0.85rem; color: #1e40af; }
        
        .section-heading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: var(--cu-red);
        }
        .code-snippets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .code-box {
          background: #0f172a;
          color: #f8fafc;
          border-radius: 8px;
          padding: 0.85rem;
          font-family: monospace;
          font-size: 0.775rem;
          overflow-x: auto;
        }
        .code-title {
          color: #38bdf8;
          font-weight: 700;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 0.25rem;
        }
        
        .api-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .api-list li {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }
        .method-pill {
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.7rem;
        }
        .method-pill.get { background: #dcfce7; color: #15803d; }
        .method-pill.put { background: #fef3c7; color: #b45309; }
        .method-pill.post { background: #dbeafe; color: #1d4ed8; }
        .method-pill.patch { background: #f3e8ff; color: #6b21a8; }
        .desc { color: var(--text-muted); font-size: 0.8rem; margin-left: auto; }
        
        .pitch-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .pitch-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
        }
        .pitch-icon { color: var(--cu-red); margin-bottom: 0.5rem; }
        .pitch-card h5 { font-size: 0.9rem; margin-bottom: 0.35rem; }
        .pitch-card p { font-size: 0.775rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};
