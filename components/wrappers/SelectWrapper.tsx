"use client"

import { cn } from "@/lib/utils"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Control } from "react-hook-form"
import { GenericObject } from "@/types/types"

interface SelectWrapperProps {
  control: Control<any>
  label: string
  name: string
  options: GenericObject[]|[]
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  direction?: "horizontal" | "vertical" 
}

export default function SelectWrapper({
  control,
  name,
  label,
  options=[],
  className,
  placeholder,
  disabled = false,
  required = false,
  direction = "horizontal",
}: SelectWrapperProps) {
  const displayLabel = required ? `* ${label}` : label

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "w-full", 
            direction === "horizontal"
              ? "flex items-center gap-4"
              : "flex flex-col"
          )}
        >
          {direction === "horizontal" && (
            <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
              {required && <span className="text-red-500 mr-1">*</span>}
              {label}
            </label>
          )}

          <div className="flex-1 w-full">
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value} 
              disabled={disabled}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger 
                  className={cn("w-full px-3 py-2 rounded-lg border border-[#dddad0] bg-[#fefdfb] focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all", className)}
                  label={direction === "vertical" ? displayLabel : undefined}
                  value={field.value}
                >
                  <SelectValue placeholder={placeholder || " "} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}