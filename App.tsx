
import React, { useState, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import ServiceCard from './components/ServiceCard';
import ApplicationSection from './components/ApplicationSection';
import { INITIAL_SERVICES, CATEGORIES } from './constants';
import { Category, ServiceItem } from './types';

function App() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const applicationRef = useRef<HTMLElement>(null);

  const togglePin = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, isPinned: !s.isPinned } : s
    ));
  };

  const scrollToApplication = () => {
    applicationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredServices = useMemo(() => {
    return services
      .filter(service => {
        const matchesCategory = selectedCategory === '전체' || service.category === selectedCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [services, selectedCategory, searchQuery]);

  const visibleServices = isExpanded ? filteredServices : filteredServices.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onApplicationClick={scrollToApplication}
        onHomeClick={scrollToTop}
      />

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="pt-24 pb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-50/50 blur-[100px] rounded-full -z-10"></div>
          
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-6">
              <h1 className="text-[72px] font-black text-[#1d2939] leading-tight tracking-tighter">
                AI <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">ON</span>
              </h1>
              
              <div className="flex items-center">
                <div className="w-[84px] h-[44px] bg-blue-600 rounded-full relative shadow-inner p-1">
                  <div className="absolute right-1 top-1 w-9 h-9 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
                </div>
              </div>
            </div>
            
            <p className="text-[20px] text-[#475467] font-medium max-w-2xl mx-auto tracking-wide">
              Switch On your Potential
            </p>
          </div>
        </div>

        {/* Stats Dashboard Card */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/70 backdrop-blur-md border border-white rounded-full px-20 py-4 shadow-xl shadow-blue-900/5 flex items-center gap-24">
            <div className="flex items-center gap-6">
              <span className="text-[15px] text-[#8b95a1] font-bold">운영서비스</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] font-black text-[#1d63ed] leading-none">9</span>
                <span className="text-[16px] font-bold text-[#475467]">개</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-gray-100"></div>
            <div className="flex items-center gap-6">
              <span className="text-[15px] text-[#8b95a1] font-bold">추진서비스</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] font-black text-[#1d2939] leading-none">58</span>
                <span className="text-[16px] font-bold text-[#475467]">개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmark Style Category Tabs */}
        <div className="relative mb-12">
          {/* Bottom border that tabs sit on */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200"></div>
          
          <div className="flex flex-wrap items-end justify-center gap-2 px-4">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setIsExpanded(false);
                }}
                className={`
                  relative z-10 px-8 py-4 text-[15px] font-black transition-all duration-300 rounded-t-2xl border-x border-t
                  ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_-8px_16px_-4px_rgba(29,99,237,0.25)] -translate-y-1'
                    : 'bg-gray-100/50 text-gray-400 border-transparent hover:bg-gray-200/50 hover:text-gray-600 hover:-translate-y-0.5'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {selectedCategory === category.id && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  )}
                  {category.label}
                </div>
                {/* Visual overlap with the bottom line for active tab */}
                {selectedCategory === category.id && (
                  <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="relative">
          {filteredServices.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleServices.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onTogglePin={togglePin} 
                  />
                ))}
              </div>

              {!isExpanded && filteredServices.length > 6 && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 px-10 py-3 bg-white border border-gray-200 text-[#333d4b] font-bold rounded-full hover:bg-gray-50 transition-all shadow-sm group"
                  >
                    <span>서비스 더보기</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-gray-400">검색 결과가 없습니다.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('전체'); setIsExpanded(false); }}
                className="mt-4 text-[#1d63ed] font-bold hover:underline"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>

        <div ref={applicationRef as any}>
          <ApplicationSection />
        </div>
      </main>

      <footer className="mt-20 py-10 text-center opacity-40">
        <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.3em]">AI Experience Center</p>
      </footer>
    </div>
  );
}

export default App;
