const FAQS = [
  {
    q: 'How do I create a project?',
    a: 'Go to Projects and click “New project”. Give it a name, an optional description and a color.',
  },
  {
    q: 'How do I add a task?',
    a: 'Click “New task” at the top of Home or a project, or “Add task” at the bottom of any column.',
  },
  {
    q: 'How do I change a task’s status?',
    a: 'Drag the card to another column, or open the task and pick a new status.',
  },
  {
    q: 'What shows up in the Inbox?',
    a: 'Every time a task or project is created, updated, moved or deleted you get a notification there.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In your browser’s local storage. It stays on this device and browser only.',
  },
];

export default function HelpView() {
  return (
    <>
      <header className="page-header">
        <div>
          <h1>Help Center</h1>
          <p className="subtitle">Answers to common questions about TaskFlow.</p>
        </div>
      </header>

      <section className="panel">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="faq">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
