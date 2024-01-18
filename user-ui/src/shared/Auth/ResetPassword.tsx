"use client"
import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";

const formSchema = z.object({
  password: z.string().min(8, "Password must be atleast 8 characters!"),
  confirmPassword: z.string(),
}).refine((values)=>{
    return values.password === values.confirmPassword},
    {
        message:"Passwords do not match! ",
        path: ["confirmPassword"],
    }
    );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({activationToken}:{activationToken: string | string[]}) => {
    const [resetPassword, {loading}] = useMutation(RESET_PASSWORD)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const [confirmPasswordshow,setconfirmPasswordshow] = useState(false);

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
        const response = await resetPassword({
            variables: {
                password: data.password,
                activationToken: activationToken,
            },
        });
        toast.success("Password updated successfully!")
        console.log(response)
    } catch (error: any) {
        console.log(error)
        toast.error(error.message);
        
    }
  };
  return (
    <div className="w-full flex justify-center items-center h-screen">
    <div className="md:w-[500px] w-full">
    <h1 className={`${styles.title}`}>Reset Your Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            {...register("password")}
            type={!show ? "password" : "text"}
            placeholder="password!@%"
            className={`${styles.input}`}
          />
          {errors.password && (
            <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
          )}
          {!show ? (
            <AiOutlineEyeInvisible
              size={20}
              onClick={() => setShow(true)}
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
            />
          ) : (
            <AiOutlineEye
              size={20}
              onClick={() => setShow(false)}
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
            />
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter confirm password
          </label>
          <input
            {...register("confirmPassword")}
            type={!confirmPasswordshow ? "password" : "text"}
            placeholder="password!@%"
            className={`${styles.input}`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 block mt-1">{`${errors.confirmPassword.message}`}</span>
          )}
          {!confirmPasswordshow ? (
            <AiOutlineEyeInvisible
              size={20}
              onClick={() => setconfirmPasswordshow(true)}
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
            />
          ) : (
            <AiOutlineEye
              size={20}
              onClick={() => setconfirmPasswordshow(false)}
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
            />
          )}
        </div>
        <br/>
        <div className="w-full mt-5">
          <input
            type="submit"
            value="Submit"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <br />
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
function values(arg: { password: string; confirmPassword: string; }): arg is { password: string; confirmPassword: string; } {
    throw new Error("Function not implemented.");
}

