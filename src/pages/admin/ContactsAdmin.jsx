import { useEffect, useState } from "react";
import { Trash2, Mail, Phone } from "lucide-react";
import { apiGet, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

export default function ContactsAdmin() {
  const { show } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      setLoading(true);
      const res = await apiGet("/api/contact?limit=100");
      setContacts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load contacts.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/contact/${confirmTarget}`);
      show("Enquiry deleted.", "success");
      setConfirmTarget(null);
      fetchContacts();
    } catch (err) {
      show(err.message || "Failed to delete enquiry.", "error");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "email",
      label: "Contact",
      render: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs">
            <Mail className="w-3 h-3 text-gray-400" /> {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Phone className="w-3 h-3 text-gray-400" /> {row.phone}
            </div>
          )}
        </div>
      ),
    },
    { key: "country", label: "Country", render: (row) => row.country || "—" },
    {
      key: "message",
      label: "Message",
      render: (row) => <p className="max-w-sm line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{row.message}</p>,
    },
    {
      key: "createdAt",
      label: "Received",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {contacts.length} contact inquir{contacts.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        loading={loading}
        emptyMessage="No contact form submissions yet."
        renderActions={(row) => (
          <button
            onClick={() => setConfirmTarget(row._id || row.id)}
            className="p-1.5 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this enquiry?"
        message="This will permanently remove the submission."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
