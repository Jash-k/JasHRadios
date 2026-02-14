import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StationList } from './components/StationList';
import { AudioPlayer } from './components/AudioPlayer';
import { stations as allStations, Station } from './data/stations';
import { Heart, Radio } from 'lucide-react';

export function App() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('jashradios-volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('jashradios-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    localStorage.setItem('jashradios-volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('jashradios-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleStationSelect = (station: Station) => {
    if (currentStation?.id === station.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  const filteredStations = useMemo(() => {
    let result = allStations;
    
    if (activeTab === 'favorites') {
      result = result.filter(s => favorites.includes(s.id));
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(lower));
    }

    return result;
  }, [searchTerm, favorites, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 font-sans">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b border-slate-200">
           <button
             onClick={() => setActiveTab('all')}
             className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
               activeTab === 'all' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             <div className="flex items-center gap-2">
               <Radio size={16} />
               All Stations
             </div>
             {activeTab === 'all' && (
               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
             )}
           </button>
           <button
             onClick={() => setActiveTab('favorites')}
             className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
               activeTab === 'favorites' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             <div className="flex items-center gap-2">
               <Heart size={16} className={activeTab === 'favorites' ? 'fill-current' : ''} />
               Favorites ({favorites.length})
             </div>
             {activeTab === 'favorites' && (
               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
             )}
           </button>
        </div>

        {filteredStations.length > 0 ? (
          <StationList
            stations={filteredStations}
            currentStation={currentStation}
            isPlaying={isPlaying}
            onSelectStation={handleStationSelect}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Radio className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No stations found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      {/* Fixed Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none z-50">
        <div className="container mx-auto max-w-4xl pointer-events-auto">
          {currentStation && (
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-1 border border-white/10 overflow-hidden text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 -z-10" />
              
              <div className="flex flex-col md:flex-row items-center p-3 gap-4">
                <div className="flex-1 flex items-center gap-4 w-full md:w-auto overflow-hidden">
                   <div className="h-14 w-14 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-white/10">
                     <Radio className="text-indigo-300 animate-pulse" />
                   </div>
                   <div className="min-w-0">
                     <h3 className="font-bold text-lg leading-tight truncate">{currentStation.name}</h3>
                     <p className="text-indigo-300 text-xs font-medium">LIVE RADIO</p>
                   </div>
                </div>

                <div className="w-full md:w-auto flex justify-center">
                   <AudioPlayer 
                      url={currentStation.url}
                      isPlaying={isPlaying}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      volume={volume}
                      onVolumeChange={setVolume}
                   />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
