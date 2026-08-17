import React from 'react';
import { User } from '../types';
import { Shield, GraduationCap, UserCheck, Database, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenMongoGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenMongoGuide,
}) => {
  return (
    <header className="cu-header">
      <div className="header-top-bar">
        <div className="header-container">
          {/* Logo & Branding */}
          <div className="brand-group">
            <div className="cu-logo-badge">
              <span className="cu-letters">CU</span>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                CAMPUS CONNECTIVITY SYSTEM <span className="version-pill">CU CCS v2.0</span>
              </div>
              <div className="brand-subtitle">Chandigarh University Cabin & Location Directory</div>
            </div>
          </div>

          {/* Actions & User Account */}
          <div className="header-actions">
            <button className="btn-guide" onClick={onOpenMongoGuide}>
              <Database size={16} />
              <span>MongoDB & Backend Architecture</span>
            </button>

            {currentUser && (
              <button className="btn-logout" onClick={onLogout} title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Information Bar */}
      {currentUser && (
        <div className="user-nav-bar">
          <div className="header-container">
            <div className="user-welcome">
              <UserIcon size={16} className="text-muted" />
              <span>
                Logged in as: <strong>{currentUser.name}</strong> ({currentUser.email})
              </span>
            </div>

            <div className={`role-badge-pill role-${currentUser.role}`}>
              {currentUser.role === 'admin' && <Shield size={14} />}
              {currentUser.role === 'teacher' && <UserCheck size={14} />}
              {currentUser.role === 'student' && <GraduationCap size={14} />}
              <span>{currentUser.role.toUpperCase()} DASHBOARD ACCESS</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cu-header {
          background: #ffffff;
          border-bottom: 1px solid var(--border-light);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-top-bar {
          background: linear-gradient(135deg, #c8102e 0%, #990000 100%);
          color: #ffffff;
          padding: 0.85rem 0;
        }
        .header-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .cu-logo-badge {
          width: 44px;
          height: 44px;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .cu-letters {
          color: #c8102e;
          font-weight: 900;
          font-size: 1.35rem;
          letter-spacing: -1px;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .version-pill {
          background: rgba(255,255,255,0.2);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .brand-subtitle {
          font-size: 0.775rem;
          opacity: 0.9;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-guide {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-guide:hover {
          background: rgba(255,255,255,0.25);
        }
        .btn-logout {
          background: #ffffff;
          color: #c8102e;
          border: none;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background: #fff0f2;
          transform: translateY(-1px);
        }
        .user-nav-bar {
          background: #f8fafc;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .user-welcome {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-main);
        }
        .role-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .role-badge-pill.role-admin {
          background: #fef2f2;
          color: #990000;
          border: 1px solid #fecaca;
        }
        .role-badge-pill.role-teacher {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }
        .role-badge-pill.role-student {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </header>
  );
};
