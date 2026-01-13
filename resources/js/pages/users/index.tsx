import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useIndexList } from '@/hooks/use-index-list';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import UserModal from './user-modal';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '#' },
];

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    users: Paginator<User>;
    filters: { q?: string; per_page?: number; sort?: string; dir?: 'asc' | 'desc' };
};

export default function UsersIndex({ users, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const { q, setQ, perPage, setPerPage, sorting, submit, onSortingChange, loading } = useIndexList(
        'users.index',
        undefined,
        filters,
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="flex justify-between items-center">
                    <Heading title="Users" description="Manage Users" />
                    <div className="flex items-center gap-2">
                        <UserModal
                            trigger={
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New
                                </Button>
                            }
                            onSuccess={() => submit(1)}
                        />
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={users.data}
                    searchValue={q}
                    onSearchChange={setQ}
                    onSearchSubmit={() => submit(1)}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                    page={users.current_page}
                    pageCount={users.last_page}
                    onPrev={() => submit(Math.max(1, users.current_page - 1))}
                    onNext={() => submit(Math.min(users.last_page, users.current_page + 1))}
                    onPageChange={(p) => submit(p)}
                    canPrev={users.current_page > 1}
                    canNext={users.current_page < users.last_page}
                    perPage={perPage}
                    onPerPageChange={(n) => {
                        setPerPage(n);
                        submit(1, { per_page: n });
                    }}
                    loading={loading}
                />
            </div>
        </AppLayout>
    );
}