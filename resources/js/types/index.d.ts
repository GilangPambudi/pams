import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Property {
    id: number;
    name: string;
    address: string;
    total_capacity: number;
    standard_monthly_rate: number;
    facility_description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Tenant {
    id: number;
    full_name: string;
    gender: string;
    date_of_birth: string;
    origin_city: string;
    occupation: string;
    workplace_name: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Tenancy {
    id: number;
    property_id: number;
    tenant_id: number;
    start_date: string;
    end_date: string;
    rent_price: number;
    status: string;
    leaving_reason: string | null;
    is_overdue: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    property: Property;
    tenant: Tenant;
}

export interface Payment {
    tenancy: Tenancy;
    id: number;
    tenancy_id: number;
    amount: number;
    payment_date: string;
    payment_type: string;
    method: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}