import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { PaginationProps } from './Pagination.interfaces';

const Pagination = ({ currentPage, totalPages, onPageChange, scrollToId = 'titulo' }: PaginationProps) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    const el = document.getElementById(scrollToId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        <FaChevronLeft size={12} />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500 text-sm select-none">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
              page === currentPage
                ? 'bg-gold-500 text-cinema-900 shadow-lg shadow-gold-500/20'
                : 'glass text-gray-400 hover:text-gold-500 hover:border-gold-500/30'
            }`}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Próxima página"
      >
        <FaChevronRight size={12} />
      </button>
    </nav>
  );
};

export default Pagination;
