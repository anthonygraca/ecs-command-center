interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "16px" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{
          padding: "6px 12px",
          cursor: currentPage <= 1 ? "not-allowed" : "pointer",
          opacity: currentPage <= 1 ? 0.5 : 1,
        }}
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            padding: "6px 12px",
            fontWeight: p === currentPage ? "bold" : "normal",
            backgroundColor: p === currentPage ? "var(--color-primary)" : undefined,
            color: p === currentPage ? "white" : undefined,
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{
          padding: "6px 12px",
          cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          opacity: currentPage >= totalPages ? 0.5 : 1,
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
