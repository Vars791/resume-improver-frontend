export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center text-white">
      <div className="w-full max-w-xl rounded-2xl bg-white/5 backdrop-blur p-8 shadow-xl space-y-6">
        
        <h1 className="text-3xl font-bold text-center">
          AI Resume Improver
        </h1>

        <p className="text-center text-slate-400 text-sm">
          Upload your resume and job description. We automatically improve it.
        </p>

        <div className="border border-dashed border-white/20 rounded-lg p-6 text-center text-slate-400">
          Resume Upload (PDF / DOCX)
        </div>

        <textarea
          placeholder="Paste job description here..."
          className="w-full h-32 rounded-lg bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          disabled
          className="w-full py-3 rounded-lg bg-indigo-600/50 cursor-not-allowed font-medium"
        >
          Improve Resume
        </button>

      </div>
    </main>
  );
}
