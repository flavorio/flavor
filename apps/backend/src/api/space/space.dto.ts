import { IsNotEmpty } from "class-validator";

export class GetSpaceInfoRequest {
  @IsNotEmpty()
  id: string;
}
