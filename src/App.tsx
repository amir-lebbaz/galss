import React, { useMemo, useState } from 'react';
import {
  ArrowUpLeft,
  Bookmark,
  Check,
  Copy,
  Eye,
  Heart,
  MessageSquare,
  Send,
  ShoppingBag,
  Sliders,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  BACKDROP_THEMES,
  CLIENT_TESTIMONIALS,
  CREATOR_POSTS,
  CURRENCY_RATES,
  CreatorPost,
  CurrencyCode,
  PROOF_METRICS,
  SOCIAL_ACCOUNTS,
  SUBSCRIPTIONS,
  SubscriptionCategory,
  SubscriptionPlan,
} from './data/catalog';
import { GlassTiltCard } from './components/GlassTiltCard';
import { SupernaturalBackdrop } from './components/SupernaturalBackdrop';

interface CartItem {
  plan: SubscriptionPlan;
  billingCycle: 'annual' | 'monthly';
  quantity: number;
}

export default function App() {
  // Interactive Backdrop & Accessibility State
  const [activeThemeId, setActiveThemeId] = useState<string>(BACKDROP_THEMES[0].id);
  const [reducedMotionMode, setReducedMotionMode] = useState<boolean>(false);

  // Subscriptions Filter, Billing & Currency State
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory>('all');
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [currency, setCurrency] = useState<CurrencyCode>('SAR');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Cart & Modals State
  const [cart, setCart] = useState<CartItem[]>([
    { plan: SUBSCRIPTIONS[0], billingCycle: 'annual', quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoFeedback, setPromoFeedback] = useState<string>('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [customerCheckoutEmail, setCustomerCheckoutEmail] = useState<string>('');

  // Active Modals for Subscription Details & Creator Post Reader
  const [activePlanModal, setActivePlanModal] = useState<SubscriptionPlan | null>(null);
  const [activePostModal, setActivePostModal] = useState<CreatorPost | null>(null);

  // Posts Interaction State (Likes & Bookmarks)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Direct Contact Form State & Validation
  const [contactName, setContactName] = useState<string>('');
  const [contactHandle, setContactHandle] = useState<string>('');
  const [contactTopic, setContactTopic] = useState<string>(SUBSCRIPTIONS[0].title);
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactError, setContactError] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const activeTheme = useMemo(
    () => BACKDROP_THEMES.find((t) => t.id === activeThemeId) || BACKDROP_THEMES[0],
    [activeThemeId]
  );

  const filteredSubscriptions = useMemo(() => {
    if (selectedCategory === 'all') return SUBSCRIPTIONS;
    return SUBSCRIPTIONS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const formatPrice = (usdAmount: number): string => {
    const rateObj = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateObj.rate);
    return `${converted.toLocaleString('en-US')} ${rateObj.symbol}`;
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const addToCart = (plan: SubscriptionPlan, cycle: 'annual' | 'monthly' = billingCycle) => {
    setCheckoutSuccess(false);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.plan.id === plan.id && item.billingCycle === cycle
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { plan, billingCycle: cycle, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (planId: string, cycle: 'annual' | 'monthly') => {
    setCart((prev) =>
      prev.filter((item) => !(item.plan.id === planId && item.billingCycle === cycle))
    );
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCodeInput.trim().toUpperCase();
    if (clean === 'ATHEER15' || clean === 'VIP2026') {
      setAppliedDiscount(0.15);
      setPromoFeedback('تم تفعيل خصم 15% الإضافي بنجاح');
    } else {
      setAppliedDiscount(0);
      setPromoFeedback('الرمز غير صالح — جرب الرمز الترحيبي ATHEER15');
    }
  };

  const cartSubtotalUSD = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unitPrice =
        item.billingCycle === 'annual' ? item.plan.annualPriceUSD : item.plan.monthlyPriceUSD;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartFinalUSD = useMemo(() => {
    return Math.max(0, cartSubtotalUSD * (1 - appliedDiscount));
  }, [cartSubtotalUSD, appliedDiscount]);

  const totalCartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerCheckoutEmail.trim() || !customerCheckoutEmail.includes('@')) {
      setPromoFeedback('يرجى إدخال بريد إلكتروني صحيح لإرسال التفعيل الرسمي والضمان');
      return;
    }
    setCheckoutSuccess(true);
    setCart([]);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (contactName.trim().length < 2) {
      setContactError('يرجى كتابة الاسم الكامل (حرفين على الأقل).');
      return;
    }
    const cleanContact = contactHandle.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
    const isValidPhone = /^[+\d\s-]{8,16}$/.test(cleanContact);
    if (!isValidEmail && !isValidPhone) {
      setContactError('يرجى إدخال بريد إلكتروني صحيح أو رقم واتساب يبدأ بمفتاح الدولة.');
      return;
    }
    if (contactMessage.trim().length < 8) {
      setContactError('يرجى كتابة تفاصيل طلبك أو استفسارك بوضوح.');
      return;
    }

    setContactSubmitted(true);
  };

  const togglePostLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const togglePostBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div
      className={`min-h-screen relative text-slate-50 selection:bg-amber-400/30 selection:text-amber-100 ${
        reducedMotionMode ? 'a11y-solid-mode' : ''
      }`}
    >
      {/* Supernatural Animated Aurora Backdrop & Magnetic Cursor Physics */}
      <SupernaturalBackdrop theme={activeTheme} reducedMotion={reducedMotionMode} />

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="glass-header sticky top-0 z-40 px-6 lg:px-12 py-4">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-tight text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            أثير بلس
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200"
          >
            <a
              href="#subscriptions"
              className="hover:text-amber-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              الاشتراكات الرقمية
            </a>
            <a
              href="#proof"
              className="hover:text-amber-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              نتائج العملاء
            </a>
            <a
              href="#posts"
              className="hover:text-amber-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              المنشورات
            </a>
            <a
              href="#accounts"
              className="hover:text-amber-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              حساباتي
            </a>
            <a
              href="#contact"
              className="hover:text-amber-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              تواصل معي
            </a>
          </nav>

          {/* Zone 3: 2 primary actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="glass-input flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-100 hover:border-amber-300/60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-amber-300" />
              <span>السلة</span>
              <span className="font-mono-num text-amber-300">({totalCartCount})</span>
            </button>

            <a
              href="#subscriptions"
              className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
            >
              اطلب اشتراكك فوراً
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container (1440px Desktop Baseline, 1240px Max Content Container) */}
      <main id="top" className="relative z-10 mx-auto max-w-[1240px] px-6 lg:px-12 pb-24">
        {/* Glassmorphic Atmosphere & Accessibility Controls Bar */}
        <div className="pt-6 pb-2 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-amber-300" />
            <span>طيف الخلفية الزجاجية:</span>
            <div className="flex items-center gap-1.5" role="group" aria-label="اختيار طيف الخلفية">
              {BACKDROP_THEMES.map((themeItem) => (
                <button
                  key={themeItem.id}
                  type="button"
                  onClick={() => setActiveThemeId(themeItem.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeThemeId === themeItem.id
                      ? 'bg-white/20 text-white font-semibold border border-white/35'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {themeItem.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setReducedMotionMode((prev) => !prev)}
              aria-pressed={reducedMotionMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                reducedMotionMode
                  ? 'bg-amber-400/25 border-amber-300 text-amber-200 font-semibold'
                  : 'border-white/20 text-slate-300 hover:text-white hover:border-white/40'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{reducedMotionMode ? 'الوضع الثابت عالي التباين: مفعّل' : 'تقليل الحركة والشفافية'}</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION — Single Dominant Focal Carrier */}
        <section className="py-14 lg:py-20">
          <GlassTiltCard
            elevated
            disabledTilt={reducedMotionMode}
            intensity={3.5}
            className="p-8 lg:p-14"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                {/* Quiet unboxed metadata line (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-300/95">
                  <span>تراخيص رقمية أصلية 100%</span>
                  <span aria-hidden="true">·</span>
                  <span>تفعيل رسمي على بريدك الشخصي</span>
                  <span aria-hidden="true">·</span>
                  <span>ضمان ذهبي كامل المدة</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.22] tracking-tight text-white">
                  أدواتك الإبداعية واشتراكات الذكاء الاصطناعي بتفعيل رسمي فوري وبأقل من ربع التكلفة.
                </h1>

                <p className="text-base lg:text-lg text-slate-200 leading-relaxed max-w-[64ch]">
                  نوفّر للمصممين، المبرمجين، وصنّاع المحتوى في العالم العربي اشتراكات أصلية موثقة في
                  حزم Adobe Creative Cloud و ChatGPT Plus و Cursor Pro وباقات الترفيه السينمائي، مع
                  ربط مباشر على حسابك الشخصي دون طلب كلمات المرور.
                </p>

                {/* Primary Hero CTA + Secondary Jump Link */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#subscriptions"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 transition-transform duration-150 active:scale-98 whitespace-nowrap"
                  >
                    <span>استعرض الاشتراكات والأسعار</span>
                    <ArrowUpLeft className="h-4 w-4" />
                  </a>

                  <a
                    href="#posts"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/15 transition-colors whitespace-nowrap"
                  >
                    <span>اقرأ منشوراتي ومراجعات الأدوات</span>
                  </a>
                </div>

                {/* Regional & Trust Markers in Hero (Unboxed clean text) */}
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300">
                  <span>دعم الدفع المحلي والدولي (مدى · Apple Pay · BaridiMob · USDT · Visa)</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-amber-300">الرمز الترحيبي لخصم 15%: ATHEER15</span>
                </div>
              </div>

              {/* Right Focal Showcase Column inside Hero Glass Panel */}
              <div className="lg:col-span-5 space-y-5 border-t lg:border-t-0 lg:border-r border-white/20 pt-6 lg:pt-0 lg:pr-8">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>العرض الأكثر طلباً هذا الأسبوع</span>
                  <span className="font-mono-num text-amber-300">وفّر 80% سنوياً</span>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/20 aspect-[16/10] bg-slate-900">
                  {!brokenImages['hero-preview'] ? (
                    <img
                      src={SUBSCRIPTIONS[0].image}
                      alt={SUBSCRIPTIONS[0].title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, ['hero-preview']: true }))
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 p-6 text-center">
                      <span className="font-display text-sm font-semibold text-amber-200">
                        {SUBSCRIPTIONS[0].title}
                      </span>
                    </div>
                  )}
                  <div className="
                  absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent p-5 flex flex-col justify-end">
                    <p className="text-xs text-amber-300">01. باقة التصميم الشاملة</p>
                    <h2 className="font-display text-lg font-bold text-white mt-0.5">
                      Adobe Creative Cloud — جميع التطبيقات (100GB)
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-300 block">الاشتراك السنوي الرسمي</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono-num text-2xl font-bold text-white">
                        {formatPrice(SUBSCRIPTIONS[0].annualPriceUSD)}
                      </span>
                      <span className="font-mono-num text-xs text-slate-400 line-through">
                        {formatPrice(SUBSCRIPTIONS[0].officialPriceUSD)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(SUBSCRIPTIONS[0], 'annual')}
                    className="rounded-lg bg-white/15 border border-white/30 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    أضف للسلة فوراً
                  </button>
                </div>
              </div>
            </div>
          </GlassTiltCard>
        </section>

        {/* SECTION 01: DIGITAL SUBSCRIPTIONS BENTO SHOWCASE */}
        <section id="subscriptions" className="py-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-amber-300">01. المتجر الرقمي الموثق</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                الاشتراكات الرقمية المتاحة للتفعيل الفوري
              </h2>
              <p className="text-sm text-slate-200 max-w-2xl">
                اختر الفئة وعملة العرض ودورة الفوترة المناسبة لك. جميع الباقات تُفعّل رسمياً مع
                وثيقة ضمان طوال المدة.
              </p>
            </div>

            {/* Interactive Currency & Billing Cycle Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Billing Cycle Toggle */}
              <div
                className="glass-surface flex items-center gap-1 p-1 rounded-xl"
                role="group"
                aria-label="دورة الفوترة"
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  سنوي (توفير حتى 75%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  شهري مرن
                </button>
              </div>

              {/* Currency Switcher */}
              <div
                className="glass-surface flex items-center gap-1 p-1 rounded-xl"
                role="group"
                aria-label="العملة"
              >
                {(['SAR', 'USD', 'DZD'] as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`font-mono-num px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      currency === code
                        ? 'bg-white/25 text-white border border-white/30'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Category Segmented Filter Bar */}
          <div
            className="glass-surface inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl"
            role="tablist"
            aria-label="تصنيف الاشتراكات"
          >
            {[
              { id: 'all', label: 'جميع الباقات (5)' },
              { id: 'creative', label: 'التصميم والإبداع' },
              { id: 'ai', label: 'الذكاء الاصطناعي والبرمجة' },
              { id: 'entertainment', label: 'الترفيه والبث 4K' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === tab.id}
                onClick={() => setSelectedCategory(tab.id as SubscriptionCategory)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Asymmetric Bento Grid of Glassmorphic Subscription Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((plan) => {
              const activePriceUSD =
                billingCycle === 'annual' ? plan.annualPriceUSD : plan.monthlyPriceUSD;

              return (
                <GlassTiltCard
                  key={plan.id}
                  disabledTilt={reducedMotionMode}
                  className={`p-6 sm:p-8 flex flex-col justify-between ${
                    plan.featuredSpan && selectedCategory === 'all' ? 'lg:col-span-2' : 'lg:col-span-1'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Media Frame with Contrast Scrim & Zero-Broken-Image Fallback */}
                    <div className="relative overflow-hidden rounded-xl border border-white/20 aspect-[16/9] bg-slate-900">
                      {!brokenImages[plan.id] ? (
                        <img
                          src={plan.image}
                          alt={plan.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [plan.id]: true }))
                          }
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 p-6">
                          <Sparkles className="h-8 w-8 text-amber-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end">
                        {/* Unboxed metadata inside scrim */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-medium">
                          <span>
                            {plan.indexNumber}. {plan.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.deliveryTime}</span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.activationMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-white leading-snug">
                        {plan.title}
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">{plan.subtitle}</p>
                    </div>

                    {/* Unboxed Key Features List */}
                    <ul className="space-y-2 border-t border-white/15 pt-4 text-xs text-slate-200">
                      {plan.highlights.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-300 font-bold mt-0.5">—</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Unboxed Included Apps Metadata */}
                    <div className="text-xs text-slate-300 pt-1">
                      <span className="text-slate-400">التطبيقات المشمولة: </span>
                      {plan.includedApps.join(' · ')}
                    </div>
                  </div>

                  {/* Pricing & Interactive Actions Footer */}
                  <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-300 block">
                        {billingCycle === 'annual' ? 'سعر الباقة السنوية' : 'سعر الاشتراك الشهري'}
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono-num text-2xl font-bold text-white">
                          {formatPrice(activePriceUSD)}
                        </span>
                        {billingCycle === 'annual' && (
                          <span className="font-mono-num text-xs text-slate-400 line-through">
                            {formatPrice(plan.officialPriceUSD)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActivePlanModal(plan)}
                        className="rounded-lg border border-white/25 bg-white/10 px-3.5 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        تفاصيل الضمان
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(plan, billingCycle)}
                        className="rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </GlassTiltCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 02: PROOF OF IMPACT & VERIFIED CLIENT OUTCOMES (Adjacent to Claims) */}
        <section id="proof" className="py-12 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-300">02. إثبات الموثوقية والأثر الرقمي</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              أرقام موثقة وتجارب حقيقية للمشتركين
            </h2>
          </div>

          {/* Quantitative Rigor Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROOF_METRICS.map((metric) => (
              <GlassTiltCard
                key={metric.id}
                disabledTilt={reducedMotionMode}
                className="p-6 space-y-2"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-num text-3xl font-bold text-amber-300">
                    {metric.value}
                  </span>
                  <span className="text-sm font-semibold text-white">{metric.unit}</span>
                </div>
                <p className="text-xs text-amber-200/90">{metric.timeframe}</p>
                <p className="text-xs text-slate-200 leading-relaxed pt-1">{metric.context}</p>
              </GlassTiltCard>
            ))}
          </div>

          {/* Attributable Testimonials (Full Name, Role, Organization, Concrete Outcome) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CLIENT_TESTIMONIALS.map((item) => (
              <GlassTiltCard
                key={item.id}
                disabledTilt={reducedMotionMode}
                className="p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <p className="text-xs font-medium text-amber-300">{item.outcomeMetric}</p>
                  <p className="text-sm text-slate-100 leading-relaxed">"{item.quote}"</p>
                </div>

                <div className="border-t border-white/15 pt-4 space-y-1 text-xs">
                  <p className="font-semibold text-white">{item.fullName}</p>
                  <p className="text-slate-300">
                    {item.role} · {item.organization}
                  </p>
                  <p className="text-slate-400 pt-0.5">{item.subscriptionUsed}</p>
                </div>
              </GlassTiltCard>
            ))}
          </div>
        </section>

        {/* SECTION 03: CREATOR POSTS & TECHNICAL ARTICLES ("بعض منشوراتي") */}
        <section id="posts" className="py-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-amber-300">03. المدونة التقنية والتجارب</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                أحدث منشوراتي ومراجعاتي للأدوات الرقمية
              </h2>
              <p className="text-sm text-slate-200 max-w-2xl">
                مقالات تطبيقية وتجارب عملية أشارك فيها خلاصة استخدامي اليومي لأدوات التصميم والذكاء
                الاصطناعي وكيفية حماية حساباتك.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CREATOR_POSTS.map((post) => {
              const isLiked = Boolean(likedPosts[post.id]);
              const isBookmarked = Boolean(bookmarkedPosts[post.id]);
              const displayLikes = post.initialLikes + (isLiked ? 1 : 0);

              return (
                <GlassTiltCard
                  key={post.id}
                  disabledTilt={reducedMotionMode}
                  className="p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <span className="font-mono-num text-amber-300 font-semibold">
                        {post.indexNumber}.
                      </span>
                      <span>{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.publishDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-200 leading-relaxed">{post.excerpt}</p>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePostLike(post.id)}
                        aria-label="إعجاب بالمنشور"
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                          isLiked
                            ? 'bg-rose-500/25 text-rose-200 border border-rose-400/40'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span className="font-mono-num">{displayLikes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePostBookmark(post.id)}
                        aria-label="حفظ المنشور"
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-400/25 text-amber-200 border border-amber-300/40'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 ${
                            isBookmarked ? 'fill-amber-300 text-amber-300' : ''
                          }`}
                        />
                        <span>{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePostModal(post)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 whitespace-nowrap cursor-pointer"
                    >
                      <span>قراءة المنشور كاملاً</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </GlassTiltCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 04: MY OFFICIAL SOCIAL ACCOUNTS ("حساباتي") */}
        <section id="accounts" className="py-12 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-300">04. القنوات والمجتمعات الرسمية</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              حساباتي الرسمية على منصات التواصل
            </h2>
            <p className="text-sm text-slate-200 max-w-2xl">
              تأكد دائماً من التواصل عبر هذه المعرّفات الرسمية الموثقة للحصول على العروض اليومية
              ودعم التفعيل الفوري.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOCIAL_ACCOUNTS.map((account) => {
              const isCopied = copiedId === account.id;
              return (
                <GlassTiltCard
                  key={account.id}
                  disabledTilt={reducedMotionMode}
                  className="p-6 sm:p-7 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <span>{account.roleLabel}</span>
                      <span className="font-mono-num text-amber-300">
                        {account.followersCount} · {account.responseRate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-bold text-white">
                        {account.platform}
                      </h3>
                      <span
                        dir="ltr"
                        className="font-mono-num text-sm font-semibold text-amber-200"
                      >
                        {account.handle}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed">{account.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyText(account.handle, account.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                          <span className="text-emerald-200">تم نسخ المعرّف</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-amber-300" />
                          <span>نسخ المعرّف ({account.handle})</span>
                        </>
                      )}
                    </button>

                    <a
                      href="#contact"
                      onClick={() => {
                        setContactTopic(`تواصل عبر ${account.platform}`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-colors whitespace-nowrap"
                    >
                      <span>مراسلة سريعة</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </GlassTiltCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 05: INTERACTIVE CONTACT & CUSTOM ORDER ("طريقة تواصل معي") */}
        <section id="contact" className="py-12">
          <GlassTiltCard
            elevated
            disabledTilt={reducedMotionMode}
            intensity={3}
            className="p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-amber-300">05. قناة التواصل المباشر</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    تواصل معي مباشرة للتفعيل الفوري أو طلبات الفرق
                  </h2>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  سواء كنت ترغب في استفسار تقني قبل الشراء، أو تحتاج إلى باقة مخصصة لفريق عملك، أو
                  تود تفعيل اشتراكك فوراً عبر الدفع المحلي، أرسل رسالتك هنا وسأرد عليك شخصياً خلال
                  دقائق.
                </p>

                <div className="space-y-4 border-t border-white/15 pt-5 text-xs text-slate-200">
                  <div>
                    <span className="text-slate-400 block">البريد الرسمي المباشر:</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono-num text-sm font-semibold text-white">
                        a.labaz.infg@lagh-univ.dz
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText('a.labaz.infg@lagh-univ.dz', 'direct-email')
                        }
                        className="text-amber-300 hover:underline cursor-pointer"
                      >
                        {copiedId === 'direct-email' ? 'تم النسخ!' : 'نسخ البريد'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block">أوقات التواجد والتفعيل الفوري:</span>
                    <span className="text-sm text-white mt-0.5 block">
                      يومياً من 09:00 صباحاً حتى 02:00 بعد منتصف الليل (بتوقيت مكة والجزائر)
                    </span>
                  </div>
                </div>
              </div>

              {/* Validated Lead Capture & Direct Order Form */}
              <div className="lg:col-span-7">
                {contactSubmitted ? (
                  <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-8 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-300">
                      <Check className="h-6 w-6 shrink-0" />
                      <h3 className="font-display text-xl font-bold text-white">
                        تم استلام طلبك بنجاح يا {contactName}!
                      </h3>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      تم تسجيل تفاصيل رسالتك بخصوص <strong className="text-amber-300">{contactTopic}</strong>.
                      سنتواصل معك فوراً عبر ({contactHandle}) لإتمام التفعيل وإرسال شهادة الضمان.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactMessage('');
                        }}
                        className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        إرسال رسالة أخرى
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium text-slate-200"
                        >
                          الاسم الكامل
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="مثال: أحمد بن علي"
                          className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-handle"
                          className="block text-xs font-medium text-slate-200"
                        >
                          البريد الإلكتروني أو رقم واتساب
                        </label>
                        <input
                          id="contact-handle"
                          type="text"
                          required
                          dir="ltr"
                          value={contactHandle}
                          onChange={(e) => setContactHandle(e.target.value)}
                          placeholder="name@email.com / +9665..."
                          className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs font-medium text-slate-200"
                      >
                        الاشتراك المطلوب أو موضوع الرسالة
                      </label>
                      <select
                        id="contact-topic"
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white bg-slate-900/90"
                      >
                        {SUBSCRIPTIONS.map((sub) => (
                          <option key={sub.id} value={sub.title} className="bg-slate-900 text-white">
                            طلب تفعيل: {sub.title}
                          </option>
                        ))}
                        <option value="باقة شركات وفرق عمل مخصصة" className="bg-slate-900 text-white">
                          باقة شركات وفرق عمل مخصصة (أكثر من 5 تراخيص)
                        </option>
                        <option value="استفسار تقني أو دعم فني" className="bg-slate-900 text-white">
                          استفسار تقني أو دعم فني لاشتراك حالي
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium text-slate-200"
                      >
                        تفاصيل الطلب أو البريد المراد التفعيل عليه
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="اكتب البريد الإلكتروني الذي ترغب بتفعيل الاشتراك عليه أو أي استفسار إضافي..."
                        className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400"
                      />
                    </div>

                    {contactError && (
                      <p role="alert" className="text-xs font-medium text-rose-300">
                        {contactError}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs text-slate-300">
                        بياناتك مشفرة ولا نطلب أبداً الرقم السري لحسابك الشخصي.
                      </span>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>إرسال الطلب للتفعيل الفوري</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </GlassTiltCard>
        </section>
      </main>

      {/* Quiet Footer (No Ornamental Telemetry or Fake Tickers) */}
      <footer className="relative z-10 border-t border-white/20 bg-slate-950/60 backdrop-blur-md px-6 lg:px-12 py-8">
        <div className="mx-auto max-w-[1240px] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white">أثير بلس</span>
            <span aria-hidden="true">·</span>
            <span>جميع الحقوق محفوظة © 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#subscriptions" className="hover:text-white transition-colors">
              الاشتراكات
            </a>
            <a href="#proof" className="hover:text-white transition-colors">
              ضمان أثير الذهبي
            </a>
            <a href="#posts" className="hover:text-white transition-colors">
              المدونة التقنية
            </a>
            <a href="#accounts" className="hover:text-white transition-colors">
              الحسابات الرسمية
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              الدعم الفوري
            </a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MODAL 1: SUBSCRIPTION DETAILS & WARRANTY */}
      {activePlanModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-plan-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
        >
          <div className="glass-surface-elevated relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-amber-300">
                  {activePlanModal.indexNumber}. {activePlanModal.categoryLabel} ·{' '}
                  {activePlanModal.deliveryTime}
                </p>
                <h3 id="modal-plan-title" className="font-display text-xl font-bold text-white">
                  {activePlanModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePlanModal(null)}
                aria-label="إغلاق النافذة"
                className="rounded-lg border border-white/25 bg-white/10 p-2 text-slate-200 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">{activePlanModal.subtitle}</p>

            <div className="space-y-3 border-t border-white/15 pt-4">
              <h4 className="text-xs font-semibold text-amber-300">مميزات الباقة بالتفصيل:</h4>
              <ul className="space-y-2 text-xs text-slate-100">
                {activePlanModal.highlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/5 p-4 space-y-1.5 text-xs">
              <p className="font-semibold text-amber-300">شروط الضمان الذهبي وآلية التفعيل:</p>
              <p className="text-slate-200 leading-relaxed">{activePlanModal.warrantyText}</p>
              <p className="text-slate-300">
                طريقة الربط: {activePlanModal.activationMethod} — لا نحتاج إلى كلمة المرور الخاصة بك.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
              <div>
                <span className="text-xs text-slate-300 block">السعر باختيارك الحالي</span>
                <span className="font-mono-num text-2xl font-bold text-white">
                  {formatPrice(
                    billingCycle === 'annual'
                      ? activePlanModal.annualPriceUSD
                      : activePlanModal.monthlyPriceUSD
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePlanModal(null)}
                  className="rounded-lg border border-white/25 px-4 py-2.5 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(activePlanModal, billingCycle);
                    setActivePlanModal(null);
                  }}
                  className="rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 cursor-pointer"
                >
                  إضافة للسلة والطلب الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL 2: CREATOR POST ARTICLE READER */}
      {activePostModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-post-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
        >
          <div className="glass-surface-elevated relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-amber-300">
                  {activePostModal.category} · {activePostModal.publishDate} ·{' '}
                  {activePostModal.readTime}
                </p>
                <h3
                  id="modal-post-title"
                  className="font-display text-xl sm:text-2xl font-bold text-white leading-snug"
                >
                  {activePostModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePostModal(null)}
                aria-label="إغلاق المقال"
                className="rounded-lg border border-white/25 bg-white/10 p-2 text-slate-200 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-100 leading-relaxed border-t border-white/15 pt-4">
              {activePostModal.contentParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="rounded-xl border border-white/20 bg-white/5 p-5 space-y-2.5">
              <h4 className="text-xs font-semibold text-amber-300">خلاصة التوصيات العملية:</h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {activePostModal.keyTakeaways.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={() => handleCopyText(activePostModal.title, activePostModal.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-amber-300" />
                <span>
                  {copiedId === activePostModal.id ? 'تم نسخ عنوان المقال!' : 'مشاركة عنوان المقال'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePostModal(null)}
                className="rounded-lg bg-amber-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                إغلاق القراءة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE SLIDING CART & INSTANT ACTIVATION DRAWER */}
      {isCartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="سلة الاشتراكات الرقمية"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
        >
          <div className="glass-surface-elevated h-full w-full max-w-md p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">سلة التفعيل الفوري</h2>
                  <p className="text-xs text-slate-300">
                    إصدار الفاتورة والربط المباشر على بريدك الشخصي
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="إغلاق السلة"
                  className="rounded-lg border border-white/25 bg-white/10 p-2 text-slate-200 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {checkoutSuccess ? (
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Check className="h-5 w-5" />
                    <h3 className="font-display text-base font-bold text-white">
                      تم إصدار طلب التفعيل بنجاح!
                    </h3>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    أرسلنا تفاصيل الفاتورة ورابط التفعيل الفوري إلى بريدك الإلكتروني (
                    <span className="font-mono-num text-amber-300">{customerCheckoutEmail}</span>).
                    يصلك التفعيل الرسمي خلال أقل من 4 دقائق.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutSuccess(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full rounded-lg bg-amber-400 py-2.5 text-xs font-semibold text-slate-950 cursor-pointer"
                  >
                    العودة للمتجر
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-sm text-slate-300">سلة الاشتراكات فارغة حالياً.</p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-white/25 cursor-pointer"
                  >
                    تصفح الباقات الرقمية
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const unitUSD =
                      item.billingCycle === 'annual'
                        ? item.plan.annualPriceUSD
                        : item.plan.monthlyPriceUSD;
                    return (
                      <div
                        key={`${item.plan.id}-${item.billingCycle}`}
                        className="rounded-xl border border-white/20 bg-white/5 p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-white leading-snug">
                            {item.plan.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.plan.id, item.billingCycle)}
                            aria-label="حذف من السلة"
                            className="text-slate-400 hover:text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span>
                            {item.billingCycle === 'annual' ? 'اشتراك سنوي' : 'اشتراك شهري'} · الكمية:{' '}
                            <span className="font-mono-num">{item.quantity}</span>
                          </span>
                          <span className="font-mono-num font-bold text-amber-300">
                            {formatPrice(unitUSD * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="pt-2 space-y-2">
                    <label htmlFor="promo-input" className="block text-xs text-slate-300">
                      هل لديك رمز ترويجي؟ (جرب <span className="font-mono-num text-amber-300">ATHEER15</span>)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="promo-input"
                        type="text"
                        dir="ltr"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="ATHEER15"
                        className="glass-input flex-1 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono-num"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 whitespace-nowrap cursor-pointer"
                      >
                        تطبيق
                      </button>
                    </div>
                    {promoFeedback && (
                      <p className="text-xs text-amber-300">{promoFeedback}</p>
                    )}
                  </form>
                </div>
              )}
            </div>

            {cart.length > 0 && !checkoutSuccess && (
              <form onSubmit={handleCompleteCheckout} className="space-y-4 border-t border-white/20 pt-5 mt-6">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono-num">{formatPrice(cartSubtotalUSD)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-300">
                      <span>الخصم الترويجي (15%):</span>
                      <span className="font-mono-num">
                        - {formatPrice(cartSubtotalUSD * appliedDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>الإجمالي المستحق:</span>
                    <span className="font-mono-num text-amber-300">
                      {formatPrice(cartFinalUSD)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="checkout-email" className="block text-xs text-slate-200">
                    البريد الإلكتروني المراد تفعيل الاشتراك عليه:
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    dir="ltr"
                    value={customerCheckoutEmail}
                    onChange={(e) => setCustomerCheckoutEmail(e.target.value)}
                    placeholder="your.email@domain.com"
                    className="glass-input w-full rounded-lg px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-400 py-3 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  تأكيد الطلب وإرسال التفعيل الفوري
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
