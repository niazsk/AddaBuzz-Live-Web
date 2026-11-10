import React from 'react';
import { 
  Sparkles, 
  Mic2, 
  Gamepad2, 
  Music, 
  MessageSquare, 
  Code, 
  Palette, 
  Swords 
} from 'lucide-react';
import { Category, CategoryId } from '../../types';

interface CategorySliderProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return Sparkles;
      case 'Mic2': return Mic2;
      case 'Gamepad2': return Gamepad2;
      case 'Music': return Music;
      case 'MessageSquare': return MessageSquare;
      case 'Code': return Code;
      case 'Palette': return Palette;
      case 'Swords': return Swords;
      default: return Sparkles;
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>Live Categories</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
            {categories.length} Topics
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const Icon = getIcon(cat.iconName);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-900/40 scale-105'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white border-purple-900/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-purple-400'}`} />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">{cat.name}</span>
                {cat.banglaName && (
                  <span className={`text-[9px] ${isActive ? 'text-pink-100' : 'text-slate-400'}`}>
                    {cat.banglaName}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
