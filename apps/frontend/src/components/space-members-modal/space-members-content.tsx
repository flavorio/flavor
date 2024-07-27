import { FormattedMessage } from "umi";
import { Invite } from "./invite";
import { InviteLink } from "./InviteLink";
import { Collaborators } from "./Collaborators";

export default function SpaceMemberModalContent() {
  const spaceId = "";
  const role = "owner" as any;

  return (
    <div className="overflow-y-auto">
      <div className="pb-2 text-sm text-muted-foreground">
        <FormattedMessage id="space.invite.desc" values={{ count: 1 }} />
      </div>
      <div className="space-y-8 py-1">
        <Invite spaceId={spaceId} role={role} />
        <InviteLink spaceId={spaceId} role={role} />
        <div className="w-full">
          <div className="mb-3 text-sm text-muted-foreground">{/* text */}</div>
          <Collaborators spaceId={spaceId} role={role} />
        </div>
      </div>
    </div>
  );
}
