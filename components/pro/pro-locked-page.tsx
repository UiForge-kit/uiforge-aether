"use client";

import { ScrollRegion } from "@/components/layout/scroll-region";
import { ProLocked } from "@/components/pro/pro-locked";
import { Topbar } from "@/components/topbar/topbar";
import { useUIStore } from "@/store/ui-store";

export function ProLockedPage({ feature, description }: { feature: string; description?: string }) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <>
      <Topbar title={feature} section="Pro" onToggleSidebar={toggleSidebar} />
      <ScrollRegion className="flex flex-col">
        <div className="flex flex-1 items-center px-4 py-16 md:px-6">
          <ProLocked feature={feature} description={description} />
        </div>
      </ScrollRegion>
    </>
  );
}
