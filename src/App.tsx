import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="flex h-screen">
        <Dashboard />
        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-12">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
