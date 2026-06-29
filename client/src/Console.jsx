import './console.css';
import axios from 'axios';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Home,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Moon,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Tags,
  UsersRound,
  Zap,
  CheckSquare,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const tools = [
  {
    id: 'task',
    label: 'Task Intelligence',
    endpoint: 'POST /api/ai/tasks/categorize',
    icon: ClipboardList,
    headline: 'Auto-categorize hostel work and suggest the best co-leader.',
    sample: 'Fix broken geyser on Floor 2',
    roles: ['admin', 'leader', 'co_leader']
  },
  {
    id: 'create_task',
    label: 'Create Task',
    endpoint: 'POST /api/tasks',
    icon: CheckSquare,
    headline: 'Create and assign a new task to students, floors, or rooms.',
    sample: 'Clean common room',
    roles: ['admin', 'leader', 'co_leader']
  },
  {
    id: 'complaint',
    label: 'Complaint Radar',
    endpoint: 'POST /api/ai/complaints/analyze',
    icon: AlertTriangle,
    headline: 'Detect urgency, sentiment, and repeated conflict patterns.',
    sample: 'No water on floor 2 for two hours',
    roles: ['admin', 'leader', 'co_leader']
  },
  {
    id: 'resources',
    label: 'Learning Recommender',
    endpoint: 'POST /api/ai/resources/recommend',
    icon: GraduationCap,
    headline: 'Recommend education resources by branch, room, floor, and interests.',
    sample: 'CSE students studying DSA',
    roles: ['admin', 'leader', 'co_leader', 'student']
  },
  {
    id: 'ask',
    label: 'Hostel Q&A Bot',
    endpoint: 'POST /api/ai/ask',
    icon: FileQuestion,
    headline: 'Answer student questions from official hostel documents.',
    sample: 'When is the mess bill due?',
    roles: ['admin', 'leader', 'co_leader', 'student']
  },
  {
    id: 'embedding',
    label: 'Knowledge Indexing',
    endpoint: 'POST /api/ai/embeddings',
    icon: Network,
    headline: 'Convert hostel rules and notices into searchable AI context.',
    sample: 'Hostel rulebook text',
    roles: ['admin']
  },
  {
    id: 'excel_upload',
    label: 'Resident Import',
    endpoint: 'POST /api/users/import',
    icon: FileSpreadsheet,
    headline: 'Bulk import residents from an Excel, CSV, or Spreadsheet file.',
    sample: 'residents.xlsx',
    roles: ['admin', 'leader', 'co_leader']
  },
  {
    id: 'user_directory',
    label: 'User Directory',
    endpoint: 'GET /api/users',
    icon: UsersRound,
    headline: 'View all hostel residents and manage their roles.',
    sample: 'all users',
    roles: ['admin']
  }
];

const stats = [
  { label: 'Residents synced', value: '1,280', icon: UsersRound },
  { label: 'WhatsApp alerts', value: '18k', icon: MessageCircle },
  { label: 'AI tasks tagged', value: '4,912', icon: Sparkles },
  { label: 'Floors coordinated', value: '12', icon: Building2 }
];

const workflow = [
  'Import students from Excel and group them by floor, branch, and room.',
  'Leaders assign tasks while AI tags priority, category, and ownership.',
  'Students get WhatsApp updates, deadlines, reminders, and official answers.',
  'Dashboards surface complaints, learning resources, and follow-up signals.'
];

