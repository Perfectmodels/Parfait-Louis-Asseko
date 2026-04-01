import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-4 mt-12 text-pm-off-white">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-black border border-pm-gold/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pm-gold hover:text-pm-dark transition-colors"
            >
                Précédent
            </button>
            <div className="flex items-center gap-2">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
                            currentPage === number 
                                ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                                : 'bg-black border-pm-gold/50 hover:bg-pm-gold/20'
                        }`}
                        aria-current={currentPage === number ? 'page' : undefined}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black border border-pm-gold/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pm-gold hover:text-pm-dark transition-colors"
            >
                Suivant
            </button>
        </nav>
    );
};

export default Pagination;
