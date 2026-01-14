"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  LogOut,
  User as UserIcon,
  Shield,
  Type,
  AlertCircle
} from "lucide-react";

// Define the Todo Type to match your updated schema
type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "in_progress" | "completed";
  userId: string;
  user?: {
    name: string;
    email: string;
  };
};

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [todos, setTodos] = useState<Todo[]>([]);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const role = (session?.user as any)?.role || "user";

  // Fetching data
  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    }
  }, [router]);

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
    else if (session) fetchTodos();
  }, [session, isPending, router, fetchTodos]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDesc
      }),
    });

    if (res.ok) {
      setNewTitle("");
      setNewDesc("");
      fetchTodos();
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) fetchTodos();
    else alert("Failed to update status");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchTodos();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to delete");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'in_progress': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-3 h-3" />;
      case 'in_progress': return <Circle className="w-3 h-3 animate-pulse" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-rose-500 p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400 rounded-full opacity-20 blur-3xl mix-blend-screen pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl mix-blend-screen pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/20">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-gradient-to-tr from-orange-400 to-rose-500 p-3 rounded-xl shadow-lg">
              <Type className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                TASKFLOW
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">ABAC</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="font-medium">{session?.user?.name}</span>
                </div>
                <div className={`flex items-center gap-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border
                  ${role === 'admin' ? 'bg-rose-500 text-white border-rose-400 shadow-sm' :
                    role === 'manager' ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm' :
                      'bg-emerald-500 text-white border-emerald-400 shadow-sm'}`}>
                  <Shield className="w-2.5 h-2.5" />
                  {role}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/10 hover:border-white/30 backdrop-blur-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Create Form */}
          {role === "user" && (
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2 className="text-lg font-bold text-gray-800 tracking-tight">New Task</h2>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Add some details..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-sm font-black transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        CREATE TASK
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: Todo List */}
          <div className={role === "user" ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Active Tasks</h2>
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold border border-white/10">
                  {todos.length} TOTAL
                </span>
              </div>
            </div>

            {todos.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/20 p-20 text-center flex flex-col items-center gap-4">
                <div className="bg-white/10 p-4 rounded-full">
                  <AlertCircle className="w-10 h-10 text-white/40" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">No tasks found</h3>
                  <p className="text-white/60 text-sm">Get started by creating your first task above.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group bg-white rounded-2xl p-5 shadow-lg border border-transparent hover:border-orange-500/20 hover:shadow-orange-500/5 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">{todo.title}</h3>
                          <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border uppercase font-black tracking-widest
                            ${getStatusColor(todo.status)}`}>
                            {getStatusIcon(todo.status)}
                            {todo.status.replace('_', ' ')}
                          </span>
                        </div>

                        {todo.description && (
                          <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{todo.description}</p>
                        )}

                        {(role === "admin" || role === "manager") && todo.user && (
                          <div className="flex items-center gap-2 pt-2">
                            <div className="bg-indigo-50 p-1.5 rounded-lg">
                              <UserIcon className="w-3 h-3 text-indigo-500" />
                            </div>
                            <span className="text-xs font-bold text-indigo-600/80">
                              {todo.user.name} • {todo.user.email}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        {/* Status Change Select */}
                        {role === "user" && (
                          <div className="relative">
                            <select
                              value={todo.status}
                              onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                              className="appearance-none bg-gray-50 border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-600 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
                            >
                              <option value="draft">Draft</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <Plus className="w-3 h-3 rotate-45" />
                            </div>
                          </div>
                        )}

                        {/* Delete Logic Modal-like buttons */}
                        {role === "admin" && (
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100/50 hover:border-rose-500 shadow-sm"
                            title="Admin Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {role === "user" && todo.status === "draft" && (
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100 hover:border-rose-100 shadow-sm"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}