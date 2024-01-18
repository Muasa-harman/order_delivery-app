import { BadRequestException, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Args, Mutation, Resolver,Query, Context } from "@nestjs/graphql";
import { ActivationResponse, ForgotPasswordResponse, LoginResponse, LogoutResponse, RegisterResponse, ResetPasswordResponse } from "./types/user.types";
import { ActivationDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { Response } from "express";
import { isEmail } from "class-validator";
import { AuthGuard } from "./guards/auth.guard";

@Resolver('User')
// @UseFilters
export class UserResolver {
    constructor (
        private readonly userService: UsersService
    ){}

    @Mutation(()=> RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: {res:Response},
        ) : Promise<RegisterResponse>{
            if(!registerDto.name || !registerDto.email || !registerDto.password || !registerDto.phone_number){
                throw new BadRequestException ('Please fill all the fields');
            }

            const {activation_token} = await this.userService.register(registerDto,context.res);

            return { activation_token };
        }
        @Mutation(()=>ActivationResponse)
        async activateUser(
            @Args('activationDto') activationDto: ActivationDto,
            @Context() context: {res:Response},
        ) : Promise<ActivationResponse> {
            return await this.userService.activateUser(activationDto,context.res);
        }

        @Mutation(() => LoginResponse)
        async Login(
           @Args('email') email: string,
           @Args('password') password: string,
        ): Promise<LoginResponse> { 
          return await this.userService.Login({email, password});
        }

        @Query(() => LoginResponse)
        @UseGuards(AuthGuard)
        async getLoggedInUser(@Context() context: {req: Request}){
            return await this.userService.getLoggedInUser(context.req);
        }
        

        @Mutation(() => ForgotPasswordResponse)
        @UseGuards(AuthGuard)
        async forgotPassword(
            @Args('forgotPasswordDto') forgotPasswordDto:ForgotPasswordDto,
        ): Promise<ForgotPasswordResponse> {
            return await this.userService.forgotPassword(forgotPasswordDto);
        }

        @Mutation(() => ResetPasswordResponse)
        async resetPassword(
            @Args('resetPasswordDto') resetPasswordDto:ResetPasswordDto,
        ): Promise<ResetPasswordResponse> {
            return await this.userService.resetPassword(resetPasswordDto);
        }

        @Query(()=>LogoutResponse)
        @UseGuards(AuthGuard)
        async logOutUser(@Context() context: {req: Request}){
            return await this.userService.Logout(context.req)
        }

        @Query(()=>[User])
        async getUsers(){
            return this.userService.getUsers();
        }    
}