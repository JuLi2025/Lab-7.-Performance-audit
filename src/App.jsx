import { useState } from 'react';
import { tutors } from './data/tutors';
import { getVisibleTutors } from './utils/catalog';
import { useReferenceData } from './hooks/useReferenceData';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import TutorList from './components/TutorList';
import TutorDetails from './components/TutorDetails';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';

export const DEFAULT_FILTERS = {
  subjects: [],
  city: '',
  format: 'all',
  maxPrice: 1200,
  verifiedOnly: false,
};

export default function App() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('tutor-favorites', []);
  const [toast, setToast] = useState(null);
  const reference = useReferenceData();

  const visible = getVisibleTutors(tutors, { query, filters, sortBy });
  const tutorsPerPage = 20;
  const totalPages = Math.ceil(visible.length / tutorsPerPage);

  const startIndex = (currentPage - 1) * tutorsPerPage;
  const paginatedTutors = visible.slice(
    startIndex,
    startIndex + tutorsPerPage
  );
  const selected = tutors.find((t) => t.id === selectedId);

  const handleQueryChange = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (patch) => {
    setFilters({ ...filters, ...patch });
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const book = (tutor) => {
    setToast(`Заявку для ${tutor.name} надіслано. Репетитор зв'яжеться з вами найближчим часом.`);
    setSelectedId(null);
  };

  return (
    <div className="app">
      <Header favoritesCount={favorites.length} total={tutors.length} />
      <main className="layout">
        <Filters
          filters={filters}
          reference={reference}
          tutors={tutors}
          onChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />
        <section className="results">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            count={visible.length}
          />
          {visible.length === 0 ? (
            <EmptyState query={query} tutors={tutors} onPick={handleQueryChange} />
          ) : (
            <>
              <TutorList
                tutors={paginatedTutors}
                favorites={favorites}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                onToggleFavorite={toggleFavorite}
                style={{ marginTop: 16 }}
              />

              <div className="pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}>
                  Попередня
                </button>

                <span>
                  Сторінка {currentPage} з {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}>
                  Наступна
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      {selected && (
        <TutorDetails
          tutor={selected}
          isFavorite={favorites.includes(selected.id)}
          onToggleFavorite={() => toggleFavorite(selected.id)}
          onClose={() => setSelectedId(null)}
          onBook={() => book(selected)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
