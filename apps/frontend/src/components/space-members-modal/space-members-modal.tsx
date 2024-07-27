import { FormattedMessage } from "umi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@flavor/ui/shadcn";
import { useShallow } from "zustand/react/shallow";
import SpaceMemberModalContent from "./space-members-content";
import { useUIStore } from "@/stores/ui-store";

export default function SpaceMemberModal() {
  const [isSpaceMembersModalOpen, setIsSpaceMembersModalOpen] = useUIStore(
    useShallow((state) => [
      state.isSpaceMembersModalOpen,
      state.setIsSpaceMembersModalOpen,
    ]),
  );

  const handleOpenChange = (open: boolean) => {
    setIsSpaceMembersModalOpen(open);
  };

  return (
    <Dialog open={isSpaceMembersModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[90%] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="space.spaceMembers" />
          </DialogTitle>
        </DialogHeader>
        <SpaceMemberModalContent />
      </DialogContent>
    </Dialog>
  );
}
