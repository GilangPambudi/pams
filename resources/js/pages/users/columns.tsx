import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types';
import { ColumnDef, type Row } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import UserModal from './user-modal';

export const columns: ColumnDef<User>[] = [
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
        accessorKey: 'name',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Name
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Email
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex justify-between items-center cursor-pointer">
                Updated At
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <UserActionsCell row={row} />,
    },
];

function UserActionsCell({ row }: { row: Row<User> }) {
    const user = row.original;

    return (
        <div className="flex gap-2 justify-end">
            <UserModal
                user={user}
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
