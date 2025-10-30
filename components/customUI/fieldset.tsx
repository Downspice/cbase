'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

interface FieldsetProps {
  legend: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled' | 'gradient';
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function Fieldset({
  legend,
  children,
  className,
  variant = 'default',
  collapsible = false,
  defaultOpen = true,
}: FieldsetProps) {
  const [isOpen, setIsOpen] =useState(defaultOpen);

  const variantStyles = {
    default: {
      container: 'bg-[#fefdfb] border-[#dddad0]',
      legend: 'bg-[#f7f5f0] text-[#3a3947]',
      legendAccent: 'bg-[#f4d03f]',
    },
    outlined: {
      container: 'bg-transparent border-[#f4d03f] border-2',
      legend: 'bg-[#f7f5f0] text-[#3a3947]',
      legendAccent: 'bg-[#f4d03f]',
    },
    filled: {
      container: 'bg-[#f7f5f0] border-[#dddad0]',
      legend: 'bg-gradient-to-r from-[#f4d03f] to-[#ffa726] text-[#3a3947]',
      legendAccent: 'bg-[#3a3947]',
    },
    gradient: {
      container: 'bg-gradient-to-br from-[#fefdfb] to-[#f7f5f0] border-[#f4d03f]',
      legend: 'bg-[#3a3947] text-[#fefdfb]',
      legendAccent: 'bg-[#f4d03f]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-xl w-full border p-6 transition-all duration-300',
        styles.container,
        className
      )}
    >
      {/* Legend */}
      <motion.legend
        className={cn(
          'relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm',
          styles.legend,
          collapsible && 'cursor-pointer select-none hover:shadow-md',
          'transition-all duration-200'
        )}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        whileHover={collapsible ? { scale: 1.02 } : {}}
        whileTap={collapsible ? { scale: 0.98 } : {}}
      >
        {/* Accent bar */}
        <div
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 rounded-full',
            styles.legendAccent
          )}
        />
        
        <span>{legend}</span>
        
        {collapsible && (
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        )}
      </motion.legend>

      {/* Content */}
      {collapsible ? (
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">{children}</div>
        </motion.div>
      ) : (
        <div className="pt-4 space-y-4">{children}</div>
      )}
    </motion.fieldset>
  );
}

// Example usage component
export function FieldsetDemo() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] p-8 space-y-6">
      <h1 className="text-3xl font-bold text-[#3a3947] mb-8">Fieldset Variants</h1>

      {/* Default Variant */}
      <Fieldset legend="Personal Information" variant="default">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </Fieldset>

      {/* Outlined Variant */}
      <Fieldset legend="Contact Details" variant="outlined">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </Fieldset>

      {/* Filled Variant */}
      <Fieldset legend="Address Information" variant="filled">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              Street Address
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
                State
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all"
                placeholder="12345"
              />
            </div>
          </div>
        </div>
      </Fieldset>

      {/* Gradient Variant */}
      <Fieldset legend="Preferences" variant="gradient">
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-[#dddad0] text-[#f4d03f] focus:ring-[#f4d03f]/20"
            />
            <span className="text-sm text-[#3a3947]">
              Send me promotional emails
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-[#dddad0] text-[#f4d03f] focus:ring-[#f4d03f]/20"
            />
            <span className="text-sm text-[#3a3947]">
              Subscribe to newsletter
            </span>
          </label>
        </div>
      </Fieldset>

      {/* Collapsible Fieldset */}
      <Fieldset
        legend="Additional Information (Click to expand)"
        variant="outlined"
        collapsible
        defaultOpen={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6a7a]">
            This section contains optional information that can be collapsed or expanded.
          </p>
          <div>
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all resize-none"
              rows={4}
              placeholder="Enter any additional notes..."
            />
          </div>
        </div>
      </Fieldset>
    </div>
  );
}

export default Fieldset;