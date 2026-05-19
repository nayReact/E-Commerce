import { useRef, useState } from "react";

const OTPInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp ] = useState(Array(length).fill(''))
    const  inputs = useRef([])

    const handleChange = (index, value) => {
        if(!/^\d*$/.test(value)) return  //accepts nums only

        const newOTP = [...otp]
        newOTP[index] = value.slice(-1) // slice- only for last digit
        setOtp(newOTP)

        //for auto focus
        if(value && index < length-1) {
            inputs.current[index + 1]?.focus()

        }

        //trigger autoComplete when all filled
        const otpString = newOTP.join('')
        if(otpString.length === length) {
            onComplete(otpString)
        }
    }

    const handleKeyDown = (index, e) => {
        if(e.key === 'Backspace' && !otp[index] && index > 0) {     //backspace- go to prev input
            inputs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').slice(0, length)
        if(!/^\d+$/.test(pasted)) return

        const newOTP = [...otp]
        pasted.split('').forEach((char, i) => {
            newOTP[i] = char
        })
        setOtp(newOTP)
        inputs.current[Math.min(pasted.length, length-1)]?.focus()

        if(pasted.length === length ) {
            onComplete(pasted)
        }
    }

    const clear = () => {
        setOtp(Array(length).fill(''))
        inputs.current[0]?.focus()
    }

    return(
        <div>
            <div>
                {otp.map((digit, index) => (
                    <input 
                        key={index}
                        ref={e1 => inputs.current[index] = e1}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className= {`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition ${
                            digit
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 focus:border-indigo-400'
                        }`} />
                ))}
            </div>
        </div>
    )

}

export default OTPInput