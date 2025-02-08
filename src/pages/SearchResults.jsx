import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getImgUrl } from "../utils/getImgUrl";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || '';
  const books = useSelector((state) => state.books.books);

  useEffect(() => {
    const searchBooks = () => {
      setLoading(true);
      try {
        // ค้นหาเฉพาะจากชื่อหนังสือ
        const filtered = books.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error("Error searching books:", error);
      } finally {
        setLoading(false);
      }
    };

    searchBooks();
  }, [searchQuery, books]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          ผลการค้นหาจากชื่อหนังสือ: <span className="font-semibold">"{searchQuery}"</span>
          {results.length > 0 
            ? ` (พบ ${results.length} เล่ม)`
            : ' (ไม่พบหนังสือที่ตรงกับการค้นหา)'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {results.length > 0 ? (
          results.map((book) => (
            <div
              key={book._id}
              className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-md mb-4">
                <img
                  src={getImgUrl(book.coverImage)}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-700 font-medium mb-1">
                Category: <span className="text-gray-900">{book.category}</span>
              </p>
              <p className="text-sm text-gray-500 line-through mb-1">
                Old Price: ${book.oldPrice}
              </p>
              <p className="text-sm text-green-600 font-bold mb-3">
                New Price: ${book.newPrice}
              </p>
              <p className="text-sm text-gray-800">
                Trending:{" "}
                <span
                  className={`font-medium ${
                    book.trending ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {book.trending ? "Yes" : "No"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            ไม่พบชื่อหนังสือที่ตรงกับการค้นหา
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;