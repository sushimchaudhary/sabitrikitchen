"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SearchX,
  User,
  ShieldCheck,
  Mail,
  Download,
  Printer,
  Search,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "@/lib/config/axios.config";
import TableLoadingSkeleton from "@/app/components/tableLoadingSkeleton";


interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
}

const PAGE_SIZE = 15;

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  // Pagination & Selection States
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch Users List
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/users");
      const fetchedData = response.data?.data || response.data;
      if (Array.isArray(fetchedData)) {
        setUsers([...fetchedData].reverse()); // नयाँ युजरहरू माथि देखाउन रिभर्स गरिएको
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Safe Filtering Logic
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "";
    const username = user.username || "";
    const email = user.email || "";

    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesRole = true;
    if (roleFilter === "SuperAdmin") {
      matchesRole = user.is_staff === true;
    } else if (roleFilter === "User") {
      matchesRole = user.is_staff === false;
    }

    return matchesSearch && matchesRole;
  });

  // Reset pagination & selection on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, roleFilter]);

  // Pagination Calc
  const paginatedItems = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete Handler (Single & Bulk)
  const handleConfirmDelete = async () => {
    const idsToDelete = selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
    if (idsToDelete.length === 0) return;

    try {
      setDeleteLoading(true);
      await Promise.all(idsToDelete.map((id) => axiosInstance.delete(`/users/${id}`)));
      toast.success(`${idsToDelete.length} user(s) deleted successfully`);
      fetchUsers();
      setIsModalOpen(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Could not delete user(s). Try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Profile initials helper
  const getInitials = (user: UserData) => {
    if (user.first_name) {
      return user.first_name.slice(0, 2).toUpperCase();
    }
    return user.username ? user.username.slice(0, 2).toUpperCase() : "US";
  };

  // Export PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("User Accounts Report", 14, 15);
    const tableData = paginatedItems.map((item, index) => [
      (currentPage - 1) * PAGE_SIZE + index + 1,
      `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.username,
      item.username,
      item.email,
      item.is_staff ? "SuperAdmin" : "User",
    ]);
    autoTable(doc, {
      head: [["S.N.", "Full Name", "Username", "Email", "Role"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [246, 127, 2] }, // Using #f67f02 theme
    });
    doc.save(`User_Report_Page_${currentPage}.pdf`);
    toast.success("PDF Downloaded");
  };

  // Print function
  const handlePrint = () => {
    const printContent = paginatedItems
      .map(
        (item, index) => `
        <tr>
          <td>${(currentPage - 1) * PAGE_SIZE + index + 1}</td>
          <td>${`${item.first_name || ""} ${item.last_name || ""}`.trim() || "N/A"}</td>
          <td>@${item.username}</td>
          <td>${item.email}</td>
          <td>${item.is_staff ? "SuperAdmin" : "User"}</td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print User List</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 10px; }
              th { background-color: #f8fafc; color: #364a63; }
              h2 { font-family: sans-serif; color: #364a63; text-align: center; }
            </style>
          </head>
          <body>
            <h2>User Management Report</h2>
            <table>
              <thead>
                <tr><th>S.N.</th><th>Full Name</th><th>Username</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>${printContent}</tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen space-y-4 px-4">
      {/* 🧭 Top Bar (Header & Controls integrated cleanly) */}
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-md font-bold text-[#364a63]">User Management</h1>
            <p className="text-[11px] text-[#8094ae]">View and manage registered accounts</p>
          </div>
        </div>

        {/* Search and Filters inside control bar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#f67f02] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex bg-gray-100 p-1 rounded w-full sm:w-auto">
            {["All", "SuperAdmin", "User"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
                  roleFilter === role
                    ? "bg-[#f67f02] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {role === "All" ? "All" : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 Table Main Section */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden ">
        <div className="overflow-x-auto max-h-[460px] scrollbar-hide relative">
          <table className="w-full text-left border-separate border-spacing-0">
            {/* Sticky Header */}
            <thead className="sticky top-0 z-30 shadow-sm">
              <tr className="bg-[#f5f6fa]">
                <th className="px-4 py-2 w-10 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#f67f02] focus:ring-[#f67f02] cursor-pointer shadow-sm"
                    checked={
                      selectedIds.length === paginatedItems.length &&
                      paginatedItems.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider">
                  S.N.
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider">
                  System Role
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider text-right w-28">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableLoadingSkeleton rows={8} cols={6} />
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      {searchQuery ? (
                        <SearchX size={40} className="text-rose-300" />
                      ) : (
                        <Inbox size={40} className="text-gray-200" />
                      )}
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#364a63]">
                          {searchQuery ? "No matching users found" : "No users registered yet"}
                        </p>
                        <p className="text-[11px] text-[#8094ae]">
                          Try adjusting filters or search query.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((user, index) => {
                  const isSelected = selectedIds.includes(user.id);
                  const displayFullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "No Name Provided";
                  
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isSelected ? "bg-orange-50/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-1.5 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#f67f02] focus:ring-[#f67f02] cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                        />
                      </td>

                      {/* S.N. */}
                      <td className="px-6 py-1.5 text-[10px] text-[#526484]">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}.
                      </td>

                      {/* User Avatar + Nickname */}
                      <td className="px-6 py-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center border ${
                            user.is_staff
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-orange-50 text-[#f67f02] border-orange-100"
                          }`}>
                            {getInitials(user)}
                          </div>
                          <div>
                            <span className="text-[11px] text-[#364a63] font-bold block leading-tight">
                              {displayFullName}
                            </span>
                            <span className="text-[10px] text-[#8094ae]">@{user.username}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="px-6 py-1.5">
                        <div className="flex items-center gap-1.5 text-[#526484]">
                          <Mail size={12} className="text-[#8094ae]" />
                          <span className="text-[11px] font-semibold">{user.email}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-1.5">
                        {user.is_staff ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                            <ShieldCheck className="w-3 h-3" />
                            SuperAdmin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">
                            <User className="w-3 h-3" />
                            User
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-1.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => toast.info(`Edit feature coming soon for ${user.username}`)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded active:scale-90 transition-all"
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIds([]);
                              setDeleteId(user.id);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded active:scale-90 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 📊 Footer: Counts, PDF/Print Actions & Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-6 py-1.5 border-t bg-[#f5f6fa]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8094ae] mr-2">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
              </span>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Download size={12} /> PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-white bg-slate-600 border border-slate-700 rounded hover:bg-slate-700 active:scale-95 transition-all"
              >
                <Printer size={12} /> Print
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 disabled:opacity-30 text-gray-600"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] font-bold px-2 text-[#364a63]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 disabled:opacity-30 text-gray-600"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🚨 Bulk Action Footer Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {selectedIds.length} Users Selected
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white rounded text-[11px] font-bold hover:bg-red-600 active:scale-95 transition-all shadow-sm"
          >
            <Trash2 size={12} /> Delete Selected
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {/* <ConfirmModal
        isOpen={isModalOpen}
        title={selectedIds.length > 0 ? `Delete ${selectedIds.length} Users?` : "Remove User Account?"}
        message="This action is permanent and will completely remove selected user account(s) from the system."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteId(null);
        }}
        loading={deleteLoading}
      /> */}
    </div>
  );
}