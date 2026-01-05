'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [ip, setIp] = useState<string>('');

  useEffect(() => {
    fetch('/api/visitor-ip')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp('error'));
  }, []);

  const displayIp = ip === '::1' || ip === '127.0.0.1' ? 'localhost' : ip;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">
          Visitor IP Address
        </h1>
        <ul className="list-disc">
          <li className="text-lg text-zinc-600 dark:text-zinc-400">
            {displayIp || 'Loading...'}
          </li>
        </ul>
      </main>
    </div>
  );
}
