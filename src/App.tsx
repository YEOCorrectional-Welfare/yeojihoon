/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  GraduationCap,
  HeartHandshake,
  Lock,
  LogOut,
  Mail,
  Menu,
  Plus,
  RotateCcw,
  Sprout,
  Trash2,
  X,
} from 'lucide-react';

type ResearchCategory = '학술논문' | '학회발표' | '보고서' | '프로젝트';
type ResearchFilter = '전체' | ResearchCategory;
type AdminTab = 'profile' | 'experience' | 'research';

interface ProfileData {
  brandName: string;
  englishBrand: string;
  researcherName: string;
  roleTitle: string;
  affiliation: string;
  heroHeadline: string;
  heroGreeting: string;
  keywords: string[];
  aboutInterestsTitle: string;
  aboutInterestsBody: string;
  aboutEducationTitle: string;
  aboutEducationBody: string;
  aboutVisionTitle: string;
  aboutVisionBody: string;
  email: string;
  contactMessage: string;
}

interface ExperienceItem {
  id: string;
  period: string;
  category: string;
  organization: string;
  title: string;
  description: string;
}

interface ResearchItem {
  id: string;
  year: string;
  category: ResearchCategory;
  title: string;
  venue: string;
  authors: string;
  abstract: string;
}

interface PortfolioStore {
  profile: ProfileData;
  experiences: ExperienceItem[];
  researches: ResearchItem[];
}

const STORAGE_KEY = 'youth_forest_portfolio_v2';
const ADMIN_PASSWORD = '1234';
const HERO_STUDY_IMAGE = '/src/assets/images/hero_forest_study_1794820164961.jpg';
const PORTRAIT_IMAGE = '/assets/images/yeojihoon_profile.jpg';

const INITIAL_DATA: PortfolioStore = {
  profile: {
    brandName: '지훈의 연구실',
    englishBrand: 'Youth & Forest',
    researcherName: '여지훈 (呂知訓)',
    roleTitle: '청소년지도학과 석사과정 · 청소년지도사 2급',
    affiliation: '명지대학교 일반대학원 청소년지도학과',
    heroHeadline: '청소년의 오늘을 경청하고,\n내일의 숲을 함께 가꿉니다',
    heroGreeting:
      '명지대학교 일반대학원 청소년지도학과 석사과정에 재학 중인 여지훈입니다. 대구한의대학교 청소년교육상담학과에서 다진 이론적 토대와 청소년 수련시설 실습 및 서울 소년원 보호협의회 자원봉사 경험을 바탕으로, 현장에 온기를 전하는 청소년지도를 연구합니다.',
    keywords: ['#청소년지도학', '#명지대학교일반대학원', '#청소년교육상담', '#청소년지도사2급', '#수련활동개발'],
    aboutInterestsTitle: '연구 및 현장 관심사',
    aboutInterestsBody:
      '대전 구즉 청소년 문화의 집 실습(수련 활동 인증 프로그램·드론 축구 프로그램 보조 및 인증제 프로그램 모의 개발)과 서울 소년원 보호협의회 자원봉사 경험을 토대로, 청소년 수련활동 프로그램 기획·운영과 보호·위기 청소년의 건강한 성장 지원 방안을 중점적으로 탐구합니다.',
    aboutEducationTitle: '학력 및 자격',
    aboutEducationBody:
      '2026년 2월 대구한의대학교 청소년교육상담학과 학사를 졸업하고, 현재 명지대학교 일반대학원 청소년지도학과 석사과정에 재학 중입니다. 국가자격증인 청소년지도사 2급을 보유하고 있습니다.',
    aboutVisionTitle: '연구자로서의 비전',
    aboutVisionBody:
      '이론과 현장이 분리되지 않고 서로를 비추는 청소년지도학을 지향합니다. 청소년이 스스로 자신의 가능성을 발견하고 건강한 숲처럼 자라날 수 있도록 돕는 연구자이자 실천가로 성장하겠습니다.',
    email: 'yeojihoon00@naver.com',
    contactMessage:
      '청소년 프로그램 기획, 연구 교류, 현장 활동 및 협업과 관련한 문의는 아래 이메일로 편하게 연락해 주세요.',
  },
  experiences: [
    {
      id: 'exp-1',
      period: '재학 중',
      category: '대학원 학위과정',
      organization: '명지대학교 일반대학원',
      title: '청소년지도학과 일반대학원 석사 과정',
      description:
        '청소년지도학의 이론적 심화와 현장 적용 가능성을 탐구하며 학위 연구를 이어가고 있습니다.',
    },
    {
      id: 'exp-2',
      period: '2026.02',
      category: '학사 졸업',
      organization: '대구한의대학교',
      title: '청소년교육상담학과 학사 졸업 · 청소년지도사 2급',
      description:
        '청소년 교육 및 상담 전반의 전공 지식을 이수하고 졸업했으며, 청소년지도사 2급 자격을 취득했습니다.',
    },
    {
      id: 'exp-3',
      period: '2025',
      category: '현장 실습',
      organization: '대전 구즉 청소년 문화의 집',
      title: '청소년 수련시설 현장 실습',
      description:
        '수련 활동 인증 프로그램 보조, 드론 축구 프로그램 보조, 수련 활동 인증제 프로그램 모의 개발 등을 수행하며 청소년 수련시설 실무와 프로그램 기획 역량을 익혔습니다.',
    },
    {
      id: 'exp-4',
      period: '봉사 활동',
      category: '교정·보호 자원봉사',
      organization: '서울 소년원 보호협의회',
      title: '서울 소년원 보호협의회 자원봉사자',
      description:
        '보호소년들의 정서적 안정과 건강한 성장을 지원하기 위한 서울 소년원 보호협의회 자원봉사 활동에 참여했습니다.',
    },
    {
      id: 'exp-5',
      period: '학창 시절',
      category: '초·중·고 학력',
      organization: '전민초 · 전민중 · 만년고',
      title: '전민초등학교 · 전민중학교 · 만년고등학교 졸업',
      description:
        '전민초등학교, 전민중학교, 만년고등학교를 졸업하며 성장기를 보냈습니다.',
    },
  ],
  researches: [
    {
      id: 'res-1',
      year: '2025',
      category: '프로젝트',
      title: '청소년 수련활동인증제 프로그램 모의 개발 기획안',
      venue: '대전 구즉 청소년 문화의 집 현장 실습 과업',
      authors: '여지훈',
      abstract:
        '2025년 대전 구즉 청소년 문화의 집 실습 과정에서 수행한 수련활동인증제 프로그램 모의 개발 결과물입니다. 청소년의 자발적 참여와 안전 기준을 반영하여 프로그램 목표, 차시별 활동 구성, 지도자 배치 및 안전관리 계획을 체계적으로 설계했습니다. (실제 학술논문이나 추가 연구 이력은 관리자 모드에서 자유롭게 수정·추가하실 수 있습니다.)',
    },
    {
      id: 'res-2',
      year: '2025',
      category: '보고서',
      title: '수련 활동 인증 및 드론 축구 프로그램 현장 보조 운영 기록',
      venue: '대전 구즉 청소년 문화의 집 실습 보고',
      authors: '여지훈',
      abstract:
        '청소년 수련시설 현장에서 수련 활동 인증 프로그램과 드론 축구 프로그램을 보조 운영하며 관찰한 참여 청소년들의 몰입 요소, 또래 간 상호작용, 그리고 현장 지도자의 안전·소통 역할을 정리한 실습 기록입니다.',
    },
    {
      id: 'res-3',
      year: '2026',
      category: '학술논문',
      title: '청소년지도학 대학원 학위 연구 주제 탐색 노트',
      venue: '명지대학교 일반대학원 청소년지도학과 (연구 진행 중)',
      authors: '여지훈',
      abstract:
        '청소년교육상담학 학부 전공과 현장 실습 및 서울 소년원 보호협의회 자원봉사 경험을 연결하여, 석사과정에서 심화할 연구 주제를 탐색하고 있는 아카이브 항목입니다. 향후 학술논문 및 학회발표 실적이 확정되면 관리자 모드에서 바로 업데이트할 수 있습니다.',
    },
  ],
};

