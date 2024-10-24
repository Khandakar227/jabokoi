import { Bus, Home, TicketsPlane, Hotel, Backpack, LogIn } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Travel Blogs",
    url: "#",
    icon: Backpack,
  },
  {
    title: "Flight",
    url: "#",
    icon: TicketsPlane,
  },
  {
    title: "Bus",
    url: "#",
    icon: Bus,
  },
  {
    title: "Hotels",
    url: "#",
    icon: Hotel,
  },
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>JaboKoi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-4">
                    <Link href={item.url}>
                      <item.icon />
                      <span className="font-semibold p-4">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
