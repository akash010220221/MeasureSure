import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  inspection_scheduled: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function TrackStatus() {
  const [requestId, setRequestId] = useState("");
  const [result, setResult] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  // Load all verification requests on mount
  useEffect(() => {
    api
      .get("verification-requests/")
      .then(({ data }) => setAllRequests(data))
      .catch(() => {})
      .finally(() => setListLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!requestId.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.get(`verification-requests/${requestId}/`);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "No verification request found with that ID."
          : "Error fetching request. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-blue-900 p-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90">
            <ArrowLeft size={20} />
            <h1 className="text-xl font-bold">Track Verification Status</h1>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* Search by ID */}
        <form
          onSubmit={handleSearch}
          className="mb-8 flex gap-3 rounded-xl bg-white p-6 shadow"
        >
          <div className="flex-1">
            <input
              type="number"
              min="1"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Enter Request ID (e.g. 1)"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                         text-slate-800 placeholder:text-slate-400
                         focus:border-blue-500 focus:outline-none focus:ring-2
                         focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-800 px-5
                       text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Search
          </button>
        </form>

        {error && (
          <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Single result */}
        {result && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Request VR-{result.id}
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="font-medium text-slate-500">Instrument</dt>
              <dd>{result.instrument_detail?.name}</dd>
              <dt className="font-medium text-slate-500">Serial Number</dt>
              <dd>{result.instrument_detail?.serial_number}</dd>
              <dt className="font-medium text-slate-500">Applicant</dt>
              <dd>{result.applicant_name}</dd>
              <dt className="font-medium text-slate-500">Status</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[result.status] || ""}`}
                >
                  {result.status?.replace(/_/g, " ").toUpperCase()}
                </span>
              </dd>
              {result.remarks && (
                <>
                  <dt className="font-medium text-slate-500">Remarks</dt>
                  <dd>{result.remarks}</dd>
                </>
              )}
              <dt className="font-medium text-slate-500">Submitted</dt>
              <dd>{new Date(result.created_at).toLocaleString()}</dd>
            </dl>
          </div>
        )}

        {/* All requests table */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            All Verification Requests
          </h3>
          {listLoading ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading…
            </div>
          ) : allRequests.length === 0 ? (
            <p className="text-sm text-slate-400">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-slate-400">
                    <th className="pb-2 pr-4">ID</th>
                    <th className="pb-2 pr-4">Instrument</th>
                    <th className="pb-2 pr-4">Applicant</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">VR-{r.id}</td>
                      <td className="py-2 pr-4">
                        {r.instrument_detail?.name}
                      </td>
                      <td className="py-2 pr-4">{r.applicant_name}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[r.status] || ""}`}
                        >
                          {r.status?.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 text-slate-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
