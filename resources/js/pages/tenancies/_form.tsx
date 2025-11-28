import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tenancy } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AsyncCombobox } from '@/components/ui/async-combobox';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

interface Property {
    id: number;
    name: string;
    standard_monthly_rate: number;
}

type Props = {
    action: string;
    method: 'post' | 'patch' | 'put';
    submitLabel?: string;
    cancelHref?: string;
    initial?: Partial<Pick<Tenancy, 'tenant_id' | 'property_id' | 'start_date' | 'end_date' | 'status'>>;
    properties?: Property[];
    preselected_property_id?: number;
};

export default function TenancyForm({
    action,
    method,
    submitLabel = 'Check-in',
    cancelHref = route('tenancies.index'),
    initial,
    properties = [],
    preselected_property_id
}: Props) {
    const [step, setStep] = useState(1);
    const [isNewTenant, setIsNewTenant] = useState(false);

    const { data, setData, post, put, patch, processing, errors, setError, clearErrors } = useForm({
        tenant_id: initial?.tenant_id?.toString() || '',
        full_name: '',
        gender: '',
        date_of_birth: '',
        origin_city: '',
        occupation: '',
        workplace_name: '',
        phone_number: '',

        property_id: initial?.property_id?.toString() || preselected_property_id?.toString() || '',
        room_number: '',
        start_date: initial?.start_date || format(new Date(), 'yyyy-MM-dd'),
        rent_price: '',

        pay_initial_rent: true,
        payment_amount: '',

        status: initial?.status || 'active',
    });

    useEffect(() => {
        if (data.property_id) {
            const property = properties.find(p => p.id.toString() === data.property_id);
            if (property) {
                setData(prev => ({
                    ...prev,
                    rent_price: property.standard_monthly_rate.toString(),
                    payment_amount: property.standard_monthly_rate.toString()
                }));
            }
        }
    }, [data.property_id]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onError: (errors: Record<string, string>) => {
                toast.error("Check-in failed. Please check the form for errors.");
                console.error(errors);
            },
            onSuccess: () => {
                toast.success("Check-in successful!");
            }
        };

        if (method === 'post') post(action, options);
        if (method === 'put') put(action, options);
        if (method === 'patch') patch(action, options);
    };

    const validateStep1 = () => {
        clearErrors();
        let isValid = true;

        if (!isNewTenant) {
            if (!data.tenant_id) {
                setError('tenant_id', 'Please select a tenant.');
                toast.error("Please select a tenant to proceed.");
                isValid = false;
            }
        } else {
            if (!data.full_name) {
                setError('full_name', 'Full name is required.');
                isValid = false;
            }
            if (!data.gender) {
                setError('gender', 'Gender is required.');
                isValid = false;
            }
            if (!data.date_of_birth) {
                setError('date_of_birth', 'Date of birth is required.');
                isValid = false;
            }
            if (!data.origin_city) {
                setError('origin_city', 'Origin city is required.');
                isValid = false;
            }
            if (!data.occupation) {
                setError('occupation', 'Occupation is required.');
                isValid = false;
            }

            if (!isValid) {
                toast.error("Please fill in all required tenant information.");
            }
        }

        return isValid;
    };

    const isStep1Complete = !isNewTenant
        ? !!data.tenant_id
        : (!!data.full_name && !!data.gender && !!data.date_of_birth && !!data.origin_city && !!data.occupation);

    const nextStep = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };
    const prevStep = () => setStep(1);

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Input Forms */}
            <div className="md:col-span-2 space-y-6">
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Tenant Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-md border p-4">
                                <div className="grid gap-1.5 leading-none">
                                    <Label className="text-sm font-medium leading-none">
                                        Register New Tenant?
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Click the button to switch between existing and new tenant.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    className="cursor-pointer"
                                    variant={isNewTenant ? "outline" : "default"}
                                    onClick={() => {
                                        const newValue = !isNewTenant;
                                        setIsNewTenant(newValue);
                                        if (newValue) setData('tenant_id', '');
                                    }}
                                >
                                    {isNewTenant ? null : <Plus className="h-4 w-4" />}
                                    {isNewTenant ? "Select Existing" : "New Tenant"}
                                </Button>
                            </div>

                            {!isNewTenant ? (
                                <div className="space-y-2">
                                    <Label htmlFor="tenant_id">Select Existing Tenant</Label>
                                    <AsyncCombobox
                                        value={data.tenant_id}
                                        onValueChange={(val) => setData('tenant_id', val)}
                                        placeholder="Search tenant..."
                                        searchPlaceholder="Search by name..."
                                        emptyMessage="No tenant found."
                                        loadOptions={async (query) => {
                                            const res = await fetch(route('tenants.search', { query }));
                                            const data = await res.json();
                                            return data as { value: string; label: string }[];
                                        }}
                                    />
                                    <InputError message={errors.tenant_id} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                        />
                                        <InputError message={errors.full_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={data.gender} onValueChange={val => setData('gender', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">Date of Birth</Label>
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
                                        <InputError message={errors.date_of_birth} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="origin_city">Origin City</Label>
                                        <Input
                                            id="origin_city"
                                            value={data.origin_city}
                                            onChange={e => setData('origin_city', e.target.value)}
                                        />
                                        <InputError message={errors.origin_city} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="occupation">Occupation</Label>
                                        <Input
                                            id="occupation"
                                            value={data.occupation}
                                            onChange={e => setData('occupation', e.target.value)}
                                        />
                                        <InputError message={errors.occupation} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">Phone Number</Label>
                                        <Input
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                        />
                                        <InputError message={errors.phone_number} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Contract & Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="property_id">Property</Label>
                                        <Select
                                            value={data.property_id}
                                            onValueChange={(val) => setData('property_id', val)}
                                        >
                                            <SelectTrigger>
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
                                        <InputError message={errors.property_id} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room_number">Room Number (Optional)</Label>
                                        <Input
                                            id="room_number"
                                            value={data.room_number}
                                            onChange={e => setData('room_number', e.target.value)}
                                            placeholder="e.g. A-101"
                                        />
                                        <InputError message={errors.room_number} />
                                    </div>
                                    <div className="space-y-2">
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
                                        <InputError message={errors.start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rent_price">Agreed Rent Price (IDR)</Label>
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
                                        />
                                        <InputError message={errors.rent_price} />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="pay_initial_rent"
                                        checked={data.pay_initial_rent}
                                        onCheckedChange={(checked) => setData('pay_initial_rent', checked as boolean)}
                                    />
                                    <Label htmlFor="pay_initial_rent">Pay Initial Rent Now?</Label>
                                </div>

                                {data.pay_initial_rent && (
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_amount">Payment Amount</Label>
                                        <Input
                                            id="payment_amount"
                                            type="text"
                                            inputMode="numeric"
                                            value={data.payment_amount ? new Intl.NumberFormat('id-ID').format(Number(data.payment_amount)) : ''}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\./g, '');
                                                if (!isNaN(Number(rawValue))) {
                                                    setData('payment_amount', rawValue);
                                                }
                                            }}
                                        />
                                        <InputError message={errors.payment_amount} />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column: Navigation & Summary */}
            <div className="md:col-span-1">
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle>Check-in Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${step >= 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                                    {step > 1 ? <Check className="h-4 w-4" /> : '1'}
                                </div>
                                <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Tenant Info</span>
                            </div>
                            <div className="ml-4 h-6 w-0.5 bg-border" />
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${step >= 2 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                                    2
                                </div>
                                <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Contract & Payment</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2">
                            {step === 1 ? (
                                <Button type="button" onClick={nextStep} className="w-full cursor-pointer" disabled={!isStep1Complete}>
                                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <>
                                    <Button type="submit" disabled={processing} className="w-full cursor-pointer">
                                        {submitLabel}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={prevStep} className="w-full cursor-pointer">
                                        Back
                                    </Button>
                                </>
                            )}
                            <Button asChild variant="outline" className="w-full cursor-pointer">
                                <Link href={cancelHref}>Cancel</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
