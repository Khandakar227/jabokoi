import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/AppSidebar"
import { PropsWithChildren } from "react"

export default function Layout({ children }:PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-2">
            <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
