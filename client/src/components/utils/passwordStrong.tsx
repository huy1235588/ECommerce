import { Check, X } from "lucide-react";

interface PasswordCriteriaProps {
    password: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({
    password
}) => {
    const criteria = [
        { label: "Password must be 7-255 characters", met: password.length >= 7 && password.length <= 255 },
        { label: "Use at least 1 letter", met: /[A-Za-z]/.test(password) },
        { label: "Use at least 1 number", met: /\d/.test(password) },
        { label: "Not use spaces", met: !/\s/.test(password) },
    ];

    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.met ? (
                        <Check className='size-4 text-green-500 mr-2' />
                    ) : (
                        <X className='size-4 text-gray-500 mr-2' />
                    )}
                    <span className={item.met ? "text-green-500" : "text-gray-400"}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
    password
}) => {
    const getStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    const getColor = (strength: number) => {
        if (strength === 0) return "bg-red-500";
        if (strength === 1) return "bg-red-400";
        if (strength === 2) return "bg-yellow-500";
        if (strength === 3) return "bg-yellow-400";
        return "bg-green-500";
    };

    const getStrengthText = (strength: number) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <div className='w-full'>
            {/* <div className='flex justify-between items-center mb-1'>
                <span className='text-xs text-gray-400'>Password strength</span>
                <span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
            </div> */}

            {/* <div className='flex space-x-1'>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
                    />
                ))}
            </div> */}
            <PasswordCriteria password={password} />
        </div>
    );
};
export default PasswordStrengthMeter;