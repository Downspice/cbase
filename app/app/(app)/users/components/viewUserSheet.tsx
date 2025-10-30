"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DummyInfo } from "./userInfoCard";

 

export default function ViewUser({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const [open, setOpen] = useState(false);
 
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-180px">
          {/* <SheetHeader>
            <SheetTitle>
              
            </SheetTitle>
          </SheetHeader> */}
          <ScrollArea className="h-[calc(100vh-120px)]">
             <DummyInfo/>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }
 
 
 