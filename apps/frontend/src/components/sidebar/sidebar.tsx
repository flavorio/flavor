import { PropsWithChildren, ReactNode, useState } from "react";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button, cn } from "@flavor/ui/shadcn";
import { HoverWrapper } from "@/components/toggle-sidebar/hover-wrapper";
import { SidebarHeader } from "./sidebar-header";
import { SIDE_BAR_WIDTH } from "../toggle-sidebar/constant";

interface SidebarProps {
  headerLeft: ReactNode;
}

export default function Sidebar(props: PropsWithChildren<SidebarProps>) {
  const { headerLeft, children } = props;
  const [leftVisible, setLeftVisible] = useState(true);

  return (
    <>
      <div
        className={cn("flex w-0 border-r flex-shrink-0 h-full", {
          "overflow-hidden": !leftVisible,
          "w-72": leftVisible,
        })}
      >
        <div className="flex size-full flex-col overflow-hidden bg-popover">
          <SidebarHeader
            headerLeft={headerLeft}
            onExpand={() => setLeftVisible(!leftVisible)}
          />
          {leftVisible && children}
        </div>
      </div>
      {!leftVisible && (
        <HoverWrapper size={SIDE_BAR_WIDTH}>
          <HoverWrapper.Trigger>
            <Button
              className={cn(
                "absolute top-7 p-1 rounded-none -left-0 rounded-r-full z-[51]",
              )}
              variant={"outline"}
              size="sm"
              onClick={() => {
                setLeftVisible(!leftVisible);
              }}
            >
              <DoubleArrowRightIcon className="size-5" />
            </Button>
          </HoverWrapper.Trigger>
          <HoverWrapper.content>
            <div className="flex size-full flex-col overflow-hidden bg-popover">
              <SidebarHeader headerLeft={headerLeft} />
              {children}
            </div>
          </HoverWrapper.content>
        </HoverWrapper>
      )}
    </>
  );
}
