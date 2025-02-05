"use client";

import { useRouter } from "next/navigation";
import "../styles.css"; // Import the CSS file

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="container">
      <h2>🎉 Баярлалаа! 🎉</h2>
      <p>Тун удахгүй match болсон хосуудыг мэдэгдэх болно..</p>
    </div>
  );
}
