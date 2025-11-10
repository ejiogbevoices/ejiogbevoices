import { useState } from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";

export function UserMenu() {
  const [, setLocation] = useLocation();
  const { user, signOut, isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setLocation("/signin")}
          className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => setLocation("/signup")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {user.name || user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setLocation("/account");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              <User className="w-4 h-4" />
              Account Settings
            </button>

            <button
              onClick={() => {
                setLocation("/preferences");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </button>

            <div className="border-t border-border my-1" />

            <button
              onClick={async () => {
                await signOut();
                setLocation("/");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
