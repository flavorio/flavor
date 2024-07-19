import { FormattedMessage } from "umi";
import { DotsHorizontalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@flavor/ui/shadcn";
import { Document } from "@/stores/space-store";

type DocOperationProps = {
  className?: string;
  doc: Document;
  onRename?: () => void;
};

export default function DocOperation(props: DocOperationProps) {
  const { className, doc, onRename } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <DotsHorizontalIcon className={className} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => onRename?.()}>
          <Pencil1Icon className="mr-2" />
          <FormattedMessage id="doc.rename" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
