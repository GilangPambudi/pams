import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, CreditCard, LayoutGrid, ReceiptText, TableProperties, Users, Database, type LucideIcon } from 'lucide-react';
import AppLogo from './app-logo';

type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: (url: string) => boolean;
};

type NavGroup = {
    title: string;
    icon: LucideIcon;
    items: NavItem[];
};

const navItems: (NavItem | NavGroup)[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
        isActive: (url) => url.startsWith('/dashboard'),
    },
    {
        title: 'Data Master',
        icon: Database,
        items: [
            {
                title: 'Properties',
                url: '/properties',
                icon: TableProperties,
                isActive: (url) => url.startsWith('/properties'),
            },
            {
                title: 'Tenants',
                url: '/tenants',
                icon: Users,
                isActive: (url) => url.startsWith('/tenants'),
            },
        ],
    },
    {
        title: 'Tenancies',
        url: '/tenancies',
        icon: ReceiptText,
        isActive: (url) => url.startsWith('/tenancies'),
    },
    {
        title: 'Payments',
        url: '/payments',
        icon: CreditCard,
        isActive: (url) => url.startsWith('/payments'),
    },
    {
        title: 'Users',
        url: '/users',
        icon: Users,
        isActive: (url) => url.startsWith('/users'),
    },
];

export function AppSidebar() {
    const page = usePage();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                if ('items' in item) {
                                    return (
                                        <Collapsible key={item.title} defaultOpen className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={item.title}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={subItem.isActive ? subItem.isActive(page.url) : page.url.startsWith(subItem.url)}>
                                                                    <Link href={subItem.url}>
                                                                        <subItem.icon />
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive ? item.isActive(page.url) : page.url.startsWith(item.url)}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
