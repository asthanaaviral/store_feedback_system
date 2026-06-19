import StarRating from '../common/StarRating';

const StoreCard = ({ store, onRate }) => (
  <div id={`store-card-${store.id}`} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
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
      onClick={() => onRate(store)}
      className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
        store.userRating
          ? 'border border-blue-300 text-blue-600 hover:bg-blue-50'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {store.userRating ? 'Modify Rating' : 'Rate this Store'}
    </button>
  </div>
);

export default StoreCard;
