"use client";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { requestId: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/history/${params.requestId}`).then((r) => r.json()).then(setData);
  }, [params.requestId]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">History Detail</h1>
      <div className="text-sm text-gray-500">requestId: {params.requestId}</div>

      <div className="border rounded p-3">
        <div className="font-medium">Request</div>
        <pre className="text-xs overflow-auto">{JSON.stringify(data?.request, null, 2)}</pre>
      </div>

      <div className="border rounded p-3">
        <div className="font-medium">Result</div>
        <pre className="text-xs overflow-auto">{JSON.stringify(data?.result, null, 2)}</pre>
      </div>
    </div>
  );
}
