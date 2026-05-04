import { useState } from "react";
import { changePassword } from "../../api/userAPI";
import toast from 'react-hot-toast'

const PasswordStrength = ({ password }) => {
    const checks = [
        { label: '8+ characters', pass: password.length >= 8 },
        { label: '1 uppercase letter', pass: /[A-Z]/.test(password) },
        { label: '1 number', pass: /\d/.test(password) },
    ]
const strength = checks.filter(c => c.pass).length

const strengthColor = strength === 0 ? 'bg-grey-400'
    : strength === 1 ? 'bg-red-400'
    : strength === 2 ? 'bg-yellow-400'
    : 'bg-green-500'

    const strengthLabel = strength === 0 ? ''
        : strength === 1 ? 'Weak'
        : strength === 2 ? 'Medium'
        : 'Strong'

    return (
        <div className="mt-2">
            {/* to show strength bar */}
            <div className="flex gap-1 mb-1">
                {[1,2,3].map( i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= strength ? strengthColor : 'bg-gray-200'
                    }`} />
                ))}
            </div>
            {strengthLabel && (
                <p className={`text-xs font-medium ${
                    strength === 1 ? 'text-red-500'
                    : strength === 2 ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>{strengthLabel}</p>
            )}

            {/* checks */}
            <div className="mt-2 space-y-1">
                {checks.map(check => (
                    <p key={check.label} className={`text-xs flex items-center gap-1.5 ${
                        check.pass ? 'text-green-600' : 'text-gray-400'
                    }`}>
                        <span>{check.pass ? '✓' : '○'}</span>
                        {check.label}
                    </p>
                ))}
            </div>
        </div>
    )   
}

const PasswordInput = ({ name, label, showKey, formData, onChange, showPasswords, toggleShow }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
            {label}
        </label>
        <div className="relative">
            <input
                type={showPasswords[showKey] ? 'text' : 'password'}
                name={name}
                value={formData[name]}
                onChange={onChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-12"
            />
            <button
                type="button"
                onClick={() => toggleShow(showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
                {showPasswords[showKey] ? '🙈' : '👁️'}
            </button>
        </div>
    </div>
)

const ChangePasswordForm = () => {
    const [formData, setFormData ] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [ showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const toggleShow = (field) => {
        setShowPasswords(prev => ({...prev, [field]: !prev[field] }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Form submitted')
        console.log('Form data:', formData)

        if(formData.newPassword !== formData.confirmPassword) {
            toast.error('New password do not match')
            return
        }
        setSaving(true)
        try {
            console.log('Making API call...') 
            await changePassword(formData)
            toast.success('Password changed successfully')
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }) 
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to change Password')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
                name="currentPassword"
                label="Current Password"
                showKey="current"
                formData={formData}
                onChange={handleChange}
                showPasswords={showPasswords}
                toggleShow={toggleShow}
            />
            <div>
                <PasswordInput
                    name="newPassword"
                    label="New Password"
                    showKey="new"
                    formData={formData}
                    onChange={handleChange}
                    showPasswords={showPasswords}
                    toggleShow={toggleShow}
                />
                {formData.newPassword && (
                    <PasswordStrength password={formData.newPassword} />
                )}
            </div>
            <div>
                <PasswordInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    showKey="confirm"
                    formData={formData}
                    onChange={handleChange}
                    showPasswords={showPasswords}
                    toggleShow={toggleShow}
                />
                {formData.confirmPassword && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                        formData.newPassword === formData.confirmPassword
                            ? 'text-green-600' : 'text-red-500'
                    }`}>
                        {formData.newPassword === formData.confirmPassword
                            ? '✓ Passwords match'
                            : '✗ Passwords do not match'
                        }
                    </p>
                )}
            </div>
            <button type="submit" disabled={saving}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                {saving ? 'Changing Password...' : 'Change Password'}
            </button>
        </form>
    )
}

export default ChangePasswordForm