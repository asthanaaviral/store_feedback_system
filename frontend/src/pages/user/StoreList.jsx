import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/common/StarRating';
import Modal from '../../components/common/Modal';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ name: '', address: '' });
  const [applied, setApplied] = useState({});

  // Rating modal state
  const [ratingModal, setRatingModal] = useState({ open: false, store: null, selected: 0 });
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/user/stores', { params: applied });
      setStores(res.data);
    } catch {
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const applySearch = (e) => {
    e.preventDefault();
    setApplied({ ...search });
  };

  const clearSearch = () => {
    setSearch({ name: '', address: '' });
    setApplied({});
  };

  const openRatingModal = (store) => {
    setRatingModal({ open: true, store, selected: store.userRating || 0 });
    setRatingMsg('');
  };

  const closeModal = () => {
    setRatingModal({ open: false, store: null, selected: 0 });
    setRatingMsg('');
  };

  const handleRatingSubmit = async () => {
    const { store, selected } = ratingModal;
    if (!selected) { setRatingMsg('Please select a rating.'); return; }

    setRatingLoading(true);
    setRatingMsg('');

    try {
      if (store.userRating) {
        await api.put(`/user/ratings/${store.id}`, { rating: selected });
      } else {
        await api.post('/user/ratings', { storeId: store.id, rating: selected });
      }
      closeModal();
      fetchStores(); // Refresh to show updated rating
    } catch (err) {
      setRatingMsg(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Browse Stores</h1>
        <p className="text-slate-500 text-sm mt-1">Find stores and share your rating</p>
      </div>

      {/* Search */}
      <form onSubmit={applySearch} className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="search-name"
            type="text"
            value={search.name}
            onChange={(e) => setSearch(p => ({ ...p, name: e.target.value }))}
            placeholder="Search by store name..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="search-address"
            type="text"
            value={search.address}
            onChange={(e) => setSearch(p => ({ ...p, address: e.target.value }))}
            placeholder="Search by address..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shrink-0">
            Search
          </button>
          {(applied.name || applied.address) && (
            <button type="button" onClick={clearSearch} className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-44 animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🏪</p>
          <p className="font-medium text-slate-600">No stores found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-base leading-snug">{store.name}</h3>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">{store.address}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24 shrink-0">Overall Rating</span>
                  <StarRating value={Math.round(parseFloat(store.avgRating))} readOnly size="sm" />
                  <span className="text-xs text-slate-500">{parseFloat(store.avgRating).toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24 shrink-0">Your Rating</span>
                  {store.userRating ? (
                    <StarRating value={store.userRating} readOnly size="sm" />
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not rated yet</span>
                  )}
                </div>
              </div>

              <button
                id={`rate-btn-${store.id}`}
                onClick={() => openRatingModal(store)}
                className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
                  store.userRating
                    ? 'border border-blue-300 text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {store.userRating ? 'Modify Rating' : 'Rate this Store'}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4">{stores.length} store{stores.length !== 1 ? 's' : ''} found</p>

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModal.open}
        onClose={closeModal}
        title={ratingModal.store?.userRating ? 'Modify Your Rating' : 'Rate this Store'}
      >
        {ratingModal.store && (
          <div>
            <p className="text-slate-600 text-sm mb-1 font-medium">{ratingModal.store.name}</p>
            <p className="text-slate-400 text-xs mb-5">{ratingModal.store.address}</p>

            <div className="flex justify-center mb-5">
              <StarRating
                value={ratingModal.selected}
                onChange={(val) => setRatingModal(p => ({ ...p, selected: val }))}
                size="lg"
              />
            </div>

            {ratingMsg && (
              <p className="text-red-500 text-sm text-center mb-3">{ratingMsg}</p>
            )}

            <div className="flex gap-3">
              <button onClick={closeModal}
                className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button
                id="submit-rating-btn"
                onClick={handleRatingSubmit}
                disabled={ratingLoading || !ratingModal.selected}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                {ratingLoading ? 'Saving...' : ratingModal.store?.userRating ? 'Update Rating' : 'Submit Rating'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoreList;
