"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // Basic breadcrumb translation from pathname
  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard";
    const segment = path.split("/")[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-card w-full">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg hidden md:block">
          {getPageTitle(pathname)}
        </h1>
        <span className="font-bold text-lg md:hidden ml-2 text-primary">
          SwasthyaSetu AI
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 px-2 hover:bg-muted cursor-pointer rounded-md">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col items-start text-sm">
                  <span className="font-medium leading-none mb-1">{currentUser.name}</span>
                  <Badge variant="outline" className="text-[10px] h-4 py-0 font-normal">
                    {currentUser.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer text-muted-foreground">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Switch Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
