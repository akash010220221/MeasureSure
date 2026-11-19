import { useState } from "react";
import api from "../api";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  inspection_scheduled: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function VerificationForm() {
  const [form, setForm] = useState({
    instrument_name: "",
    serial_number: "",
    manufacturer: "",
    applicant_name: "",
    applicant_email: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("submit-verification/", form);
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Network error – is the Django server running?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-blue-900 p-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90">
            <ArrowLeft size={20} />
            <h1 className="text-xl font-bold">Submit Verification Request</h1>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* ── Success result ── */}
        {result && (
          <div className="mb-8 rounded-xl border border-green-200 bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-2 text-green-700">
              <CheckCircle size={24} />
              <h3 className="text-lg font-semibold">Request Submitted!</h3>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="font-medium text-slate-500">Request ID</dt>
              <dd className="text-slate-800">VR-{result.id}</dd>

              <dt className="font-medium text-slate-500">Instrument</dt>
              <dd className="text-slate-800">
                {result.instrument_detail?.name}
              </dd>

              <dt className="font-medium text-slate-500">Serial Number</dt>
              <dd className="text-slate-800">
                {result.instrument_detail?.serial_number}
              </dd>

              <dt className="font-medium text-slate-500">Applicant</dt>
              <dd className="text-slate-800">{result.applicant_name}</dd>

              <dt className="font-medium text-slate-500">Status</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[result.status] || ""}`}
                >
                  {result.status?.replace("_", " ").toUpperCase()}
                </span>
              </dd>

              <dt className="font-medium text-slate-500">Created</dt>
              <dd className="text-slate-800">
                {new Date(result.created_at).toLocaleString()}
              </dd>
            </dl>

            <button
              onClick={() => {
                setResult(null);
                setForm({
                  instrument_name: "",
                  serial_number: "",
                  manufacturer: "",
                  applicant_name: "",
                  applicant_email: "",
                });
              }}
              className="mt-6 rounded-lg bg-blue-800 px-5 py-2 text-sm text-white
                         hover:bg-blue-700"
            >
              Submit Another
            </button>
          </div>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Form ── */}
        {!result && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl bg-white p-8 shadow"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              Verification Request
            </h2>
            <p className="text-sm text-slate-500">
              Fill in your instrument details and applicant information.
            </p>

            {/* Instrument section */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Instrument Details
              </legend>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Instrument Name <span className="text-red-500">*</span>
                </span>
                <input
                  name="instrument_name"
                  value={form.instrument_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Electronic Weighing Scale"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                             text-slate-800 placeholder:text-slate-400
                             focus:border-blue-500 focus:outline-none focus:ring-2
                             focus:ring-blue-500/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Serial Number <span className="text-red-500">*</span>
                </span>
                <input
                  name="serial_number"
                  value={form.serial_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SN-2024-00123"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                             text-slate-800 placeholder:text-slate-400
                             focus:border-blue-500 focus:outline-none focus:ring-2
                             focus:ring-blue-500/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Manufacturer
                </span>
                <input
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Mettler Toledo"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                             text-slate-800 placeholder:text-slate-400
                             focus:border-blue-500 focus:outline-none focus:ring-2
                             focus:ring-blue-500/20"
                />
              </label>
            </fieldset>

            {/* Applicant section */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Applicant Information
              </legend>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Your Name <span className="text-red-500">*</span>
                </span>
                <input
                  name="applicant_name"
                  value={form.applicant_name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                             text-slate-800 placeholder:text-slate-400
                             focus:border-blue-500 focus:outline-none focus:ring-2
                             focus:ring-blue-500/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </span>
                <input
                  name="applicant_email"
                  type="email"
                  value={form.applicant_email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                             text-slate-800 placeholder:text-slate-400
                             focus:border-blue-500 focus:outline-none focus:ring-2
                             focus:ring-blue-500/20"
                />
              </label>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg
                         bg-blue-800 px-6 py-3 font-medium text-white
                         hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Submitting…" : "Submit Verification Request"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
