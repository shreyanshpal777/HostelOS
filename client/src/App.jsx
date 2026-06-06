import { BookOpen, MessageSquareText, Sparkles, UsersRound } from 'lucide-react';

const modules = [
  {
    title: 'Smart Users',
    description: 'Manage residents by room, floor, branch, leadership role, and WhatsApp status.',
    icon: UsersRound
  },
  {
    title: 'WhatsApp Automation',
    description: 'Birthday wishes, individual broadcasts, task reminders, and bot replies.',
    icon: MessageSquareText
  },
  {
    title: 'Education Hub',
    description: 'Centralized resources with room, floor, branch, and interest targeting.',
    icon: BookOpen
  },
  {
    title: 'AI Operations',
    description: 'Task tagging, complaint trends, RAG answers, and resource recommendations.',
    icon: Sparkles
  }
];

export function App() {
  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="masthead">
          <p>Hostel Group Management AI</p>
          <h1>Operations dashboard foundation is ready.</h1>
        </div>

        <div className="module-grid">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <article className="module-card" key={module.title}>
                <Icon size={24} aria-hidden="true" />
                <h2>{module.title}</h2>
                <p>{module.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
