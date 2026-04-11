// components/dashboard/CreateSnippetForm.tsx
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const snippetSchema = z.object({
  title: z.string().min(3, "Title is too short").max(100),
  language: z.string().min(1, "Language is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tags: z.string().optional(), // Handled as string, converted to array on submit
  code: z.string().min(5, "Code is required"),
  description: z.string().max(300).optional(),
});

type SnippetFormValues = z.infer<typeof snippetSchema>;

const CreateSnippetForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      language: "javascript",
      category: "",
      difficulty: "Easy",
      tags: "",
      code: "",
      description: "",
    },
  });

  const onSubmit = async (data: SnippetFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert comma-separated tags string to a clean array
      const tagsArray = data.tags;

      const payload = {
        ...data,
        tags: tagsArray,
      };

      const { error } = await supabase.from("snippets").insert([payload]);
      if (error) throw error;

      setStatus("success");
      setTimeout(() => {
        reset();
        onSuccess(); // Redirect back to snippets list
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-xl font-bold">Snippet Created!</h2>
        <p className="text-muted-foreground text-sm">
          Refreshing your collection...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Snippet</h2>
        <p className="text-muted-foreground text-sm">
          Fill in the details to add a new code snippet to the database.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Title & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Title</label>
            <Input
              {...register("title")}
              placeholder="e.g. Center a Div with Grid"
            />
            {errors.title && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Language</label>
            <Input
              {...register("language")}
              placeholder="javascript, typescript, css..."
            />
            {errors.language && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.language.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Category & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Category</label>
            <Input
              {...register("category")}
              placeholder="e.g. Frontend, Backend, Utils"
            />
            {errors.category && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Difficulty</label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Row 3: Tags */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">
            Tags (Comma separated)
          </label>
          <Input
            {...register("tags")}
            placeholder="react, hooks, ui, buttons"
          />
          <p className="text-[10px] text-muted-foreground italic">
            Press comma after each tag
          </p>
        </div>

        {/* Row 4: Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">
            Description (Optional)
          </label>
          <Input
            {...register("description")}
            placeholder="A short summary of what this snippet solves..."
          />
        </div>

        {/* Row 5: Code Content */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Code Content</label>
          <Textarea
            {...register("code")}
            className="font-mono min-h-[250px] bg-muted/20 text-sm p-4"
            placeholder="// Paste your code here..."
          />
          {errors.code && (
            <p className="text-[10px] text-destructive font-medium">
              {errors.code.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="w-full md:w-48 h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Create Snippet"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSnippetForm;
