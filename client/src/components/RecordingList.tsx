import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { RecordingCard } from "./RecordingCard";
import { Loader2, AlertCircle } from "lucide-react";

interface RecordingListProps {
  traditionId?: string;
  elderId?: string;
  searchQuery?: string;
}

export function RecordingList({
  traditionId,
  elderId,
  searchQuery,
}: RecordingListProps) {
  const [page, setPage] = useState(0);
  const limit = 12;
  const offset = page * limit;

  // Determine which query to use
  let query;
  if (searchQuery) {
    query = trpc.recordings.search.useQuery({
      query: searchQuery,
      limit,
      offset,
    });
  } else if (traditionId) {
    query = trpc.recordings.getByTradition.useQuery({
      tradition_id: traditionId,
      limit,
      offset,
    });
  } else if (elderId) {
    query = trpc.recordings.getByElder.useQuery({
      elder_id: elderId,
      limit,
      offset,
    });
  } else {
    query = trpc.recordings.getPublic.useQuery({
      limit,
      offset,
    });
  }

  const { data: recordings, isLoading, error } = query;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error loading recordings</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!recordings || recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No recordings found</p>
        <p className="text-sm text-muted-foreground mt-2">
          {searchQuery
            ? "Try a different search term"
            : "Check back later for new content"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid of recordings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings.map((recording) => (
          <RecordingCard key={recording.id} recording={recording} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <span className="text-sm text-muted-foreground">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={!recordings || recordings.length < limit}
          className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
