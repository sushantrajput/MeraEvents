"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query"; 
import { formatDistanceToNow } from "date-fns";   
import { Bell, Search, CheckCircle2, UserPlus, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function Header() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  
  const { data: attendees = [], isLoading } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const res = await fetch("/api/attendees/all");
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
    
    refetchInterval: 5000 
  });

  
  const recentNotifications = attendees
    .sort((a: any, b: any) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5); 

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-20">
  
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          placeholder="Search events, attendees..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>

      <div className="flex items-center gap-6">
       
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Bell className="w-5 h-5" />
           
            {recentNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowNotifications(false)}
              />
              
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
                  <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                
                  {isLoading && (
                    <div className="p-4 flex justify-center text-gray-400">
                      <Loader2 className="animate-spin w-5 h-5" />
                    </div>
                  )}

              
                  {!isLoading && recentNotifications.length === 0 && (
                    <div className="p-6 text-center text-gray-500 text-xs">
                      No recent activity found.
                    </div>
                  )}

             
                  {recentNotifications.map((person: any) => (
                    <div key={person.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Registration</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          <span className="font-semibold text-gray-700">{person.name}</span> joined 
                          <span className="text-indigo-600"> {person.event?.title || "an event"}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wide">
                         
                          {formatDistanceToNow(new Date(person.registeredAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
                  <button className="text-xs font-semibold text-gray-600 hover:text-gray-900">View All Attendees</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Sushant</p>
            <p className="text-xs text-gray-500">Event Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
              <span className="font-bold text-indigo-600">S</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}