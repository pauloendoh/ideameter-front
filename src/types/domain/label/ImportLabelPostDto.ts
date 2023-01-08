import { IsString } from "class-validator"

export class ImportLabelPostDto {
  constructor() {}
  @IsString()
  name: string

  @IsString()
  bgColor: string
}
