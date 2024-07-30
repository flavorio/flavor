import { useEffect } from "react";
import { useNavigate, useSearchParams } from "umi";
import { useShallow } from "zustand/react/shallow";
import { apiAgent } from "@/api";
import { LoadingSpinner } from "@flavor/ui/base";
import { useSpaceStore } from "@/stores/space-store";

export default function Invite() {
  const navigate = useNavigate();
  const [setCurrSpaceId, getSpaceInfo] = useSpaceStore(
    useShallow((state) => [state.setCurrSpaceId, state.getSpaceInfo]),
  );
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  const invitationCode = searchParams.get("invitationCode");

  useEffect(() => {
    if (invitationId && invitationCode) {
      apiAgent.invitation
        .acceptInvitationLink({
          invitationId,
          invitationCode,
        })
        .then((res) => {
          const { spaceId } = res.data;
          setCurrSpaceId(spaceId);
          getSpaceInfo();
          navigate("/docs");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
