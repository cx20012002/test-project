"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const VisitorMap = dynamic(() => import("./components/VisitorMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-2xl glass-effect flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-white/80">Loading map...</p>
      </div>
    </div>
  ),
});

interface VisitRecord {
  ip: string;
  country: string;
  time: string;
}

export default function Home() {
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<VisitRecord | null>(
    null
  );

  useEffect(() => {
    fetch("/api/visitor-ip")
      .then((res) => res.json())
      .then((data: VisitRecord[]) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatIp = (ip: string) => {
    return ip === "::1" || ip === "127.0.0.1" ? "localhost" : ip;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRecordClick = (record: VisitRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(-45deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
        }}
      />

      {/* Overlay for better contrast */}
      <div className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40" />

      <main className="flex min-h-screen w-full items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-5xl sm:text-6xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f0e7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Visitor Records
            </h1>
            <p className="text-white/80 text-lg">
              Track and visualize your global audience
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-white/90 font-medium">
                Loading visitor data...
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="glass-effect rounded-3xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-xl text-white/90 font-medium">
                No visitor records yet
              </p>
              <p className="text-white/60 mt-2">
                Your visitor data will appear here once someone visits
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Visitor Map Section */}
              <div
                className="animate-slideUp"
                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
              >
                <div className="glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      <span className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                      Visitor Map
                    </h2>
                    {selectedRecord && (
                      <button
                        onClick={() => setSelectedRecord(null)}
                        className="px-4 py-2 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <VisitorMap
                      records={selectedRecord ? [selectedRecord] : records}
                      selectedRecord={selectedRecord}
                    />
                  </div>
                  {selectedRecord && (
                    <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                      <p className="text-white/90 text-sm">
                        <span className="font-semibold">Selected:</span>{" "}
                        {formatIp(selectedRecord.ip)} - {selectedRecord.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Visit Records Table Section */}
              <div
                className="animate-slideUp"
                style={{ animationDelay: "0.2s", animationFillMode: "both" }}
              >
                <div className="glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></span>
                    Visit Records
                  </h2>
                  <div className="overflow-x-auto rounded-2xl">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                            Country
                          </th>
                          <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                            Visit Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record, index) => {
                          const isSelected =
                            selectedRecord?.ip === record.ip &&
                            selectedRecord?.time === record.time;
                          return (
                            <tr
                              key={`${record.ip}-${record.time}-${index}`}
                              onClick={() => handleRecordClick(record)}
                              className={`border-b border-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-[1.01] cursor-pointer ${
                                isSelected
                                  ? "bg-white/20 ring-2 ring-purple-400/50"
                                  : ""
                              }`}
                              style={{
                                animation: "slideUp 0.4s ease-out",
                                animationDelay: `${0.3 + index * 0.05}s`,
                                animationFillMode: "both",
                              }}
                            >
                              <td className="px-4 sm:px-6 py-4 text-sm font-medium text-white/80">
                                <span className="inline-flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isSelected
                                        ? "bg-purple-400 animate-pulse"
                                        : "bg-green-400 animate-pulse-slow"
                                    }`}
                                  ></span>
                                  {formatIp(record.ip)}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-white/80">
                                {record.country}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-white/70">
                                {formatTime(record.time)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
