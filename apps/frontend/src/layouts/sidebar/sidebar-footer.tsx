import { Avatar, AvatarFallback, AvatarImage } from "@flavor/ui/shadcn";
import { useUserInfo } from "@/stores/user-store";

export default function SidebarFooter() {
  const userInfo = useUserInfo();

  if (!userInfo) return null;

  return (
    <div className="flex items-center m-2 gap-2">
      <Avatar className="size-7">
        <AvatarImage src="https://github.com/shadcn.png" sizes="28px" />
        <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span>{userInfo.name}</span>
    </div>
  );
}
