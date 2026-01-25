export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: "bg-gray-200 text-gray-800",
    running: "bg-blue-200 text-blue-800",
    done: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${map[status] ?? "bg-gray-200 text-gray-800"}`}>
      {status}
    </span>
  );
}
