import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Trash2, Eye, Download, Mail, Phone, MapPin, Search } from "lucide-react";
import { apiGet, apiPatch, apiDelete, apiOpenFile } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const STATUS_OPTIONS = ["pending", "reviewed", "shortlisted", "rejected"];
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  shortlisted: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function ApplicationsAdmin() {
  const { show } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobFilter = searchParams.get("job") || "";

  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobFilter, statusFilter]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (jobFilter) params.set("job", jobFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await apiGet(`/api/applications?${params.toString()}`);
      setApplications(Array.isArray(res?.data) ? res.data : []);
      setStatusCounts(res?.statusCounts || {});
    } catch (err) {
      show(err.message || "Failed to load applications.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchApplications();
  }

  async function handleStatusChange(id, status) {
    try {
      await apiPatch(`/api/applications/${id}/status`, { status });
      show("Status updated.", "success");
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      if (detail && detail._id === id) setDetail((d) => ({ ...d, status }));
    } catch (err) {
      show(err.message || "Failed to update status.", "error");
    }
  }

  async function handleViewResume(app, download) {
    try {
      await apiOpenFile(`/api/applications/${app._id}/resume${download ? "?download=true" : ""}`, {
        filename: app.resumeFilename,
        download,
      });
    } catch (err) {
      show(err.message || "Failed to open resume.", "error");
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/applications/${confirmTarget}`);
      show("Application deleted.", "success");
      setConfirmTarget(null);
      setDetail(null);
      fetchApplications();
    } catch (err) {
      show(err.message || "Failed to delete application.", "error");
    }
  }

  const columns = [
    {
      key: "fullName",
      label: "Applicant",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">{row.fullName}</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <Mail className="w-3 h-3" /> {row.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Phone className="w-3 h-3" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: "jobTitleSnapshot",
      label: "Applied For",
      render: (row) => (
        <div>
          <div className="text-gray-800 dark:text-gray-100">{row.jobTitleSnapshot}</div>
          {row.preferredCountry && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <MapPin className="w-3 h-3" /> {row.preferredCountry}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize border-0 cursor-pointer ${STATUS_STYLES[row.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "Applied",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"),
    },
    {
      key: "resume",
      label: "Resume",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewResume(row, false)}
            title="View resume"
            className="p-1.5 text-gray-400 hover:text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewResume(row, true)}
            title="Download resume"
            className="p-1.5 text-gray-400 hover:text-blue-600"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            {applications.length} application{applications.length === 1 ? "" : "s"}
          </p>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
              className={`text-[11px] font-medium capitalize rounded-full px-2.5 py-1 border transition-colors ${
                statusFilter === s ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400"
              }`}
            >
              {s} {statusCounts[s] ? `(${statusCounts[s]})` : ""}
            </button>
          ))}
          {jobFilter && (
            <button
              onClick={() => setSearchParams({})}
              className="text-[11px] font-medium rounded-full px-2.5 py-1 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-400 hover:text-red-500"
            >
              Clear job filter ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, job…"
            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] dark:text-gray-100 focus:outline-none focus:border-blue-500 w-64"
          />
        </form>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        emptyMessage="No applications received yet."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => setDetail(row)} className="p-1.5 text-gray-400 hover:text-blue-600" title="View details">
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmTarget(row._id)}
              className="p-1.5 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <Modal open={!!detail} title="Application Details" onClose={() => setDetail(null)} maxWidth="max-w-xl">
        {detail && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{detail.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Applied for {detail.jobTitleSnapshot}</div>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Email</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.email}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Phone</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.phone}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Current Location</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.currentLocation || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Preferred Country</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.preferredCountry || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Skill Level</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.skillLevel || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Experience</div>
                <div className="text-gray-800 dark:text-gray-100">{detail.experience || "—"}</div>
              </div>
            </div>

            {detail.notes && (
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1">Notes</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{detail.notes}</p>
              </div>
            )}

            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Resume</div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{detail.resumeFilename}</span>
                <button
                  onClick={() => handleViewResume(detail, false)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => handleViewResume(detail, true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(detail._id, s)}
                    className={`text-xs font-medium capitalize rounded-full px-3 py-1.5 border transition-colors ${
                      detail.status === s ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this application?"
        message="This will permanently remove the application and its uploaded resume."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
