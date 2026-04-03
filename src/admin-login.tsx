import React from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z
    .email({ message: "Invalid email address." })
    .min(5, "Email must be at least 5 characters.")
    .max(32, "Email must be at most 32 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters."),
});

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Card className="w-[85%]  min-[510px]:max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Please enter your email and password to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-submit" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Email Address</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="form-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="mt-5">
          <Field orientation="vertical">
            <Button type="submit" form="form-submit">
              Login
            </Button>
            <Button variant={"outline"} onClick={handleBack}>
              Back
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
