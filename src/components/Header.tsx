import React from 'react';
import { User } from '../types';
import { Shield, GraduationCap, UserCheck, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
}) => {
  return (
    <header className="cu-header">
      <div className="header-top-bar">
        <div className="header-container">
          {/* Logo & Branding */}
          <div className="brand-group">
            <div className="cu-logo-img-wrapper">
              <img src="/logo.png" alt="Chandigarh University Logo" className="cu-logo-img" />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                CAMPUS CONNECTIVITY SYSTEM
              </div>
              <div className="brand-subtitle">Chandigarh University Cabin & Location Directory</div>
            </div>
          </div>

          {/* Actions & User Account */}
          <div className="header-actions">
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
          padding: 0.75rem 0;
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
        .cu-logo-img-wrapper {
          height: 48px;
          display: flex;
          align-items: center;
          background: #ffffff;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .cu-logo-img {
          height: 100%;
          width: auto;
          object-fit: contain;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
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
