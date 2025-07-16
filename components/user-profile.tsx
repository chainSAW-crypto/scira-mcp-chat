"use client";

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface UserProfileProps {
  isCollapsed?: boolean;
}

export function UserProfile({ isCollapsed = false }: UserProfileProps) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />;
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full p-0 border border-border/40 hover:border-border/60 bg-background/50 hover:bg-secondary/50 transition-all duration-200"
          >
            <Avatar className="h-7 w-7 border border-border/30">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="relative h-12 w-full px-3 py-2 border border-border/60 hover:bg-secondary/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-border/80"
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8 border-2 border-border/30">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground/90 truncate w-full text-left">
                  {user.displayName || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full text-left">
                  {user.email}
                </span>
              </div>
              <LogOut className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64" 
        align={isCollapsed ? "start" : "end"} 
        side={isCollapsed ? "right" : "top"}
        forceMount 
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-border/30">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
              <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none text-foreground/90 truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout}
          className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
