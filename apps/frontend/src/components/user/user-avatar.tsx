import { Avatar, AvatarFallback, AvatarImage, cn } from '@flavor/ui/shadcn';
import React from 'react';

interface UserAvatarProps {
  user: { name: string; avatar?: string | null };
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { user, width = 28, height = 28, className, style } = props;
  const { name, avatar } = user;

  const userAvatarProps = {
    width,
    height,
    src: avatar as string,
    alt: name,
    // style: { objectFit: 'cover' },
  };

  return (
    <Avatar className={cn('size-7', className)} style={style}>
      {avatar && <AvatarImage {...userAvatarProps} />}
      <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
};
