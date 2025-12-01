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
  FileText,
  Gem,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

// MOCK: In a real app, this would come from user authentication
const userPlan = 'Free'; // 'Free', 'Premium', or 'Super'

const primaryNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Practice', href: '/interview/setup', icon: PlayCircle },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Resources', href: '/resources', icon: BookOpen },
];

const secondaryNav = [
  { name: 'Interview History', href: '/history', icon: History, requiredPlan: 'Free' },
  { name: 'Question Bank', href: '/questions', icon: FileQuestion, requiredPlan: 'Free' },
  { name: 'Resume AI', href: '/resume-analyzer', icon: FileText, requiredPlan: 'Premium' },
  { name: 'Confidence Coach', href: '/confidence-coach', icon: Sparkles, requiredPlan: 'Premium' },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isPlanSufficient = (requiredPlan: string) => {
    if (requiredPlan === 'Free') return true;
    if (requiredPlan === 'Premium' && (userPlan === 'Premium' || userPlan === 'Super')) return true;
    if (requiredPlan === 'Super' && userPlan === 'Super') return true;
    return false;
  };

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
              <Link href={item.href} passHref>
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
            {secondaryNav.map((item) => {
              const hasAccess = isPlanSufficient(item.requiredPlan);
              return (
                <SidebarMenuItem key={item.name}>
                  <Link href={hasAccess ? item.href : '/pricing'} passHref>
                    <SidebarMenuButton 
                      as="a" 
                      isActive={hasAccess && isActive(item.href)} 
                      tooltip={item.name}
                      disabled={!hasAccess}
                      className={cn(!hasAccess && "text-muted-foreground/70 hover:text-muted-foreground")}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                       {!hasAccess && <Lock className="ml-auto h-3 w-3" />}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </div>
      <div>
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/pricing" passHref>
              <SidebarMenuButton as="a" isActive={isActive('/pricing')} tooltip="Subscriptions">
                <Gem />
                <span>Subscriptions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/profile" passHref>
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
