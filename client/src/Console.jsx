import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Home,
  AlertTriangle,
  UsersRound,
  GraduationCap,
  FileSpreadsheet,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
  Building2,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Plus,
  MessageSquare,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import './console.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function RoleDropdownSelect({ userItem, onUpdateRole }) {
  const [updating, setUpdating] = useState(false);
  const [currentRole, setCurrentRole] = useState(userItem.role);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleRoleChange = async (event) => {
    const newRole = event.target.value;
    setUpdating(true);
    setStatusMessage('');
    setIsError(false);

    const res = await onUpdateRole(userItem._id, newRole);
    setUpdating(false);

    if (res.success) {
      setCurrentRole(newRole);
      setStatusMessage('Saved!');
      setTimeout(() => setStatusMessage(''), 2000);
    } else {
      setIsError(true);
      setStatusMessage(res.error || 'Failed');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <select
        value={currentRole}
        disabled={updating}
        onChange={handleRoleChange}
        className="saas-select"
      >
        <option value="student">Student</option>
        <option value="co_leader">Co-Leader</option>
        <option value="leader">Leader</option>
        <option value="admin">Admin</option>
      </select>
      {updating && <Loader2 className="spin" size={14} style={{ color: '#2563eb' }} />}
      {statusMessage && (
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isError ? 'var(--warn)' : '#2563eb' }}>
          {statusMessage}
        </span>
      )}
    </div>
  );
}

