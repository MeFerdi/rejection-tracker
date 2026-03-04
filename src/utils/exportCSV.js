const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

export const exportToCSV = (applications) => {
  const headers = [
    "#", "Company", "Role", "Location",
    "Salary Range", "Status", "Date Applied", "Notes",
  ];

  const rows = applications.map((a, i) => [
    i + 1,
    escape(a.company),
    escape(a.role),
    escape(a.location),
    escape(a.salary),
    escape(a.status),
    escape(a.date),
    escape(a.notes),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `1000-challenge-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
