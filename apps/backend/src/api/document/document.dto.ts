import { IsNotEmpty } from "class-validator";


export class CreateDocumentRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  spaceId: string;

  doc: any;
}


export class CreateDocumentResponse {
  id: string;
}

