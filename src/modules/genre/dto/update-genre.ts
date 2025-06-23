import { PartialType } from "@nestjs/mapped-types";
import { CreateGenreDto } from "./create-genre";

export class UpdateGenreDto extends PartialType(CreateGenreDto) { }