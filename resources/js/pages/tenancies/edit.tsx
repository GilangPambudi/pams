import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Payment, Property, Tenancy } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TenantDetail from './detail/tenant';
import TenancyDetail from './detail/tenancy';
import PaymentHistory from './detail/payment-history';

interface Props {
    tenancy: Tenancy & {
        payments: Payment[];
    };
    properties: Property[];
}

export default function TenancyEdit({ tenancy, properties }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tenancies', href: route('tenancies.index') },
        { title: 'Detail', href: route('tenancies.edit', tenancy.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tenancy - ${tenancy.tenant.full_name}`} />

            <div className="flex flex-col gap-6 p-4 md:grid md:grid-cols-3">
                {/* Left Column: Tenant Details & Payment History (2/3 width) */}
                <div className="space-y-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TenantDetail
                                tenantId={tenancy.tenant.id}
                                initial={{
                                    full_name: tenancy.tenant.full_name,
                                    gender: tenancy.tenant.gender,
                                    date_of_birth: tenancy.tenant.date_of_birth,
                                    origin_city: tenancy.tenant.origin_city,
                                    occupation: tenancy.tenant.occupation,
                                    workplace_name: tenancy.tenant.workplace_name,
                                    phone_number: tenancy.tenant.phone_number,
                                }}
                            />
                        </CardContent>
                    </Card>
                    <PaymentHistory
                        tenancyId={tenancy.id}
                        rentPrice={tenancy.rent_price}
                        payments={tenancy.payments}
                    />
                </div>

                {/* Right Column: Tenancy Details (1/3 width) */}
                <div className="space-y-6 h-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenancy Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TenancyDetail
                                action={route('tenancies.update', tenancy.id)}
                                method="put"
                                initial={{
                                    start_date: tenancy.start_date,
                                    end_date: tenancy.end_date,
                                    rent_price: tenancy.rent_price,
                                    status: tenancy.status,
                                    property_id: tenancy.property_id,
                                    leaving_reason: tenancy.leaving_reason,
                                }}
                                properties={properties}
                                submitLabel="Update"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
