import { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserStatus } from '../../api/adminAPI';
import toast from 'react-hot-toast';

const roleColors = {
  admin:    'bg-purple-100 text-purple-700',
  seller:   'bg-blue-100 text-blue-700',
  customer: 'bg-gray-100 text-gray-600',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = users;
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    if (search.trim()) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, roleFilter, users]);

  const load = async () => {
    try {
      const { data } = await fetchAllUsers();
      setUsers(data.users || []);
      setFiltered(data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (user) => {
    setUpdating(user._id);
    try {
      const { data } = await updateUserStatus(user._id, {
        isApproved: !user.isApproved
      });
      setUsers(prev => prev.map(u => u._id === user._id ? data.user : u));
      toast.success(`Seller ${!user.isApproved ? 'approved' : 'unapproved'}`);
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleActive = async (user) => {
    setUpdating(user._id);
    try {
      const { data } = await updateUserStatus(user._id, {
        isActive: !user.isActive
      });
      setUsers(prev => prev.map(u => u._id === user._id ? data.user : u));
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <p className="text-gray-500 mt-1">{filtered.length} users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <select value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['customer', 'seller', 'admin'].map(role => (
            <div key={role} className="bg-white rounded-xl shadow p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.role === role).length}
              </p>
              <p className="text-sm text-gray-500 capitalize">{role}s</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
            <div className="col-span-1">Avatar</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          <div className="divide-y">
            {filtered.map(user => (
              <div key={user._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">

                {/* Avatar */}
                <div className="col-span-1">
                  <img src={user.avatar} alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border" />
                </div>

                {/* Name */}
                <div className="col-span-3">
                  <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.phone}</p>
                </div>

                {/* Email */}
                <div className="col-span-3">
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Role */}
                <div className="col-span-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 space-y-1">
                  <span className={`block text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.role === 'seller' && (
                    <span className={`block text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                      user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex flex-col gap-1">
                  {/* Approve/Unapprove for sellers */}
                  {user.role === 'seller' && (
                    <button
                      onClick={() => handleToggleApproval(user)}
                      disabled={updating === user._id}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition disabled:opacity-50 ${
                        user.isApproved
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {updating === user._id ? '...'
                        : user.isApproved ? 'Unapprove' : 'Approve'}
                    </button>
                  )}

                  {/* Activate/Deactivate */}
                  <button
                    onClick={() => handleToggleActive(user)}
                    disabled={updating === user._id}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition disabled:opacity-50 ${
                      user.isActive
                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {updating === user._id ? '...'
                      : user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p className="text-4xl mb-2">👥</p>
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;