interface SettingsViewProps {
  onResetData: () => void;
}

export default function SettingsView({ onResetData }: SettingsViewProps) {
  return (
    <>
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Manage your workspace.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel-row">
          <div>
            <h3>Reset workspace</h3>
            <p className="subtitle">Replace all projects, tasks and notifications with the sample data. This can’t be undone.</p>
          </div>
          <button
            className="btn btn-danger-outline"
            onClick={() => {
              if (confirm('Reset everything to the sample data? Your current projects and tasks will be lost.')) onResetData();
            }}
          >
            Reset data
          </button>
        </div>
      </section>
    </>
  );
}
