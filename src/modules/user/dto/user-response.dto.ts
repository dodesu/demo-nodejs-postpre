import { Expose, Transform } from 'class-transformer';


export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    @Transform(({ value }) => (value === undefined ? undefined : value), {
        toPlainOnly: true,
    })
    email?: string;
}