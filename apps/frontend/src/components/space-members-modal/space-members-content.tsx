import { FormattedMessage } from "umi";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSpaceStore } from "@/stores/space-store";
import { useT } from "@/hooks";
import { Invite } from "./invite";
import { InviteLink } from "./InviteLink";
import { Collaborators } from "./Collaborators";

export default function SpaceMemberModalContent() {
  const [currSpaceInfo, getInviteLinks, getSpaceMembers] = useSpaceStore(
    useShallow((state) => [
      state.currSpaceInfo,
      state.getInviteLinks,
      state.getSpaceMembers,
    ]),
  );
  const t = useT();

  useEffect(() => {
    const fetchData = async () => {
      getInviteLinks();
      getSpaceMembers();
    };

    fetchData();
  }, []);

  if (!currSpaceInfo) return null;

  const spaceId = currSpaceInfo.id;
  const role = currSpaceInfo.role;

  return (
    <div className="overflow-y-auto">
      <div className="pb-2 text-sm text-muted-foreground">
        <FormattedMessage id="space.invite.desc" values={{ count: 1 }} />
      </div>
      <div className="space-y-8 py-1">
        <Invite spaceId={spaceId} role={role} />
        <InviteLink spaceId={spaceId} role={role} />
        <div className="w-full">
          <div className="mb-3 text-sm text-muted-foreground">
            {t("space.invite.spaceTitle")}
          </div>
          <Collaborators spaceId={spaceId} role={role} />
        </div>
      </div>
    </div>
  );
}
