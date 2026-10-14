import React from 'react';
import {
  FileText,
  TableProperties,
  Layers,
  KeyRound,
  Calculator,
  PlusCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab, QuestionItem } from '../types';

interface DocumentNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  questions: QuestionItem[];
  onAddNewQuestion: () => void;
  onOpenConfig: () => void;
}

export const DocumentNavigation: React.FC<DocumentNavigationProps> = ({
  activeTab,
  setActiveTab,
  questions,
  onAddNewQuestion,
  onOpenConfig
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; countLabel?: string }[] = [
    {
      id: 'naskah',
      label: 'Naskah Soal',
      icon: <FileText className="w-4 h-4" />,
      countLabel: `${questions.length} Butir`
    },
    {
      id: 'kisi_kisi',
      label: 'Kisi-Kisi Soal',
      icon: <TableProperties className="w-4 h-4" />
    },
    {
      id: 'kartu_soal',
      label: 'Kartu Soal',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'kunci_jawaban',
      label: 'Kunci Jawaban & Pembahasan',
      icon: <KeyRound className="w-4 h-4" />
    },
    {
      id: 'norma_penilaian',
      label: 'Norma Penilaian (Skor 100)',
      icon: <Calculator className="w-4 h-4" />
    }
  ];

  const totalScore = questions.reduce((acc, q) => acc + q.bobotSkor, 0);

  return (
    <div className="no-print bg-white border-b border-slate-200 sticky top-[95px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 gap-3">
          {/* Tab Navigation Buttons */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.countLabel && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.countLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics and Add Manual Question Button */}
          <div className="flex items-center justify-between lg:justify-end gap-3 text-xs border-t lg:border-t-0 pt-2 lg:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Skor Akhir Maksimal:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {totalScore} / 100
              </span>
            </div>

            <button
              onClick={onAddNewQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Soal Manual</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
