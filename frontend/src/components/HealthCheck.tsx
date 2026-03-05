import { useEffect, useState } from "react";

export default function HealthCheck() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health/")
      .then((res) => {
        if (!res.ok) throw new Error("Health check failed");
        return res.json();
      })
      .then((data) => setOnline(data?.status === "ok"))
      .catch(() => setOnline(false));
  }, []);

  if (online === null) return <p>Checking system...</p>;

  const style: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    backgroundColor: online ? "green" : "red",
    fontWeight: "bold"
  };

  return (
    <div>
      <span style={style}>
        {online ? "System Online" : "Offline"}
      </span>
    </div>
  );
}