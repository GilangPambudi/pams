import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property, Tenancy } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
type Props = {
    action: string;
    method: 'post' | 'patch' | 'put';
    submitLabel?: string;
    cancelHref?: string;
    initial?: Partial<Pick<Tenancy, 'start_date' | 'end_date' | 'rent_price' | 'status' | 'property_id' | 'leaving_reason'>>;
    properties?: Property[];
};

export default function TenancyDetail({ action, method, submitLabel = 'Save', cancelHref = route('tenancies.index'), initial, properties = [] }: Props) {
    const { data, setData, post, put, patch, processing, errors } = useForm({
        start_date: initial?.start_date ?? '',
        end_date: initial?.end_date ?? '',
        rent_price: initial?.rent_price ?? '',
        property_id: initial?.property_id ?? '',
        leaving_reason: initial?.leaving_reason ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => toast.success('Tenancy updated successfully!'),
        };
        if (method === 'post') post(action, options);
        if (method === 'put') put(action, options);
        if (method === 'patch') patch(action, options);
    };

    return (
        <form onSubmit={submit} className="space-y-6 max-w-xl">
            <div className="gap-2 grid">
                <Label htmlFor="status">Status</Label>
                <Input
                    id="status"
                    value={(initial?.status || '').charAt(0).toUpperCase() + (initial?.status || '').slice(1)}
                    readOnly
                    disabled
                    className="bg-secondary"
                />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="property_id">Property</Label>
                <Select
                    value={data.property_id.toString()}
                    onValueChange={(val) => {
                        setData('property_id', val);
                        const selectedProperty = properties.find(p => p.id.toString() === val);
                        if (selectedProperty) {
                            setData(data => ({ ...data, property_id: val, rent_price: selectedProperty.standard_monthly_rate.toString() }));
                        }
                    }}
                >
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                        {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id.toString()}>
                                {property.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError className="mt-2" message={errors.property_id} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="rent_price">Current Rent Price (IDR)</Label>
                <Input
                    id="rent_price"
                    type="text"
                    inputMode="numeric"
                    value={data.rent_price ? new Intl.NumberFormat('id-ID').format(Number(data.rent_price)) : ''}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, '');
                        if (!isNaN(Number(rawValue))) {
                            setData('rent_price', rawValue);
                        }
                    }}
                    required
                />
                <InputError className="mt-2" message={errors.rent_price} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="start_date">Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn('w-full justify-between text-left font-normal', !data.start_date && 'text-muted-foreground')}
                        >
                            {data.start_date ? format(new Date(data.start_date), 'PPP') : <span>Pick a date</span>}
                            <ChevronDownIcon className="ml-2 w-4 h-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                            mode="single"
                            selected={data.start_date ? new Date(data.start_date) : undefined}
                            onSelect={(date) => setData('start_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <InputError className="mt-2" message={errors.start_date} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="end_date">End Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn('w-full justify-between text-left font-normal', !data.end_date && 'text-muted-foreground')}
                        >
                            {data.end_date ? format(new Date(data.end_date), 'PPP') : <span>Pick a date</span>}
                            <ChevronDownIcon className="ml-2 w-4 h-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                            mode="single"
                            selected={data.end_date ? new Date(data.end_date) : undefined}
                            onSelect={(date) => setData('end_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <InputError className="mt-2" message={errors.end_date} />
            </div>

            {data.end_date && (
                <div className="gap-2 grid">
                    <Label htmlFor="leaving_reason">Leaving Reason</Label>
                    <Textarea
                        id="leaving_reason"
                        value={data.leaving_reason}
                        onChange={(e) => setData('leaving_reason', e.target.value)}
                        placeholder="Reason for leaving..."
                    />
                    <InputError className="mt-2" message={errors.leaving_reason} />
                </div>
            )}

            <div className="flex items-center gap-2">
                <Button className="cursor-pointer" size="sm" disabled={processing}>
                    {submitLabel}
                </Button>
                <Button asChild size="sm" variant="outline">
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
