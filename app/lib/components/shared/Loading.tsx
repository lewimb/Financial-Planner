export default function Loading() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {/* Title Skeleton */}
          <div className="h-8 w-48 bg-gray-200 rounded-md" />
          {/* Subtitle Skeleton */}
          <div className="h-4 w-72 bg-gray-100 rounded-md" />
        </div>
        {/* Button Skeleton */}
        <div className="h-10 w-32 bg-gray-200 rounded-md" />
      </div>

      {/* 2. Summary Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 bg-white border rounded-xl shadow-sm space-y-4"
          >
            {/* Card Label */}
            <div className="h-4 w-24 bg-gray-100 rounded" />

            <div className="flex items-center justify-between">
              {/* Amount */}
              <div className="h-8 w-32 bg-gray-200 rounded" />
              {/* Icon Circle */}
              <div className="h-10 w-10 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Transaction Table Section */}
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50/50">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>

        {/* Table Rows (Generate 5 dummy rows) */}
        <div className="divide-y">
          {[...Array(5)].map((_, row) => (
            <div key={row} className="grid grid-cols-6 gap-4 p-4 items-center">
              {/* Col 1: Icon + Description */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex-shrink-0" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>

              {/* Col 2: Category */}
              <div className="h-4 w-24 bg-gray-100 rounded" />

              {/* Col 3: Date */}
              <div className="h-4 w-24 bg-gray-100 rounded" />

              {/* Col 4: Account */}
              <div className="h-4 w-28 bg-gray-100 rounded" />

              {/* Col 5: Type (Badge) */}
              <div className="h-6 w-16 bg-gray-100 rounded-full" />

              {/* Col 6: Amount (Align Right) */}
              <div className="flex justify-end">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
