import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Browse from "./pages/Browse";
import RecordingDetail from "./pages/RecordingDetail";
import Upload from "./pages/Upload";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EldersDirectory from "./pages/EldersDirectory";
import Playlists from "./pages/Playlists";
import AdminDashboard from "./pages/AdminDashboard";
import AccountSettings from "./pages/AccountSettings";
import ReviewTasks from "./pages/ReviewTasks";
import ConsentPanel from "./pages/ConsentPanel";
import Collections from "./pages/Collections";
import Analytics from "./pages/Analytics";
import SystemEvents from "./pages/SystemEvents";
import PlaylistDetail from "./pages/PlaylistDetail";
import TraditionDetail from "./pages/TraditionDetail";
import SearchResults from "./pages/SearchResults";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="" component={Browse} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/upload" component={Upload} />
      <Route path="/elders" component={EldersDirectory} />
      <Route path="/recordings/:id" component={RecordingDetail} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/settings" component={AccountSettings} />
      <Route path="/review-tasks" component={ReviewTasks} />
      <Route path="/consent/:id" component={ConsentPanel} />
      <Route path="/collections" component={Collections} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/system-events" component={SystemEvents} />
      <Route path="/playlists/:id" component={PlaylistDetail} />
      <Route path="/traditions/:id" component={TraditionDetail} />
      <Route path="/search" component={SearchResults} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
