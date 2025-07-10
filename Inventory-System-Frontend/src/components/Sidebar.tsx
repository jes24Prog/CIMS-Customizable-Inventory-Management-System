
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package2,
  BarChartHorizontal,
  ShoppingCart,
  FileBarChart,
  ClipboardList,
  Settings,
  LogOut,
  ChevronsLeft,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/items', label: 'Items', icon: Package2 },
  {
    path: '/stock-management',
    label: 'Stock Management',
    icon: BarChartHorizontal,
  },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/history', label: 'History', icon: ClipboardList },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { state: sidebarState, toggleSidebar } = useSidebar();

  return (
    <BaseSidebar collapsible="icon">
      <SidebarHeader>
        {sidebarState === 'expanded' && (
          <h1 className="text-xl font-semibold tracking-tight">CIMS</h1>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.path)}
                  tooltip={item.label}
                >
                  <Link href={item.path}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9 border-2 border-sidebar-border">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary-foreground">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          {sidebarState === 'expanded' && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.role || 'User'}
              </p>
            </div>
          )}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="hidden md:block mt-2">
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={sidebarState === 'expanded' ? 'Collapse' : 'Expand'}
            >
              <ChevronsLeft
                className={`transition-transform duration-300 ${
                  sidebarState === 'collapsed' ? 'rotate-180' : ''
                }`}
              />
              <span>{sidebarState === 'expanded' ? 'Collapse' : ''}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </BaseSidebar>
  );
};

export default Sidebar;
