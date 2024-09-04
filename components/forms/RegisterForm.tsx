"use client";

// React imports
import { useState } from "react";

// UI component imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Zod validation import
import { z } from "zod";
import { registerSchema } from "@/lib/schemas/registerSchema";

export default function RegisterForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState(""); // Use a string for zipcode
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Zod validation
    const result = registerSchema.safeParse({
      firstname,
      lastname,
      email,
      password,
    });

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      alert(errorMessage);
      return;
    }

    const data = result.data; // Use the validated data

    // API call with validated data
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert("Registration successful!");
    } else {
      // More specific error handling based on response codes/messages
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10 justify-center items-center">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Please fill in the form to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Victor"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Schoelcher"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                name="email"
                type="email" // Use type="text" for email
                placeholder="VictorSchoelcher@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CardFooter className="flex justify-end mt-5">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { registerSchema } from "@/lib/schemas/registerSchema";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// type RegisterFormData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const [serverError, setServerError] = useState<string | null>(null);

//   const onSubmit = async (data: RegisterFormData) => {
//     setServerError(null);
//     try {
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setServerError(errorData.error);
//       } else {
//         // Handle successful registration (e.g., redirect to login)
//       }
//     } catch (error) {
//       setServerError("An unexpected error occurred.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <label htmlFor="firstname">First Name</label>
//         <Input id="firstname" {...register("firstname")} />
//         {errors.firstname && <p>{errors.firstname.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="lastname">Last Name</label>
//         <Input id="lastname" {...register("lastname")} />
//         {errors.lastname && <p>{errors.lastname.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="email">Email</label>
//         <Input id="email" {...register("email")} />
//         {errors.email && <p>{errors.email.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="password">Password</label>
//         <Input id="password" type="password" {...register("password")} />
//         {errors.password && <p>{errors.password.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="confirmPassword">Confirm Password</label>
//         <Input
//           id="confirmPassword"
//           type="password"
//           {...register("confirmPassword")}
//         />
//         {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
//       </div>
//       {serverError && <p>{serverError}</p>}
//       <Button type="submit">Register</Button>
//     </form>
//   );
// }
