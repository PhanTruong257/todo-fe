import React from 'react';
import { ListTodo, Cloud, Server, AlertCircle, RefreshCw } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  isBackendConnected: boolean;
  onRetryConnection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isBackendConnected,
  onRetryConnection,
}) => {
  return (
    <>
      <header className="app-header">
        <div className="brand">
          <div className="logo-badge">
            <ListTodo size={28} />
          </div>
          <div className="brand-text">
            <h1>TaskFlow</h1>
            <p>Quản lý công việc thông minh • React TS + NestJS + MongoDB</p>
          </div>
        </div>

        <div className="tech-badges">
          <span className="badge-pill badge-aws">
            <Cloud size={13} /> AWS Ready
          </span>
          <span
            className={`badge-pill ${
              isBackendConnected ? 'badge-connected' : 'badge-disconnected'
            }`}
          >
            <Server size={13} />
            {isBackendConnected ? 'Backend Connected' : 'Local Preview'}
          </span>
        </div>
      </header>

      {!isBackendConnected && (
        <div className="connection-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#f59e0b" />
            <span>
              <strong>Chế độ xem trước (Local Preview)</strong>: Chưa kết nối tới Backend NestJS tại{' '}
              <code>http://localhost:4000</code>. Dữ liệu đang được lưu tạm trên trình duyệt.
            </span>
          </div>
          <button onClick={onRetryConnection} title="Bấm để thử kết nối lại NestJS">
            <RefreshCw size={13} />
            Kết nối lại
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
