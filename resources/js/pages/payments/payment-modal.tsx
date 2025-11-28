import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Payment } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AsyncCombobox } from '@/components/ui/async-combobox';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


interface Props {
    tenancyId?: number;
    defaultAmount?: number;
    payment?: Payment;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function PaymentModal({ tenancyId, defaultAmount, payment, trigger, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = !!payment;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        tenancy_id: payment?.tenancy_id || tenancyId || 0,
        amount: payment?.amount.toString() || defaultAmount?.toString() || '',
        payment_date: payment?.payment_date || format(new Date(), 'yyyy-MM-dd'),
        payment_type: payment?.payment_type || 'monthly_rent',
        notes: payment?.notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && payment) {
            put(route('payments.update', payment.id), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('Payment updated successfully');
                    onSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to update payment');
                },
            });
        } else {
            post(route('payments.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('Payment recorded successfully');
                    onSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to record payment');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Add Payment
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update payment details.' : 'Record a new payment for this tenancy.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    {!tenancyId && !payment && (
                        <div className="grid gap-2">
                            <Label htmlFor="tenancy_id">Tenancy</Label>
                            <AsyncCombobox
                                value={data.tenancy_id ? String(data.tenancy_id) : ''}
                                onValueChange={(val) => {
                                    const selectedId = Number(val);
                                    setData('tenancy_id', selectedId);
                                    if (selectedId) {
                                        fetch(route('tenancies.search', { id: selectedId }))
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.length > 0) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        tenancy_id: selectedId,
                                                        amount: data[0].rent_price.toString(),
                                                    }));
                                                }
                                            });
                                    }
                                }}
                                placeholder="Search tenancy..."
                                searchPlaceholder="Search by tenant or property..."
                                emptyMessage="No tenancy found."
                                loadOptions={async (query) => {
                                    const res = await fetch(route('tenancies.search', { query }));
                                    const data = await res.json();
                                    return data.map((t: { value: string; label: string }) => ({
                                        value: String(t.value),
                                        label: t.label,
                                    }));
                                }}
                            />
                            <InputError message={errors.tenancy_id} />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full justify-between text-left font-normal',
                                        !data.payment_date && 'text-muted-foreground'
                                    )}
                                >
                                    {data.payment_date ? format(new Date(data.payment_date), 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-auto" align="start">
                                <Calendar
                                    mode="single"
                                    selected={data.payment_date ? new Date(data.payment_date) : undefined}
                                    onSelect={(date) => setData('payment_date', date ? format(date, 'yyyy-MM-dd') : '')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.payment_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (IDR)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                            <Input
                                id="amount"
                                type="text"
                                inputMode="numeric"
                                className="pl-9"
                                value={data.amount ? new Intl.NumberFormat('id-ID').format(Number(data.amount)) : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, '');
                                    if (!isNaN(Number(rawValue))) {
                                        setData('amount', rawValue);
                                    }
                                }}
                            />
                        </div>
                        <InputError message={errors.amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="payment_type">Payment Type</Label>
                        <Select
                            value={data.payment_type}
                            onValueChange={(val) => setData('payment_type', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly_rent">Monthly Rent</SelectItem>
                                <SelectItem value="deposit">Deposit</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_type} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
