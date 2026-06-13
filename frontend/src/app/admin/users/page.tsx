"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<User[]>>("/api/admin/users")
      .then((r) => setUsers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#2c2c2c", marginBottom: "24px" }}>
        Người dùng
      </h1>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
        {loading ? (
          <p style={{ color: "#888" }}><i className="fas fa-spinner fa-spin" /> Đang tải...</p>
        ) : users.length === 0 ? (
          <p style={{ color: "#888" }}>Chưa có người dùng nào.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0d5d5" }}>
                  <Th>ID</Th><Th>Tên</Th><Th>Email</Th><Th>Role</Th><Th>Đã xác thực</Th><Th>Ngày tạo</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <Td>{u.id}</Td>
                    <Td><span style={{ fontWeight: 600 }}>{u.name}</span></Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <span style={{
                        background: u.role === "ADMIN" ? "#fdf0f0" : "#f5f5f5",
                        color: u.role === "ADMIN" ? "#d32f2f" : "#555",
                        borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700,
                      }}>
                        {u.role}
                      </span>
                    </Td>
                    <Td>
                      {u.emailVerified
                        ? <i className="fas fa-check-circle" style={{ color: "#2e7d32" }} />
                        : <i className="fas fa-times-circle" style={{ color: "#d32f2f" }} />
                      }
                    </Td>
                    <Td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.78rem", color: "#777", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "10px 12px", color: "#444" }}>{children}</td>;
}
