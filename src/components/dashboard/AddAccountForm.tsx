// components/dashboard/AddAccountForm.tsx
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const accountSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
});

const AddAccountForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // 2. Add user to profiles table with is_admin = true
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            email: data.email,
            is_admin: true,
          },
        ]);

        if (profileError) throw profileError;
      }

      alert("Admin account created successfully! They can now log in.");
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Add Admin Account</h2>
        <p className="text-muted-foreground text-sm">
          Grant dashboard access to a new administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-md flex items-center gap-2">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium">Email Address</label>
          <Input
            {...register("email")}
            type="email"
            placeholder="admin@example.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Temporary Password</label>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border mb-4">
          <div className="flex gap-2 items-start text-muted-foreground">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              By clicking "Create Account", this user will immediately gain full
              administrative privileges to edit/delete snippets and manage other
              accounts.
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            "Create Admin Account"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddAccountForm;