const initialForms = {
  task: {
    taskId: '',
    title: 'Fix broken geyser on Floor 2',
    description: 'Students in room 204 have no hot water since morning.',
    floor: '2',
    roomNumber: '204',
    dueAt: ''
  },
  create_task: {
    title: 'Clean common room',
    description: 'Please ensure all trash is removed and floors are swept.',
    category: 'cleaning',
    priority: 'normal',
    assignedToFloors: '',
    assignedToRooms: '',
    assignedToUsers: '',
    dueAt: ''
  },
  complaint: {
    complaintId: '',
    title: 'Water shortage',
    description: 'No water on floor 2 for the last two hours.',
    floor: '2',
    roomNumber: '208'
  },
  resources: {
    userId: '',
    branch: 'CSE',
    year: '2nd Year',
    floor: '2',
    roomNumber: '204',
    interests: 'dsa, web development',
    limit: '5'
  },
  ask: {
    question: 'When is the mess bill due?',
    topK: '5'
  },
  embedding: {
    text: 'Hostel students must submit mess bills before the due date.'
  },
  excel_upload: {
    file: null
  },
  user_directory: {}
};

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}

function toNumber(value) {
  if (value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function buildPayload(activeTool, form) {
  if (activeTool === 'task') {
    return compactObject({
      taskId: form.taskId,
      title: form.title,
      description: form.description,
      floor: toNumber(form.floor),
      roomNumber: form.roomNumber,
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : ''
    });
  }

  if (activeTool === 'create_task') {
    return compactObject({
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      assignedToFloors: form.assignedToFloors ? form.assignedToFloors.split(',').map(toNumber).filter((x) => x !== undefined) : [],
      assignedToRooms: form.assignedToRooms ? form.assignedToRooms.split(',').map((x) => x.trim()).filter(Boolean) : [],
      assignedToUsers: form.assignedToUsers ? form.assignedToUsers.split(',').map((x) => x.trim()).filter(Boolean) : [],
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined
    });
  }

  if (activeTool === 'complaint') {
    return compactObject({
      complaintId: form.complaintId,
      title: form.title,
      description: form.description,
      floor: toNumber(form.floor),
      roomNumber: form.roomNumber
    });
  }

  if (activeTool === 'resources') {
    const profile = compactObject({
      branch: form.branch,
      year: form.year,
      floor: toNumber(form.floor),
      roomNumber: form.roomNumber,
      interests: form.interests
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean)
    });

    return compactObject({
      userId: form.userId,
      profile: Object.keys(profile).length ? profile : undefined,
      limit: toNumber(form.limit)
    });
  }

  if (activeTool === 'ask') {
    return compactObject({
      question: form.question,
      topK: toNumber(form.topK)
    });
  }

  if (activeTool === 'excel_upload' || activeTool === 'user_directory') {
    return null;
  }

  return compactObject({ text: form.text });
}

function endpointPath(toolId) {
  return {
    task: '/ai/tasks/categorize',
    complaint: '/ai/complaints/analyze',
    resources: '/ai/resources/recommend',
    ask: '/ai/ask',
    embedding: '/ai/embeddings',
    create_task: '/tasks',
    excel_upload: '/users/import',
    user_directory: '/users'
  }[toolId];
}

function StatusBadge({ status }) {
  const Icon = status === 'online' ? CheckCircle2 : status === 'checking' ? Loader2 : AlertTriangle;

  return (
    <span className={`status-badge ${status}`}>
      <Icon size={15} className={status === 'checking' ? 'spin' : ''} aria-hidden="true" />
      {status === 'online' ? 'API online' : status === 'checking' ? 'Checking API' : 'API offline'}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function JsonBlock({ value }) {
  return <pre className="json-block">{JSON.stringify(value, null, 2)}</pre>;
}

function AuthBox({ user, onLogout }) {
  if (!user) {
    return (
      <div className="auth-box" aria-label="Authorization actions">
        <LockKeyhole size={17} aria-hidden="true" />
        <button type="button">Login</button>
        <button className="auth-primary" type="button">Sign up</button>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : 'U';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div className="user-profile-badge" aria-label={`Logged in as ${user.name}`}>
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </div>
      <button className="logout-button" type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

function LandingPage({ openTool }) {
  return (
    <>
      <section className="hero-section" id="home">
        <div className="hero-content reveal-up">
          <div className="hero-kicker">
            <Zap size={17} aria-hidden="true" />
            Student housing, automated
          </div>
          <h1>The Modern Operating System for Student Housing.</h1>
          <p>
            Centralize residents, room operations, WhatsApp communication, learning resources, complaints,
            and AI-assisted workflows in one calm command center.
          </p>
          <div className="hero-actions">
            <button className="primary-button hero-button" type="button" onClick={() => openTool('task')}>
              <Sparkles size={18} />
              Try an AI endpoint
            </button>
            <a className="secondary-link" href="#features">
              Explore features
              <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className="hero-dashboard reveal-up delay-one" aria-label="Hostel management preview">
          <div className="dashboard-glass-head">
            <span>HostelPro AI</span>
            <StatusBadge status="online" />
          </div>
          <div className="preview-grid">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <article className="preview-stat" key={item.label}>
                  <Icon size={20} aria-hidden="true" />
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              );
            })}
          </div>
          <div className="signal-panel">
            <span>Live AI signal</span>
            <strong>5 repeated water complaints detected on Floor 2</strong>
            <button type="button" onClick={() => openTool('complaint')}>
              Analyze now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="section-band" id="features">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>Every module connects to a real endpoint.</h2>
        </div>
        <div className="feature-grid">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                className="feature-card reveal-up"
                style={{ animationDelay: `${index * 80}ms` }}
                key={tool.id}
                type="button"
                onClick={() => openTool(tool.id)}
              >
                <span className="feature-icon"><Icon size={22} /></span>
                <strong>{tool.label}</strong>
                <small>{tool.headline}</small>
                <em>{tool.endpoint}</em>
                <span className="feature-link">
                  Open endpoint
                  <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-band split-band" id="workflow">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Workflow</p>
          <h2>Designed for leaders who need less chasing and more clarity.</h2>
        </div>
        <div className="workflow-list">
          {workflow.map((item, index) => (
            <article className="workflow-step" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band stats-strip" id="overview">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label}>
              <Icon size={21} aria-hidden="true" />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          );
        })}
      </section>
    </>
  );
}

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
        style={{
          minHeight: '32px',
          padding: '2px 8px',
          fontSize: '0.85rem',
          maxWidth: '120px',
          background: updating ? 'var(--surface-muted)' : 'var(--surface-strong)',
          borderColor: isError ? 'var(--warn)' : 'var(--line)',
          borderRadius: '6px',
          cursor: updating ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="student">Student</option>
        <option value="co_leader">Co-Leader</option>
        <option value="leader">Leader</option>
        <option value="admin">Admin</option>
      </select>
      {updating && <Loader2 className="spin" size={14} style={{ color: 'var(--accent)' }} />}
      {statusMessage && (
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isError ? 'var(--warn)' : 'var(--accent)' }}>
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

function ConsoleView({
  activeTool,
  setActiveTool,
  forms,
  updateForm,
  payload,
  selectedTool,
  submitActiveTool,
  isSubmitting,
  result,
  error,
  allowedTools,
  usersList,
  isLoadingUsers,
  usersError,
  onUpdateUserRole,
  onDeleteUser,
  onRefreshUsers
}) {
  const isUserDirectory = activeTool === 'user_directory';

  return (
    <section className="console-shell">
      <aside className="tool-rail" aria-label="AI endpoints">
        {allowedTools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </aside>

      <section className={`tool-panel ${isUserDirectory ? 'span-two' : ''}`}>
        <div className="panel-header">
          <div>
            <p>{selectedTool.endpoint}</p>
            <h2>{selectedTool.label}</h2>
          </div>
          <Sparkles size={24} aria-hidden="true" />
        </div>

        {!isUserDirectory ? (
          <form className="endpoint-form" onSubmit={submitActiveTool}>
            {activeTool === 'task' && (
              <>
                <Field label="Task ID"><input value={forms.task.taskId} onChange={(event) => updateForm('taskId', event.target.value)} /></Field>
                <Field label="Title"><input required value={forms.task.title} onChange={(event) => updateForm('title', event.target.value)} /></Field>
                <Field label="Description"><textarea rows="4" value={forms.task.description} onChange={(event) => updateForm('description', event.target.value)} /></Field>
                <div className="field-grid">
                  <Field label="Floor"><input type="number" value={forms.task.floor} onChange={(event) => updateForm('floor', event.target.value)} /></Field>
                  <Field label="Room"><input value={forms.task.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} /></Field>
                  <Field label="Due"><input type="datetime-local" value={forms.task.dueAt} onChange={(event) => updateForm('dueAt', event.target.value)} /></Field>
                </div>
              </>
            )}

            {activeTool === 'create_task' && (
              <>
                <Field label="Task Title"><input required value={forms.create_task.title} onChange={(event) => updateForm('title', event.target.value)} /></Field>
                <Field label="Description"><textarea rows="4" value={forms.create_task.description} onChange={(event) => updateForm('description', event.target.value)} /></Field>
                <div className="field-grid two">
                  <Field label="Category">
                    <select value={forms.create_task.category} onChange={(event) => updateForm('category', event.target.value)}>
                      <option value="maintenance">Maintenance</option>
                      <option value="education">Education</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="mess">Mess</option>
                      <option value="utility">Utility</option>
                      <option value="event">Event</option>
                      <option value="admin">Admin</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Priority">
                    <select value={forms.create_task.priority} onChange={(event) => updateForm('priority', event.target.value)}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </Field>
                </div>
                <div className="field-grid">
                  <Field label="Assigned Floors (comma-separated)"><input placeholder="e.g. 1, 2" value={forms.create_task.assignedToFloors} onChange={(event) => updateForm('assignedToFloors', event.target.value)} /></Field>
                  <Field label="Assigned Rooms (comma-separated)"><input placeholder="e.g. 101, 102" value={forms.create_task.assignedToRooms} onChange={(event) => updateForm('assignedToRooms', event.target.value)} /></Field>
                  <Field label="Due Date"><input type="datetime-local" value={forms.create_task.dueAt} onChange={(event) => updateForm('dueAt', event.target.value)} /></Field>
                </div>
              </>
            )}

            {activeTool === 'complaint' && (
              <>
                <Field label="Complaint ID"><input value={forms.complaint.complaintId} onChange={(event) => updateForm('complaintId', event.target.value)} /></Field>
                <Field label="Title"><input required value={forms.complaint.title} onChange={(event) => updateForm('title', event.target.value)} /></Field>
                <Field label="Description"><textarea required rows="4" value={forms.complaint.description} onChange={(event) => updateForm('description', event.target.value)} /></Field>
                <div className="field-grid two">
                  <Field label="Floor"><input type="number" value={forms.complaint.floor} onChange={(event) => updateForm('floor', event.target.value)} /></Field>
                  <Field label="Room"><input value={forms.complaint.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} /></Field>
                </div>
              </>
            )}

            {activeTool === 'resources' && (
              <>
                <Field label="User ID"><input value={forms.resources.userId} onChange={(event) => updateForm('userId', event.target.value)} /></Field>
                <div className="field-grid two">
                  <Field label="Branch"><input value={forms.resources.branch} onChange={(event) => updateForm('branch', event.target.value)} /></Field>
                  <Field label="Year"><input value={forms.resources.year} onChange={(event) => updateForm('year', event.target.value)} /></Field>
                  <Field label="Floor"><input type="number" value={forms.resources.floor} onChange={(event) => updateForm('floor', event.target.value)} /></Field>
                  <Field label="Room"><input value={forms.resources.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} /></Field>
                </div>
                <Field label="Interests"><input value={forms.resources.interests} onChange={(event) => updateForm('interests', event.target.value)} /></Field>
                <Field label="Limit"><input min="1" max="10" type="number" value={forms.resources.limit} onChange={(event) => updateForm('limit', event.target.value)} /></Field>
              </>
            )}

            {activeTool === 'ask' && (
              <>
                <Field label="Question"><textarea required rows="5" value={forms.ask.question} onChange={(event) => updateForm('question', event.target.value)} /></Field>
                <Field label="Context chunks"><input min="1" max="8" type="number" value={forms.ask.topK} onChange={(event) => updateForm('topK', event.target.value)} /></Field>
              </>
            )}

            {activeTool === 'embedding' && (
              <Field label="Text"><textarea required rows="8" value={forms.embedding.text} onChange={(event) => updateForm('text', event.target.value)} /></Field>
            )}

            {activeTool === 'excel_upload' && (
              <>
                <div className="file-upload-zone">
                  <FileSpreadsheet size={40} className="upload-icon" />
                  <p>Drag and drop your spreadsheet here, or click to browse</p>
                  <span className="file-types">Supports .xlsx, .xls, .csv</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      updateForm('file', file);
                    }}
                  />
                  {forms.excel_upload.file && (
                    <div className="selected-file">
                      <strong>Selected:</strong> {forms.excel_upload.file.name} ({(forms.excel_upload.file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
                <span>{isSubmitting ? 'Running' : 'Run endpoint'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="directory-container">
            <div className="directory-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="directory-count">Total Residents: <strong>{usersList.length}</strong></span>
              <button type="button" className="icon-button" onClick={onRefreshUsers} title="Refresh directory" style={{ border: '1px solid var(--line)', padding: '6px 12px', minHeight: 'auto', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 'bold' }}>
                <Loader2 className={isLoadingUsers ? 'spin' : ''} size={15} />
                Refresh
              </button>
            </div>

            {isLoadingUsers ? (
              <div className="empty-state" style={{ minHeight: '200px' }}>
                <Loader2 className="spin" size={30} />
                <span>Loading directory data...</span>
              </div>
            ) : usersError ? (
              <div className="error-box">{usersError}</div>
            ) : usersList.length === 0 ? (
              <div className="empty-state" style={{ minHeight: '200px' }}>
                <span>No residents found in the database.</span>
              </div>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="user-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--line)' }}>
                      <th style={{ padding: '12px 8px', fontWeight: 800 }}>Resident</th>
                      <th style={{ padding: '12px 8px', fontWeight: 800 }}>Location</th>
                      <th style={{ padding: '12px 8px', fontWeight: 800 }}>Branch & Year</th>
                      <th style={{ padding: '12px 8px', fontWeight: 800 }}>Role</th>
                      <th style={{ padding: '12px 8px', fontWeight: 800 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((userItem) => (
                      <tr key={userItem._id} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                              {userItem.name ? userItem.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ fontSize: '0.95rem' }}>{userItem.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{userItem.email || 'No email'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem' }}>Room {userItem.roomNumber || 'N/A'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Floor {userItem.floor ?? 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem' }}>{userItem.branch || 'N/A'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{userItem.year || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <RoleDropdownSelect userItem={userItem} onUpdateRole={onUpdateUserRole} />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <DeleteUserButton userId={userItem._id} onDelete={onDeleteUser} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {!isUserDirectory && (
        <section className="result-panel">
          <div className="panel-header compact">
            <div>
              <p>Request payload</p>
              <h2>Preview</h2>
            </div>
            <Tags size={22} aria-hidden="true" />
          </div>
          <JsonBlock value={payload} />

          <div className="panel-header compact response-title">
            <div>
              <p>API response</p>
              <h2>Result</h2>
            </div>
            <Bot size={22} aria-hidden="true" />
          </div>

          {error && <div className="error-box">{error}</div>}
          {result ? (
            <JsonBlock value={result} />
          ) : (
            <div className="empty-state">
              <Brain size={30} aria-hidden="true" />
              <span>No response yet</span>
            </div>
          )}
        </section>
      )}
    </section>
  );
}

export default function Console() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('home');
  const [activeTool, setActiveTool] = useState('task');
  const [forms, setForms] = useState(initialForms);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [theme, setTheme] = useState(() => localStorage.getItem('hostelly-theme') || 'light');

  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

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

  useEffect(() => {
    if (activeTool === 'user_directory') {
      fetchUsers();
    }
  }, [activeTool, fetchUsers]);

  const allowedTools = useMemo(() => tools.filter((tool) => tool.roles.includes(user?.role || 'student')), [user]);

  // Ensure active tool is allowed for the user's role
  useEffect(() => {
    if (user && allowedTools.length > 0) {
      const isAllowed = allowedTools.some((tool) => tool.id === activeTool);
      if (!isAllowed) {
        setActiveTool(allowedTools[0].id);
      }
    }
  }, [user, allowedTools, activeTool]);

  const selectedTool = useMemo(() => tools.find((tool) => tool.id === activeTool) || allowedTools[0] || tools[0], [activeTool, allowedTools]);
  const payload = useMemo(() => buildPayload(activeTool, forms[activeTool]), [activeTool, forms]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('hostelly-theme', theme);
  }, [theme]);

  useEffect(() => {
    let ignored = false;

    async function checkHealth() {
      setApiStatus('checking');

      try {
        await axios.get(`${API_BASE_URL}/health`, { timeout: 4000 });
        if (!ignored) setApiStatus('online');
      } catch {
        if (!ignored) setApiStatus('offline');
      }
    }

    checkHealth();

    return () => {
      ignored = true;
    };
  }, []);

  function openTool(toolId) {
    if (!allowedTools.some(t => t.id === toolId)) return;
    setActiveTool(toolId);
    setView('console');
    setResult(null);
    setError('');
  }

  function updateForm(key, value) {
    setForms((current) => ({
      ...current,
      [activeTool]: {
        ...current[activeTool],
        [key]: value
      }
    }));
  }

  function changeTool(toolId) {
    setActiveTool(toolId);
    setResult(null);
    setError('');
  }

  async function submitActiveTool(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      let response;
      if (activeTool === 'excel_upload') {
        const formData = new FormData();
        if (!forms.excel_upload.file) {
          throw new Error('Please select an Excel or CSV file to upload.');
        }
        formData.append('file', forms.excel_upload.file);
        
        response = await axios.post(`${API_BASE_URL}${endpointPath(activeTool)}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
      } else {
        response = await axios.post(`${API_BASE_URL}${endpointPath(activeTool)}`, payload, {
          withCredentials: true
        });
      }
      setResult(response.data);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        'Request failed. Check the API server and environment variables.';
      setError(message);
      setResult(requestError.response?.data || null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="brand-mark" type="button" onClick={() => setView('home')} aria-label="Go home">
          <span><Building2 size={20} /></span>
          Hostelly
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          <button className={view === 'home' ? 'active' : ''} type="button" onClick={() => setView('home')}>
            <Home size={16} />
            Home
          </button>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <button className={view === 'console' ? 'active' : ''} type="button" onClick={() => setView('console')}>
            <Network size={16} />
            Endpoints
          </button>
        </nav>

        <div className="header-actions">
          <StatusBadge status={apiStatus} />
          <button
            className="icon-button"
            type="button"
            title={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            aria-label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <AuthBox user={user} onLogout={logout} />
        </div>
      </header>

      {view === 'home' ? (
        <LandingPage openTool={openTool} />
      ) : (
        <ConsoleView
          activeTool={activeTool}
          setActiveTool={changeTool}
          forms={forms}
          updateForm={updateForm}
          payload={payload}
          selectedTool={selectedTool}
          submitActiveTool={submitActiveTool}
          isSubmitting={isSubmitting}
          result={result}
          error={error}
          allowedTools={allowedTools}
          usersList={usersList}
          isLoadingUsers={isLoadingUsers}
          usersError={usersError}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
          onRefreshUsers={fetchUsers}
        />
      )}
    </main>
  );
}
