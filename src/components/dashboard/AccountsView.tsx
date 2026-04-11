// components/dashboard/AccountsView.tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import { Badge } from "../ui/badge";

const AccountsView = () => {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["admin-accounts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", true);
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border bg-card inline-block min-w-[200px]">
        <p className="text-sm text-muted-foreground font-medium">
          Admin Accounts
        </p>
        <h3 className="text-3xl font-bold">{accounts?.length || 0}</h3>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Email
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {accounts?.map((acc) => (
              <tr key={acc.id} className="hover:bg-muted/20">
                <td className="p-4 font-medium">{acc.email}</td>
                <td className="p-4">
                  <Badge variant="secondary">Administrator</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AccountsView;
