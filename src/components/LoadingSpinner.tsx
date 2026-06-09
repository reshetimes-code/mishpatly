export default function LoadingSpinner({ text = 'טוען...' }: { text?: string }) {
  return (
    <div dir="rtl" className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A84C] animate-spin" />
      </div>
      <p className="text-gray-500 text-sm animate-pulse">{text}</p>
    </div>
  );
}
