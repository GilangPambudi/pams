import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Payment } from '@/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import PaymentModal from './payment-modal';

export const columns: ColumnDef<Payment>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'payment_date',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Payment Date
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => format(new Date(row.original.payment_date), 'dd MMM yyyy'),
    },
    {
        accessorKey: 'tenancy.tenant.full_name',
        header: 'Tenant',
        cell: ({ row }) => (
            <Link href={route('tenancies.edit', row.original.tenancy_id)} className="hover:underline">
                {row.original.tenancy.tenant.full_name}
            </Link>
        ),
    },
    {
        accessorKey: 'tenancy.property.name',
        header: 'Property',
        cell: ({ row }) => row.original.tenancy.property.name,
    },
    {
        accessorKey: 'payment_type',
        header: 'Type',
        cell: ({ row }) => <span className="capitalize">{row.original.payment_type.replace('_', ' ')}</span>,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Amount
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.original.amount),
    },
    {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ row }) => row.original.notes || '-',
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Created At
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => format(new Date(row.original.created_at), 'dd MMM yyyy, HH:mm'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <PaymentActionsCell row={row} />,
    },
];

function PaymentActionsCell({ row }: { row: Row<Payment> }) {
    const payment = row.original;
    return (
        <div className="flex gap-2 justify-end">
            <PaymentModal
                payment={payment}
                trigger={
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        <Eye className="h-4 w-4" />
                        Detail
                    </Button>
                }
            />
        </div>
    );
}
