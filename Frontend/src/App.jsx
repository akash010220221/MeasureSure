import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ShieldCheck, Scale, FileText, Search } from "lucide-react";
import VerificationForm from "./pages/VerificationForm";
import TrackStatus from "./pages/TrackStatus";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-blue-900 p-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Scale size={30} />
          <h1 className="text-xl font-bold">
            Online Verification System
          </h1>
        </div>
      </nav>

      <main
        className="mx-auto flex min-h-[80vh] max-w-5xl
                    flex-col items-center justify-center
                    px-6 text-center"
      >
        <ShieldCheck size={65} className="mb-6 text-blue-700" />

        <h2 className="mb-4 text-4xl font-bold text-slate-800">
          Weighing &amp; Measuring Instrument Verification
        </h2>

        <p className="mb-8 max-w-2xl text-lg text-slate-600">
          A digital platform for instrument registration,
          verification applications, inspections,
          and certificate management.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/submit"
            className="flex items-center gap-2 rounded-lg bg-blue-800
                       px-7 py-3 text-white hover:bg-blue-700"
          >
            <FileText size={18} />
            Submit Verification
          </Link>

          <Link
            to="/track"
            className="flex items-center gap-2 rounded-lg border border-blue-800
                       px-7 py-3 text-blue-800 hover:bg-blue-50"
          >
            <Search size={18} />
            Track Status
          </Link>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<VerificationForm />} />
        <Route path="/track" element={<TrackStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
