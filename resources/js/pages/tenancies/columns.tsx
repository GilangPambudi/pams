import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tenancy } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef, type Row } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Tenancy>[] = [
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
        accessorKey: 'tenant.full_name',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Tenant Name
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'property.name',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Property Name
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'rent_price',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Rent Price
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const rentPrice = row.original.rent_price;
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(rentPrice);
        },
    },
    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Start Date
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.start_date);
            return date.toLocaleDateString('en-GB'); // Formats date as DD/MM/YYYY
        },
    },
    {
        accessorKey: 'end_date',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                End Date
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const endDate = row.original.end_date;
            if (!endDate) {
                return '-';
            }
            const date = new Date(endDate);
            return date.toLocaleDateString('en-GB'); // Formats date as DD/MM/YYYY
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Status
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex items-center">
                    <Badge
                        variant={
                            status === 'active'
                                ? 'default'
                                : status === 'cancelled'
                                    ? 'secondary'
                                    : 'destructive'
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                    {row.original.is_overdue && (
                        <Badge variant="destructive" className="ml-2">
                            Overdue
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <PropertyActionsCell row={row} />,
    },
];

function PropertyActionsCell({ row }: { row: Row<Tenancy> }) {
    const tenancy = row.original;

    return (
        <div className="flex justify-end items-center gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href={route('tenancies.edit', tenancy.id)}>
                    <Eye />
                    Detail
                </Link>
            </Button>
        </div>
    );
}
