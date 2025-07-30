export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-8 flex justify-end pr-4 gap-4">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="bg-black hover:bg-gray-800 text-white px-10 py-3 rounded duration-300"
        >
          Prev
        </button>
      )}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="bg-black hover:bg-gray-800 text-white px-10 py-3 rounded duration-300"
        >
          Next
        </button>
      )}
    </div>
  );
};
