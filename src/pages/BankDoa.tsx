import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Search, Play, Maximize2, Moon, Sun, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BankDoa() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [doaList, setDoaList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('doa_categories').select('*').order('display_order');
    setCategories(data || []);
    if (data && data.length > 0) setSelectedCategory(data[0].id);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedCategory) fetchDoa(selectedCategory);
  }, [selectedCategory]);

  async function fetchDoa(categoryId: string) {
    setLoading(true);
    const { data } = await supabase
      .from('doa_list')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order');
    setDoaList(data || []);
    setLoading(false);
  }

  const filteredDoa = doaList.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-cream text-gray-900'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* HEADER & SEARCH */}
        <div className="flex justify-between items-center px-2">
           <h2 className={`text-2xl font-black ${isDarkMode ? 'text-secondary' : 'text-primary-dark'}`}>Bank Doa 🤲</h2>
           <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-400 shadow-sm'}`}
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>

        <div className={`flex items-center gap-3 px-4 py-3 rounded-[24px] border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari doa..." 
            className="bg-transparent border-none outline-none flex-1 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORIES HORIZONTAL */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl whitespace-nowrap font-bold text-xs transition-all duration-300 ${
                selectedCategory === cat.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : (isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 border border-gray-100')
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* DOA LIST */}
        <div className="space-y-4 px-1">
          {loading ? (
            <p className="text-center py-10 opacity-50">Mengambil doa suci...</p>
          ) : filteredDoa.length === 0 ? (
            <div className="text-center py-20 space-y-3 opacity-40">
               <Heart size={48} className="mx-auto" />
               <p className="font-medium">Doa belum tersedia.</p>
            </div>
          ) : filteredDoa.map((doa, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={doa.id}
              className={`p-6 rounded-[32px] border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-50 shadow-sm shadow-gray-200/20'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className={`font-black text-lg ${isDarkMode ? 'text-secondary' : 'text-primary-dark'}`}>{doa.title}</h3>
                <button className={`p-2 rounded-xl ${isDarkMode ? 'bg-gray-700 text-secondary' : 'bg-secondary/10 text-secondary'}`}>
                  <Play size={18} fill="currentColor" />
                </button>
              </div>

              <div className="space-y-6 text-center">
                <p className={`arabic-text text-3xl font-arabic leading-relaxed ${isDarkMode ? 'text-white' : 'text-primary-dark'}`}>
                  {doa.arabic_text}
                </p>
                
                <div className="space-y-2">
                  <p className={`text-sm italic font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doa.latin_text}
                  </p>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {doa.translation_id}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-100/20 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Keutamaan Tersedia</span>
                 <button className="text-primary flex items-center gap-1 text-[10px] font-black uppercase">
                    Detail <ChevronRight size={12} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
