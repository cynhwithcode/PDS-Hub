import { useState, useEffect } from "react";
import initialChangelog from "../data/changelog.json";

type LogEntry = {
  id: string;
  target_id: string;
  target_type: string;
  action: string;
  changed_by: string;
  note: string;
  date: string;
};

export default function Changelog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pds_changelog");
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      setLogs(initialChangelog);
      localStorage.setItem("pds_changelog", JSON.stringify(initialChangelog));
    }
  }, []);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pds-changelog-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = Object.keys(logs[0]).join(",");
    const rows = logs.map(log => Object.values(log).map(val => `"${val}"`).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pds-changelog-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Changelog</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleExportJSON}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Export JSON
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-12 pb-4">
          {logs.map(log => (
            <div key={log.id} className="relative pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-gray-900">{log.changed_by}</span>
                  <span className="text-gray-500">{new Date(log.date).toLocaleString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    log.action === 'create' ? 'bg-green-100 text-green-700' :
                    log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                    log.action === 'deprecate' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {log.action}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600 uppercase">
                    {log.target_type}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{log.note}</p>
                <p className="text-xs text-gray-400 mt-1">Target ID: {log.target_id}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 pl-8">No logs available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