function loadInitialStore(): PortfolioStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw) as Partial<PortfolioStore>;
    return {
      profile: { ...INITIAL_DATA.profile, ...(parsed.profile ?? {}) },
      experiences: Array.isArray(parsed.experiences)
        ? parsed.experiences
        : INITIAL_DATA.experiences,
      researches: Array.isArray(parsed.researches)
        ? parsed.researches
        : INITIAL_DATA.researches,
    };
  } catch {
    return INITIAL_DATA;
  }
}

export default function App() {
  const [store, setStore] = useState<PortfolioStore>(() => loadInitialStore());
  const [viewMode, setViewMode] = useState<'portfolio' | 'admin'>('portfolio');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Header & Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);

  // Portfolio Research Filter
  const [researchFilter, setResearchFilter] = useState<ResearchFilter>('전체');

  // Contact Copy Feedback
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Image Error Fallbacks
  const [heroImgError, setHeroImgError] = useState(false);
  const [portraitImgError, setPortraitImgError] = useState(false);

  // Admin State
  const [adminTab, setAdminTab] = useState<AdminTab>('profile');
  const [saveNotice, setSaveNotice] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Admin Profile Form State
  const [profileForm, setProfileForm] = useState<ProfileData>(store.profile);
  const [keywordsText, setKeywordsText] = useState(store.profile.keywords.join(', '));

  // Admin Experience Form State
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Omit<ExperienceItem, 'id'>>({
    period: '',
    category: '',
    organization: '',
    title: '',
    description: '',
  });

  // Admin Research Form State
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [resForm, setResForm] = useState<Omit<ResearchItem, 'id'>>({
    year: new Date().getFullYear().toString(),
    category: '학술논문',
    title: '',
    venue: '',
    authors: '',
    abstract: '',
  });

  // Persist store changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [store]);

  // Keep profile form synced when store changes externally or resets
  useEffect(() => {
    setProfileForm(store.profile);
    setKeywordsText(store.profile.keywords.join(', '));
  }, [store.profile]);

  // ESC key closes open modals cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedResearch) setSelectedResearch(null);
        if (authModalOpen) {
          setAuthModalOpen(false);
          setAuthError('');
          setPasswordInput('');
        }
        if (resetConfirmOpen) setResetConfirmOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedResearch, authModalOpen, resetConfirmOpen, mobileMenuOpen]);

  const filteredResearches = useMemo(() => {
    if (researchFilter === '전체') return store.researches;
    return store.researches.filter((item) => item.category === researchFilter);
  }, [store.researches, researchFilter]);

  const researchCounts = useMemo(() => {
    return {
      전체: store.researches.length,
      학술논문: store.researches.filter((r) => r.category === '학술논문').length,
      학회발표: store.researches.filter((r) => r.category === '학회발표').length,
      보고서: store.researches.filter((r) => r.category === '보고서').length,
      프로젝트: store.researches.filter((r) => r.category === '프로젝트').length,
    };
  }, [store.researches]);

  const showTempNotice = (message: string) => {
    setSaveNotice(message);
    window.setTimeout(() => {
      setSaveNotice((prev) => (prev === message ? '' : prev));
    }, 2600);
  };

  const handleOpenAdmin = () => {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      setViewMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setPasswordInput('');
    setAuthError('');
    setAuthModalOpen(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      setPasswordInput('');
      setAuthError('');
      setViewMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthError('비밀번호가 일치하지 않습니다. 테스트 비밀번호(1234)를 확인해 주세요.');
    }
  };

  const handleCopyEmail = async () => {
    const email = store.profile.email;
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  // Admin: Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedKeywords = keywordsText
      .split(',')
      .map((kw) => kw.trim())
      .filter(Boolean)
      .map((kw) => (kw.startsWith('#') ? kw : `#${kw}`));

    setStore((prev) => ({
      ...prev,
      profile: {
        ...profileForm,
        keywords: parsedKeywords.length > 0 ? parsedKeywords : ['#청소년지도학'],
      },
    }));
    showTempNotice('프로필 및 소개글이 저장되었습니다.');
  };

  // Admin: Experience CRUD
  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.period.trim() || !expForm.title.trim() || !expForm.organization.trim()) {
      return;
    }

    if (editingExpId) {
      setStore((prev) => ({
        ...prev,
        experiences: prev.experiences.map((item) =>
          item.id === editingExpId ? { id: editingExpId, ...expForm } : item
        ),
      }));
      setEditingExpId(null);
      showTempNotice('경력 및 활동 항목이 수정되었습니다.');
    } else {
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        ...expForm,
      };
      setStore((prev) => ({
        ...prev,
        experiences: [newItem, ...prev.experiences],
      }));
      showTempNotice('새 경력 및 활동 항목이 추가되었습니다.');
    }

    setExpForm({
      period: '',
      category: '',
      organization: '',
      title: '',
      description: '',
    });
  };

  const handleEditExperience = (item: ExperienceItem) => {
    setEditingExpId(item.id);
    setExpForm({
      period: item.period,
      category: item.category,
      organization: item.organization,
      title: item.title,
      description: item.description,
    });
  };

  const handleDeleteExperience = (id: string) => {
    setStore((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((item) => item.id !== id),
    }));
    if (editingExpId === id) {
      setEditingExpId(null);
      setExpForm({
        period: '',
        category: '',
        organization: '',
        title: '',
        description: '',
      });
    }
    showTempNotice('경력 및 활동 항목이 삭제되었습니다.');
  };

  // Admin: Research CRUD
  const handleSubmitResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.title.trim() || !resForm.year.trim() || !resForm.venue.trim()) {
      return;
    }

    if (editingResId) {
      setStore((prev) => ({
        ...prev,
        researches: prev.researches.map((item) =>
          item.id === editingResId ? { id: editingResId, ...resForm } : item
        ),
      }));
      setEditingResId(null);
      showTempNotice('연구 목록 항목이 수정되었습니다.');
    } else {
      const newItem: ResearchItem = {
        id: `res-${Date.now()}`,
        ...resForm,
      };
      setStore((prev) => ({
        ...prev,
        researches: [newItem, ...prev.researches],
      }));
      showTempNotice('새 연구 항목이 추가되었습니다.');
    }

    setResForm({
      year: new Date().getFullYear().toString(),
      category: '학술논문',
      title: '',
      venue: '',
      authors: '',
      abstract: '',
    });
  };

  const handleEditResearch = (item: ResearchItem) => {
    setEditingResId(item.id);
    setResForm({
      year: item.year,
      category: item.category,
      title: item.title,
      venue: item.venue,
      authors: item.authors,
      abstract: item.abstract,
    });
  };

  const handleDeleteResearch = (id: string) => {
    setStore((prev) => ({
      ...prev,
      researches: prev.researches.filter((item) => item.id !== id),
    }));
    if (editingResId === id) {
      setEditingResId(null);
      setResForm({
        year: new Date().getFullYear().toString(),
        category: '학술논문',
        title: '',
        venue: '',
        authors: '',
        abstract: '',
      });
    }
    showTempNotice('연구 항목이 삭제되었습니다.');
  };

  const handleConfirmReset = () => {
    setStore(INITIAL_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    setEditingExpId(null);
    setEditingResId(null);
    setResetConfirmOpen(false);
    showTempNotice('초기 샘플 데이터로 복원되었습니다.');
  };

  const navLinks = [
    { href: '#about', label: '소개' },
    { href: '#experience', label: '경력 및 활동' },
    { href: '#research', label: '연구 목록' },
    { href: '#contact', label: '연락처' },
  ];

  // =========================================================================
  // ADMIN DASHBOARD VIEW
  // =========================================================================
  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#F9FBF8] text-[#2C3531]">
        {/* Admin Top Bar */}
        <header className="sticky top-0 z-30 border-b border-[#DCE6DF] bg-[#F9FBF8]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <Sprout className="h-5 w-5 shrink-0 text-[#5F8D6E]" aria-hidden="true" />
              <span className="font-serif-editorial text-lg font-semibold tracking-tight text-[#2C3531] truncate">
                {store.profile.brandName} · 관리자
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#DCE6DF] bg-[#FAF9F6] px-3.5 py-2 text-xs font-medium text-[#5C6B64] transition-colors hover:border-[#8FB399] hover:text-[#2C3531] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">초기 데이터 복원</span>
                <span className="sm:hidden">복원</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  setViewMode('portfolio');
                }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2 text-xs font-medium text-[#5C6B64] transition-colors hover:border-[#8FB399] hover:text-[#2C3531] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('portfolio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#5F8D6E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4D755A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>포트폴리오로 돌아가기</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          {/* Save Notification Banner */}
          {saveNotice && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 flex items-center gap-2 rounded-2xl border border-[#8FB399] bg-[#E8F0EA] px-4 py-3 text-sm font-medium text-[#2C3531]"
            >
              <Check className="h-4 w-4 shrink-0 text-[#4D755A]" aria-hidden="true" />
              <span>{saveNotice}</span>
            </div>
          )}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[#5F8D6E]">브라우저 자동 저장 (Local Storage)</p>
              <h1 className="mt-1 font-serif-editorial text-2xl font-semibold tracking-tight text-[#2C3531] sm:text-3xl">
                포트폴리오 콘텐츠 관리
              </h1>
              <p className="mt-1.5 text-sm text-[#5C6B64]">
                수정한 내용은 즉시 저장되며, 우측 상단의 [포트폴리오로 돌아가기] 버튼으로 바로 확인할 수 있습니다.
              </p>
            </div>

            {/* Segmented Tab Controls */}
            <div
              role="tablist"
              aria-label="관리자 편집 섹션"
              className="inline-flex w-full sm:w-auto items-center gap-1 rounded-xl border border-[#DCE6DF] bg-[#E8F0EA]/60 p-1"
            >
              {(
                [
                  { id: 'profile', label: '프로필 및 소개' },
                  { id: 'experience', label: `경력 및 활동 (${store.experiences.length})` },
                  { id: 'research', label: `연구 목록 (${store.researches.length})` },
                ] as { id: AdminTab; label: string }[]
              ).map((tab) => {
                const active = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setAdminTab(tab.id)}
                    className={`flex-1 sm:flex-initial min-h-[38px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#5F8D6E] ${
                      active
                        ? 'bg-white text-[#2C3531] shadow-xs'
                        : 'text-[#5C6B64] hover:text-[#2C3531]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: PROFILE & ABOUT */}
          {adminTab === 'profile' && (
            <form
              onSubmit={handleSaveProfile}
              className="rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-[0_6px_28px_-10px_rgba(44,53,49,0.06)] sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="brandName" className="block text-xs font-semibold text-[#2C3531]">
                    웹사이트 브랜드명
                  </label>
                  <input
                    id="brandName"
                    type="text"
                    required
                    value={profileForm.brandName}
                    onChange={(e) => setProfileForm({ ...profileForm, brandName: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="englishBrand" className="block text-xs font-semibold text-[#2C3531]">
                    영문 서브 타이틀
                  </label>
                  <input
                    id="englishBrand"
                    type="text"
                    value={profileForm.englishBrand}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, englishBrand: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="researcherName"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    연구자 이름
                  </label>
                  <input
                    id="researcherName"
                    type="text"
                    required
                    value={profileForm.researcherName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, researcherName: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="roleTitle" className="block text-xs font-semibold text-[#2C3531]">
                    현재 직함 / 과정
                  </label>
                  <input
                    id="roleTitle"
                    type="text"
                    required
                    value={profileForm.roleTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, roleTitle: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="affiliation" className="block text-xs font-semibold text-[#2C3531]">
                    소속 대학원 / 기관
                  </label>
                  <input
                    id="affiliation"
                    type="text"
                    required
                    value={profileForm.affiliation}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, affiliation: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#2C3531]">
                    연락처 이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="heroHeadline"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    히어로 메인 문구 (줄바꿈 가능)
                  </label>
                  <textarea
                    id="heroHeadline"
                    rows={2}
                    required
                    value={profileForm.heroHeadline}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, heroHeadline: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="heroGreeting"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    히어로 인사말 소개
                  </label>
                  <textarea
                    id="heroGreeting"
                    rows={3}
                    required
                    value={profileForm.heroGreeting}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, heroGreeting: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="keywords" className="block text-xs font-semibold text-[#2C3531]">
                    핵심 키워드 (쉼표 , 로 구분)
                  </label>
                  <input
                    id="keywords"
                    type="text"
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    placeholder="#청소년지도학, #교정교육, #청소년심리"
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 border-t border-[#E6EEE8] pt-6">
                  <h2 className="font-serif-editorial text-lg font-semibold text-[#2C3531]">
                    소개(About Me) 세부 내용
                  </h2>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="aboutInterestsBody"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    연구 관심사
                  </label>
                  <textarea
                    id="aboutInterestsBody"
                    rows={3}
                    value={profileForm.aboutInterestsBody}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, aboutInterestsBody: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="aboutEducationBody"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    학력 및 전공 배경
                  </label>
                  <textarea
                    id="aboutEducationBody"
                    rows={3}
                    value={profileForm.aboutEducationBody}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, aboutEducationBody: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="aboutVisionBody"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    연구자로서의 비전
                  </label>
                  <textarea
                    id="aboutVisionBody"
                    rows={3}
                    value={profileForm.aboutVisionBody}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, aboutVisionBody: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="contactMessage"
                    className="block text-xs font-semibold text-[#2C3531]"
                  >
                    하단 연락처 안내 문구
                  </label>
                  <textarea
                    id="contactMessage"
                    rows={2}
                    value={profileForm.contactMessage}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, contactMessage: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#5F8D6E] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D755A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] cursor-pointer"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>프로필 변경사항 저장</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: EXPERIENCE CRUD */}
          {adminTab === 'experience' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <form
                onSubmit={handleSubmitExperience}
                className="lg:col-span-5 rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-[0_6px_28px_-10px_rgba(44,53,49,0.06)] h-fit"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-editorial text-lg font-semibold text-[#2C3531]">
                    {editingExpId ? '경력 및 활동 수정' : '새 경력 및 활동 추가'}
                  </h2>
                  {editingExpId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExpId(null);
                        setExpForm({
                          period: '',
                          category: '',
                          organization: '',
                          title: '',
                          description: '',
                        });
                      }}
                      className="text-xs font-medium text-[#5C6B64] underline hover:text-[#2C3531] cursor-pointer"
                    >
                      추가 모드로 전환
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="expPeriod" className="block text-xs font-semibold text-[#2C3531]">
                      기간 *
                    </label>
                    <input
                      id="expPeriod"
                      type="text"
                      required
                      placeholder="예: 2025.03 - 현재"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="expCategory"
                      className="block text-xs font-semibold text-[#2C3531]"
                    >
                      활동 구분
                    </label>
                    <input
                      id="expCategory"
                      type="text"
                      placeholder="예: 교정·현장 지도, 연구 활동, 멘토링"
                      value={expForm.category}
                      onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="expOrg"
                      className="block text-xs font-semibold text-[#2C3531]"
                    >
                      기관 / 소속명 *
                    </label>
                    <input
                      id="expOrg"
                      type="text"
                      required
                      placeholder="예: 대전 구즉 청소년 문화의 집"
                      value={expForm.organization}
                      onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="expTitle" className="block text-xs font-semibold text-[#2C3531]">
                      활동명 / 역할 *
                    </label>
                    <input
                      id="expTitle"
                      type="text"
                      required
                      placeholder="예: 청소년 수련시설 현장 실습"
                      value={expForm.title}
                      onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="expDesc" className="block text-xs font-semibold text-[#2C3531]">
                      상세 설명
                    </label>
                    <textarea
                      id="expDesc"
                      rows={4}
                      placeholder="수행한 역할과 현장 경험, 배운 점을 간략히 작성해 주세요."
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#5F8D6E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D755A] cursor-pointer"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{editingExpId ? '수정 내용 저장' : '경력 및 활동 추가'}</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                {store.experiences.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#FAF9F6] p-10 text-center text-sm text-[#5C6B64]">
                    등록된 경력 및 활동이 없습니다. 왼쪽 입력 폼에서 첫 항목을 추가해 주세요.
                  </div>
                ) : (
                  store.experiences.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-[#DCE6DF] bg-white p-5 transition-colors hover:border-[#8FB399]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B64] tabular-nums">
                            <span className="font-semibold text-[#5F8D6E]">{item.period}</span>
                            {item.category && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.category}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{item.organization}</span>
                          </div>
                          <h3 className="mt-1.5 text-base font-semibold text-[#2C3531]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#5C6B64]">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditExperience(item)}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#DCE6DF] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#2C3531] transition-colors hover:border-[#5F8D6E] hover:text-[#5F8D6E] cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(item.id)}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#DCE6DF] bg-white px-3 py-1.5 text-xs font-medium text-[#9A403A] transition-colors hover:border-[#C96B64] hover:bg-[#FDF4F3] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH CRUD */}
          {adminTab === 'research' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <form
                onSubmit={handleSubmitResearch}
                className="lg:col-span-5 rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-[0_6px_28px_-10px_rgba(44,53,49,0.06)] h-fit"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-editorial text-lg font-semibold text-[#2C3531]">
                    {editingResId ? '연구 항목 수정' : '새 연구 항목 추가'}
                  </h2>
                  {editingResId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingResId(null);
                        setResForm({
                          year: new Date().getFullYear().toString(),
                          category: '학술논문',
                          title: '',
                          venue: '',
                          authors: '',
                          abstract: '',
                        });
                      }}
                      className="text-xs font-medium text-[#5C6B64] underline hover:text-[#2C3531] cursor-pointer"
                    >
                      추가 모드로 전환
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="resYear" className="block text-xs font-semibold text-[#2C3531]">
                        연도 *
                      </label>
                      <input
                        id="resYear"
                        type="text"
                        required
                        placeholder="2026"
                        value={resForm.year}
                        onChange={(e) => setResForm({ ...resForm, year: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] tabular-nums focus:border-[#5F8D6E] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="resCategory"
                        className="block text-xs font-semibold text-[#2C3531]"
                      >
                        구분 *
                      </label>
                      <select
                        id="resCategory"
                        value={resForm.category}
                        onChange={(e) =>
                          setResForm({
                            ...resForm,
                            category: e.target.value as ResearchCategory,
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                      >
                        <option value="학술논문">학술논문</option>
                        <option value="학회발표">학회발표</option>
                        <option value="보고서">보고서</option>
                        <option value="프로젝트">프로젝트</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="resTitle" className="block text-xs font-semibold text-[#2C3531]">
                      연구 제목 *
                    </label>
                    <input
                      id="resTitle"
                      type="text"
                      required
                      placeholder="논문 또는 발표 제목을 입력하세요"
                      value={resForm.title}
                      onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="resVenue" className="block text-xs font-semibold text-[#2C3531]">
                      학술지 / 학회명 / 발행처 *
                    </label>
                    <input
                      id="resVenue"
                      type="text"
                      required
                      placeholder="예: 명지대학교 일반대학원 청소년지도학과 / 학회명"
                      value={resForm.venue}
                      onChange={(e) => setResForm({ ...resForm, venue: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resAuthors"
                      className="block text-xs font-semibold text-[#2C3531]"
                    >
                      저자 / 역할
                    </label>
                    <input
                      id="resAuthors"
                      type="text"
                      placeholder="예: 여지훈 (제1저자)"
                      value={resForm.authors}
                      onChange={(e) => setResForm({ ...resForm, authors: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resAbstract"
                      className="block text-xs font-semibold text-[#2C3531]"
                    >
                      연구 요약문 (Abstract)
                    </label>
                    <textarea
                      id="resAbstract"
                      rows={5}
                      placeholder="연구 목적, 방법, 주요 결과 및 의의를 입력해 주세요."
                      value={resForm.abstract}
                      onChange={(e) => setResForm({ ...resForm, abstract: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#5F8D6E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D755A] cursor-pointer"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{editingResId ? '수정 내용 저장' : '연구 항목 추가'}</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                {store.researches.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#FAF9F6] p-10 text-center text-sm text-[#5C6B64]">
                    등록된 연구가 없습니다. 왼쪽 입력 폼에서 첫 연구 항목을 추가해 주세요.
                  </div>
                ) : (
                  store.researches.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-[#DCE6DF] bg-white p-5 transition-colors hover:border-[#8FB399]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B64] tabular-nums">
                            <span className="font-semibold text-[#5F8D6E]">{item.year}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#2C3531]">{item.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.venue}</span>
                          </div>
                          <h3 className="mt-1.5 text-base font-semibold text-[#2C3531]">
                            {item.title}
                          </h3>
                          {item.authors && (
                            <p className="mt-1 text-xs text-[#5C6B64]">{item.authors}</p>
                          )}
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5C6B64]">
                            {item.abstract}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditResearch(item)}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#DCE6DF] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#2C3531] transition-colors hover:border-[#5F8D6E] hover:text-[#5F8D6E] cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResearch(item.id)}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#DCE6DF] bg-white px-3 py-1.5 text-xs font-medium text-[#9A403A] transition-colors hover:border-[#C96B64] hover:bg-[#FDF4F3] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Reset Confirmation Modal */}
        {resetConfirmOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C3531]/40 p-4 backdrop-blur-xs"
            onClick={() => setResetConfirmOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                id="reset-dialog-title"
                className="font-serif-editorial text-lg font-semibold text-[#2C3531]"
              >
                초기 샘플 데이터로 복원하시겠습니까?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C6B64]">
                현재 브라우저에 저장된 프로필, 경력, 연구 수정 내역이 모두 초기 기본 샘플 데이터로 되돌아갑니다.
              </p>
              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="min-h-[40px] rounded-xl border border-[#DCE6DF] bg-white px-4 py-2 text-xs font-medium text-[#5C6B64] hover:text-[#2C3531] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="min-h-[40px] rounded-xl bg-[#5F8D6E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4D755A] cursor-pointer"
                >
                  복원하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // PUBLIC PORTFOLIO VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F9FBF8] text-[#2C3531]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-[#E3ECE5] bg-[#F9FBF8]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-5 py-3.5 sm:px-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-serif-editorial text-lg font-semibold tracking-tight text-[#2C3531] transition-colors hover:text-[#5F8D6E] whitespace-nowrap shrink-0"
          >
            {store.profile.brandName}
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="주요 섹션 이동"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C6B64]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors duration-150 hover:text-[#2C3531] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#5F8D6E] after:transition-all after:duration-150 hover:after:w-full whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + Mobile Drawer Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D4E2D8] bg-[#FAF9F6] px-4 py-2 text-xs font-semibold text-[#4A6E56] transition-colors duration-150 hover:border-[#5F8D6E] hover:bg-[#E8F0EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>관리자 모드</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#DCE6DF] bg-[#FAF9F6] text-[#2C3531] transition-colors hover:bg-[#E8F0EA] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E3ECE5] bg-[#FAF9F6] px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-[#2C3531] transition-colors hover:bg-[#E8F0EA]"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={handleOpenAdmin}
                className="mt-2 flex min-h-[44px] items-center gap-2 rounded-xl border border-[#D4E2D8] bg-white px-3 text-sm font-semibold text-[#4A6E56] cursor-pointer"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>관리자 모드</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* 2) HERO SECTION */}
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Editorial Typography & Intro */}
            <div className="flex flex-col justify-between lg:col-span-6 lg:py-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#5F8D6E]">
                  {store.profile.englishBrand} · {store.profile.roleTitle}
                </p>

                <h1 className="mt-4 font-serif-editorial text-[clamp(2rem,3.6vw,3.1rem)] font-semibold leading-[1.28] tracking-tight text-[#2C3531] text-balance whitespace-pre-line">
                  {store.profile.heroHeadline}
                </h1>

                <p className="mt-6 max-w-xl text-base leading-[1.75] text-[#5C6B64]">
                  {store.profile.heroGreeting}
                </p>

                {/* Unboxed inline keyword list (Zero-Pill Discipline) */}
                <div
                  aria-label="주요 연구 키워드"
                  className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-[#4D755A]"
                >
                  {store.profile.keywords.map((kw, index) => (
                    <React.Fragment key={`${kw}-${index}`}>
                      <span>{kw}</span>
                      {index < store.profile.keywords.length - 1 && (
                        <span aria-hidden="true" className="text-[#B8CBBE]">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#research"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-[#5F8D6E] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(95,141,110,0.45)] transition-all duration-150 hover:bg-[#4D755A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0"
                >
                  <span>연구 아카이브 살펴보기</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex min-h-[46px] items-center gap-1.5 px-2 py-2 text-sm font-medium text-[#5C6B64] underline decoration-[#B8CBBE] underline-offset-4 transition-colors hover:text-[#2C3531] hover:decoration-[#5F8D6E] whitespace-nowrap shrink-0"
                >
                  <span>연구 문의하기</span>
                </a>
              </div>
            </div>

            {/* Right Column: Matching Height Forest Study Visual */}
            <div className="lg:col-span-6">
              <div className="relative h-72 sm:h-96 lg:h-full lg:min-h-[420px] w-full overflow-hidden rounded-2xl border border-[#DCE6DF] bg-[#E8F0EA] shadow-[0_12px_36px_-14px_rgba(44,53,49,0.12)]">
                {!heroImgError ? (
                  <img
                    src={HERO_STUDY_IMAGE}
                    alt="숲이 내다보이는 창가 원목 책상 위의 연구 노트와 식물"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E8F0EA] via-[#F2F6F3] to-[#DCE8DF] p-8 text-center">
                    <Sprout className="h-12 w-12 text-[#5F8D6E]" aria-hidden="true" />
                    <p className="mt-4 font-serif-editorial text-lg font-medium text-[#2C3531]">
                      {store.profile.brandName}
                    </p>
                    <p className="mt-1 text-xs text-[#5C6B64]">{store.profile.englishBrand}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full-width Horizontal Summary Strip below the Hero Split */}
          <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-[#E2EAE4] bg-[#FAF9F6] p-5 shadow-[0_4px_20px_-8px_rgba(44,53,49,0.05)] sm:p-6 lg:grid-cols-4 lg:gap-8">
            <div className="flex flex-col">
              <span className="text-xs text-[#5C6B64]">연구자</span>
              <span className="mt-1 font-serif-editorial text-lg font-semibold text-[#2C3531]">
                {store.profile.researcherName}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#5C6B64]">소속 대학원</span>
              <span className="mt-1 text-sm font-semibold text-[#2C3531] leading-snug">
                {store.profile.affiliation}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#5C6B64]">누적 연구·발표</span>
              <span className="mt-1 font-serif-editorial text-lg font-semibold text-[#5F8D6E] tabular-nums">
                {store.researches.length}건
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#5C6B64]">현장 및 지도 경력</span>
              <span className="mt-1 font-serif-editorial text-lg font-semibold text-[#5F8D6E] tabular-nums">
                {store.experiences.length}건
              </span>
            </div>
          </div>
        </section>

        {/* 3) ABOUT ME SECTION */}
        <section id="about" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-medium text-[#5F8D6E]">About Me</p>
            <h2 className="mt-2 font-serif-editorial text-2xl font-semibold tracking-tight text-[#2C3531] sm:text-3xl text-balance">
              사람의 마음을 먼저 읽는 연구자를 꿈꿉니다
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E2EAE4] bg-[#FAF9F6] p-6 shadow-[0_8px_30px_-12px_rgba(44,53,49,0.06)] sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Portrait & Quick Academic Profile */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-[#DCE6DF] bg-[#E8F0EA]">
                  {!portraitImgError ? (
                    <img
                      src={PORTRAIT_IMAGE}
                      alt={`${store.profile.researcherName} 프로필 사진`}
                      referrerPolicy="no-referrer"
                      onError={() => setPortraitImgError(true)}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#E8F0EA] p-6 text-center">
                      <GraduationCap className="h-10 w-10 text-[#5F8D6E]" aria-hidden="true" />
                      <span className="mt-3 text-sm font-semibold text-[#2C3531]">
                        {store.profile.researcherName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-1.5">
                  <h3 className="font-serif-editorial text-xl font-semibold text-[#2C3531]">
                    {store.profile.researcherName}
                  </h3>
                  <p className="text-sm font-medium text-[#5F8D6E]">{store.profile.roleTitle}</p>
                  <p className="text-sm text-[#5C6B64]">{store.profile.affiliation}</p>
                  <p className="pt-1 text-xs text-[#5C6B64] tabular-nums">
                    2000. 11. 07 · 대구한의대학교 청소년교육상담학과 학사
                  </p>
                </div>
              </div>

              {/* Three Editorial Pillars separated by hairline dividers (no nested cards) */}
              <div className="lg:col-span-8 divide-y divide-[#E4ECE6]">
                <div className="pb-7">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 shrink-0 text-[#5F8D6E]" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-[#2C3531]">
                      {store.profile.aboutInterestsTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[#5C6B64]">
                    {store.profile.aboutInterestsBody}
                  </p>
                </div>

                <div className="py-7">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="h-4 w-4 shrink-0 text-[#5F8D6E]" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-[#2C3531]">
                      {store.profile.aboutEducationTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[#5C6B64]">
                    {store.profile.aboutEducationBody}
                  </p>
                </div>

                <div className="pt-7">
                  <div className="flex items-center gap-2.5">
                    <HeartHandshake
                      className="h-4 w-4 shrink-0 text-[#5F8D6E]"
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-semibold text-[#2C3531]">
                      {store.profile.aboutVisionTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[#5C6B64]">
                    {store.profile.aboutVisionBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4) EXPERIENCE & ACTIVITIES TIMELINE */}
        <section id="experience" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-medium text-[#5F8D6E]">Experience & Activities</p>
            <h2 className="mt-2 font-serif-editorial text-2xl font-semibold tracking-tight text-[#2C3531] sm:text-3xl text-balance">
              현장의 숨결을 기록해 온 발자취
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#5C6B64]">
              대학원 연구 활동부터 교정기관·청소년수련시설에서의 현장 지도 및 멘토링 이력을 시간순으로 정리했습니다.
            </p>
          </div>

          {store.experiences.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#FAF9F6] p-10 text-center text-sm text-[#5C6B64]">
              등록된 경력 및 활동 이력이 없습니다.
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 before:absolute before:top-3 before:bottom-3 before:left-[9px] before:w-[1px] before:bg-[#DCE6DF]">
              <div className="space-y-6">
                {store.experiences.map((exp) => (
                  <article key={exp.id} className="relative">
                    {/* Structural Botanical Timeline Node */}
                    <span
                      aria-hidden="true"
                      className="absolute -left-6 sm:-left-8 top-6 flex h-5 w-5 items-center justify-center rounded-full border border-[#8FB399] bg-[#F9FBF8]"
                    >
                      <Sprout className="h-3 w-3 text-[#5F8D6E]" />
                    </span>

                    <div className="rounded-2xl border border-[#E2EAE4] bg-[#FAF9F6] p-6 transition-colors duration-150 hover:border-[#8FB399] sm:p-7">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B64]">
                          <span className="font-semibold text-[#5F8D6E] tabular-nums">
                            {exp.period}
                          </span>
                          {exp.category && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{exp.category}</span>
                            </>
                          )}
                        </div>
                        <span className="text-xs font-medium text-[#5C6B64]">
                          {exp.organization}
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-serif-editorial text-lg font-semibold text-[#2C3531]">
                        {exp.title}
                      </h3>

                      <p className="mt-2.5 text-[15px] leading-[1.7] text-[#5C6B64]">
                        {exp.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5) RESEARCH & PUBLICATIONS SECTION */}
        <section id="research" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-medium text-[#5F8D6E]">Research & Publications</p>
              <h2 className="mt-2 font-serif-editorial text-2xl font-semibold tracking-tight text-[#2C3531] sm:text-3xl text-balance">
                탐구하고 기록한 연구 목록
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#5C6B64]">
                각 항목을 클릭하면 연구의 배경과 주요 결과가 담긴 요약문(Abstract)을 자세히 확인하실 수 있습니다.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div
              role="group"
              aria-label="연구 유형 필터"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#DCE6DF] bg-[#E8F0EA]/65 p-1"
            >
              {(['전체', '학술논문', '학회발표', '보고서', '프로젝트'] as ResearchFilter[]).map(
                (category) => {
                  const active = researchFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setResearchFilter(category)}
                      aria-pressed={active}
                      className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#5F8D6E] ${
                        active
                          ? 'bg-white text-[#2C3531] shadow-xs'
                          : 'text-[#5C6B64] hover:text-[#2C3531]'
                      }`}
                    >
                      {category}{' '}
                      <span className="ml-0.5 text-[11px] font-normal text-[#5C6B64] tabular-nums">
                        {researchCounts[category]}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {filteredResearches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#FAF9F6] p-12 text-center text-sm text-[#5C6B64]">
              선택한 구분에 해당하는 연구 항목이 아직 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredResearches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedResearch(item)}
                  className="group flex flex-col justify-between rounded-2xl border border-[#E2EAE4] bg-[#FAF9F6] p-6 text-left shadow-[0_4px_20px_-10px_rgba(44,53,49,0.05)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#8FB399] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] cursor-pointer sm:p-7"
                >
                  <div>
                    {/* Zero-Pill Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B64] tabular-nums">
                      <span className="font-semibold text-[#5F8D6E]">{item.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#2C3531]">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[220px] sm:max-w-[280px]">{item.venue}</span>
                    </div>

                    <h3 className="mt-3 font-serif-editorial text-lg font-semibold leading-snug text-[#2C3531] transition-colors group-hover:text-[#4D755A]">
                      {item.title}
                    </h3>

                    {item.authors && (
                      <p className="mt-2 text-xs text-[#5C6B64]">{item.authors}</p>
                    )}

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#5C6B64]">
                      {item.abstract}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#E8EFEA] pt-4 text-xs font-semibold text-[#5F8D6E]">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>초록 및 요약 보기</span>
                    </span>
                    <ChevronRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 6) CONTACT & FOOTER */}
        <section id="contact" className="mx-auto max-w-6xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-20">
          <div className="rounded-2xl border border-[#DCE6DF] bg-[#E8F0EA]/60 p-8 sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium text-[#5F8D6E]">Contact</p>
                <h2 className="mt-2 font-serif-editorial text-2xl font-semibold tracking-tight text-[#2C3531] sm:text-3xl text-balance">
                  연구와 현장의 이야기를 함께 나누고 싶습니다
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5C6B64]">
                  {store.profile.contactMessage}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
                <a
                  href={`mailto:${store.profile.email}`}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-[#CFE0D4] bg-white px-5 py-3 text-sm font-medium text-[#2C3531] transition-colors hover:border-[#5F8D6E] whitespace-nowrap shrink-0"
                >
                  <Mail className="h-4 w-4 text-[#5F8D6E]" aria-hidden="true" />
                  <span>{store.profile.email}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#5F8D6E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4D755A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F8D6E] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>이메일 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E3ECE5] bg-[#F9FBF8]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-[#5C6B64] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {store.profile.brandName} ({store.profile.englishBrand}).
            All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#top" className="hover:text-[#2C3531] transition-colors">
              맨 위로
            </a>
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="inline-flex items-center gap-1 font-medium text-[#5C6B64] hover:text-[#5F8D6E] transition-colors cursor-pointer"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>관리자 모드</span>
            </button>
          </div>
        </div>
      </footer>

      {/* RESEARCH ABSTRACT MODAL */}
      {selectedResearch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="research-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C3531]/45 p-4 backdrop-blur-xs"
          onClick={() => setSelectedResearch(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B64] tabular-nums">
                <span className="font-semibold text-[#5F8D6E]">{selectedResearch.year}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#2C3531]">{selectedResearch.category}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedResearch.venue}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResearch(null)}
                aria-label="창 닫기"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE6DF] bg-white text-[#5C6B64] transition-colors hover:border-[#8FB399] hover:text-[#2C3531] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3
              id="research-modal-title"
              className="mt-4 font-serif-editorial text-xl font-semibold leading-snug text-[#2C3531] sm:text-2xl"
            >
              {selectedResearch.title}
            </h3>

            {selectedResearch.authors && (
              <p className="mt-2.5 text-sm font-medium text-[#5C6B64]">
                저자 및 참여: {selectedResearch.authors}
              </p>
            )}

            <div className="mt-6 border-t border-[#E4ECE6] pt-6">
              <h4 className="text-xs font-semibold text-[#5F8D6E]">연구 요약 (Abstract)</h4>
              <p className="mt-3 text-[15px] leading-[1.8] text-[#2C3531] whitespace-pre-line">
                {selectedResearch.abstract || '등록된 요약문이 없습니다.'}
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResearch(null)}
                className="min-h-[42px] rounded-xl bg-[#5F8D6E] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4D755A] cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PASSWORD MODAL */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-auth-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C3531]/45 p-4 backdrop-blur-xs"
          onClick={() => {
            setAuthModalOpen(false);
            setAuthError('');
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#DCE6DF] bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0EA] text-[#5F8D6E]">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    id="admin-auth-title"
                    className="font-serif-editorial text-lg font-semibold text-[#2C3531]"
                  >
                    관리자 모드 인증
                  </h3>
                  <p className="text-xs text-[#5C6B64]">콘텐츠를 편집하려면 비밀번호를 입력하세요.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthModalOpen(false);
                  setAuthError('');
                }}
                aria-label="창 닫기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE6DF] bg-white text-[#5C6B64] hover:text-[#2C3531] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-6">
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#2C3531]">
                비밀번호
              </label>
              <input
                id="admin-password"
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="비밀번호를 입력하세요"
                className="mt-2 w-full rounded-xl border border-[#DCE6DF] bg-white px-4 py-3 text-sm text-[#2C3531] focus:border-[#5F8D6E] focus:outline-none"
              />
              <p className="mt-2 text-xs text-[#5C6B64]">초기 테스트 비밀번호: 1234</p>

              {authError && (
                <p role="alert" className="mt-3 text-xs font-medium text-[#9A403A]">
                  {authError}
                </p>
              )}

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalOpen(false);
                    setAuthError('');
                  }}
                  className="min-h-[42px] rounded-xl border border-[#DCE6DF] bg-white px-4 py-2 text-xs font-medium text-[#5C6B64] hover:text-[#2C3531] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] rounded-xl bg-[#5F8D6E] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4D755A] cursor-pointer"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
