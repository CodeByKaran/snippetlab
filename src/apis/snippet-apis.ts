import { supabase } from "../utils/supabase";

// In your snippet-apis.js
const paginateSnippets = async (params: {
  page: number;
  pageSize?: number;
}) => {
  try {
    const pageSize = params.pageSize ?? 20;
    const startOffset = (params.page - 1) * pageSize;
    const endOffset = params.page * pageSize - 1;

    const res = await supabase
      .from("snippets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(startOffset, endOffset);

    if (res.error) {
      throw res.error;
    }

    const total = res.count ?? 0;
    const hasMore = params.page * pageSize < total;
    const nextPage = params.page + 1;

    return {
      snippets: res.data,
      total: total,
      hasMore: hasMore, // Add this
      nextPage,
    };
  } catch (error) {
    throw error;
  }
};

const getOneSnippet = async (id: string) => {
  try {
    const res = await supabase
      .from("snippets")
      .select("*")
      .eq("id", id)
      .single();

    if (res.error) {
      throw res.error;
    }

    return res.data;
  } catch (error) {
    console.error("Error in getOneSnippet:", error);
    throw error;
  }
};

// Fetch 4 latest snippets for the "Trending" view
const getTrendingSnippets = async () => {
  const { data, error } = await supabase
    .from("snippets")
    .select("id, title")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return data;
};

// Search snippets by title (Fuzzy match, limit 10)
const searchSnippets = async (query: string) => {
  if (!query) return [];
  const { data, error } = await supabase
    .from("snippets")
    .select("id, title")
    .ilike("title", `%${query}%`) // case-insensitive fuzzy match
    .limit(10);

  if (error) throw error;
  return data;
};

export { paginateSnippets, getOneSnippet, getTrendingSnippets, searchSnippets };
