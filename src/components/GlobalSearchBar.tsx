import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, FolderGit2, Users, Gauge, Lightbulb, 
  BookOpen, ArrowRight, Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface Props {
  onNavigate: (tab: string, itemId?: string) => void;
}

type SearchCategory = 'all' | 'projects' | 'researchers' | 'indicators' | 'patents' | 'publications';

interface SearchResultItem {
  id: string;
  type: 'project' | 'researcher' | 'indicator' | 'patent' | 'publication';
  title: string;
  subtitle: string;
  meta: string;
  targetTab: string;
  badge?: string;
  badgeColor?: 'teal' | 'emerald' | 'indigo' | 'amber' | 'slate';
}

export const GlobalSearchBar: React.FC<Props> = ({ onNavigate }) => {
  const { db } = useData();
  
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('all');
    }
  }, [isOpen]);

  // Extract compiled list of researchers (combining registered users and authors/inventors)
  const researchers = useMemo(() => {
    const map = new Map<string, {
      name: string;
      designation: string;
      department: string;
      role: string;
      email: string;
      patentsCount: number;
      pubsCount: number;
    }>();

    // From registered users
    db.users.forEach((u) => {
      const dept = db.departments.find(d => d.id === u.departmentId)?.name || 'Innovation Center';
      map.set(u.name.toLowerCase(), {
        name: u.name,
        designation: u.designation || 'Researcher & Innovator',
        department: dept,
        role: u.role.replace('_', ' '),
        email: u.email,
        patentsCount: 0,
        pubsCount: 0
      });
    });

    // Tally publications
    db.publications.forEach(p => {
      p.authors.forEach(author => {
        const key = author.toLowerCase();
        if (map.has(key)) {
          map.get(key)!.pubsCount += 1;
        } else {
          map.set(key, {
            name: author,
            designation: 'Research Scholar',
            department: p.departmentName || 'Ayurveda Sciences',
            role: 'Scientist',
            email: `${author.toLowerCase().replace(/\s+/g, '.')}@aiia.gov.in`,
            patentsCount: 0,
            pubsCount: 1
          });
        }
      });
    });

    // Tally patents
    db.patents.forEach(pt => {
      pt.inventors.forEach(inv => {
        const key = inv.toLowerCase();
        if (map.has(key)) {
          map.get(key)!.patentsCount += 1;
        } else {
          map.set(key, {
            name: inv,
            designation: 'Patent Inventor',
            department: pt.departmentName || 'Translational Medicine',
            role: 'Inventor',
            email: `${inv.toLowerCase().replace(/\s+/g, '.')}@aiia.gov.in`,
            patentsCount: 1,
            pubsCount: 0
          });
        }
      });
    });

    return Array.from(map.values());
  }, [db]);

  // Compute live search results
  const results: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // 1. Projects
    if (activeCategory === 'all' || activeCategory === 'projects') {
      db.projects.forEach((proj) => {
        const matchTitle = proj.title.toLowerCase().includes(q);
        const matchDesc = proj.description.toLowerCase().includes(q);
        const matchDept = proj.departmentName.toLowerCase().includes(q);
        const matchLead = proj.createdByName.toLowerCase().includes(q);
        const matchCategory = proj.category.toLowerCase().includes(q);

        if (!q || matchTitle || matchDesc || matchDept || matchLead || matchCategory) {
          items.push({
            id: `proj-${proj.id}`,
            type: 'project',
            title: proj.title,
            subtitle: `${proj.departmentName} · Lead: ${proj.createdByName}`,
            meta: `${proj.category} · Funding: ₹${(proj.funding / 100000).toFixed(1)}L · Status: ${proj.status}`,
            targetTab: 'projects',
            badge: proj.verificationStatus.replace('_', ' '),
            badgeColor: proj.verificationStatus === 'approved' ? 'emerald' : proj.verificationStatus === 'submitted' ? 'amber' : 'slate'
          });
        }
      });
    }

    // 2. Researchers
    if (activeCategory === 'all' || activeCategory === 'researchers') {
      researchers.forEach((res, idx) => {
        const matchName = res.name.toLowerCase().includes(q);
        const matchDept = res.department.toLowerCase().includes(q);
        const matchDesig = res.designation.toLowerCase().includes(q);
        const matchRole = res.role.toLowerCase().includes(q);

        if (!q || matchName || matchDept || matchDesig || matchRole) {
          const stats: string[] = [];
          if (res.pubsCount > 0) stats.push(`${res.pubsCount} Pubs`);
          if (res.patentsCount > 0) stats.push(`${res.patentsCount} Patents`);

          items.push({
            id: `res-${idx}-${res.name}`,
            type: 'researcher',
            title: res.name,
            subtitle: `${res.designation} · ${res.department}`,
            meta: stats.length > 0 ? stats.join(' · ') : res.email,
            targetTab: 'recognition',
            badge: res.role,
            badgeColor: 'teal'
          });
        }
      });
    }

    // 3. Indicators
    if (activeCategory === 'all' || activeCategory === 'indicators') {
      db.indicators.forEach((ind) => {
        const matchName = ind.name.toLowerCase().includes(q);
        const matchCode = ind.code.toLowerCase().includes(q);
        const matchDesc = ind.description.toLowerCase().includes(q);
        const matchCat = ind.category.toLowerCase().includes(q);

        if (!q || matchName || matchCode || matchDesc || matchCat) {
          items.push({
            id: `ind-${ind.id}`,
            type: 'indicator',
            title: ind.name,
            subtitle: `${ind.code} · ${ind.category}`,
            meta: `Target: ${ind.target} · Weight: ${ind.weight}% · ${ind.reportingPeriod}`,
            targetTab: 'indicators',
            badge: `${ind.weight}% Weight`,
            badgeColor: 'indigo'
          });
        }
      });
    }

    // 4. Patents
    if (activeCategory === 'all' || activeCategory === 'patents') {
      db.patents.forEach((pat) => {
        const matchTitle = pat.title.toLowerCase().includes(q);
        const matchApp = pat.applicationNumber.toLowerCase().includes(q);
        const matchInv = pat.inventors.some(i => i.toLowerCase().includes(q));
        const matchDept = pat.departmentName.toLowerCase().includes(q);

        if (!q || matchTitle || matchApp || matchInv || matchDept) {
          items.push({
            id: `pat-${pat.id}`,
            type: 'patent',
            title: pat.title,
            subtitle: `App #: ${pat.applicationNumber} · ${pat.departmentName}`,
            meta: `Inventors: ${pat.inventors.join(', ')}`,
            targetTab: 'patents',
            badge: pat.status,
            badgeColor: pat.status === 'Granted' ? 'emerald' : 'amber'
          });
        }
      });
    }

    // 5. Publications
    if (activeCategory === 'all' || activeCategory === 'publications') {
      db.publications.forEach((pub) => {
        const matchTitle = pub.title.toLowerCase().includes(q);
        const matchJournal = pub.journal.toLowerCase().includes(q);
        const matchAuthors = pub.authors.some(a => a.toLowerCase().includes(q));

        if (!q || matchTitle || matchJournal || matchAuthors) {
          items.push({
            id: `pub-${pub.id}`,
            type: 'publication',
            title: pub.title,
            subtitle: `${pub.journal} (${pub.publicationDate.slice(0, 4)})`,
            meta: `Authors: ${pub.authors.join(', ')} · ${pub.indexing}`,
            targetTab: 'publications',
            badge: pub.indexing,
            badgeColor: 'slate'
          });
        }
      });
    }

    // If query is empty, limit default suggestions to 12 items
    return q ? items : items.slice(0, 10);
  }, [query, activeCategory, db, researchers]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, activeCategory, query]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    onNavigate(item.targetTab, item.id);
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'project':
        return <FolderGit2 className="h-4 w-4 text-teal-700" />;
      case 'researcher':
        return <Users className="h-4 w-4 text-emerald-700" />;
      case 'indicator':
        return <Gauge className="h-4 w-4 text-indigo-700" />;
      case 'patent':
        return <Lightbulb className="h-4 w-4 text-amber-600" />;
      case 'publication':
        return <BookOpen className="h-4 w-4 text-slate-700" />;
    }
  };

  const getBadgeStyle = (color?: SearchResultItem['badgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      {/* Trigger Button in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2.5 w-full max-w-[200px] sm:max-w-[280px] md:max-w-[340px] px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs transition-colors shadow-2xs group"
        title="Search projects, researchers, indicators... (⌘K)"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          <span className="truncate text-slate-500 group-hover:text-slate-700">
            Search projects, researchers, indicators...
          </span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Global Command Palette Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-950/45 backdrop-blur-xs animate-fade-in">
          {/* Click Backdrop to close */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Search Palette Dialog */}
          <div 
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Top Search Input Box */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-white">
              <Search className="h-5 w-5 text-teal-800 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by project name, researcher, patent, or indicator code..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50"
              >
                ESC
              </button>
            </div>

            {/* Filter Category Segmented Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-xs">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              {(['all', 'projects', 'researchers', 'indicators', 'patents', 'publications'] as SearchCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div 
              ref={resultsContainerRef}
              className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100"
            >
              {results.length > 0 ? (
                results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors pt-2.5 ${
                        isSelected
                          ? 'bg-teal-50/80 border border-teal-200 text-slate-900'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-3">
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                          isSelected ? 'bg-white border-teal-300' : 'bg-slate-100 border-slate-200'
                        }`}>
                          {getIcon(item.type)}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono">
                              {item.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {item.subtitle}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {item.meta}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${getBadgeStyle(item.badgeColor)}`}>
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-teal-800 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 px-4 text-center space-y-2">
                  <Search className="h-8 w-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-semibold text-slate-800">
                    No results found for "{query}"
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching by researcher name (e.g. Anand Chaudhary), project keyword (e.g. Nadi), or indicator code (e.g. IND_STU_01).
                  </p>
                </div>
              )}
            </div>

            {/* Search Palette Footer with Keyboard Tips */}
            <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">esc</kbd>
                  <span>close</span>
                </span>
              </div>
              <div className="font-medium text-slate-400 font-mono">
                {results.length} {results.length === 1 ? 'item' : 'items'}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
