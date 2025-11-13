import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const [uiLocale, setUiLocale] = useState("en");
  const [theme, setTheme] = useState("light");

  if (!user) {
    return <div className="p-8 text-center">Please sign in</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Account Settings</h1>

        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <p className="text-foreground">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
              <p className="text-foreground">{user.name || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">UI Language</label>
              <select
                value={uiLocale}
                onChange={(e) => setUiLocale(e.target.value)}
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              >
                <option value="en">English</option>
                <option value="yo">Yorùbá</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-accent text-accent-foreground">Save Changes</Button>
          <Button
            onClick={() => logout()}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
