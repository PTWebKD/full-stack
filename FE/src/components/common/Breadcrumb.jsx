import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();
  // Build breadcrumb segments from pathname
  const segments = location.pathname.split('/').filter(Boolean);
  const paths = segments.map((seg, idx) => '/' + segments.slice(0, idx + 1).join('/'));
  const names = segments.map(seg => {
    // Simple prettify: replace hyphens, capitalize
    return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  });

  return (
    <nav className="px-4 sm:px-6 py-2 text-xs text-[#18181B]/60 flex items-center gap-1">
      <Link to="/" className="hover:text-[#18181B] transition-colors">Home</Link>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          {i === segments.length - 1 ? (
            <span className="text-[#18181B]/80">{names[i]}</span>
          ) : (
            <Link to={paths[i]} className="hover:text-[#18181B] transition-colors">{names[i]}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
