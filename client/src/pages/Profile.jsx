import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getProfile, updateProfile,
  addAddress, updateAddress,
  deleteAddress, setDefaultAddress
} from '../api/userAPI';
import AddressCard from '../components/profile/AddressCard';
import AddressForm from '../components/profile/AddressForm';
import toast from 'react-hot-toast';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', avatar: ''
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data.user);
      setProfileForm({
        name: data.user.name || '',
        phone: data.user.phone || '',
        avatar: data.user.avatar || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!/^[0-9]{10}$/.test(profileForm.phone)) {
      toast.error('Phone must be 10 digits');
      return;
    }
    setSaving(true);
    try {
      const { data } = await updateProfile(profileForm);
      setProfile(data.user);
      setEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (formData) => {
    try {
      const { data } = await addAddress(formData);
      setProfile(prev => ({ ...prev, addresses: data.addresses }));
      setShowAddressForm(false);
      toast.success('Address added');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add address');
    }
  };

  const handleEditAddress = async (formData) => {
    try {
      const { data } = await updateAddress(editingAddress._id, formData);
      setProfile(prev => ({ ...prev, addresses: data.addresses }));
      setEditingAddress(null);
      toast.success('Address updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const { data } = await deleteAddress(id);
      setProfile(prev => ({ ...prev, addresses: data.addresses }));
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data } = await setDefaultAddress(id);
      setProfile(prev => ({ ...prev, addresses: data.addresses }));
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to set default address');
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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Left: Avatar + Info ── */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 text-center">
              <img src={profile?.avatar || null} alt={profile?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 mx-auto mb-4" />

              <h2 className="font-bold text-gray-800 text-lg">
                  {profile?.name}
              </h2>
              <p className="text-gray-500 text-sm">
                  {profile?.email}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                profile?.role === 'admin' ? 'bg-purple-100 text-purple-700'
                : profile?.role === 'seller' ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
              }`}>
                {profile?.role}
              </span>
              <p className="text-xs text-gray-400 mt-3">
                Joined {new Date(profile?.createdAt).toLocaleDateString('en-IN', {
                  month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* ── Right: Edit Form + Addresses ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)}
                    className="text-sm text-indigo-600 hover:underline font-medium">
                    Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input type="text" value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <input type="tel" value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      maxLength={10}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Avatar URL</label>
                    <input type="text" value={profileForm.avatar}
                      onChange={e => setProfileForm(p => ({ ...p, avatar: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setEditingProfile(false)}
                      className="flex-1 border border-gray-300 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-800">{profile?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{profile?.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-800">{profile?.phone}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-800 capitalize">{profile?.role}</span>
                  </div>
                </div>
              )}
            </div>
            <ChangePasswordForm />

            {/* Addresses */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">
                  Saved Addresses
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({profile?.addresses?.length || 0})
                  </span>
                </h2>
                <button onClick={() => setShowAddressForm(true)}
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition">
                  + Add Address
                </button>             
              </div>
              
              {profile?.addresses?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="text-sm">No saved addresses yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile?.addresses?.map(addr => (
                    <AddressCard
                      key={addr._id}
                      address={addr}
                      onEdit={(addr) => setEditingAddress(addr)}
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                    />
                  ))}
                </div>               
              )}
            </div>
            
          </div>          
        </div> 
      </div>
      
      

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          onSave={handleAddAddress}
          onClose={() => setShowAddressForm(false)}
        />
      )}
      {editingAddress && (
        <AddressForm
          existing={editingAddress}
          onSave={handleEditAddress}
          onClose={() => setEditingAddress(null)}
        />
      )}
    </div>
  );
};

export default Profile;