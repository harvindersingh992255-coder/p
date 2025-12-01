'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  BookOpen,
  User,
  History,
  FileQuestion,
  Settings,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const primaryNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Practice', href: '/interview/setup', icon: PlayCircle },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Resources', href: '/resources', icon: BookOpen },
];

const secondaryNav = [
  { name: 'Interview History', href: '/history', icon: History },
  { name: 'Question Bank', href: '/questions', icon: FileQuestion },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Make dashboard active for root path as well
    if (href === '/dashboard') {
      return pathname === href || pathname.startsWith('/interview');
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex h-full flex-col">
      <div className="flex-grow">
        <SidebarMenu>
          {primaryNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton as="a" isActive={isActive(item.href)} tooltip={item.name}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton as="a" isActive={isActive(item.href)} tooltip={item.name}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </div>
      <div>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/profile" passHref legacyBehavior>
              <SidebarMenuButton as="a" isActive={isActive('/profile')} tooltip="Profile">
                <User />
                <span>Profile</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </nav>
  );
}
