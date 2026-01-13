import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, Payment, Tenancy } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building, Users, Banknote, AlertCircle, Clock, CreditCard, UserPlus, Eye, EyeOff, Home, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type DashboardProps = {
    summary: {
        totalProperties: number;
        totalCapacity: number;
        availableRooms: number;
        monthlyRevenue: number;
        outstandingPayments: number;
    };
    charts: {
        revenueTrend: { month: string; total: number }[];
        propertyStats: { name: string; occupied: number; available: number }[];
    };
    activity: {
        expiringLeases: Tenancy[];
        recentPayments: Payment[];
        newTenants: Tenancy[];
    };
};

export default function Dashboard({ summary, charts, activity }: DashboardProps) {
    const [showRevenue, setShowRevenue] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href={route('tenancies.create')}>
                            <Card className="transition-colors hover:bg-accent cursor-pointer">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Add Tenancy</h3>
                                        <p className="text-xs text-muted-foreground">Check-in tenant</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={route('payments.index')}>
                            <Card className="transition-colors hover:bg-accent cursor-pointer">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Add Payment</h3>
                                        <p className="text-xs text-muted-foreground">Record payment</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={route('properties.create')}>
                            <Card className="transition-colors hover:bg-accent cursor-pointer">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Home className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Add Property</h3>
                                        <p className="text-xs text-muted-foreground">New property</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={route('tenants.create')}>
                            <Card className="transition-colors hover:bg-accent cursor-pointer">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Add Tenant</h3>
                                        <p className="text-xs text-muted-foreground">Register tenant</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Summary</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                                <Building className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.totalProperties}</div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.totalCapacity} Total Rooms
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.availableRooms}</div>
                                <p className="text-xs text-muted-foreground">
                                    Rooms Ready
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4"
                                        onClick={() => setShowRevenue(!showRevenue)}
                                    >
                                        {showRevenue ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                    <Banknote className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {showRevenue ? formatCurrency(summary.monthlyRevenue) : 'Rp •••••••'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This Month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {showRevenue ? formatCurrency(summary.outstandingPayments) : 'Rp •••••••'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Estimated Pending
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Analytics</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-1 lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                                <CardDescription>Monthly revenue for the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={charts.revenueTrend}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Room Status per Property</CardTitle>
                                <CardDescription>Occupied vs Available</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={charts.propertyStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="occupied" name="Occupied" stackId="a" fill="#8884d8" />
                                            <Bar dataKey="available" name="Available" stackId="a" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-4"></div>
                <h2 className="text-lg font-semibold">Activity</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Expiring Leases
                            </CardTitle>
                            <CardDescription>Ending in next 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.expiringLeases.map((lease) => (
                                    <div key={lease.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(lease.tenant.full_name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <span className="text-sm font-medium">{lease.tenant.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{lease.property.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-destructive">
                                            {format(new Date(lease.end_date), 'dd MMM yyyy')}
                                        </div>
                                    </div>
                                ))}
                                {activity.expiringLeases.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No expiring leases.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Recent Payments
                            </CardTitle>
                            <CardDescription>Latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.recentPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(payment.tenancy.tenant.full_name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <span className="text-sm font-medium">{payment.tenancy.tenant.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{format(new Date(payment.payment_date), 'dd MMM')}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            +{formatCurrency(payment.amount)}
                                        </div>
                                    </div>
                                ))}
                                {activity.recentPayments.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No recent payments.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                New Tenants
                            </CardTitle>
                            <CardDescription>Moved in this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.newTenants.map((tenancy) => (
                                    <div key={tenancy.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(tenancy.tenant.full_name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <span className="text-sm font-medium">{tenancy.tenant.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{tenancy.property.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {format(new Date(tenancy.start_date), 'dd MMM')}
                                        </div>
                                    </div>
                                ))}
                                {activity.newTenants.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No new tenants this month.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
