import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Property, Tenancy } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useIndexList } from '@/hooks/use-index-list';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tenancies', href: '#' },
];

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    tenancies: Paginator<Tenancy>;
    filters: { q?: string; per_page?: number; sort?: string; dir?: 'asc' | 'desc'; property_id?: string; status?: string };
    properties: Property[];
};

export default function TenanciesIndex({ tenancies, filters, properties }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [propertyId, setPropertyId] = useState<string>(filters?.property_id || 'all');
    const [status, setStatus] = useState<string>(filters?.status || 'all');

    const { q, setQ, perPage, setPerPage, sorting, submit, onSortingChange, loading } = useIndexList(
        'tenancies.index',
        undefined,
        filters,
        () => ({
            property_id: propertyId !== 'all' ? propertyId : undefined,
            status: status !== 'all' ? status : undefined,
        }),
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const rightActions = (
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:w-auto">
            <Select
                value={status}
                onValueChange={(v) => {
                    setStatus(v);
                    submit(1, { status: v !== 'all' ? v : undefined });
                }}
            >
                <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
            </Select>
            <Select
                value={propertyId}
                onValueChange={(v) => {
                    setPropertyId(v);
                    submit(1, { property_id: v !== 'all' ? v : undefined });
                }}
            >
                <SelectTrigger className="w-full lg:w-56">
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
            <Head title="Tenancies" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="flex justify-between items-center">
                    <Heading title="Tenancies" description="Manage Tenancies" />
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm">
                            <Link href={route('tenancies.create')}>
                                <Plus />
                                Add New
                            </Link>
                        </Button>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={tenancies.data}
                    searchValue={q}
                    onSearchChange={setQ}
                    onSearchSubmit={() => submit(1)}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                    page={tenancies.current_page}
                    pageCount={tenancies.last_page}
                    onPrev={() => submit(Math.max(1, tenancies.current_page - 1))}
                    onNext={() => submit(Math.min(tenancies.last_page, tenancies.current_page + 1))}
                    onPageChange={(p) => submit(p)}
                    canPrev={tenancies.current_page > 1}
                    canNext={tenancies.current_page < tenancies.last_page}
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