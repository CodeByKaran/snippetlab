import React, { useEffect, useMemo } from "react";
import SnippetCard from "./components/custom/snippetCard";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { paginateSnippets } from "./apis/snippet-apis";

const Home = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px", // Increased margin to start loading BEFORE user hits bottom
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["snippets"],
    queryFn: ({ pageParam = 1 }) =>
      paginateSnippets({ page: pageParam, pageSize: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,

    // --- OPTIMIZATION OPTIONS ---
    staleTime: 1000 * 60 * 5, // 5 minutes: Data stays "fresh", preventing unnecessary API hits
    gcTime: 1000 * 60 * 30, // 30 minutes: Keeps data in cache longer for back-navigation
    refetchOnWindowFocus: false, // Prevents jumping content when switching browser tabs
    retry: 2, // Only retry failed requests twice before showing error
    refetchOnMount: false, // Use cached data if available when returning to this page
  });

  // Memoize the flattened list to prevent expensive re-calculations on every render
  const allSnippets = useMemo(() => {
    return data?.pages.flatMap((page) => page.snippets) ?? [];
  }, [data?.pages]);

  // Handle Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Error loading snippets: {(error as any)?.message}</p>
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 sm:p-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allSnippets.map((snippet, index) => (
          <SnippetCard
            // Optimization: If your IDs are somehow duplicated from backend,
            // combine ID with index to prevent React key warnings
            key={`${snippet.id}-${index}`}
            {...snippet}
          />
        ))}
      </div>

      {/* Footer / Observer Trigger */}
      <div
        ref={ref}
        className="min-h-[100px] flex flex-col items-center justify-center mt-10"
      >
        {isFetchingNextPage && (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="text-sm text-gray-500">Loading more...</span>
          </div>
        )}

        {!hasNextPage && allSnippets.length > 0 && (
          <div className="space-y-2 text-center">
            <p className="text-2xl">🔚</p>
            <p className="text-gray-400 text-sm font-medium">
              You've reached the end of the collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
