"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  value?: string; // selected id
  onChange?: (value: string) => void;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((opt) => opt.id === value);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#6b6a7a] mb-2">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between rounded-lg border border-[#dddad0] bg-[#fefdfb] text-left font-normal",
              "focus:border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f]/20 outline-none transition-all",
              !value && "text-muted-foreground"
            )}
          >
            {selected ? selected.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {/* 👇 This ensures the dropdown matches the button width */}
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.id}
                    onSelect={(val) => {
                      onChange?.(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};



//   <SelectField
//     label="Country"
//     options={countries}
//     value={countryId}
//     onChange={setCountryId}
//     placeholder="Select your country"
//   />

//     const countries = [
//   { id: "gh", name: "Ghana" },
//   { id: "ng", name: "Nigeria" },
//   { id: "ke", name: "Kenya" },
// ];