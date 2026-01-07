"use client";

import { LayoutDashboard, Calendar, Users, LogOut, CalendarDays } from "lucide-react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col fixed left-0 top-0 h-full z-10">
     
      <div className="h-16 flex items-center gap-2 px-6 bg-indigo-600 text-white">
        <CalendarDays className="w-6 h-6" />
        <span className="font-bold text-xl tracking-tight">MeraEvents</span>
      </div>

     
      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavItem 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          href="/" 
          active={pathname === "/"} 
        />
        
        <NavItem 
          icon={<Calendar />} 
          label="Events" 
          href="/events" 
          active={pathname.startsWith("/events")} 
        />

        <NavItem 
          icon={<Users />} 
          label="Attendees" 
          href="/attendees" 
          active={pathname === "/attendees"} 
        />
        
        
        
      </nav>

     
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors w-full">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        active ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}