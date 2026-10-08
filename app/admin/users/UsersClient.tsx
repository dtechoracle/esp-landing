"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminCreateUser, fetchAdminUsers, adminDeleteUser, getToken } from "@/lib/backend-client";
import AdminShell from "../components/AdminShell";

export default function UsersClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [createdUser, setCreatedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const token = getToken();
    if (!token) return;
    setLoadingUsers(true);
    const res = await fetchAdminUsers(token);
    if (res.ok && res.users) {
      setUsers(res.users);
    }
    setSelectedUserIds([]);
    setLoadingUsers(false);
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = getToken();
    if (!token) return;
    
    setIsDeleting(true);
    const res = await adminDeleteUser(token, userId);
    if (res.ok) {
      loadUsers(); // Refresh the list
    } else {
      alert(res.message || "Failed to delete user.");
    }
    setIsDeleting(false);
  }

  async function handleBatchDelete() {
    if (selectedUserIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedUserIds.length} selected user(s)?`)) return;
    const token = getToken();
    if (!token) return;

    setIsDeleting(true);
    let successCount = 0;
    for (const userId of selectedUserIds) {
      const res = await adminDeleteUser(token, userId);
      if (res.ok) successCount++;
    }

    if (successCount < selectedUserIds.length) {
      alert(`Deleted ${successCount} out of ${selectedUserIds.length} users. Some failed.`);
    }
    
    loadUsers();
    setIsDeleting(false);
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedUserIds(users.map(u => u._id || u.id));
    } else {
      setSelectedUserIds([]);
    }
  }

  function toggleSelectUser(userId: string, checked: boolean) {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setStatus("loading");
    setMessage("");
    setCreatedUser(null);

    const res = await adminCreateUser(token, { email, firstName, lastName, password });

    if (res.ok) {
      setStatus("success");
      setMessage("User created successfully.");
      setCreatedUser(res.user);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      loadUsers(); // Refresh the list after creation
    } else {
      setStatus("error");
      setMessage(res.message || "An error occurred.");
    }
  }

  const allSelected = users.length > 0 && selectedUserIds.length === users.length;
  const someSelected = selectedUserIds.length > 0 && !allSelected;

  return (
    <AdminShell>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Create User Section */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>Users</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Create a new regular user account. They will be marked as email verified and can log in immediately.
            </p>
          </div>

          <div
            style={{
              background: "var(--surface-card)",
              padding: 24,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              maxWidth: 600,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Create User</h2>

            {status === "error" && (
              <div
                style={{
                  padding: 12,
                  borderRadius: "var(--radius-md)",
                  background: "var(--error-50)",
                  color: "var(--error-600)",
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                {message}
              </div>
            )}

            {status === "success" && (
              <div
                style={{
                  padding: 12,
                  borderRadius: "var(--radius-md)",
                  background: "var(--success-50)",
                  color: "var(--success-600)",
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                {message}
                {createdUser && (
                  <div style={{ marginTop: 4, fontWeight: 500 }}>
                    Account created for {(createdUser.data || createdUser).firstName || ""} {(createdUser.data || createdUser).lastName || ""} ({(createdUser.data || createdUser).email})
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--line-300)", fontSize: 15, boxSizing: "border-box" }} placeholder="user@example.com" />
              </div>
              <div>
                <label htmlFor="firstName" style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>First name</label>
                <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--line-300)", fontSize: 15, boxSizing: "border-box" }} placeholder="Jane" />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Last name</label>
                <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--line-300)", fontSize: 15, boxSizing: "border-box" }} placeholder="Doe" />
              </div>
              <div>
                <label htmlFor="password" style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--line-300)", fontSize: 15, boxSizing: "border-box" }} placeholder="Secure password" />
              </div>
              <button type="submit" disabled={status === "loading"} style={{ marginTop: 8, height: 46, border: "none", borderRadius: "var(--radius-pill)", background: "var(--accent)", color: "white", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.6 : 1 }}>
                {status === "loading" ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        </div>

        {/* List Users Section */}
        <div
          style={{
            background: "var(--surface-card)",
            padding: 24,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>All Users</h2>
            <div style={{ display: "flex", gap: 12 }}>
              {selectedUserIds.length > 0 && (
                <button 
                  onClick={handleBatchDelete} 
                  disabled={isDeleting}
                  style={{ fontSize: 13, background: "var(--error-50)", color: "var(--error-600)", border: "none", borderRadius: "var(--radius-md)", padding: "6px 12px", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: 500, opacity: isDeleting ? 0.5 : 1 }}
                >
                  {isDeleting ? "Deleting..." : `Delete Selected (${selectedUserIds.length})`}
                </button>
              )}
              <button onClick={loadUsers} style={{ fontSize: 13, background: "none", border: "1px solid var(--line-300)", borderRadius: "var(--radius-md)", padding: "6px 12px", cursor: "pointer" }}>Refresh</button>
            </div>
          </div>

          {loadingUsers ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading users...</p>
          ) : users.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No users found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line-300)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "12px 8px", width: 40 }}>
                      <input 
                        type="checkbox" 
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected; }}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                    <th style={{ padding: "12px 8px", fontWeight: 600 }}>Name</th>
                    <th style={{ padding: "12px 8px", fontWeight: 600 }}>Email</th>
                    <th style={{ padding: "12px 8px", fontWeight: 600 }}>Created</th>
                    <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const id = user._id || user.id;
                    const isSelected = selectedUserIds.includes(id);
                    return (
                      <tr key={id} style={{ borderBottom: "1px solid var(--line-200)", background: isSelected ? "var(--surface-sunken-2)" : "transparent" }}>
                        <td style={{ padding: "12px 8px" }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => toggleSelectUser(id, e.target.checked)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ padding: "12px 8px" }}>{user.firstName} {user.lastName}</td>
                        <td style={{ padding: "12px 8px", color: "var(--text-muted)" }}>{user.email}</td>
                        <td style={{ padding: "12px 8px", color: "var(--text-muted)" }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={isDeleting}
                            style={{
                              background: "var(--error-50)",
                              color: "var(--error-600)",
                              border: "none",
                              borderRadius: "var(--radius-sm)",
                              padding: "6px 10px",
                              cursor: isDeleting ? "not-allowed" : "pointer",
                              fontWeight: 500,
                              fontSize: 13,
                              opacity: isDeleting ? 0.5 : 1
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminShell>
  );
}

