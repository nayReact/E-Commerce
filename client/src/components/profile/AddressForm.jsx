import { useState } from 'react';
import toast from 'react-hot-toast';
import locationData from '../../data/indiaStateCities.json'

const initialState = {
  street: '', city: '', state: '', pin: '', country: 'India', isDefault: false
};

const AddressForm = ({ existing, onSave, onClose }) => {
  const [formData, setFormData] = useState(existing || initialState);
  const [saving, setSaving] = useState(false);

  // ✅ Get states dynamically
  const indianStates = locationData.map(item => item.state);

  // ✅ Get cities based on selected state
  const selectedStateData = locationData.find(
    item => item.state === formData.state
  );
  const cities = selectedStateData ? selectedStateData.cities : [];

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'state' && { city: '' }) // reset city if state changes
    }));
  };

  // ✅ Validate PIN
  const validatePin = (pin) => /^[1-9][0-9]{5}$/.test(pin);

  // ✅ PIN → auto-fill API
  const fetchLocationFromPin = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setFormData(prev => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State
        }));

        toast.success("City & State auto-filled");
      } else {
        toast.error("Invalid PIN code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch location");
    }
  };

  // ✅ Handle PIN change with auto-fetch
  const handlePinChange = (e) => {
    const pin = e.target.value;

    handleChange(e);

    if (/^[1-9][0-9]{5}$/.test(pin)) {
      fetchLocationFromPin(pin);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { street, city, state, pin } = formData;

    if (!street.trim()) { toast.error('Street is required'); return; }
    if (!city.trim()) { toast.error('City is required'); return; }
    if (!state) { toast.error('State is required'); return; }
    if (!validatePin(pin)) { toast.error('Enter a valid 6-digit Indian PIN code'); return; }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          {existing ? 'Edit Address' : 'Add New Address'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123, MG Road, Apartment 4B"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">

            {/* ✅ City Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* ✅ State Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select State</option>
                {indianStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          {/* PIN + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handlePinChange}
                placeholder="560001"
                maxLength={6}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {formData.pin && !validatePin(formData.pin) && (
                <p className="text-xs text-red-500 mt-1">
                  Invalid Indian PIN code
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                disabled
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-400"
              />
            </div>
          </div>

          {/* Default */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm text-gray-700 font-medium">
              Set as default address
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : existing ? 'Save Changes' : 'Add Address'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddressForm;