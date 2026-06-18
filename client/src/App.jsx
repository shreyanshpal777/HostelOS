import axios from 'axios';
import {
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Loader2,
  Moon,
  Network,
  Send,
  Sparkles,
  Sun,
  Tags
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const tools = [
  { id: 'task', label: 'Task AI', endpoint: 'POST /api/ai/tasks/categorize', icon: ClipboardList },
  { id: 'complaint', label: 'Complaint AI', endpoint: 'POST /api/ai/complaints/analyze', icon: AlertTriangle },
  { id: 'resources', label: 'Resources', endpoint: 'POST /api/ai/resources/recommend', icon: GraduationCap },
  { id: 'ask', label: 'Q&A Bot', endpoint: 'POST /api/ai/ask', icon: FileQuestion },
  { id: 'embedding', label: 'Embeddings', endpoint: 'POST /api/ai/embeddings', icon: Network }
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
  }
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

  return compactObject({ text: form.text });
}

function endpointPath(toolId) {
  return {
    task: '/ai/tasks/categorize',
    complaint: '/ai/complaints/analyze',
    resources: '/ai/resources/recommend',
    ask: '/ai/ask',
    embedding: '/ai/embeddings'
  }[toolId];
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

function StatusBadge({ status }) {
  const Icon = status === 'online' ? CheckCircle2 : status === 'checking' ? Loader2 : AlertTriangle;

  return (
    <span className={`status-badge ${status}`}>
      <Icon size={15} className={status === 'checking' ? 'spin' : ''} aria-hidden="true" />
      {status === 'online' ? 'API online' : status === 'checking' ? 'Checking API' : 'API offline'}
    </span>
  );
}

export function App() {
  const [activeTool, setActiveTool] = useState('task');
  const [forms, setForms] = useState(initialForms);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [theme, setTheme] = useState(() => localStorage.getItem('hostelly-theme') || 'light');

  const selectedTool = useMemo(() => tools.find((tool) => tool.id === activeTool), [activeTool]);
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

  function updateForm(key, value) {
    setForms((current) => ({
      ...current,
      [activeTool]: {
        ...current[activeTool],
        [key]: value
      }
    }));
  }

  async function submitActiveTool(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}${endpointPath(activeTool)}`, payload);
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
      <section className="topbar" aria-label="Application status">
        <div>
          <p className="eyebrow">Hostelly AI Console</p>
          <h1>AI endpoint workspace</h1>
        </div>

        <div className="topbar-actions">
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
        </div>
      </section>

      <section className="dashboard">
        <aside className="tool-rail" aria-label="AI endpoints">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
                key={tool.id}
                type="button"
                onClick={() => {
                  setActiveTool(tool.id);
                  setResult(null);
                  setError('');
                }}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </aside>

        <section className="tool-panel">
          <div className="panel-header">
            <div>
              <p>{selectedTool.endpoint}</p>
              <h2>{selectedTool.label}</h2>
            </div>
            <Sparkles size={24} aria-hidden="true" />
          </div>

          <form className="endpoint-form" onSubmit={submitActiveTool}>
            {activeTool === 'task' && (
              <>
                <Field label="Task ID">
                  <input value={forms.task.taskId} onChange={(event) => updateForm('taskId', event.target.value)} />
                </Field>
                <Field label="Title">
                  <input required value={forms.task.title} onChange={(event) => updateForm('title', event.target.value)} />
                </Field>
                <Field label="Description">
                  <textarea rows="4" value={forms.task.description} onChange={(event) => updateForm('description', event.target.value)} />
                </Field>
                <div className="field-grid">
                  <Field label="Floor">
                    <input type="number" value={forms.task.floor} onChange={(event) => updateForm('floor', event.target.value)} />
                  </Field>
                  <Field label="Room">
                    <input value={forms.task.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} />
                  </Field>
                  <Field label="Due">
                    <input type="datetime-local" value={forms.task.dueAt} onChange={(event) => updateForm('dueAt', event.target.value)} />
                  </Field>
                </div>
              </>
            )}

            {activeTool === 'complaint' && (
              <>
                <Field label="Complaint ID">
                  <input value={forms.complaint.complaintId} onChange={(event) => updateForm('complaintId', event.target.value)} />
                </Field>
                <Field label="Title">
                  <input required value={forms.complaint.title} onChange={(event) => updateForm('title', event.target.value)} />
                </Field>
                <Field label="Description">
                  <textarea required rows="4" value={forms.complaint.description} onChange={(event) => updateForm('description', event.target.value)} />
                </Field>
                <div className="field-grid two">
                  <Field label="Floor">
                    <input type="number" value={forms.complaint.floor} onChange={(event) => updateForm('floor', event.target.value)} />
                  </Field>
                  <Field label="Room">
                    <input value={forms.complaint.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} />
                  </Field>
                </div>
              </>
            )}

            {activeTool === 'resources' && (
              <>
                <Field label="User ID">
                  <input value={forms.resources.userId} onChange={(event) => updateForm('userId', event.target.value)} />
                </Field>
                <div className="field-grid two">
                  <Field label="Branch">
                    <input value={forms.resources.branch} onChange={(event) => updateForm('branch', event.target.value)} />
                  </Field>
                  <Field label="Year">
                    <input value={forms.resources.year} onChange={(event) => updateForm('year', event.target.value)} />
                  </Field>
                  <Field label="Floor">
                    <input type="number" value={forms.resources.floor} onChange={(event) => updateForm('floor', event.target.value)} />
                  </Field>
                  <Field label="Room">
                    <input value={forms.resources.roomNumber} onChange={(event) => updateForm('roomNumber', event.target.value)} />
                  </Field>
                </div>
                <Field label="Interests">
                  <input value={forms.resources.interests} onChange={(event) => updateForm('interests', event.target.value)} />
                </Field>
                <Field label="Limit">
                  <input min="1" max="10" type="number" value={forms.resources.limit} onChange={(event) => updateForm('limit', event.target.value)} />
                </Field>
              </>
            )}

            {activeTool === 'ask' && (
              <>
                <Field label="Question">
                  <textarea required rows="5" value={forms.ask.question} onChange={(event) => updateForm('question', event.target.value)} />
                </Field>
                <Field label="Context chunks">
                  <input min="1" max="8" type="number" value={forms.ask.topK} onChange={(event) => updateForm('topK', event.target.value)} />
                </Field>
              </>
            )}

            {activeTool === 'embedding' && (
              <Field label="Text">
                <textarea required rows="8" value={forms.embedding.text} onChange={(event) => updateForm('text', event.target.value)} />
              </Field>
            )}

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
                <span>{isSubmitting ? 'Running' : 'Run endpoint'}</span>
              </button>
            </div>
          </form>
        </section>

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
      </section>
    </main>
  );
}

