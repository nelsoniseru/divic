import { InputType, Field } from '@nestjs/graphql'; 
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
@InputType()
export class LoginInput {
@IsNotEmpty()
@IsString()
@IsEmail()
@Field()
email: string
@IsNotEmpty()
@IsString()
@Field()
password:string
}