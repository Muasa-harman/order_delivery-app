"use client";
import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/src/graphql/actions/register.action";
import toast from "react-hot-toast";

const formSchema = z.object({
    name:  z.string().min(3, "Name must be atleast 3 character long!"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be atleast 8 characters!"),
    phone_number: z.number().min(11, "Phone number must be atleast 11 characters")
  });
  type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({setActiveState}:{setActiveState: (e:string)=> void}) => {
    const [registerUserMutation, {loading}] = useMutation(REGISTER_USER);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<SignUpSchema>({
        resolver: zodResolver(formSchema),
      });
    
      const [show,setShow] = useState(false)
    
      const onSubmit = async(data: SignUpSchema) => {
        try {
            const response = await registerUserMutation({variables: data});
            localStorage.setItem("activation_token", response.data.register.activation_token)
            toast.success("Please check your email to activate your account");
            reset();
            setActiveState("Verification");
        } catch (error: any) {
            toast.error(error.message)
        }
      };
  return (
    <div>
    <h1 className={`${styles.title}`}>SignUp with Donfiles</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="w-full relative mb-3">
      <label className={`${styles.label}`}>Enter your Name</label>
      <input
      {...register("name")}
      type="text"
      placeholder="harmanmuasa"
      className={`${styles.input}`}
      />
      {errors.name && (
        <span className="text-red-500 block mt-1">{`${errors.name.message}`}</span>
      )}
      <br/>
    </div>
      <label className={`${styles.label}`}>Enter your Email</label>
      <input
        {...register("email")}
        type="email"
        placeholder="loginmail@gmail.com"
        className={`${styles.input}`}
      />
      {errors.email && (
        <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
      )}
       <div className="w-full relative mt-3">
      <label className={`${styles.label}`}>Enter your Phone Number</label>
      <input
      {...register("phone_number",{valueAsNumber: true})}
      type="number"
      placeholder="+2547****"
      className={`${styles.input}`}
      />
      {errors.phone_number && (
        <span className="text-red-500 block mt-1">{`${errors.phone_number.message}`}</span>
      )}
      <br/>
    </div>
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
        {!show ? (
          <AiOutlineEyeInvisible size={20} onClick={()=> setShow(true)} className="absolute bottom-3 right-2 z-1 cursor-pointer"/>
          ): (<AiOutlineEye size={20} onClick={()=>setShow(false)} className = "absolute bottom-3 right-2 z-1 cursor-pointer"/>)}
      </div>
          {errors.password && (
            <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
          )}
      <div className="w-full mt-5">
        <input type="submit" value="Sign Up" disabled={isSubmitting || loading} className={`${styles.button} mt-3`} />
      </div>
      <br/>
      <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">Or join with</h5>
      <div className="flex items-center justify-center my-3">
      <FcGoogle size={30} className="cursor-pointer mr-2"/>
      <AiFillGithub size={30} className="cursor-pointer ml-2"/>
      </div>
      <h5 className="text-center pt-4 font-Poppins text-[14px]">Already have any account?
      <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={()=> setActiveState("login")}>Login</span>  
      </h5>
      <br/>
    </form>
  </div>
  )
}

export default Signup