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
    <div className="space-y-6 w-full max-w-full">
      {/* Stat Card */}
      <div className="p-6 rounded-xl border bg-card inline-block min-w-[200px]">
        <p className="text-sm text-muted-foreground font-medium">
          Admin Accounts
        </p>
        <h3 className="text-3xl font-bold">{accounts?.length || 0}</h3>
      </div>

      {/* Table Container - Responsive layout */}
      <div className="rounded-xl border bg-card overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden sm:block w-full">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-3 sm:p-4 font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts?.map((acc) => (
                <tr key={acc.id} className="hover:bg-muted/20">
                  <td className="p-3 sm:p-4">
                    <div className="font-medium break-words" title={acc.email}>
                      {acc.email}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge variant="secondary">Administrator</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Stacked columns */}
        <div className="sm:hidden divide-y">
          {accounts?.map((acc) => (
            <div key={acc.id} className="p-4 hover:bg-muted/20">
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Email
                </p>
                <p className="font-medium wrap-break-word text-sm max-[300px]:text-xs">
                  {acc.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Status
                </p>
                <Badge variant="secondary">Administrator</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsView;
