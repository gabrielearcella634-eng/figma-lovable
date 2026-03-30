import { useState } from "react";
import { Filter } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const Index = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Nav bar */}
      <nav className="h-[var(--nav-height)] bg-nav flex items-center px-4 gap-3">
        <span className="text-nav-foreground font-semibold text-sm">AI</span>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="text-nav-foreground ml-auto"
            onClick={() => setOpen(true)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        )}
      </nav>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="p-0 w-[85vw] sm:max-w-sm">
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <FilterSidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-[var(--sidebar-width)] flex-shrink-0">
            <FilterSidebar />
          </div>
        )}
        <main className="flex-1 bg-background" />
      </div>
    </div>
  );
};

export default Index;
