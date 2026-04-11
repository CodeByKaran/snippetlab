import { useState } from "react"; // Added useState
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
import { supabase } from "./utils/supabase";

const formSchema = z.object({
  email: z
    .email({ message: "Invalid email address." })
    .min(5, "Email must be at least 5 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setServerError(null);

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("No user found.");

      // 2. Check if the user exists in the 'profiles' table and is an admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        // 3. If not an admin, sign them out immediately
        await supabase.auth.signOut();
        throw new Error("Access denied. You do not have admin privileges.");
      }

      // 4. Success - Redirect to Dashboard
      console.log("Admin logged in successfully");
      navigate("/admin/dashboard");
    } catch (error: any) {
      setServerError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Card className="w-[85%] min-[510px]:max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Only authorized administrators can access this area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-submit" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Show Global Server Error */}
              {serverError && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                  {serverError}
                </div>
              )}

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Email Address</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      disabled={loading}
                      placeholder="admin@company.com"
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
                      disabled={loading}
                      placeholder="••••••••"
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
            <Button
              type="submit"
              form="form-submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full"
              disabled={loading}
            >
              Back
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
