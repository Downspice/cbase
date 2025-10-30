import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] 
        focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all
        ${props.className ?? ""}`}
      />
    </div>
  );
};


{/* <InputField
  label="Phone Number"
  type="tel"
  placeholder="+1 (555) 000-0000"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

<InputField
  label="Email"
  type="email"
  placeholder="example@email.com"
/>

<InputField
  label="Username"
  type="text"
  placeholder="Your username"
/> */}