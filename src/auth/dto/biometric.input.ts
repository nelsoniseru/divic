import { InputType, Field } from '@nestjs/graphql'; 
import { IsNotEmpty, IsString,IsEmail } from 'class-validator';
@InputType()
export class BiometricInput {

@IsNotEmpty()
@IsString()
@Field()
biometricKey:string
}