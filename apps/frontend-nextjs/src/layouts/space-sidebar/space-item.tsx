import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ItemButton } from './item-button';
import { Space } from '@/stores/store-type';

interface IProps {
  space: Space;
  isActive: boolean;
}

export const SpaceItem: React.FC<IProps> = ({ space, isActive }) => {
  const { id, name } = space;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    isActive && ref.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <ItemButton className="group" isActive={isActive} ref={ref}>
      <Link
        href={{
          pathname: '/space/[spaceId]',
          query: {
            spaceId: id,
          },
        }}
        title={name}
      >
        <p className="grow truncate">{' ' + name}</p>
      </Link>
    </ItemButton>
  );
};
