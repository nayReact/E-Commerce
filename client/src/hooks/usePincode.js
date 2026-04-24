import { useState, useCallback } from "react";

const usePincode = (onAutoFill) => {
    const [pinStatus, setPinStatus] = useState('idle')  //idle | loading | valid | invalid

    const validatePin = useCallback(async(pin) => {
        if(!/^[1-9][0-9]{5}$/.test(pin)) {
            setPinStatus('Invalid')
            return false
        }

        setPinStatus('loading')
        try{
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
            const data = await res.json()

            if(data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0]
                setPinStatus('valid')

                if(onAutoFill) {
                    onAutoFill({
                        city: postOffice.District,
                        state: postOffice.State
                    })
                }
                return true
            } else {
                setPinStatus('Invalid')
                return false
            }
        } catch(error) {
            setPinStatus('valid')
            return true
        }
    }, [onAutoFill])

    const resetPin = useCallback(() => {
        setPinStatus('idle')
    }, [])
    
    return {pinStatus, validatePin, resetPin }

}

export default usePincode