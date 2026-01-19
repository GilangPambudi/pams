import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tenant } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
    action: string;
    method: 'post' | 'patch' | 'put';
    submitLabel?: string;
    cancelHref?: string;
    initial?: Partial<Pick<Tenant, 'full_name' | 'gender' | 'date_of_birth' | 'origin_city' | 'occupation' | 'workplace_name' | 'phone_number'>>;
};

export default function TenantForm({ action, method, submitLabel = 'Save', cancelHref = route('tenants.index'), initial }: Props) {
    const { data, setData, post, put, patch, processing, recentlySuccessful, errors } = useForm({
        full_name: initial?.full_name ?? '',
        gender: initial?.gender ?? '',
        date_of_birth: initial?.date_of_birth ?? '',
        origin_city: initial?.origin_city ?? '',
        occupation: initial?.occupation ?? '',
        workplace_name: initial?.workplace_name ?? '',
        phone_number: initial?.phone_number ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (method === 'post') {
            post(action, { preserveScroll: true });
        } else if (method === 'put') {
            put(action, { preserveScroll: true });
        } else {
            patch(action, { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6 max-w-xl">
            <div className="gap-2 grid">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    required
                    placeholder="e.g., John Doe"
                />
                <InputError className="mt-2" message={errors.full_name} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="gender">Gender</Label>
                <Select value={data.gender} onValueChange={val => setData('gender', val)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                </Select>
                <InputError className="mt-2" message={errors.gender} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="origin_city">Origin City</Label>
                <Input
                    id="origin_city"
                    name="origin_city"
                    value={data.origin_city}
                    onChange={(e) => setData('origin_city', e.target.value)}
                    required
                    placeholder="e.g., Bandung"
                />
                <InputError className="mt-2" message={errors.origin_city} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="workplace_name">Workplace Name</Label>
                <Input
                    id="workplace_name"
                    name="workplace_name"
                    value={data.workplace_name}
                    onChange={(e) => setData('workplace_name', e.target.value)}
                    placeholder="e.g., University of Indonesia"
                />
                <InputError className="mt-2" message={errors.workplace_name} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="date_of_birth">Date of Birth (Optional) </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn('w-full justify-between text-left font-normal', !data.date_of_birth && 'text-muted-foreground')}
                        >
                            {data.date_of_birth ? format(new Date(data.date_of_birth), 'PPP') : <span>Pick a date</span>}
                            <ChevronDownIcon className="ml-2 w-4 h-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                            mode="single"
                            selected={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                            onSelect={(date) => setData('date_of_birth', date ? format(date, 'yyyy-MM-dd') : '')}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <InputError className="mt-2" message={errors.date_of_birth} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="occupation">Occupation (Optional)</Label>
                <Input
                    id="occupation"
                    name="occupation"
                    value={data.occupation}
                    onChange={(e) => setData('occupation', e.target.value)}
                    placeholder="e.g., Student"
                />
                <InputError className="mt-2" message={errors.occupation} />
            </div>

            <div className="gap-2 grid">
                <Label htmlFor="phone_number">Phone Number (Optional) </Label>
                <Input
                    id="phone_number"
                    name="phone_number"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="e.g., +628123456789"
                />
                <InputError className="mt-2" message={errors.phone_number} />
            </div>

            <div className="flex items-center gap-2">
                <Button size="sm" disabled={processing}>{submitLabel}</Button>
                <Button size="sm" variant="outline" asChild>
                    <Link href={cancelHref}>Cancel</Link>
                </Button>

                {recentlySuccessful && <p className="text-muted-foreground text-sm">Saved.</p>}
            </div>
        </form>
    );
}
