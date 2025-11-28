import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Property, Tenancy } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import PropertyForm from './_form';
import ActiveTenants from './_active';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Data Master', href: '/dashboard' },
    { title: 'Properties', href: route('properties.index') },
    { title: 'Edit', href: '#' },
];

type Props = {
    property: Property & {
        tenancies: Tenancy[];
    };
};

export default function PropertyEdit({ property }: Props) {

    const handleDelete = () => {
        router.delete(route('properties.destroy', property.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Property" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <Heading title="Edit Property" />
                    <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                            <Link href={route('tenancies.create', { property_id: property.id })}>
                                <Plus className=" h-4 w-4" />
                                Check-in Tenant
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the property
                                        "{property.name}" and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PropertyForm
                                action={route('properties.update', property.id)}
                                method="patch"
                                initial={{
                                    name: property.name,
                                    address: property.address,
                                    total_capacity: property.total_capacity,
                                    standard_monthly_rate: property.standard_monthly_rate,
                                    facility_description: property.facility_description,
                                }}
                                submitLabel="Update"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Tenants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActiveTenants tenancies={property.tenancies} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