function DeleteUserButton({ userId, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    const res = await onDelete(userId);
    setDeleting(false);
    if (!res.success) {
      alert(res.error || 'Failed to delete user');
      setConfirming(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={deleting}
      style={{
        background: confirming ? 'var(--warn)' : 'transparent',
        color: confirming ? '#fff' : 'var(--warn)',
        border: '1px solid var(--warn)',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        minHeight: '32px',
        cursor: deleting ? 'not-allowed' : 'pointer'
      }}
    >
      {deleting ? (
        <Loader2 className="spin" size={14} />
      ) : confirming ? (
        <span>Confirm?</span>
      ) : (
        <>
          <Trash2 size={14} />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}

function TaskStatusDropdown({ task, userRole, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const isLeader = userRole === 'admin' || userRole === 'leader' || userRole === 'co_leader';

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    const res = await onStatusChange(task._id, newStatus);
    setUpdating(false);
    if (res.success) {
      setCurrentStatus(newStatus);
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  if (!isLeader) {
    return <span className={`badge status-${currentStatus}`}>{currentStatus}</span>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <select
        value={currentStatus}
        disabled={updating}
        onChange={handleChange}
        className="saas-select"
        style={{ minHeight: '30px', padding: '2px 8px', fontSize: '0.8rem' }}
      >
        <option value="assigned">Assigned</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="resolved">Resolved</option>
      </select>
      {updating && <Loader2 className="spin" size={12} style={{ color: '#2563eb' }} />}
    </div>
  );
}

function DashboardOverview({ tasks, users, userRole, isLoading, onRefresh, onStatusChange }) {
  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'resolved');
  const urgentCount = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  const totalResidents = users.length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Tasks</span>
            <span className="stat-value">{activeTasks.length}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <Building2 size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Urgent Issues</span>
            <span className="stat-value">{urgentCount}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Residents</span>
            <span className="stat-value">{totalResidents}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <UsersRound size={20} />
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Recent Tasks & Assignments</h2>
          <button onClick={onRefresh} className="saas-btn secondary" style={{ minHeight: 'auto', padding: '6px 12px' }}>
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="saas-empty">
            <Loader2 className="spin" size={24} />
            <span>Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="saas-empty">
            <CheckCircle2 size={32} />
            <span>All caught up! No active tasks.</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Assigned Location</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{task.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>{task.description}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {task.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <TaskStatusDropdown task={task} userRole={userRole} onStatusChange={onStatusChange} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>
                        {task.assignedToRooms?.length ? `Rooms ${task.assignedToRooms.join(', ')}` : ''}
                        {task.assignedToFloors?.length ? ` (Floors ${task.assignedToFloors.join(', ')})` : ''}
                        {!task.assignedToRooms?.length && !task.assignedToFloors?.length ? 'Everyone' : ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ComplaintsBoard({ tasks, userRole, isLoading, onRefresh, onStatusChange }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Complaints & Tasks Board</h2>
        <button onClick={onRefresh} className="saas-btn secondary" style={{ minHeight: 'auto', padding: '6px 12px' }}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="saas-empty">
          <Loader2 className="spin" size={24} />
          <span>Loading complaints...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="saas-empty">
          <span>No complaints reported yet.</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Details</th>
                <th>Category</th>
                <th>AI Urgency</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>
                      {task.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                      {task.category || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <TaskStatusDropdown task={task} userRole={userRole} onStatusChange={onStatusChange} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>
                      {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No limit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CreateTaskForm({ user, onTaskCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'normal',
    assignedToFloors: '',
    assignedToRooms: '',
    dueAt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      assignedToFloors: form.assignedToFloors ? form.assignedToFloors.split(',').map(f => Number(f.trim())).filter(n => !isNaN(n)) : [],
      assignedToRooms: form.assignedToRooms ? form.assignedToRooms.split(',').map(r => r.trim()).filter(Boolean) : [],
      dueAt: form.dueAt || undefined
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/tasks`, payload, {
        withCredentials: true
      });
      if (res.data && res.data.success) {
        setSuccess(true);
        setForm({
          title: '',
          description: '',
          category: 'other',
          priority: 'normal',
          assignedToFloors: '',
          assignedToRooms: '',
          dueAt: ''
        });
        if (onTaskCreated) onTaskCreated();
      } else {
        setError('Failed to submit task.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit task.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user?.role === 'student';

  return (
    <div className="saas-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="saas-card-title">{isStudent ? 'File a New Complaint' : 'Create a New Task'}</h2>
      <form className="saas-form" onSubmit={handleSubmit}>
        <div className="saas-field">
          <label>{isStudent ? 'Complaint Title' : 'Task Title'}</label>
          <input required placeholder={isStudent ? 'e.g. Water leak in room 302' : 'e.g. Fix Wi-Fi router'} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="saas-field">
          <label>Description</label>
          <textarea rows="4" placeholder={isStudent ? 'Provide details about the issue' : 'Task instructions and details'} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        {!isStudent && (
          <>
            <div className="field-grid two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="saas-field">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="maintenance">Maintenance</option>
                  <option value="education">Education</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="mess">Mess</option>
                  <option value="utility">Utility</option>
                  <option value="event">Event</option>
                  <option value="admin">Admin</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="saas-field">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="saas-field">
              <label>Assigned Floors (comma-separated numbers)</label>
              <input placeholder="e.g. 1, 2, 3" value={form.assignedToFloors} onChange={e => setForm({ ...form, assignedToFloors: e.target.value })} />
            </div>

            <div className="saas-field">
              <label>Assigned Rooms (comma-separated numbers/strings)</label>
              <input placeholder="e.g. 101, 102, 203" value={form.assignedToRooms} onChange={e => setForm({ ...form, assignedToRooms: e.target.value })} />
            </div>

            <div className="saas-field">
              <label>Due Date</label>
              <input type="datetime-local" value={form.dueAt} onChange={e => setForm({ ...form, dueAt: e.target.value })} />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="saas-btn primary" style={{ width: '100%' }}>
          {loading ? <Loader2 className="spin" size={16} /> : <Plus size={16} />}
          <span>{loading ? 'Submitting...' : isStudent ? 'Submit Complaint' : 'Create Task'}</span>
        </button>
      </form>

      {error && <div className="error-box" style={{ marginTop: '16px' }}>{error}</div>}
      {success && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#dcfce7', border: '1px solid #bcf0da', borderRadius: '8px', color: '#15803d', fontWeight: 'bold' }}>
          {isStudent ? 'Complaint submitted successfully!' : 'Task created successfully!'}
        </div>
      )}
    </div>
  );
}

function StudentDirectory({ users, isLoading, onRefresh }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Student Directory</h2>
        <button onClick={onRefresh} className="saas-btn secondary" style={{ minHeight: 'auto', padding: '6px 12px' }}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="saas-empty">
          <Loader2 className="spin" size={24} />
          <span>Loading student list...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="saas-empty">
          <span>No residents found in the database.</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Location</th>
                <th>Branch & Year</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar-circle">
                        {userItem.name ? userItem.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{userItem.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{userItem.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    Room {userItem.roomNumber || 'N/A'} (Floor {userItem.floor ?? 'N/A'})
                  </td>
                  <td>
                    {userItem.branch || 'N/A'} - {userItem.year || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EducationHub() {
  const [form, setForm] = useState({
    userId: '',
    branch: 'CSE',
    year: '2nd Year',
    floor: '',
    roomNumber: '',
    interests: '',
    limit: '3'
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations(null);

    const payload = {
      userId: form.userId || undefined,
      profile: {
        branch: form.branch,
        year: form.year,
        floor: form.floor ? Number(form.floor) : undefined,
        roomNumber: form.roomNumber || undefined,
        interests: form.interests.split(',').map(i => i.trim()).filter(Boolean)
      },
      limit: Number(form.limit)
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/ai/resources/recommend`, payload, {
        withCredentials: true
      });
      if (res.data && res.data.success) {
        setRecommendations(res.data.data);
      } else {
        setError('Failed to load education recommendations.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-grid">
      <div className="saas-card">
        <h2 className="saas-card-title">AI Learning Recommender</h2>
        <form className="saas-form" onSubmit={handleSubmit}>
          <div className="saas-field">
            <label>Student Branch</label>
            <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="ME">Mechanical (ME)</option>
              <option value="EE">Electrical (EE)</option>
              <option value="CE">Civil (CE)</option>
            </select>
          </div>
          <div className="saas-field">
            <label>Current Year</label>
            <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="saas-field">
            <label>Interests (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. data structures, web, ml"
              value={form.interests}
              onChange={e => setForm({ ...form, interests: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="saas-btn primary">
            {loading ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
            <span>Get Recommendations</span>
          </button>
        </form>
        {error && <div className="error-box" style={{ marginTop: '16px' }}>{error}</div>}
      </div>

      <div className="saas-card">
        <h2 className="saas-card-title">Learning Recommendations Plan</h2>
        {!recommendations && !loading && (
          <div className="saas-empty">
            <GraduationCap size={32} />
            <span>Select details and trigger recommendations to see structured Insights and Learning Plan.</span>
          </div>
        )}
        {loading && (
          <div className="saas-empty">
            <Loader2 className="spin" size={24} />
            <span>Generating structured learning recommendations...</span>
          </div>
        )}
        {recommendations && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Insights */}
            {recommendations.industryInsights && (
              <div style={{ padding: '16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#2563eb' }}>Industry Insights</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text)' }}>
                  {recommendations.industryInsights}
                </p>
              </div>
            )}

            {/* Learning Plan */}
            {recommendations.learningPlan && recommendations.learningPlan.length > 0 && (
              <div style={{ padding: '16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#2563eb' }}>3-Step Learning Plan</strong>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {recommendations.learningPlan.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Resources */}
            {recommendations.resources && recommendations.resources.length > 0 && (
              <div style={{ padding: '16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#2563eb' }}>Top 3 Relevant Resources</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.resources.map((resource, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: i < recommendations.resources.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{resource.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '2px' }}>{resource.description}</div>
                      {resource.url && (
                        <a href={resource.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold', marginTop: '6px', textDecoration: 'none' }}>
                          View Link &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {recommendations.searchSuggestions && recommendations.searchSuggestions.length > 0 && (
              <div style={{ padding: '16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#2563eb' }}>Suggested Search Topics</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {recommendations.searchSuggestions.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', background: 'var(--surface)', border: '1px solid var(--line)', padding: '4px 10px', borderRadius: '16px', color: 'var(--muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ImportExcel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/users/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data && res.data.success) {
        setResult(res.data);
        setFile(null);
      } else {
        setError('Failed to import user spreadsheet.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="saas-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="saas-card-title">Bulk Resident Import</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '24px' }}>
        Select or drag a Microsoft Excel (.xlsx, .xls) or CSV (.csv) file containing resident details to automatically import them.
      </p>

      <form onSubmit={handleUpload} className="saas-form">
        <div className="excel-upload-container">
          <FileSpreadsheet size={40} className="excel-upload-icon" />
          <p style={{ fontWeight: 600, margin: 0 }}>
            {file ? file.name : 'Choose file or drag here'}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            {file ? `Size: ${(file.size / 1024).toFixed(1)} KB` : 'Supports xls, xlsx, csv'}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit" disabled={!file || uploading} className="saas-btn primary" style={{ width: '100%' }}>
          {uploading ? <Loader2 className="spin" size={16} /> : <FileSpreadsheet size={16} />}
          <span>{uploading ? 'Importing Residents...' : 'Upload & Import'}</span>
        </button>
      </form>

      {error && <div className="error-box" style={{ marginTop: '20px' }}>{error}</div>}
      {result && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#dcfce7', border: '1px solid #bcf0da', borderRadius: '8px', color: '#15803d', fontSize: '0.9rem' }}>
          <strong>Success!</strong> Resident spreadsheet imported.
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
            <li>Total Records Read: {result.recordsRead || 0}</li>
            <li>Successful Imports: {result.successCount || 0}</li>
            <li>Errors/Duplicates Skipped: {result.errorCount || 0}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function ManageRoles({ users, isLoading, onRefresh, onUpdateRole, onDeleteUser }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Resident Access Control (RBAC)</h2>
        <button onClick={onRefresh} className="saas-btn secondary" style={{ minHeight: 'auto', padding: '6px 12px' }}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="saas-empty">
          <Loader2 className="spin" size={24} />
          <span>Loading accounts...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="saas-empty">
          <span>No accounts found.</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Location</th>
                <th>Branch & Year</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar-circle">
                        {userItem.name ? userItem.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{userItem.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{userItem.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    Room {userItem.roomNumber || 'N/A'} (Floor {userItem.floor ?? 'N/A'})
                  </td>
                  <td>
                    {userItem.branch || 'N/A'} - {userItem.year || 'N/A'}
                  </td>
                  <td>
                    <RoleDropdownSelect userItem={userItem} onUpdateRole={onUpdateRole} />
                  </td>
                  <td>
                    <DeleteUserButton userId={userItem._id} onDelete={onDeleteUser} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HostelOSChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the HostelOS rulebook assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/ai/chat`, { question: userMessage }, {
        withCredentials: true
      });
      if (res.data && res.data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.data.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error processing your query.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am unable to connect to the server right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-chatbot-container">
      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-dot"></span>
              <strong>HostelOS Assistant</strong>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-close-btn">
              <X size={16} />
            </button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="chat-bubble loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSend} className="chat-footer">
            <input
              type="text"
              placeholder="Ask about hostel rules..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <div className="chat-badge-wrapper">
          <div className="chat-popover-hint">Need help? Ask rules!</div>
          <button className="chat-badge-btn" onClick={() => setIsOpen(true)}>
            <MessageSquare size={22} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Console() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('hostelly-theme') || 'light');

  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  const [tasksList, setTasksList] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setUsersError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        withCredentials: true
      });
      if (response.data && response.data.success) {
        setUsersList(response.data.data);
      } else {
        setUsersError('Failed to load users list');
      }
    } catch (err) {
      setUsersError(err.response?.data?.message || err.message || 'Failed to load users list');
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    setTasksError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        withCredentials: true
      });
      if (response.data && response.data.success) {
        setTasksList(response.data.data);
      } else {
        setTasksError('Failed to load tasks');
      }
    } catch (err) {
      setTasksError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      if (response.data && response.data.success) {
        setUsersList((currentList) =>
          currentList.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        return { success: true };
      }
      return { success: false, error: 'Failed to update user role' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user role';
      return { success: false, error: msg };
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        withCredentials: true
      });
      if (response.data && response.data.success) {
        setUsersList((currentList) => currentList.filter((u) => u._id !== userId));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete user' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete user';
      return { success: false, error: msg };
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data && response.data.success) {
        setTasksList((currentList) =>
          currentList.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
        return { success: true };
      }
      return { success: false, error: 'Failed to update task status' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [fetchUsers, fetchTasks]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('hostelly-theme', theme);
  }, [theme]);

  const activeTabLabel = useMemo(() => {
    return {
      dashboard: 'Dashboard Overview',
      complaints: 'Public Complaints',
      create_task: user?.role === 'student' ? 'File Complaint' : 'Create Task',
      directory: 'Student Directory',
      education_hub: 'Education Hub',
      import_excel: 'Import Excel',
      manage_roles: 'Manage Roles'
    }[activeTab] || 'Dashboard';
  }, [activeTab, user]);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar-fixed">
        <a href="#logo" className="sidebar-logo">
          <span><Building2 size={18} /></span>
          HostelOS
        </a>

        <div className="sidebar-menu">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`sidebar-link ${activeTab === 'complaints' ? 'active' : ''}`}
          >
            <AlertTriangle size={18} />
            <span>Public Complaints</span>
          </button>
          <button
            onClick={() => setActiveTab('create_task')}
            className={`sidebar-link ${activeTab === 'create_task' ? 'active' : ''}`}
          >
            <Plus size={18} />
            <span>{user?.role === 'student' ? 'File Complaint' : 'Create Task'}</span>
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`sidebar-link ${activeTab === 'directory' ? 'active' : ''}`}
          >
            <UsersRound size={18} />
            <span>Student Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('education_hub')}
            className={`sidebar-link ${activeTab === 'education_hub' ? 'active' : ''}`}
          >
            <GraduationCap size={18} />
            <span>Education Hub</span>
          </button>

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-section-title">Admin Operations</div>
              <button
                onClick={() => setActiveTab('import_excel')}
                className={`sidebar-link ${activeTab === 'import_excel' ? 'active' : ''}`}
              >
                <FileSpreadsheet size={18} />
                <span>Import Excel</span>
              </button>
              <button
                onClick={() => setActiveTab('manage_roles')}
                className={`sidebar-link ${activeTab === 'manage_roles' ? 'active' : ''}`}
              >
                <ShieldCheck size={18} />
                <span>Manage Roles</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-scroll">
        {/* Header */}
        <header className="top-header-bar">
          <div className="header-welcome">
            <h1>{activeTabLabel}</h1>
            <p>Welcome back, {user?.name || 'User'} ({user?.role || 'Resident'})</p>
          </div>

          <div className="header-actions">
            <button
              className="logout-btn"
              type="button"
              title={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
              onClick={() => setTheme(curr => curr === 'dark' ? 'light' : 'dark')}
              style={{ marginRight: '8px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="user-badge">
              <div className="avatar-circle">
                {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
              </div>
              <span className="badge-text">{user?.name || 'Resident'}</span>
            </div>
            <button className="logout-btn" onClick={logout}>
              <LogOut size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="page-container">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              tasks={tasksList}
              users={usersList}
              userRole={user?.role}
              isLoading={isLoadingTasks}
              onRefresh={fetchTasks}
              onStatusChange={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintsBoard
              tasks={tasksList}
              userRole={user?.role}
              isLoading={isLoadingTasks}
              onRefresh={fetchTasks}
              onStatusChange={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'create_task' && (
            <CreateTaskForm
              user={user}
              onTaskCreated={fetchTasks}
            />
          )}

          {activeTab === 'directory' && (
            <StudentDirectory
              users={usersList}
              isLoading={isLoadingUsers}
              onRefresh={fetchUsers}
            />
          )}

          {activeTab === 'education_hub' && (
            <EducationHub />
          )}

          {activeTab === 'import_excel' && user?.role === 'admin' && (
            <ImportExcel />
          )}

          {activeTab === 'manage_roles' && user?.role === 'admin' && (
            <ManageRoles
              users={usersList}
              isLoading={isLoadingUsers}
              onRefresh={fetchUsers}
              onUpdateRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>
      <HostelOSChatbot />
    </div>
  );
}
