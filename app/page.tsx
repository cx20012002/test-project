'use client';

import { useEffect, useState } from 'react';

interface VisitRecord {
  ip: string;
  country: string;
  time: string;
}

export default function Home() {
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/visitor-ip')
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
    return ip === '::1' || ip === '127.0.0.1' ? 'localhost' : ip;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">
          Visitor Records
        </h1>
        {loading ? (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">No records yet</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-300 dark:border-zinc-700">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-zinc-50">
                    IP
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-zinc-50">
                    Country
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-zinc-50">
                    Visit Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr
                    key={`${record.ip}-${record.time}-${index}`}
                    className="border-b border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatIp(record.ip)}
                    </td>
                    <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {record.country}
                    </td>
                    <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatTime(record.time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
