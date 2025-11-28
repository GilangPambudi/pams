import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input"

interface AsyncComboboxProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    loadOptions: (query: string) => Promise<{ value: string; label: string }[]>
    defaultOptions?: { value: string; label: string }[]
}

export function AsyncCombobox({
    value,
    onValueChange,
    placeholder = "Select item...",
    searchPlaceholder = "Search...",
    emptyMessage = "No item found.",
    loadOptions,
    defaultOptions = [],
}: AsyncComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [options, setOptions] = React.useState<{ value: string; label: string }[]>(defaultOptions)
    const [loading, setLoading] = React.useState(false)
    const [selectedLabel, setSelectedLabel] = React.useState<string>("")

    const fetchOptions = React.useCallback(async (query: string) => {
        setLoading(true)
        try {
            const results = await loadOptions(query)
            setOptions(results)
        } catch (error) {
            console.error("Failed to load options:", error)
            setOptions([])
        } finally {
            setLoading(false)
        }
    }, [loadOptions])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (open) {
                fetchOptions(search)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [search, open, fetchOptions])

    // Update selected label when value changes or options update
    React.useEffect(() => {
        if (value) {
            const option = options.find((o) => o.value === value) || defaultOptions.find((o) => o.value === value)
            if (option) {
                setSelectedLabel(option.label)
            }
        } else {
            setSelectedLabel("")
        }
    }, [value, options, defaultOptions])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2 border-b">
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8"
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                    {loading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground flex justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : options.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    ) : (
                        options.map((item) => (
                            <div
                                key={item.value}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    value === item.value ? "bg-accent text-accent-foreground" : ""
                                )}
                                onClick={() => {
                                    onValueChange(item.value === value ? "" : item.value)
                                    setOpen(false)
                                    setSelectedLabel(item.label)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === item.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {item.label}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover >
    )
}
