import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tenant } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef, type Row } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';

export const columns: ColumnDef<Tenant>[] = [
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
        accessorKey: 'full_name',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Full Name
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'gender',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Gender
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const gender = row.original.gender;
            return <div>{gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ''}</div>;
        },
    },
    {
        accessorKey: 'origin_city',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Origin City
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'occupation',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Occupation
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'workplace_name',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Workplace Name
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'date_of_birth',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Date of Birth
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('date_of_birth'));
            const formattedDate = new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);
            const age = new Date().getFullYear() - date.getFullYear();
            return (
                <div>
                    {formattedDate} <span className="text-muted-foreground">({age} tahun)</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'phone_number',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Phone Number
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            let phone = row.getValue('phone_number') as string;
            if (phone) {
                if (phone.startsWith('0')) {
                    phone = '+62' + phone.slice(1);
                } else if (phone.startsWith('62')) {
                    phone = '+' + phone;
                }
            }
            return <div>{phone}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <TenantActionsCell row={row} />,
    },
];

function TenantActionsCell({ row }: { row: Row<Tenant> }) {
    const tenant = row.original;

    return (
        <div className="flex justify-end items-center gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href={route('tenants.edit', tenant.id)}>
                    <Eye />
                    Detail
                </Link>
            </Button>
        </div>
    );
}
