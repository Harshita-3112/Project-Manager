'use client';

import dynamic from 'next/dynamic';

// All app state lives in localStorage and the UI depends on the viewer's clock
// (greeting, due dates), so render on the client only to avoid hydration mismatches.
const App = dynamic(() => import('./App'), { ssr: false });

export default function ClientApp() {
  return <App />;
}
