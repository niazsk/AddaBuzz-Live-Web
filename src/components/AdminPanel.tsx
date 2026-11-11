import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ShieldCheck, Users, Radio, Trash2, RefreshCw } from 'lucide-react';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const u = await getDocs(collection(firebaseDb, 'profiles'));
      setUsers(u.docs.map((d) => ({ id: d.id, ...d.data() })));
      const r = await getDocs(collection(firebaseDb, 'live_rooms'));
      setRooms(r.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id: string) => {
    await deleteDoc(doc(firebaseDb, 'profiles', id));
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const deleteRoom = async (id: string) => {
    await deleteDoc(doc(firebaseDb, 'live_rooms', id));
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07070D] p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="px-3 py-2 rounded-lg bg-slate-800 text-white text-sm flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm cursor-pointer">Close</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#0c091b] border border-purple-900/30 p-4">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Users ({users.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
                  <div>
                    <div className="text-sm font-semibold text-white">{u.name || u.username || u.id}</div>
                    <div className="text-xs text-slate-400">{u.id}</div>
                  </div>
                  <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {users.length === 0 && <p className="text-slate-500 text-sm">No users.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0c091b] border border-purple-900/30 p-4">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" /> Live Rooms ({rooms.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rooms.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
                  <div>
                    <div className="text-sm font-semibold text-white">{r.title || r.id}</div>
                    <div className="text-xs text-slate-400">{r.id}</div>
                  </div>
                  <button onClick={() => deleteRoom(r.id)} className="p-2 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {rooms.length === 0 && <p className="text-slate-500 text-sm">No rooms.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
