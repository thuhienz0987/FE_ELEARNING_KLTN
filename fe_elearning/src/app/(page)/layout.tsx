"use client";
import type { Metadata } from "next";
import "../globals.css";

import { useDispatch } from "react-redux";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();

  return (
    <html lang="en">
      <body className="bg-AntiFlashWhite">
        <div className="flex items-start justify-start ">
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              <header className="flex h-16  shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
                {" "}
                <div className="flex items-center gap-2 px-4 w-full fix top-0 sticky">
                  <SidebarTrigger className="bg-majorelleBlue50" />

                  <Header />
                  <Separator
                    orientation="vertical"
                    className="mr-2 h-4 bg-AntiFlashWhite"
                  />
                </div>
              </header>
              <hr />
              {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
              </div> */}
              <div className="w-full h-full p-3 bg-AntiFlashWhite">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
