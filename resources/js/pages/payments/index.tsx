import Heading from '@/components/heading';
import { DataTable } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Payment, Property } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useIndexList } from '@/hooks/use-index-list';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import PaymentModal from './payment-modal';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '#' },
];

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    payments: Paginator<Payment>;
    filters: { q?: string; per_page?: number; sort?: string; dir?: 'asc' | 'desc'; property_id?: string };
    properties: Property[];
};

export default function PaymentsIndex({ payments, filters, properties }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [propertyId, setPropertyId] = useState<string>(filters?.property_id || 'all');

    const { q, setQ, perPage, setPerPage, sorting, submit, onSortingChange, loading } = useIndexList(
        'payments.index',
        undefined,
        filters,
        () => ({
            property_id: propertyId !== 'all' ? propertyId : undefined,
        }),
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: 'flash-success' });
        if (flash?.error) toast.error(flash.error, { id: 'flash-error' });
    }, [flash?.success, flash?.error]);

    const rightActions = (
        <div className="flex w-full flex-col gap-1 lg:w-56">
            <Select
                value={propertyId}
                onValueChange={(v) => {
                    setPropertyId(v);
                    submit(1, { property_id: v !== 'all' ? v : undefined });
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="flex justify-between items-center">
                    <Heading title="Payments" description="Manage all payment transactions" />
                    <PaymentModal />
                </div>
                <DataTable
                    columns={columns}
                    data={payments.data}
                    searchValue={q}
                    onSearchChange={setQ}
                    onSearchSubmit={() => submit(1)}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                    page={payments.current_page}
                    pageCount={payments.last_page}
                    onPrev={() => submit(Math.max(1, payments.current_page - 1))}
                    onNext={() => submit(Math.min(payments.last_page, payments.current_page + 1))}
                    onPageChange={(p) => submit(p)}
                    canPrev={payments.current_page > 1}
                    canNext={payments.current_page < payments.last_page}
                    perPage={perPage}
                    onPerPageChange={(n) => {
                        setPerPage(n);
                        submit(1, { per_page: n });
                    }}
                    rightActions={rightActions}
                    loading={loading}
                />
            </div>
        </AppLayout>
    );
}
