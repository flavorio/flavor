import { z } from "zod";
import { map } from "lodash";
import { useMemo, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { hasPermission, SpaceRole } from "@flavor/core/auth";
import { Button, cn } from "@flavor/ui/shadcn";
import { useSpaceRoleStatic, useT } from "@/hooks";
import { RoleSelect } from "./RoleSelect";
import { getRolesWithLowerPermissions } from "./utils";

interface IInvite {
  className?: string;
  spaceId: string;
  role: SpaceRole;
}

export const Invite: React.FC<IInvite> = (props) => {
  const { className, spaceId, role } = props;
  const t = useT();

  const [inviteType, setInviteType] = useState<"link" | "email">("email");
  const [inviteRole, setInviteRole] = useState<SpaceRole>(role);
  const [email, setEmail] = useState<string>("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);

  const updateCollaboratorLoading = false;
  const createInviteLinkLoading = false;

  const sendInviteEmail = async () => {
    //
  };

  const createInviteLink = async () => {
    //
  };

  const changeInviteType = (inviteType: "link" | "email") => {
    initEmail();
    setInviteRole(SpaceRole.Creator);
    setInviteType(inviteType);
  };

  const initEmail = () => {
    setInviteEmails([]);
    setEmail("");
  };

  const emailInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace" && !email?.length) {
      setInviteEmails(inviteEmails.slice(0, inviteEmails.length - 1));
      return;
    }
    if (
      ["Space", "Enter"].includes(e.code) &&
      email &&
      z.string().email().safeParse(email).success &&
      !inviteEmails.includes(email)
    ) {
      setEmail("");
      setInviteEmails(inviteEmails.concat(email));
      e.preventDefault();
    }
  };

  const deleteEmail = (email: string) => {
    setInviteEmails((inviteEmails) =>
      inviteEmails.filter((inviteEmail) => email !== inviteEmail),
    );
  };

  const spaceRoleStatic = useSpaceRoleStatic();
  const filterRoles = useMemo(
    () => map(getRolesWithLowerPermissions(role, spaceRoleStatic), "role"),
    [role, spaceRoleStatic],
  );

  const isEmailInputValid = useMemo(
    () => z.string().email().safeParse(email).success,
    [email],
  );

  const EmailInvite = (
    <div>
      <div className="flex gap-2">
        <div className="flex max-h-64 min-h-8 flex-1 flex-wrap gap-1 overflow-y-auto rounded-md border border-input bg-background p-1 text-sm shadow-sm transition-colors">
          {inviteEmails.map((email) => (
            <div
              key={email}
              className="flex h-6 items-center rounded-full bg-muted px-2 text-xs text-muted-foreground"
            >
              {email}
              <Cross2Icon
                className="ml-1 cursor-pointer hover:opacity-70"
                onClick={() => deleteEmail(email)}
              />
            </div>
          ))}
          <input
            className="h-6 flex-auto bg-background text-xs outline-none"
            placeholder={t("space.invite.emailPlaceholder")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={emailInputChange}
          />
        </div>
        <RoleSelect
          value={inviteRole}
          filterRoles={filterRoles}
          onChange={setInviteRole}
        />
      </div>
      <Button
        className="mt-2"
        size={"sm"}
        disabled={
          (!isEmailInputValid && inviteEmails.length === 0) ||
          updateCollaboratorLoading
        }
        onClick={sendInviteEmail}
      >
        {t("space.invite.emailSend")}
      </Button>
    </div>
  );

  const LinkInvite = (
    <div>
      <div className="flex items-center text-sm">
        <span>{t("space.invite.linkPlaceholder")}</span>
        <RoleSelect
          className="mx-1"
          filterRoles={filterRoles}
          value={inviteRole}
          onChange={setInviteRole}
        />
      </div>
      <Button
        className="mt-2"
        size={"sm"}
        disabled={createInviteLinkLoading}
        onClick={createInviteLink}
      >
        {t("space.invite.linkSend")}
      </Button>
    </div>
  );

  const showLink = hasPermission(role, "space|invite_link");

  if (!showLink) {
    return (
      <div className={cn(className, "rounded bg-muted px-4 py-2")}>
        {EmailInvite}
      </div>
    );
  }

  return (
    <div className={cn(className, "rounded bg-muted px-4 py-2")}>
      <div className="pb-2">
        <Button
          className="mr-6 p-0 data-[state=active]:underline"
          data-state={inviteType === "email" ? "active" : "inactive"}
          variant={"link"}
          onClick={() => changeInviteType("email")}
        >
          {t("space.invite.tabEmail")}
        </Button>
        <Button
          className="p-0 data-[state=active]:underline"
          data-state={inviteType === "link" ? "active" : "inactive"}
          variant={"link"}
          onClick={() => changeInviteType("link")}
        >
          {t("space.invite.tabLink")}
        </Button>
      </div>
      <div>{inviteType === "email" ? EmailInvite : LinkInvite}</div>
    </div>
  );
};
