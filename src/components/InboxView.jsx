const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString();
};

export default function InboxView({ inbox, onMarkRead, onMarkAllRead, onClear }) {
  const unread = inbox.filter((n) => !n.read).length;

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Inbox</h1>
          <p className="subtitle">{unread} unread notification{unread === 1 ? '' : 's'}</p>
        </div>
        <div className="header-actions">
          <button className="btn" disabled={unread === 0} onClick={onMarkAllRead}>Mark all as read</button>
          <button className="btn" disabled={inbox.length === 0} onClick={onClear}>Clear</button>
        </div>
      </header>

      {inbox.length === 0 ? (
        <p className="hint">You're all caught up! Activity on your tasks will show up here.</p>
      ) : (
        <ul className="inbox">
          {inbox.map((n) => (
            <li key={n.id} className={`inbox-item ${n.read ? '' : 'unread'}`} onClick={() => onMarkRead(n.id)}>
              <span className="unread-dot" />
              <span className="inbox-text">{n.text}</span>
              <span className="inbox-time">{timeAgo(n.time)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
