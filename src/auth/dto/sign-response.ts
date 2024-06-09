import { Field, ObjectType } from '@nestjs/graphql';
import { User } from "../../user/user.entity"
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class SignResponse {
 @IsNotEmpty()
 @IsString()
@Field()
token: string;
@Field(() => User )
user:User
}