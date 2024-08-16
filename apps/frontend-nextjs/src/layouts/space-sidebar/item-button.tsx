import { Button, cn } from '@flavor/ui';
import React from 'react';

interface IItemButtonProps {
  className?: string;
  isActive?: boolean;
  children?: React.ReactNode;
}

export const ItemButton = React.forwardRef<HTMLButtonElement, IItemButtonProps>((props, ref) => {
  const { className, isActive, children } = props;

  return (
    <Button
      ref={ref}
      variant={'ghost'}
      size={'sm'}
      asChild
      className={cn(
        'my-[2px] w-full px-2 justify-start text-sm font-normal gap-2',
        {
          'bg-secondary': isActive,
        },
        className,
      )}
    >
      {children}
    </Button>
  );
});

ItemButton.displayName = 'Item';
