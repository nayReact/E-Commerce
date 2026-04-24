import { useRef, useEffect } from "react";
import usePincode from '../../hooks/usePincode'

const PincodeInput = ({ value, onChange, onAutoFill, className= ''}) => {
    const { pinStatus, validatePin, resetPin } = usePincode(onAutoFill)
    const debounceRef = useRef(null)

    useEffect(() => {
        if(value.length === 6){
            clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                validatePin(value)
            }, 500)
        } else if(value.length>0) {
            resetPin()
        }
        return () => clearTimeout(debounceRef.current)
    }, [value])

    const statusIcon = () => {
        if(pinStatus === 'loading') return (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"/>
            </span>
        )
        if(pinStatus === 'valid') return (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✓</span>
        )
        if(pinStatus === 'invalid') return (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">✗</span>
        )
        return null
    }

    const borderColor = () => {
        if(pinStatus === 'valid') return 'border-green-400 focus:ring-green-400'
        if(pinStatus === 'invalid') return 'border-green-400 focus:ring-red-400'
        return 'border-gray-400 focus:ring-indigo-400'
    }

    return (
        <div className="relative">
            <input type="text" value={value} onChange={onChange}
                placeholder="e.g. 781001" maxLength={6} 
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none pr-10 ${borderColor()} ${className}`}/>
                {statusIcon()}

                {/**status message */}
                {pinStatus === 'invalid' && value.length === 6 && (
                    <p className="text-xs text-red-500 mt-1">
                        Invalid Indian PIN code
                    </p>
                )}
                {pinStatus === 'valid' && (
                    <p className="text-xs text-green-500 mt-1">
                        Valid PIN code 
                    </p>
                )}
                {pinStatus === 'loading' && (
                    <p className="text-xs text-gray-500 mt-1">
                        Verifying PIN code...
                    </p>
                )}
        </div>
    )
}
export default PincodeInput