import Link from 'next/link';

export default function LawyerNotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-legal-bg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-500 mb-2">עורך הדין לא נמצא</h1>
        <Link href="/lawyers" className="text-accent hover:underline">חזרה לפורטל עורכי הדין</Link>
      </div>
    </div>
  );
}
