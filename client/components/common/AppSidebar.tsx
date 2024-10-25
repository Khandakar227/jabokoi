import { Bus, Home, TicketsPlane, Hotel, Backpack, LogIn, MemoryStick, User } from "lucide-react"

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
import { useUser } from "@/hooks/use-user"
import { Button } from "../ui/button"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Trip",
    url: "/trip",
    icon: Bus,
  },
  {
    title: "Memories",
    url: "/memories",
    icon: MemoryStick,
  },
  // {
  //   title: "Login",
  //   url: "/login",
  //   icon: LogIn,
  // },
]

export function AppSidebar() {
  const [user, setUser] = useUser();

  function logout() {
    const shouldLogout = confirm("Are you sure you want to log out?");
    
    if(!shouldLogout) return; 

    localStorage.removeItem("token");
    setUser(null);
  }

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
              {
                user ? (
                  <SidebarMenuItem key={"User"}>
                      <SidebarMenuButton asChild className="p-4">
                        <Button onClick={logout}>
                          < User/>
                          <span className="font-semibold p-4">{"Log out"}</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ) : (
              <SidebarMenuItem key={"Login"}>
                  <SidebarMenuButton asChild className="p-4">
                    <Link href={"/login"}>
                      < LogIn/>
                      <span className="font-semibold p-4">{"Login"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
