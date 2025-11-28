import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Tenant } from '@/types';
import { Head, router } from '@inertiajs/react';
import TenantForm from './_form';
import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tenants', href: route('tenants.index') },
    { title: 'Edit', href: '#' },
];

type Props = {
    tenant: Pick<Tenant, 'id' | 'full_name' | 'gender' | 'date_of_birth' | 'origin_city' | 'occupation' | 'workplace_name' | 'phone_number'>;
    can_delete: boolean;
};

export default function TenantEdit({ tenant, can_delete }: Props) {

    const handleDelete = () => {
        router.delete(route('tenants.destroy', tenant.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Tenant" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Edit Tenant" />
                    {can_delete ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Tenant
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the tenant
                                        "{tenant.full_name}" and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Button
                            size="sm"
                            variant="destructive"
                            className="opacity-50"
                            onClick={() => toast.error("Cannot delete tenant with active tenancy")}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Tenant
                        </Button>
                    )}
                </div>
                <div className="w-full md:w-1/2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TenantForm
                                action={route('tenants.update', tenant.id)}
                                method="patch"
                                initial={{
                                    full_name: tenant.full_name,
                                    gender: tenant.gender,
                                    date_of_birth: tenant.date_of_birth,
                                    origin_city: tenant.origin_city,
                                    occupation: tenant.occupation,
                                    workplace_name: tenant.workplace_name,
                                    phone_number: tenant.phone_number,
                                }}
                                submitLabel="Update"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
