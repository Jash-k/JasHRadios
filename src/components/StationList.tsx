import React from 'react';
import { Station } from '../data/stations';
import { Radio, Music2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StationListProps {
  stations: Station[];
  currentStation: Station | null;
  isPlaying: boolean;
  onSelectStation: (station: Station) => void;
  favorites: string[];
  onToggleFavorite: (stationId: string) => void;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  currentStation,
  isPlaying,
  onSelectStation,
  favorites,
  onToggleFavorite
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      <AnimatePresence>
        {stations.map((station) => {
          const isCurrent = currentStation?.id === station.id;
          const isFavorite = favorites.includes(station.id);

          return (
            <motion.div
              key={station.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`
                group relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer
                ${isCurrent 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-200' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }
              `}
              onClick={() => onSelectStation(station)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`
                  h-10 w-10 rounded-lg flex items-center justify-center
                  ${isCurrent ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}
                `}>
                  {isCurrent && isPlaying ? (
                     <div className="flex gap-0.5 items-end h-4">
                        <motion.div animate={{ height: [4, 16, 8, 14, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-current rounded-full" />
                        <motion.div animate={{ height: [12, 6, 16, 8, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-current rounded-full" />
                        <motion.div animate={{ height: [8, 14, 6, 12, 8] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-current rounded-full" />
                     </div>
                  ) : (
                    <Radio size={20} />
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(station.id);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'text-red-500 fill-current bg-red-50' 
                      : isCurrent ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>

              <div>
                <h3 className={`font-semibold text-lg line-clamp-1 ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                  {station.name}
                </h3>
                <p className={`text-xs mt-1 font-medium flex items-center gap-1 opacity-80 ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                  <Music2 size={12} />
                  FM Radio
                </p>
              </div>

              {isCurrent && (
                <div className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
