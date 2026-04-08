const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`relative border rounded-2xl p-5 transition ${
      address.isDefault
        ? 'border-indigo-400 bg-indigo-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {/* Default badge */}
      {address.isDefault && (
        <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
          Default
        </span>
      )}

      {/* Address details */}
      <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p className="font-semibold text-gray-800">{address.street}</p>
        <p>{address.city === "Other" ? "Custom City":address.city}, {address.state}</p>
        <p>PIN: {address.pin}</p>
        <p>{address.country}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 text-xs font-semibold">
        {!address.isDefault && (
          <button onClick={() => onSetDefault(address._id)}
            className="text-indigo-600 hover:underline">
            Set Default
          </button>
        )}
        <button onClick={() => onEdit(address)}
          className="text-gray-600 hover:underline">
          Edit
        </button>
        <button onClick={() =>{
            if (window.confirm("Are you sure want to delete this address"))
            {
                onDelete(address._id)
            }
        } }
          className="text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;