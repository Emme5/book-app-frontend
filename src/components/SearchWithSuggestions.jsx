import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { IoSearchSharp } from "react-icons/io5";

const SearchWithSuggestions = ({ books = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState({
    authors: [],
    titles: [],
    categories: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

  // สร้าง Fuse instance เมื่อ books มีข้อมูล
  const fuse = useRef(
    books.length > 0
      ? new Fuse(books, {
          keys: ['title', 'author', 'category'],
          threshold: 0.4,
          includeScore: true,
          ignoreLocation: true,
          minMatchCharLength: 1
        })
      : null
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        if (fuse.current) {
          const results = fuse.current.search(searchTerm);
          const groupedResults = {
            authors: [],
            titles: [],
            categories: []
          };

          results.forEach(({ item, score }) => {
            if (score < 0.4) {
              if (item.author?.trim() && !groupedResults.authors.includes(item.author)) {
                groupedResults.authors.push(item.author);
              }
              if (item.title?.trim() && !groupedResults.titles.includes(item.title)) {
                groupedResults.titles.push(item.title);
              }
              if (item.category?.trim() && !groupedResults.categories.includes(item.category)) {
                groupedResults.categories.push(item.category);
              }
            }
          });

          groupedResults.authors = groupedResults.authors.slice(0, 5);
          groupedResults.titles = groupedResults.titles.slice(0, 5);
          groupedResults.categories = groupedResults.categories.slice(0, 5);

          setSuggestions(groupedResults);
          setShowSuggestions(true);
        }
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions({
        authors: Array.from(new Set(books.map(book => book.author))).slice(0, 5),
        titles: books.map(book => book.title).slice(0, 5),
        categories: Array.from(new Set(books.map(book => book.category))).slice(0, 5)
      });
      setShowSuggestions(true);
      setIsSearching(false);
    }
  }, [searchTerm, books]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      navigate('/book');
    } else {
      navigate(`/book?q=${encodeURIComponent(searchTerm)}`);
    }
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="relative sm:w-72 w-40">
      <form onSubmit={handleSearch} className="relative">
        <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 text-2xl hover:text-green-800 transition-colors"
          style={{
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))',
            strokeWidth: '2'
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="ค้นหาที่นี่"
          className="bg-white/90 backdrop-blur-sm w-full py-2 pl-10 pr-4 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </form>

      {showSuggestions && searchTerm.trim() && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-pulse">กำลังค้นหา...</div>
            </div>
          ) : (
            <>
              {suggestions.authors.length > 0 && (
                <div className="p-2 border-b">
                  <div className="text-sm font-semibold text-gray-600 mb-1">ผู้แต่ง</div>
                  {suggestions.authors.slice(0, 3).map((author, idx) => (
                    <div
                      key={`author-${idx}`}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(author)}`);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
                    >
                      ผู้แต่ง: {author}
                    </div>
                  ))}
                </div>
              )}

              {suggestions.categories.length > 0 && (
                <div className="p-2 border-b">
                  <div className="text-sm font-semibold text-gray-600 mb-1">หมวดหมู่</div>
                  {suggestions.categories.slice(0, 3).map((category, idx) => (
                    <div
                      key={`category-${idx}`}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(category)}`);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
                    >
                      หมวดหมู่: {category}
                    </div>
                  ))}
                </div>
              )}

              {suggestions.titles.length > 0 && (
                <div className="p-2">
                  <div className="text-sm font-semibold text-gray-600 mb-1">หนังสือ</div>
                  {suggestions.titles.slice(0, 3).map((title, idx) => (
                    <div
                      key={`title-${idx}`}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(title)}`);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
                    >
                      {title}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
