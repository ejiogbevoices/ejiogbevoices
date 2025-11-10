import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <div className="p-8 text-center text-red-600">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Recordings</h3>
            <p className="text-3xl font-bold text-foreground">--</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-accent">--</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-foreground">--</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">System Status</h2>
          <p className="text-muted-foreground">Dashboard metrics loading...</p>
        </Card>
      </div>
    </div>
  );
}
