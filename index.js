import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient('https://YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

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
      alert('Data Saved!');
      router.push('/admin');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {step === 1 ? (
        <div>
          <h2>Enter Your Unique ID</h2>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button onClick={handleSubmit}>Next</button>
        </div>
      ) : (
        <div>
          <h2>Enter Two Loved Ones' IDs</h2>
          <input placeholder="First ID" value={love1} onChange={(e) => setLove1(e.target.value)} />
          <input placeholder="Second ID" value={love2} onChange={(e) => setLove2(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}