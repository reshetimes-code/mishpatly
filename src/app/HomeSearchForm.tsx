"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 mb-12 animate-fade-in-up delay-400"
    >
      <div className="relative flex-1">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="הקלד שם אדם, חברה, מספר תיק או מילת חיפוש"
          className="w-full pr-12 pl-6 py-4.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-base placeholder:text-white/40 outline-none focus:border-[#C9A84C]/60 focus:bg-white/15 transition-all duration-300"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-8 py-4.5 bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] text-base font-bold rounded-xl shadow-lg shadow-[#C9A84C]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Search className="h-5 w-5" />
        חיפוש
      </button>
    </form>
  );
}
