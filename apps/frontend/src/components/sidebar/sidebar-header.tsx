import type { ReactNode } from 'react';
import { FormattedMessage } from 'umi';
import { DoubleArrowLeftIcon } from '@radix-ui/react-icons';
import {
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@flavor/ui/shadcn';

export interface ISidebarHeaderProps {
  headerLeft: ReactNode;
  onExpand?: () => void;
}

export const SidebarHeader = (prop: ISidebarHeaderProps) => {
  const { headerLeft, onExpand } = prop;

  return (
    <div className="m-2 flex h-7 items-center gap-1">
      {headerLeft}
      <div className="grow basis-0" />
      {onExpand && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-6 shrink-0 px-0"
                variant="ghost"
                size="sm"
                onClick={() => onExpand?.()}
              >
                <DoubleArrowLeftIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent hideWhenDetached={true}>
              <p>
                <FormattedMessage id="actions.collapseSidebar" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
