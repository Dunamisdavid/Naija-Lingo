"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Check, Plus, Pencil, Trash2, X, Save } from "lucide-react";

const CATEGORIES = ["Proverbs", "Names", "Food", "Greetings", "Festivals", "Family", "History", "Stories"];
const LANG_OPTIONS = [
  { value: "yo", label: "Yorùbá" },
  { value: "ig", label: "Igbo" },
  { value: "ha", label: "Hausa" },
];
const PAGE_SIZE = 20;

function confirmDelete(label) {
  return window.confirm(`Delete "${label}"? This cannot be undone.`);
}

// Debounces a fast-changing value (like search text) so we don't fire
// a network request on every single keystroke — only after typing pauses.
function useDebounced(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function FilterBar({ search, setSearch, lang, setLang, status, setStatus, category, setCategory }) {
  return (
    <div className="flex flex-wrap gap-2 items-center border p-3 rounded bg-gray-50">
      <input
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded flex-1 min-w-[140px]"
      />
      <select value={lang} onChange={(e) => setLang(e.target.value)} className="border p-2 rounded">
        <option value="all">All languages</option>
        {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>
      {category !== undefined && (
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
        <option value="all">All statuses</option>
        <option value="draft">Draft only</option>
        <option value="published">Published only</option>
      </select>
    </div>
  );
}

// ---------- CULTURE TAB ----------

function CultureRow({ entry, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(entry);

  const save = async () => {
    await fetch("/api/admin/culture", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, ...form }),
    });
    setEditing(false);
    onChanged();
  };

  const togglePublish = async () => {
    await fetch("/api/admin/culture", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, published: !entry.published }),
    });
    onChanged();
  };

  const remove = async () => {
    if (!confirmDelete(entry.title)) return;
    await fetch(`/api/admin/culture?id=${entry.id}`, { method: "DELETE" });
    onChanged();
  };

  if (editing) {
    return (
      <div className="col-span-2 border p-3 rounded space-y-2 bg-yellow-50">
        <div className="flex gap-2">
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="border p-2 rounded">
            {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 rounded w-full" placeholder="Title" />
        <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="border p-2 rounded w-full" placeholder="Body" />
        <input value={form.phrase || ""} onChange={(e) => setForm({ ...form, phrase: e.target.value })} className="border p-2 rounded w-full" placeholder="Phrase (optional)" />
        <div className="flex gap-2">
          <button onClick={save} className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded text-sm">
            <Save size={14} /> Save
          </button>
          <button onClick={() => { setForm(entry); setEditing(false); }} className="flex items-center gap-1 border px-3 py-1.5 rounded text-sm">
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border p-3 rounded flex flex-col justify-between gap-2">
      <div>
        <p className="font-medium text-sm">
          {entry.title}
        </p>
        <p className="text-xs text-gray-500 mb-1">
          {entry.language} · {entry.category} · {entry.published ? "Published" : "Draft"}
        </p>
        {entry.phrase && <p className="italic text-sm">"{entry.phrase}"</p>}
        <p className="text-sm text-gray-600 line-clamp-2">{entry.body}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        <button onClick={togglePublish} className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-white ${entry.published ? "bg-gray-500" : "bg-green-700"}`}>
          <Check size={12} /> {entry.published ? "Unpublish" : "Publish"}
        </button>
        <button onClick={() => setEditing(true)} className="flex items-center gap-1 border px-2 py-1 rounded text-xs">
          <Pencil size={12} /> Edit
        </button>
        <button onClick={remove} className="flex items-center gap-1 text-red-700 border border-red-200 px-2 py-1 rounded text-xs">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

function CultureManager() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({ language: "yo", category: "Proverbs", title: "", body: "", phrase: "" });

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const [langFilter, setLangFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("draft");

  const load = async (pageNum = page) => {
    const params = new URLSearchParams({
      search, language: langFilter, category: categoryFilter, status: statusFilter,
      skip: String(pageNum * PAGE_SIZE), take: String(PAGE_SIZE),
    });
    const res = await fetch(`/api/admin/culture?${params}`);
    const data = await res.json();
    setEntries(data.entries);
    setTotal(data.total);
  };

  // Reset to page 0 whenever a filter changes, then load
  useEffect(() => {
    setPage(0);
    load(0);
  }, [search, langFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    load(page);
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/culture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...form, title: "", body: "", phrase: "" });
    load(page);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
        <h2 className="font-semibold">Add Culture Entry</h2>
        <div className="flex gap-2">
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="border p-2 rounded">
            {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 rounded w-full" required />
        <textarea placeholder="Body / explanation" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Phrase (optional, native language text)" value={form.phrase} onChange={(e) => setForm({ ...form, phrase: e.target.value })} className="border p-2 rounded w-full" />
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded">
          <Plus size={14} /> Add as draft
        </button>
      </form>

      <FilterBar
        search={searchInput} setSearch={setSearchInput}
        lang={langFilter} setLang={setLangFilter}
        category={categoryFilter} setCategory={setCategoryFilter}
        status={statusFilter} setStatus={setStatusFilter}
      />

      <p className="text-sm text-gray-500">{total} result{total !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-2 gap-3">
        {entries.map((e) => <CultureRow key={e.id} entry={e} onChanged={() => load(page)} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="border px-3 py-1.5 rounded text-sm disabled:opacity-40">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="border px-3 py-1.5 rounded text-sm disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- LESSONS TAB ----------

function LessonRow({ lesson, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...lesson, optionsText: lesson.options.join(", ") });

  const save = async () => {
    const options = form.optionsText.split(",").map((s) => s.trim()).filter(Boolean);
    await fetch("/api/admin/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lesson.id,
        language: form.language,
        sceneLabel: form.sceneLabel,
        context: form.context,
        phrase: form.phrase,
        question: form.question,
        options,
        correctIndex: form.correctIndex,
        order: form.order,
      }),
    });
    setEditing(false);
    onChanged();
  };

  const togglePublish = async () => {
    await fetch("/api/admin/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lesson.id, published: !lesson.published }),
    });
    onChanged();
  };

  const remove = async () => {
    if (!confirmDelete(lesson.sceneLabel)) return;
    await fetch(`/api/admin/lessons?id=${lesson.id}`, { method: "DELETE" });
    onChanged();
  };

  if (editing) {
    return (
      <div className="col-span-2 border p-3 rounded space-y-2 bg-yellow-50">
        <div className="flex gap-2">
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="border p-2 rounded">
            {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="border p-2 rounded w-20" placeholder="Order" />
        </div>
        <input value={form.sceneLabel} onChange={(e) => setForm({ ...form, sceneLabel: e.target.value })} className="border p-2 rounded w-full" placeholder="Scene label" />
        <textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} className="border p-2 rounded w-full" placeholder="Context" />
        <input value={form.phrase} onChange={(e) => setForm({ ...form, phrase: e.target.value })} className="border p-2 rounded w-full" placeholder="Phrase (native language)" />
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="border p-2 rounded w-full" placeholder="Question" />
        <input value={form.optionsText} onChange={(e) => setForm({ ...form, optionsText: e.target.value })} className="border p-2 rounded w-full" placeholder="Options, comma separated" />
        <input type="number" value={form.correctIndex} onChange={(e) => setForm({ ...form, correctIndex: e.target.value })} className="border p-2 rounded w-32" placeholder="Correct index (0-based)" />
        <div className="flex gap-2">
          <button onClick={save} className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded text-sm">
            <Save size={14} /> Save
          </button>
          <button onClick={() => { setForm({ ...lesson, optionsText: lesson.options.join(", ") }); setEditing(false); }} className="flex items-center gap-1 border px-3 py-1.5 rounded text-sm">
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border p-3 rounded flex flex-col justify-between gap-2">
      <div>
        <p className="font-medium text-sm">{lesson.sceneLabel}</p>
        <p className="text-xs text-gray-500 mb-1">
          {lesson.language} · order {lesson.order} · {lesson.published ? "Published" : "Draft"}
        </p>
        <p className="italic text-sm">"{lesson.phrase}"</p>
        <p className="text-sm text-gray-600 line-clamp-2">{lesson.context}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        <button onClick={togglePublish} className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-white ${lesson.published ? "bg-gray-500" : "bg-green-700"}`}>
          <Check size={12} /> {lesson.published ? "Unpublish" : "Publish"}
        </button>
        <button onClick={() => setEditing(true)} className="flex items-center gap-1 border px-2 py-1 rounded text-xs">
          <Pencil size={12} /> Edit
        </button>
        <button onClick={remove} className="flex items-center gap-1 text-red-700 border border-red-200 px-2 py-1 rounded text-xs">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

function LessonManager() {
  const [lessons, setLessons] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({
    language: "yo", sceneLabel: "", context: "", phrase: "", question: "", optionsText: "", correctIndex: "0", order: "0",
  });

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const [langFilter, setLangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("draft");

  const load = async (pageNum = page) => {
    const params = new URLSearchParams({
      search, language: langFilter, status: statusFilter,
      skip: String(pageNum * PAGE_SIZE), take: String(PAGE_SIZE),
    });
    const res = await fetch(`/api/admin/lessons?${params}`);
    const data = await res.json();
    setLessons(data.lessons);
    setTotal(data.total);
  };

  useEffect(() => {
    setPage(0);
    load(0);
  }, [search, langFilter, statusFilter]);

  useEffect(() => {
    load(page);
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = form.optionsText.split(",").map((s) => s.trim()).filter(Boolean);
    await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, options }),
    });
    setForm({ ...form, sceneLabel: "", context: "", phrase: "", question: "", optionsText: "" });
    load(page);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
        <h2 className="font-semibold">Add Lesson</h2>
        <div className="flex gap-2">
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="border p-2 rounded">
            {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="border p-2 rounded w-24" />
        </div>
        <input placeholder="Scene label (e.g. Greetings · Scene 1)" value={form.sceneLabel} onChange={(e) => setForm({ ...form, sceneLabel: e.target.value })} className="border p-2 rounded w-full" required />
        <textarea placeholder="Context (the scenario setup)" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Phrase (native language text)" value={form.phrase} onChange={(e) => setForm({ ...form, phrase: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Question (e.g. What does she mean?)" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Options, comma separated" value={form.optionsText} onChange={(e) => setForm({ ...form, optionsText: e.target.value })} className="border p-2 rounded w-full" required />
        <input type="number" placeholder="Correct option index (0-based)" value={form.correctIndex} onChange={(e) => setForm({ ...form, correctIndex: e.target.value })} className="border p-2 rounded w-full" required />
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded">
          <Plus size={14} /> Add as draft
        </button>
      </form>

      <FilterBar
        search={searchInput} setSearch={setSearchInput}
        lang={langFilter} setLang={setLangFilter}
        status={statusFilter} setStatus={setStatusFilter}
      />

      <p className="text-sm text-gray-500">{total} result{total !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-2 gap-3">
        {lessons.map((l) => <LessonRow key={l.id} lesson={l} onChanged={() => load(page)} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="border px-3 py-1.5 rounded text-sm disabled:opacity-40">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="border px-3 py-1.5 rounded text-sm disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- USERS TAB ----------

function formatDate(dateStr) {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function UserRow({ user }) {
  return (
    <div className="border p-3 rounded flex items-center gap-3">
      {user.image ? (
        <img src={user.image} alt="" className="w-10 h-10 rounded-full shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{user.name || "Unnamed"}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
        <p className="text-xs text-gray-500">
          Joined {formatDate(user.createdAt)} · Last active {formatDate(user.lastActive)}
        </p>
      </div>
      <div className="flex gap-4 text-center shrink-0">
        <div>
          <p className="text-sm font-semibold">{user.totalCompleted}</p>
          <p className="text-[10px] text-gray-500 uppercase">Lessons</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{user.streak}</p>
          <p className="text-[10px] text-gray-500 uppercase">Streak</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{user.avgScore !== null ? `${user.avgScore}%` : "—"}</p>
          <p className="text-[10px] text-gray-500 uppercase">Avg score</p>
        </div>
        <div className="text-left">
          <p className="text-[10px] text-gray-500">
            🟢 {user.byLanguage.yo} · 🟠 {user.byLanguage.ig} · 🔵 {user.byLanguage.ha}
          </p>
          <p className="text-[9px] text-gray-400">Yo · Ig · Ha</p>
        </div>
      </div>
    </div>
  );
}

function UsersManager() {
  const [users, setUsers] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("lastActive");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(setUsers)
      .catch(() => setLoadError("Could not load users — check the server console for details."));
  }, []);

  if (loadError) return <p className="text-sm text-red-600">{loadError}</p>;
  if (!users) return <p className="text-sm text-gray-500">Loading…</p>;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "lastActive") return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
    if (sortBy === "totalCompleted") return b.totalCompleted - a.totalCompleted;
    if (sortBy === "streak") return b.streak - a.streak;
    if (sortBy === "joined") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center border p-3 rounded bg-gray-50">
        <input
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[140px]"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="lastActive">Sort: Last active</option>
          <option value="totalCompleted">Sort: Most lessons</option>
          <option value="streak">Sort: Longest streak</option>
          <option value="joined">Sort: Newest members</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">{sorted.length} user{sorted.length !== 1 ? "s" : ""}</p>

      <div className="space-y-2">
        {sorted.map((u) => <UserRow key={u.id} user={u} />)}
      </div>
    </div>
  );
}

// ---------- PAGE ----------

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("culture");

  if (status === "loading") return <p className="p-8">Loading…</p>;
  if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <p className="p-8">Not authorized.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Content Admin</h1>

      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setTab("culture")} className={`px-3 py-1.5 rounded text-sm ${tab === "culture" ? "bg-black text-white" : "border"}`}>
          Culture
        </button>
        <button onClick={() => setTab("lessons")} className={`px-3 py-1.5 rounded text-sm ${tab === "lessons" ? "bg-black text-white" : "border"}`}>
          Lessons
        </button>
        <button onClick={() => setTab("users")} className={`px-3 py-1.5 rounded text-sm ${tab === "users" ? "bg-black text-white" : "border"}`}>
          Users
        </button>
      </div>

      {tab === "culture" && <CultureManager />}
      {tab === "lessons" && <LessonManager />}
      {tab === "users" && <UsersManager />}
    </div>
  );
}