"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './styles.css';


const supabase = createClient('https://hazcxtdvehxjwqtmjkyg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhemN4dGR2ZWh4andxdG1qa3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODczMzkzMywiZXhwIjoyMDU0MzA5OTMzfQ.TxT7sjHd0JpVjKy9h_O88ew_07hIndNRjmbpbbuZT2k');

export default function Home() {
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState(1);
  const [love1, setLove1] = useState('');
  const [love2, setLove2] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      await supabase.from('matches').insert({ user_id: userId, love1, love2 });
      router.push('/thank-you');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {step === 1 ? (
        <div>
          <Image src="/yuble-logo-01.png" width={400} height={450/2} alt="Yuble Logo" />
          <h2>Өөрийн хувийн дугаарыг оруулна уу?</h2>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button onClick={handleSubmit}>Цааш</button>
        </div>
      ) : (
        <div>
          <h2>Өөрт таалагдсан 2 хүний дугаарыг оруулаарай</h2>
          <input placeholder="Эхний дугаар" value={love1} onChange={(e) => setLove1(e.target.value)} />
          <input placeholder="Хоёр дахь дугаар" value={love2} onChange={(e) => setLove2(e.target.value)} />
          <button onClick={handleSubmit}>Оруулах</button>
        </div>
      )}
    </div>
  );
}

export function AdminPanel() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase.from("matches").select("*");
      if (error) {
        console.error("Error fetching matches:", error);
        return;
      }

      // Create a map of user selections
      let matchesMap = new Map();
      data.forEach(({ user_id, love1, love2 }) => {
        matchesMap.set(user_id, [love1, love2]);
      });

      // Find reciprocal matches
      let matchedPairs = [];
      data.forEach(({ user_id, love1, love2 }) => {
        [love1, love2].forEach((loved) => {
          if (matchesMap.has(loved) && matchesMap.get(loved).includes(user_id)) {
            matchedPairs.push([user_id, loved].sort().join(" - ")); // Ensure A-B and B-A appear only once
          }
        });
      });

      // Remove duplicates (convert to Set)
      setMatches([...new Set(matchedPairs)]);
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Matched Couples</h2>
      {matches.length > 0 ? (
        <ul>
          {matches.map((pair, index) => (
            <li key={index}>{pair}</li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
}
