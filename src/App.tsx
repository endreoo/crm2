import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/components/Dashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Dashboard />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
