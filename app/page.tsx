"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error(
    "❌ NEXT_PUBLIC_BACKEND_URL is NOT set. Add it in your deployment environment variables."
  );
}

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // ================= SAFE PARALLAX =================
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      if (leftRef.current)
        leftRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translate(${-x}px, ${-y}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ================= SAFE FETCH =================
  async function handleSubmit() {
    if (!resume || !jobDesc) return;
    if (!BACKEND_URL) {
      alert("Backend URL not configured");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDesc);

      const res = await fetch(`${BACKEND_URL}/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("⚠️ Backend unreachable or cold start (wait ~30s)");
    } finally {
      setLoading(false);
    }
  }

  const score =
    result?.score ??
    result?.match_score ??
    result?.resume_score ??
    0;

  return (
    <main className="min-h-screen cosmic-bg flex items-center justify-center px-6 text-white overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl">

        {/* ================= LEFT CARD ================= */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 space-y-6
                     bg-gradient-to-br from-white/10 to-white/5
                     backdrop-blur-2xl border border-white/10 neon-border"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            AI Resume Improver <span className="text-white">Pro</span>
          </h1>

          <input
            type="file"
            accept=".pdf,.docx"
            disabled={loading}
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full text-sm file:bg-indigo-600 file:text-white
                       file:rounded-lg file:px-4 file:py-2 file:border-0"
          />

          <textarea
            disabled={loading}
            className="w-full h-36 rounded-xl bg-black/40
                       border border-white/10 p-4 text-sm resize-none"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste job description here"
          />

          <motion.button
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            animate={
              loading
                ? {}
                : {
                    boxShadow: [
                      "0 0 15px #a855f7",
                      "0 0 30px #ec4899",
                      "0 0 15px #a855f7",
                    ],
                  }
            }
            transition={{ repeat: Infinity, duration: 3 }}
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 neon-button"
          >
            {loading ? "Analyzing Resume..." : "Improve Resume"}
          </motion.button>
        </motion.div>

        {/* ================= RIGHT CARD ================= */}
        <motion.div
          ref={rightRef}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="rounded-3xl p-8 space-y-6
                     bg-gradient-to-br from-white/10 to-white/5
                     backdrop-blur-2xl border border-white/10 neon-border"
        >
          <h2 className="text-xl font-semibold text-cyan-300">
            Resume Analysis
          </h2>

          {!loading && result && (
            <>
              <div className="rounded-xl bg-black/30 p-4 border border-white/10">
                <p className="text-sm font-semibold text-emerald-400 mb-2">
                  Resume Match Score
                </p>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  />
                </div>
              </div>

              {result.ai_analysis?.analysis_text && (
                <div className="rounded-xl bg-black/30 p-4 border border-white/10">
                  <p className="text-sm font-semibold text-emerald-400 mb-2">
                    Hiring Manager Suggestions
                  </p>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {result.ai_analysis.analysis_text}
                  </pre>
                </div>
              )}

              {result.download_id && (
                <a
                  href={`${BACKEND_URL}/download/${result.download_id}`}
                  className="block text-center w-full py-3 rounded-xl
                             bg-emerald-500 font-semibold"
                >
                  Download Improved Resume
                </a>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
