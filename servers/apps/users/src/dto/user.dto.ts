import { InputType,Field } from "@nestjs/graphql";
import { IsEmail,IsNotEmpty,IsString, MinLength } from "class-validator";
import e from "express";

@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name need to be one string'})
    name: string;

    @Field()
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(8, {message: 'password must be atleast 8 characters'})
    password: string;

    @Field()
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Email is invalid'})
    email:string;

    @Field()
    @IsNotEmpty({message: 'PhoneNumber is required'})
    phone_number: number;
}

@InputType()
export class ActivationDto {
    @Field()
    @IsNotEmpty({message: 'Activation Token is required'})
    activationToken: string;

    @Field()
    @IsNotEmpty({message: 'Activation Code is required'})
    activationCode: string;
}

export class LoginDto {
    @Field()
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Email is invalid'})
    email:string;

    @Field()
    @IsNotEmpty({message: 'Password is required'})
    // @MinLength(8, {message: 'password must be atleast 8 characters'})
    password: string;

}
@InputType()
export class ForgotPasswordDto {
    @Field()
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Email is invalid'})
    email:string;

}
@InputType()
export class ResetPasswordDto {
    @Field()
    @IsNotEmpty({message: "Password is required."})
    @MinLength(8, {message: 'Password must be atleast 8 characters'})
    password: string;

    @Field()
    @IsNotEmpty({message: "Activation token is required."})
    activationToken: string
}