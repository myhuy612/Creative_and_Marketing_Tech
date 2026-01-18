import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Activity,
  Bookmark,
  Eye,
  Heart,
  Megaphone,
  MessageCircle,
  PieChart,
  Share2,
} from "lucide-react";

const stats = [
  { label: "Total Views", value: "120.5K", icon: Eye, gradient: "from-sky-500 to-blue-400" },
  { label: "Users Reached", value: "85.2K", icon: Megaphone, gradient: "from-indigo-500 to-blue-500" },
  { label: "Likes", value: "15.3K", icon: Heart, gradient: "from-rose-500 to-orange-400" },
  { label: "Comments", value: "3,240", icon: MessageCircle, gradient: "from-blue-500 to-sky-500" },
  { label: "Shares", value: "1,120", icon: Share2, gradient: "from-indigo-500 to-violet-500" },
  { label: "Saves", value: "890", icon: Bookmark, gradient: "from-blue-600 to-indigo-500" },
];

const pieSegments = [
  { label: "Likes", value: 40, color: "#2563eb" },
  { label: "Comments", value: 20, color: "#22c55e" },
  { label: "Shares", value: 15, color: "#f97316" },
  { label: "Saves", value: 25, color: "#7c3aed" },
];

const interactions = [
  { label: "Likes", value: 48, color: "bg-blue-500" },
  { label: "Comments", value: 22, color: "bg-green-500" },
  { label: "Shares", value: 18, color: "bg-orange-400" },
  { label: "Saves", value: 12, color: "bg-purple-500" },
];

function buildPieGradient() {
  let current = 0;
  const segments = pieSegments.map((seg) => {
    const start = current;
    const end = current + seg.value;
    current = end;
    return `${seg.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${segments.join(", ")})`;
}

export default function EngagementPredictionMockPage() {
  const pieGradient = buildPieGradient();

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3] text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="text-center space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              User Engagement Overview
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
              Engagement Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Quick snapshot of how your content is performing this week.
            </p>
          </header>

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/80 backdrop-blur shadow-sm border border-white/40 px-4 py-5 flex items-center gap-4"
              >
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-md`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Pie + legend */}
            <div className="rounded-xl bg-white/85 backdrop-blur border border-white/40 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Engagement Breakdown</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div
                  className="h-48 w-48 rounded-full shadow-inner shadow-slate-100"
                  style={{ backgroundImage: pieGradient }}
                />
                <ul className="space-y-3">
                  {pieSegments.map((seg) => (
                    <li key={seg.label} className="flex items-center gap-3 text-sm text-slate-700">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: seg.color }}
                        aria-hidden
                      />
                      <span className="font-medium">{seg.label}</span>
                      <span className="ml-auto text-slate-500">{seg.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interaction bars */}
            <div className="rounded-xl bg-white/85 backdrop-blur border border-white/40 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Top Interaction Types</h2>
              </div>
              <div className="space-y-3">
                {interactions.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm text-slate-700">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-slate-500">{item.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color} shadow-[0_4px_10px_rgba(59,130,246,0.25)]`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
