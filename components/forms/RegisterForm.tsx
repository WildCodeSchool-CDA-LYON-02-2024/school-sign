"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.error);
      } else {
        // Handle successful registration (e.g., redirect to login)
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <Input id="address" {...register("address")} />
        {errors.address && <p>{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="zipcode">Zipcode</label>
        <Input id="zipcode" {...register("zipcode")} />
        {errors.zipcode && <p>{errors.zipcode.message}</p>}
      </div>
      <div>
        <label htmlFor="city">City</label>
        <Input id="city" {...register("city")} />
        {errors.city && <p>{errors.city.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>
      {serverError && <p>{serverError}</p>}
      <Button type="submit">Register</Button>
    </form>
  );
}
