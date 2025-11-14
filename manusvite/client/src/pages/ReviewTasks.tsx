import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

export default function ReviewTasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const tasksQuery = trpc.reviewTasks.list.useQuery({
    status: filter === "all" ? undefined : filter,
    limit: 50,
    offset: 0,
  });

  const { data: tasks, isLoading, error } = tasksQuery;

  const approveMutation = trpc.reviewTasks.approve.useMutation({
    onSuccess: () => tasksQuery.refetch(),
  });

  const rejectMutation = trpc.reviewTasks.reject.useMutation({
    onSuccess: () => tasksQuery.refetch(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading review tasks</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <h1 className="font-playfair text-4xl font-bold mb-4">Review Tasks</h1>
          <p className="text-indigo-100 text-lg">
            Manage transcription, translation, and consent approvals
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                filter === status
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No review tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-playfair font-bold text-lg">
                          {task.task_type === "transcription_qc"
                            ? "Transcription Review"
                            : task.task_type === "translation_qc"
                            ? "Translation Review"
                            : "Consent Sign-off"}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : task.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        Recording: {task.target_id}
                      </p>

                      {task.notes && (
                        <div className="bg-muted p-3 rounded-lg text-sm mb-3">
                          <p className="text-foreground">{task.notes}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>

                    {task.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            approveMutation.mutate({
                              task_id: task.id,
                              approved: true,
                            })
                          }
                          disabled={approveMutation.isPending}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {approveMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() =>
                            rejectMutation.mutate({
                              task_id: task.id,
                              approved: false,
                            })
                          }
                          disabled={rejectMutation.isPending}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {rejectMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
