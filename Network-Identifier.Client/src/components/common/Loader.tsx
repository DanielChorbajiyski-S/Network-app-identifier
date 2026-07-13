export function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center py-20 ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );
}
