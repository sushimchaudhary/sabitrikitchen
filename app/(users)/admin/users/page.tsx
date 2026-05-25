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
  X,
  AlertTriangle,
  FileCheck,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "@/lib/config/axios.config";
import TableLoadingSkeleton from "@/app/components/tableLoadingSkeleton";

interface KYCData {
  id: number;
  user: number; // Linked with UserData.id
  full_name: string;
  permanent_address: string;
  current_address: string;
  document: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  admin_remarks: string | null;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  kyc?: KYCData | null; // Nested or merged KYC property
}

const PAGE_SIZE = 15;

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [kycFilter, setKycFilter] = useState("All");

  // Pagination & Selection States
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Update User Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // KYC Management Modal States
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<KYCData | null>(null);
  const [kycRemarks, setKycRemarks] = useState("");
  const [kycSubmitting, setKycSubmitting] = useState(false);

  // Fetch Users and KYC Data
  const fetchUsersAndKyc = async () => {
    try {
      setLoading(true);
      
      // Parallel API calls for optimal performance
      const [usersResponse, kycResponse] = await Promise.all([
        axiosInstance.get("/auth/users"),
        axiosInstance.get("/auth/kyc").catch(() => ({ data: [] })) // Fallback if KYC route errors out
      ]);

      const fetchedUsers = usersResponse.data?.data || usersResponse.data || [];
      const fetchedKycList: KYCData[] = kycResponse.data?.data || kycResponse.data || [];

      if (Array.isArray(fetchedUsers)) {
        // Map KYC details directly inside each user object based on user ID
        const mergedData = fetchedUsers.map((user: UserData) => {
          const matchedKyc = fetchedKycList.find((kyc) => kyc.user === user.id);
          return { ...user, kyc: matchedKyc || null };
        });
        
        setUsers([...mergedData].reverse());
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load users or KYC information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndKyc();
  }, []);

  // Safe Filtering Logic (Search + Role + KYC Status)
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

    let matchesKyc = true;
    const currentKycStatus = user.kyc?.status || "NOT_SUBMITTED";
    if (kycFilter !== "All") {
      matchesKyc = currentKycStatus === kycFilter;
    }

    return matchesSearch && matchesRole && matchesKyc;
  });

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, roleFilter, kycFilter]);

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

  // Delete Handler
  const handleConfirmDelete = async () => {
    const idsToDelete = selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
    if (idsToDelete.length === 0) return;

    try {
      setDeleteLoading(true);
      await Promise.all(idsToDelete.map((id) => axiosInstance.delete(`/auth/users/${id}`)));
      toast.success(`${idsToDelete.length} user(s) deleted successfully`);
      fetchUsersAndKyc();
      setIsDeleteModalOpen(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Could not delete user(s). Try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Update User standard info
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      setUpdateLoading(true);
      await axiosInstance.patch(`/users/${editUser.id}`, {
        is_staff: editUser.is_staff,
        is_active: editUser.is_active,
      });
      toast.success(`User @${editUser.username} updated successfully`);
      fetchUsersAndKyc();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle KYC Actions (Status Change)
  const handleKycStatusUpdate = async (newStatus: "APPROVED" | "REJECTED") => {
    if (!selectedKyc) return;

    try {
      setKycSubmitting(true);
      // KYC update status API endpoint
      await axiosInstance.patch(`/auth/kyc/${selectedKyc.id}`, {
        status: newStatus,
        admin_remarks: kycRemarks || null,
      });
      
      toast.success(`KYC status updated to ${newStatus}`);
      fetchUsersAndKyc();
      setIsKycModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update KYC status");
    } finally {
      setKycSubmitting(false);
    }
  };

  // Profile initials helper
  const getInitials = (user: UserData) => {
    if (user.first_name) return user.first_name.slice(0, 2).toUpperCase();
    return user.username ? user.username.slice(0, 2).toUpperCase() : "US";
  };

  // KYC Badge Generator
  const renderKycBadge = (kyc?: KYCData | null) => {
    if (!kyc) {
      return (
        <span className="inline-flex items-center text-gray-400 bg-gray-50 border border-gray-200 text-[10px] px-2 py-0.5 rounded font-medium">
          Not Submitted
        </span>
      );
    }
    switch (kyc.status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center text-rose-700 bg-rose-50 border border-rose-200 text-[10px] px-2 py-0.5 rounded font-bold">
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center text-amber-700 bg-amber-50 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-bold ">
            Pending Review
          </span>
        );
    }
  };

  // Export PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("User Accounts & KYC Report", 14, 15);
    const tableData = paginatedItems.map((item, index) => [
      (currentPage - 1) * PAGE_SIZE + index + 1,
      `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.username,
      item.username,
      item.email,
      item.is_staff ? "SuperAdmin" : "User",
      item.kyc ? item.kyc.status : "NOT SUBMITTED",
      item.is_active ? "Active" : "Inactive"
    ]);
    autoTable(doc, {
      head: [["S.N.", "Full Name", "Username", "Email", "Role", "KYC", "Status"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [246, 127, 2] },
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
          <td>${`${item.first_name || ""} ${item.last_name || ""}`.trim() || item.username}</td>
          <td>@${item.username}</td>
          <td>${item.email}</td>
          <td>${item.is_staff ? "SuperAdmin" : "User"}</td>
          <td>${item.kyc ? item.kyc.status : "NOT SUBMITTED"}</td>
          <td>${item.is_active ? "Active" : "Inactive"}</td>
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
            <h2>User Management & KYC Report</h2>
            <table>
              <thead>
                <tr><th>S.N.</th><th>Full Name</th><th>Username</th><th>Email</th><th>Role</th><th>KYC Status</th><th>Status</th></tr>
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
    <div className="w-full bg-gray-50 min-h-screen space-y-4 px-4 py-4">
      {/* 🧭 Top Bar */}
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-md font-bold text-[#364a63]">User & KYC Management</h1>
            <p className="text-[11px] text-[#8094ae]">Review registrations, documents, and system flags</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto items-center">
          {/* Global Search */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#f67f02] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Role Filter */}
          <div className="flex bg-gray-100 p-1 rounded w-full sm:w-auto">
            {["All", "SuperAdmin", "User"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all whitespace-nowrap ${
                  roleFilter === role
                    ? "bg-[#f67f02] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* KYC Filter Toggle */}
          <div className="flex bg-gray-100 p-1 rounded w-full sm:w-auto">
            {["All", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setKycFilter(status)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all whitespace-nowrap ${
                  kycFilter === status
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {status === "All" ? "KYC: All" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 Table Main Section */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] scrollbar-hide relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-30 shadow-sm">
              <tr className="bg-[#f5f6fa]">
                <th className="px-4 py-2 w-10 text-center border-b border-gray-200">
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
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  S.N.
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  User Details
                </th>
                <th className="px-6 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  Email Address
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  System Role
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  KYC Verification
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-[#8094ae] uppercase tracking-wider text-right w-36 border-b border-gray-200">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableLoadingSkeleton rows={8} cols={8} />
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      {searchQuery || kycFilter !== "All" ? (
                        <SearchX size={40} className="text-rose-300" />
                      ) : (
                        <Inbox size={40} className="text-gray-200" />
                      )}
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#364a63]">No matching users found</p>
                        <p className="text-[11px] text-[#8094ae]">Try adjusting your queries or custom status filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((user, index) => {
                  const isSelected = selectedIds.includes(user.id);
                  const displayFullName = user.kyc?.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "No Name Provided";
                  
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isSelected ? "bg-orange-50/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#f67f02] focus:ring-[#f67f02] cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                        />
                      </td>

                      {/* S.N. */}
                      <td className="px-4 py-2 text-[10px] text-[#526484]">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}.
                      </td>

                      {/* Avatar + Nickname */}
                      <td className="px-6 py-2">
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

                      {/* Email */}
                      <td className="px-6 py-2">
                        <div className="flex items-center gap-1.5 text-[#526484]">
                          <Mail size={12} className="text-[#8094ae]" />
                          <span className="text-[11px] font-semibold">{user.email}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-2">
                        {user.is_staff ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                            <ShieldCheck className="w-3 h-3" /> SuperAdmin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">
                            <User className="w-3 h-3" /> User
                          </span>
                        )}
                      </td>

                      {/* KYC Verification Badge */}
                      <td className="px-4 py-2">
                        {renderKycBadge(user.kyc)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-2">
                        {user.is_active ? (
                          <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-100 text-[10px] font-medium px-2 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-gray-500 bg-gray-100 border border-gray-200 text-[10px] font-medium px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Premium KYC Verify Button */}
                          {user.kyc && (
                            <button
                              onClick={() => {
                                setSelectedKyc(user.kyc!);
                                setKycRemarks(user.kyc!.admin_remarks || "");
                                setIsKycModalOpen(true);
                              }}
                              className={`p-1.5 rounded active:scale-90 transition-all flex items-center gap-1 text-[10px] font-bold border ${
                                user.kyc.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                              title="Verify KYC Document"
                            >
                              <FileCheck size={12} />
                              <span>Verify</span>
                            </button>
                          )}

                          {/* <button
                            onClick={() => {
                              setEditUser(user);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded active:scale-90 transition-all border border-transparent hover:border-blue-100"
                            title="Edit Account Status"
                          >
                            <Pencil size={12} />
                          </button> */}
                          
                          <button
                            onClick={() => {
                              setSelectedIds([]);
                              setDeleteId(user.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded active:scale-90 transition-all border border-transparent hover:border-red-100"
                            title="Delete User"
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

        {/* 📊 Footer */}
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
        <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {selectedIds.length} Users Selected
          </span>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white rounded text-[11px] font-bold hover:bg-red-600 active:scale-95 transition-all shadow-sm"
          >
            <Trash2 size={12} /> Delete Selected
          </button>
        </div>
      )}

     {/* 📑 PREMIUM KYC VERIFICATION MODAL */}
{isKycModalOpen && selectedKyc && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white w-full max-w-2xl rounded shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150">
      
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#364a63]">KYC Verification Portal</h3>
          <p className="text-[10px] text-gray-400">Review submitted legal documentation and addresses</p>
        </div>
        <button
          onClick={() => setIsKycModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Column: Form Details */}
        <div className="space-y-3.5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name (Legal)</label>
            <p className="text-xs font-bold text-slate-800 bg-gray-50 px-3 py-2 rounded border border-gray-100 mt-1">
              {selectedKyc.full_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Permanent Address</label>
              <p className="text-xs font-medium text-slate-700 bg-gray-50 px-3 py-2 rounded mt-1 border border-gray-100 truncate" title={selectedKyc.permanent_address}>
                {selectedKyc.permanent_address}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Address</label>
              <p className="text-xs font-medium text-slate-700 bg-gray-50 px-3 py-2 rounded mt-1 border border-gray-100 truncate" title={selectedKyc.current_address}>
                {selectedKyc.current_address}
              </p>
            </div>
          </div>

          {/* 📅 Created At र Updated At मितिहरू */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Created Date</label>
              <p className="text-[11px] font-medium text-slate-600 bg-slate-50/50 px-3 py-2 rounded mt-1 border border-gray-100">
                {selectedKyc.created_at ? new Date(selectedKyc.created_at).toLocaleString("en-US", {
                  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                }) : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Updated Date</label>
              <p className="text-[11px] font-medium text-slate-600 bg-slate-50/50 px-3 py-2 rounded mt-1 border border-gray-100">
                {selectedKyc.updated_at ? new Date(selectedKyc.updated_at).toLocaleString("en-US", {
                  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                }) : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Admin Remarks / Reason</label>
            <textarea
              rows={2.5}
              placeholder="Provide context or explanation for approval/rejection notes..."
              value={kycRemarks}
              onChange={(e) => setKycRemarks(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-gray-200 rounded outline-none focus:border-[#f67f02] transition-colors resize-none bg-gray-50/30"
            />
          </div>

          {/* 🔄 Ant Design Inspired Status Dropdown */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500">Select Review Status:</span>
            <select
              value={selectedKyc.status}
              disabled={kycSubmitting}
              // 🛠️ TypeScript Error Fixed here using type assertion (as "APPROVED" | "REJECTED")
              onChange={(e) => handleKycStatusUpdate(e.target.value as "APPROVED" | "REJECTED")}
              className={`text-xs font-bold px-3 py-1.5 rounded border focus:outline-none cursor-pointer transition-all ${
                selectedKyc.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" :
                selectedKyc.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              <option value="PENDING"> PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {/* Right Column: Document Preview */}
        <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Document Attachment</label>
                <div className="relative border border-dashed border-gray-300 rounded bg-gray-50 flex flex-col items-center justify-center overflow-hidden group h-48">
                  {selectedKyc.document ? (
                    <>
                      <img
                        src={selectedKyc.document}
                        alt="KYC Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <a
                        href={selectedKyc.document}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1.5 text-white text-xs font-bold"
                      >
                        <Eye size={14} /> Open Full View
                      </a>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">No document artifact attached</p>
                  )}
                </div>
              </div>
      </div>

      {/* Modal Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsKycModalOpen(false)}
          className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
        >
          Close
        </button>
        
        {/* 🚀 Single Dynamic Action Button based on Dropdown Selection */}
        <button
          type="button"
          disabled={kycSubmitting}
          onClick={() => handleKycStatusUpdate(selectedKyc.status as "APPROVED" | "REJECTED")}
          className={`px-4 py-1.5 rounded text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
            selectedKyc.status === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-700" :
            selectedKyc.status === "REJECTED" ? "bg-rose-600 hover:bg-rose-700" :
            "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {kycSubmitting ? "Processing..." : selectedKyc.status === "PENDING" ? "Save as Pending" : `Confirm ${selectedKyc.status}`}
        </button>
      </div>
    </div>
  </div>
)}

      {/* 🛠️ Edit / Update Account Flags Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded shadow-lg border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gray-50 border-b flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#364a63]">Update User Credentials</h3>
                <p className="text-[10px] text-gray-400">Modify system roles or account active state</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-5 space-y-4">
              <div className="bg-orange-50/40 p-3 rounded border border-orange-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-[#f67f02] font-bold text-xs flex items-center justify-center border border-orange-200">
                  {getInitials(editUser)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700">
                    {editUser.kyc?.full_name || `${editUser.first_name || ""} ${editUser.last_name || ""}`.trim() || editUser.username}
                  </h4>
                  <p className="text-[10px] text-gray-400">@{editUser.username} • {editUser.email}</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Assign Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUser({ ...editUser, is_staff: false })}
                    className={`p-2.5 rounded border text-xs font-semibold text-center flex items-center justify-center gap-2 transition-all ${
                      !editUser.is_staff 
                        ? "border-[#f67f02] bg-orange-50/20 text-[#f67f02] font-bold" 
                        : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <User size={14} /> Regular User
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUser({ ...editUser, is_staff: true })}
                    className={`p-2.5 rounded border text-xs font-semibold text-center flex items-center justify-center gap-2 transition-all ${
                      editUser.is_staff 
                        ? "border-red-500 bg-red-50/20 text-red-600 font-bold" 
                        : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <ShieldCheck size={14} /> SuperAdmin
                  </button>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Account Status</label>
                  <p className="text-[10px] text-gray-400">Toggle block or permit access</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditUser({ ...editUser, is_active: !editUser.is_active })}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                    editUser.is_active 
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {editUser.is_active ? "Active (Allowed)" : "Inactive (Blocked)"}
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-1.5 bg-[#f67f02] text-white rounded text-xs font-bold hover:bg-orange-600 disabled:opacity-50 min-w-[90px]"
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚨 Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded shadow-lg border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Are you absolutely sure?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedIds.length > 0 
                    ? `This action will permanently delete ${selectedIds.length} selected user accounts.` 
                    : "This action will permanently delete this user account. This cannot be undone."}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                  }}
                  className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 w-full"
                >
                  No, Keep
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-1.5 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 disabled:opacity-50 w-full"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}