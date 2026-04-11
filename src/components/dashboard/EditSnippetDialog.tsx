import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
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

const EditSnippetDialog = ({ snippet, open, onOpenChange }: any) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      title: snippet.title,
      description: snippet.description || "",
      code: snippet.code,
      language: snippet.language,
      category: snippet.category || "",
      difficulty: snippet.difficulty || "Easy",
      tags: snippet.tags || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      // Process tags back into an array
      const tagsArray = values.tags;

      const { error } = await supabase
        .from("snippets")
        .update({ ...values, tags: tagsArray })
        .eq("id", snippet.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-snippets"] });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Edit Snippet</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Title
              </label>
              <Input {...form.register("title")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Language
              </label>
              <Input {...form.register("language")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Category
              </label>
              <Input
                {...form.register("category")}
                placeholder="e.g. Frontend"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Difficulty
              </label>
              <Select
                onValueChange={(v) => form.setValue("difficulty", v)}
                defaultValue={snippet.difficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Description
            </label>
            <Textarea {...form.register("description")} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Tags (comma separated)
            </label>
            <Input {...form.register("tags")} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Code
            </label>
            <Textarea
              {...form.register("code")}
              className="font-mono min-h-[200px] bg-zinc-950 text-zinc-100"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSnippetDialog;
