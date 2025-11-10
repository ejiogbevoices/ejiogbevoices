import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export default function Playlists() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: playlists, isLoading } = trpc.playlists.listMine.useQuery(
    { limit: 20, offset: 0 },
    { enabled: !!user }
  );

  const createMutation = trpc.playlists.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
    },
  });

  const handleCreate = () => {
    if (!user || !title.trim()) return;
    createMutation.mutate({
      title,
      description,
      visibility: "private",
    });
  };

  if (!user) {
    return <div className="p-8 text-center">Please sign in to view playlists</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Playlists</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-accent text-accent-foreground"
          >
            Create Playlist
          </Button>
        </div>

        {showCreateForm && (
          <div className="bg-card p-6 rounded-lg mb-8 border border-border">
            <h2 className="text-2xl font-semibold mb-4">Create New Playlist</h2>
            <input
              type="text"
              placeholder="Playlist Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-border rounded"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-border rounded"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-accent text-accent-foreground"
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center">Loading playlists...</div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist: any) => (
              <div
                key={playlist.id}
                className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {playlist.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {playlist.description || "No description"}
                </p>
                <Button variant="outline" className="w-full">
                  View Playlist
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No playlists yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
