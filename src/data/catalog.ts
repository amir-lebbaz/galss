import backdropAurora from '../assets/images/backdrop_aurora_mesh_1790944268382.jpg';
import subCreative from '../assets/images/sub_creative_suite_1790944280018.jpg';
import subEntertainment from '../assets/images/sub_entertainment_vip_1790944291742.jpg';
import subProductivity from '../assets/images/sub_productivity_pro_1790944302488.jpg';

export type SubscriptionCategory = 'all' | 'creative' | 'ai' | 'entertainment';
export type CurrencyCode = 'SAR' | 'USD' | 'DZD';

export interface SubscriptionPlan {
  id: string;
  indexNumber: string;
  title: string;
  subtitle: string;
  category: Exclude<SubscriptionCategory, 'all'>;
  categoryLabel: string;
  deliveryTime: string;
  activationMethod: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  officialPriceUSD: number;
  image: string;
  featuredSpan?: boolean;
  warrantyText: string;
  highlights: string[];
  includedApps: string[];
}

export interface CreatorPost {
  id: string;
  indexNumber: string;
  title: string;
  excerpt: string;
  category: string;
  publishDate: string;
  readTime: string;
  viewsCount: string;
  initialLikes: number;
  contentParagraphs: string[];
  keyTakeaways: string[];
}

export interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  roleLabel: string;
  followersCount: string;
  responseRate: string;
  description: string;
  url: string;
  accentColor: string;
}

export interface ClientTestimonial {
  id: string;
  fullName: string;
  role: string;
  organization: string;
  subscriptionUsed: string;
  outcomeMetric: string;
  quote: string;
}

export interface BackdropTheme {
  id: string;
  name: string;
  description: string;
  orbOne: string;
  orbTwo: string;
  orbThree: string;
  tintOverlay: string;
}

export const HERO_BACKDROP_IMAGE = backdropAurora;

export const BACKDROP_THEMES: BackdropTheme[] = [
  {
    id: 'cosmic-aurora',
    name: 'شفق كوني متوهج',
    description: 'تدرجات النيلي العميق مع العنبر الذهبي والبنفسجي الطيفي',
    orbOne: 'radial-gradient(circle, rgba(99, 102, 241, 0.55) 0%, rgba(99, 102, 241, 0) 70%)',
    orbTwo: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)',
    orbThree: 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0) 70%)',
    tintOverlay: 'from-indigo-950/65 via-slate-950/55 to-amber-950/40',
  },
  {
    id: 'emerald-nebula',
    name: 'سديم الزمرد الليلي',
    description: 'تدرجات الزمرد الملكي مع السيان الضوئي والكحلي العميق',
    orbOne: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 70%)',
    orbTwo: 'radial-gradient(circle, rgba(6, 182, 212, 0.48) 0%, rgba(6, 182, 212, 0) 70%)',
    orbThree: 'radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(59, 130, 246, 0) 70%)',
    tintOverlay: 'from-emerald-950/65 via-slate-950/55 to-cyan-950/45',
  },
  {
    id: 'crimson-horizon',
    name: 'أفق الياقوت والعنبر',
    description: 'إضاءة الياقوت القرمزي الدافئ مع الذهب المصقول',
    orbOne: 'radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, rgba(244, 63, 94, 0) 70%)',
    orbTwo: 'radial-gradient(circle, rgba(251, 191, 36, 0.48) 0%, rgba(251, 191, 36, 0) 70%)',
    orbThree: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(139, 92, 246, 0) 70%)',
    tintOverlay: 'from-rose-950/65 via-slate-950/55 to-amber-950/45',
  },
];

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  SAR: { symbol: 'ر.س', rate: 3.75, label: 'ريال سعودي (SAR)' },
  USD: { symbol: '$', rate: 1, label: 'دولار أمريكي (USD)' },
  DZD: { symbol: 'د.ج', rate: 240, label: 'دينار جزائري (DZD)' },
};

export const SUBSCRIPTIONS: SubscriptionPlan[] = [
  {
    id: 'adobe-cc-all-apps',
    indexNumber: '01',
    title: 'حزمة Adobe Creative Cloud الكاملة — جميع التطبيقات',
    subtitle: 'تفعيل رسمي مباشر على بريدك الشخصي مع سحابة تخزين 100GB وميزات Firefly للذكاء الاصطناعي التوليدي.',
    category: 'creative',
    categoryLabel: 'التصميم والإبداع',
    deliveryTime: 'تفعيل خلال 3 دقائق',
    activationMethod: 'على إيميلك الشخصي رسمياً',
    monthlyPriceUSD: 14,
    annualPriceUSD: 119,
    officialPriceUSD: 599,
    image: subCreative,
    featuredSpan: true,
    warrantyText: 'ضمان ذهبي كامل طوال فترة الاشتراك (استبدال فوري في حال أي انقطاع)',
    highlights: [
      'يشمل أكثر من 20 تطبيقاً أصلياً للكمبيوتر والآيباد (Photoshop, Illustrator, Premiere Pro, After Effects)',
      'رصيد شهري 1,000 نقطة Generative Credits لأدوات Adobe Firefly الذكية',
      'يعمل على جهازين في نفس الوقت (Mac و Windows و iPadOS) مع تحديثات مباشرة من Creative Cloud',
      'مساحة تخزين سحابية خاصة 100 جيجابايت مع وصول كامل لمكتبة Adobe Fonts و Portfolio',
    ],
    includedApps: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Lightroom', 'InDesign'],
  },
  {
    id: 'ai-workspace-pro',
    indexNumber: '02',
    title: 'مجموعة الذكاء الاصطناعي المتقدمة — ChatGPT Plus & Claude Pro',
    subtitle: 'وصول غير محدود لأحدث نماذج التحليل والبرمجة والكتابة الإبداعية مع أولوية الخوادم وقت الذروة.',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي والإنتاجية',
    deliveryTime: 'تفعيل فوري تلقائي',
    activationMethod: 'حساب خاص أو تفعيل مباشر',
    monthlyPriceUSD: 12,
    annualPriceUSD: 109,
    officialPriceUSD: 240,
    image: subProductivity,
    featuredSpan: false,
    warrantyText: 'ضمان استمرارية 100% مع خصوصية كاملة لمحادثاتك وملفاتك',
    highlights: [
      'استخدام كامل لنماذج التفكير العميق والبرمجة المتقدمة وتحليل الملفات الضخمة PDF و Excel',
      'توليد الصور عالية الدقة والبحث الفوري عبر الويب بدون قيود الانتظار',
      'إمكانية إنشاء مساحات عمل خاصة (Projects & Custom GPTs) محفوظة بالكامل',
    ],
    includedApps: ['ChatGPT Plus', 'Claude Pro Projects', 'Code Interpreter', 'Voice Mode'],
  },
  {
    id: 'cinema-vip-bundle',
    indexNumber: '03',
    title: 'الباقة السينمائية والرياضية — Shahid VIP الشاملة + YouTube Premium',
    subtitle: 'مشاهدة بدقة 4K HDR بدون فواصل إعلانية، مع البث المباشر للبطولات الرياضية وتشغيل الخلفية.',
    category: 'entertainment',
    categoryLabel: 'الترفيه والبث',
    deliveryTime: 'تفعيل خلال 5 دقائق',
    activationMethod: 'تفعيل رسمي بدون كلمة مرور',
    monthlyPriceUSD: 9,
    annualPriceUSD: 79,
    officialPriceUSD: 210,
    image: subEntertainment,
    featuredSpan: false,
    warrantyText: 'ضمان كامل المدة على حسابك الشخصي دون الحاجة لمشاركة الرقم السري',
    highlights: [
      'يوتيوب بريميوم + YouTube Music بدون إعلانات نهائياً مع التحميل والتشغيل في الخلفية',
      'ملف خاص ومستقل في باقة شاهد VIP الرياضية والشاملة بدقة 4K Ultra HD',
      'يدعم التشغيل على الشاشات الذكية (Smart TV) والهواتف وأجهزة الألعاب',
    ],
    includedApps: ['YouTube Premium', 'YouTube Music', 'Shahid VIP Sport', '4K UHD Streaming'],
  },
  {
    id: 'figma-canva-design-pro',
    indexNumber: '04',
    title: 'ثنائي التصميم السريع — Canva Pro + Figma Professional',
    subtitle: 'الأدوات الأساسية للمصممين وصناع المحتوى وفرق المنتجات الرقمية مع مكتبات القوالب والخطوط العربية.',
    category: 'creative',
    categoryLabel: 'التصميم والإبداع',
    deliveryTime: 'تفعيل خلال دقيقتين',
    activationMethod: 'دعوة رسمية لإيميلك الشخصي',
    monthlyPriceUSD: 7,
    annualPriceUSD: 54,
    officialPriceUSD: 180,
    image: subCreative,
    featuredSpan: false,
    warrantyText: 'تفعيل رسمي معتمد مع حفظ تام لخصوصية التصاميم داخل مساحتك الخاصة',
    highlights: [
      'فتح أكثر من 100 مليون عنصر وصورة وقالب احترافي في Canva Pro مع أداة إزالة الخلفية بضغطة زر',
      'مشاريع وملفات غير محدودة في Figma Professional مع مكتبات المكونات المشتركة ووضع Dev Mode',
      'دعم كامل للخطوط العربية الاحترافية وتصدير الملفات بصيغ SVG و PDF للطباعة بجودة كاملة',
    ],
    includedApps: ['Canva Pro', 'Figma Professional', 'FigJam', 'Magic Studio'],
  },
  {
    id: 'jetbrains-cursor-dev',
    indexNumber: '05',
    title: 'حزمة المطورين النخبة — JetBrains All Products + Cursor Pro',
    subtitle: 'بيئة البرمجة المتكاملة مع الإكمال التلقائي الذكي للمشاريع البرمجية الضخمة وتطبيقات الويب والموبايل.',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي والإنتاجية',
    deliveryTime: 'تفعيل خلال 4 دقائق',
    activationMethod: 'ترخيص رسمي على حسابك',
    monthlyPriceUSD: 11,
    annualPriceUSD: 95,
    officialPriceUSD: 289,
    image: subProductivity,
    featuredSpan: true,
    warrantyText: 'ترخيص رسمي موثق يظهر مباشرة في لوحة تحكم JetBrains و Cursor الخاصة بك',
    highlights: [
      'وصول كامل لجميع بيئات JetBrains (IntelliJ IDEA Ultimate, WebStorm, PyCharm, PhpStorm, DataGrip)',
      'يتضمن 500 طلب سريع شهرياً في محرر Cursor Pro مع تعديل الملفات المتعددة بالذكاء الاصطناعي',
      'تحديثات رسمية مستمرة لجميع الإصدارات الجديدة طوال فترة الاشتراك',
    ],
    includedApps: ['Cursor Pro', 'WebStorm', 'PyCharm Pro', 'IntelliJ IDEA', 'DataGrip'],
  },
];

export const PROOF_METRICS = [
  {
    id: 'm1',
    value: '+4,850',
    unit: 'اشتراك مفعّل بنجاح',
    timeframe: 'خلال آخر 12 شهراً (2025–2026)',
    context: 'تراخيص رسمية موثقة للأفراد والشركات الناشئة في الخليج والمغرب العربي',
  },
  {
    id: 'm2',
    value: '3.4 دقائق',
    unit: 'متوسط سرعة التفعيل',
    timeframe: 'قياس فعلي لآخر 1,000 طلب',
    context: 'ربط مباشر على البريد الشخصي للعميل دون طلب كلمات مرور حساسة',
  },
  {
    id: 'm3',
    value: '99.8%',
    unit: 'نسبة استقرار الحسابات',
    timeframe: 'طوال دورة الاشتراك السنوية',
    context: 'مشمول بضمان استبدال أو تعويض فوري خلال أقل من 15 دقيقة',
  },
];

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 't1',
    fullName: 'م. طارق المنصوري',
    role: 'مدير الإبداع الفني',
    organization: 'استوديو روازن للتصميم — الرياض',
    subscriptionUsed: 'حزمة Adobe Creative Cloud الكاملة (7 تراخيص سنوية)',
    outcomeMetric: 'توفير 78% من تكاليف التراخيص السنوية للاستوديو',
    quote: 'قبل التعامل مع أثير بلس كنا ندفع مبالغ باهظة شهرياً لتراخيص الفريق أو نعاني من الحسابات المشتركة التي تفصل فجأة. بعد الترقية للتفعيل الرسمي على إيميلات المصممين لدينا، استقر العمل بنسبة 100% لأكثر من 9 أشهر متواصلة مع دعم فني يستجيب خلال دقائق.',
  },
  {
    id: 't2',
    fullName: 'د. لينا عبد القادر',
    role: 'باحثة ومطورة برمجيات ذكاء اصطناعي',
    organization: 'مختبر البيانات المتقدمة — الجزائر العاصمة',
    subscriptionUsed: 'حزمة المطورين JetBrains + مجموعة الذكاء الاصطناعي',
    outcomeMetric: 'تفعيل فوري خلال 3 دقائق بالدينار الجزائري والبطاقات الدولية',
    quote: 'أكبر عقبة كانت تواجهني هي صعوبة الدفع الدولي وتفعيل الأدوات البحثية بسرعة. حصلت على التفعيل الرسمي على بريدي الجامعي والشخصي في أقل من 4 دقائق، مما اختصر عليّ ساعات من البحث والانتظار.',
  },
  {
    id: 't3',
    fullName: 'أنس الحربي',
    role: 'صانع محتوى تقني ومونتير فيديو',
    organization: 'قناة أنس تك (420 ألف مشترك) — جدة',
    subscriptionUsed: 'Adobe CC + YouTube Premium + Canva Pro',
    outcomeMetric: 'صفر انقطاع خلال 14 شهراً من إنتاج الفيديو اليومي',
    quote: 'كمونتير يعتمد يومياً على Premiere Pro و After Effects ومزايا Firefly الصوتية والبصرية، لا أتحمل توقف الحساب ساعة واحدة. التزام أثير بلس بالضمان والتجديد التلقائي جعلني أعتمد عليهم في جميع اشتراكاتي الرقمية.',
  },
];

export const CREATOR_POSTS: CreatorPost[] = [
  {
    id: 'post-1',
    indexNumber: '01',
    title: 'كيف تفرّق بين التفعيل الرسمي لاشتراكات Adobe وبين الحسابات التجريبية المؤقتة؟',
    excerpt: 'دليل تقني مفصل يكشف لك 4 علامات في لوحة تحكم حسابك تضمن أن اشتراكك رسمي ومستقر طوال السنة ولا يعرض ملفاتك السحابية لخطر الحذف.',
    category: 'أمن الحسابات والتراخيص',
    publishDate: '28 سبتمبر 2026',
    readTime: 'قراءة 4 دقائق',
    viewsCount: '18.4K مشاهدة',
    initialLikes: 342,
    contentParagraphs: [
      'يقع الكثير من المصممين وصناع المحتوى في فخ الاشتراكات الرخيصة جداً التي تعتمد على فترات تجريبية مجانية مدتها 14 يوماً يتم تدويرها عبر سكريبتات آلية. المشكلة الحقيقية هنا ليست فقط انقطاع الاشتراك المتكرر، بل ضياع مكتبات الخطوط والألوان والملفات المحفوظة على سحابة Creative Cloud.',
      'عندما تحصل على تفعيل رسمي مؤسسي أو تعليمي موثق على بريدك الإلكتروني الشخصي، يظل حسابك مرتبطاً بمعرّف Adobe ID الخاص بك وحدك، وتبقى مساحة الـ 100GB السحابية مشفرة ومحمية بكلمة مرورك أنت دون أن يطلع عليها أي طرف ثالث.',
      'للتحقق من جودة اشتراكك الحالي: ادخل إلى صفحة account.adobe.com، وتأكد من عدم وجود رسالة "Trial Ends Soon"، وتفقد رصيد Generative Credits الشهري (يجب أن يظهر 1,000 نقطة كاملة في الحسابات السنوية الأصلية).',
    ],
    keyTakeaways: [
      'لا تشارك كلمة مرور بريدك الأساسي أبداً؛ التفعيل الرسمي يتم عبر دعوة مباشرة لإيميلك.',
      'تأكد من ثبات مساحة التخزين السحابية وعدم تغير اسم المؤسسة كل أسبوع.',
      'احتفظ دائماً بنسخة احتياطية محلية لملفات المشاريع الضخمة بجانب النسخة السحابية.',
    ],
  },
  {
    id: 'post-2',
    indexNumber: '02',
    title: 'مقارنة عملية لعام 2026: متى تستخدم Claude Pro ومتى تتجه إلى ChatGPT Plus؟',
    excerpt: 'بعد تجربة يومية لأكثر من 600 ساعة في البرمجة وكتابة المحتوى العربي وتحليل البيانات، إليك الخلاصة العملية لاختيار الأداة الأنسب لطبيعة عملك.',
    category: 'الذكاء الاصطناعي والإنتاجية',
    publishDate: '19 سبتمبر 2026',
    readTime: 'قراءة 5 دقائق',
    viewsCount: '24.9K مشاهدة',
    initialLikes: 518,
    contentParagraphs: [
      'لم يعد السؤال اليوم هل تحتاج لاشتراك مدفوع في أدوات الذكاء الاصطناعي، بل أي نموذج يمنحك عائداً حقيقياً على وقتك. من خلال تجربتي المستمرة في بناء المشاريع البرمجية وكتابة المقالات التقنية باللغة العربية، يتفوق كل نموذج في مضمار مختلف تماماً.',
      'في كتابة الكود المعماري النظيف (React, TypeScript, Python) وصياغة النصوص العربية الطبيعية الخالية من الركاكة والترجمة الحرفية، يظل Claude Pro مع ميزة Projects متفوقاً بفضل نافذة السياق الواسعة والقدرة على الالتزام الدقيق بالتعليمات.',
      'أما حينما تحتاج إلى البحث الحي في الويب، أو المحادثة الصوتية الفورية، أو توليد الصور السريعة وتحليل جداول البيانات المعقدة دفعة واحدة، فإن ChatGPT Plus يمنحك صندوق أدوات شاملاً يغنيك عن 4 تطبيقات منفصلة.',
    ],
    keyTakeaways: [
      'استخدم ميزة Projects لرفع ملفات الهوية البصرية أو معايير الكود الخاصة بك مرة واحدة.',
      'الجمع بين الأداتين ضمن حزمة إنتاجية واحدة يوفر عليك أكثر من 12 ساعة عمل أسبوعياً.',
      'فعّل دائماً خيار عدم تدريب النماذج على بياناتك الخاصة من إعدادات الخصوصية.',
    ],
  },
  {
    id: 'post-3',
    indexNumber: '03',
    title: 'أفضل 5 إعدادات خفية في محرر Cursor Pro تضاعف سرعتك في بناء واجهات الويب',
    excerpt: 'كيف تضبط ملفات القواعد (.cursorrules) وتفهرس مستودع الكود بالكامل لتحصل على اقتراحات برمجية دقيقة بدون أخطاء في المكتبات الحديثة.',
    category: 'هندسة البرمجيات',
    publishDate: '07 سبتمبر 2026',
    readTime: 'قراءة 6 دقائق',
    viewsCount: '15.2K مشاهدة',
    initialLikes: 289,
    contentParagraphs: [
      'أغلب المبرمجين الذين ينتقلون من VS Code إلى Cursor Pro يستخدمون 20% فقط من قدراته الحقيقية لأنهم يتعاملون معه كصندوق دردشة جانبي تقليدي، بينما القوة الفعلية تكمن في الفهرسة العميقة للمشروع (Codebase Indexing).',
      'الخطوة الأولى التي أنصح بها كل مشترك جديد هي إنشاء ملف قواعد مخصص يحدد إصدارات الحزم المستخدمة (مثل Tailwind v4 و React 19) ويمنع المحرر من اقتراح أنماط قديمة، مع ربط التوثيق الرسمي مباشرة عبر رمز @Docs.',
      'بهذه الطريقة تتحول طلباتك السريعة الـ 500 في الباقة الاحترافية إلى مهندس مساعد يفهم بنية مشروعك بالكامل ويعدل عدة ملفات مترابطة في ثوانٍ معدودة.',
    ],
    keyTakeaways: [
      'استخدم @Codebase للبحث الدلالي في كامل المشروع قبل كتابة أي ميزة جديدة.',
      'أضف روابط التوثيق الرسمي للمكتبات الحديثة في قسم Docs داخل إعدادات Cursor.',
      'استفد من وضع Composer لتنفيذ التعديلات المتزامنة عبر ملفات الواجهة والأنواع.',
    ],
  },
];

export const SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'telegram',
    platform: 'قناة ومجتمع تيليجرام',
    handle: '@AtheerPlus_Official',
    roleLabel: 'التحديثات اليومية والعروض الفورية',
    followersCount: '38.5K مشترك',
    responseRate: 'رد فوري (أقل من 3 دقائق)',
    description: 'القناة الرسمية لنشر الأكواد الترويجية، إشعارات توفر التراخيص النادرة، وشروحات التفعيل المصورة خطوة بخطوة.',
    url: 'https://t.me/AtheerPlus_Official',
    accentColor: '#38bdf8',
  },
  {
    id: 'whatsapp',
    platform: 'واتساب الأعمال الموثق',
    handle: '+966 55 892 4100',
    roleLabel: 'المبيعات والدعم الفني المباشر',
    followersCount: '+4,800 عميل نشط',
    responseRate: 'متاح 24/7 للتفعيل الفوري',
    description: 'الخط المباشر لاستلام طلبات الاشتراكات، إرسال إيصالات الضمان الذهبي، ومتابعة التفعيل الفوري على بريدك الشخصي.',
    url: 'https://wa.me/966558924100',
    accentColor: '#34d399',
  },
  {
    id: 'x-twitter',
    platform: 'منصة X (تويتر سابقاً)',
    handle: '@AtheerDigital_AR',
    roleLabel: 'سلاسل التغريدات التقنية وآراء العملاء',
    followersCount: '29.2K متابع',
    responseRate: 'نشر يومي للمراجعات والتجارب',
    description: 'نشارك فيها تجارب الأدوات الرقمية الحديثة، مقارنات برامج التصميم والذكاء الاصطناعي، وتوثيق تقييمات العملاء الحقيقية.',
    url: 'https://x.com/AtheerDigital_AR',
    accentColor: '#f8fafc',
  },
  {
    id: 'instagram',
    platform: 'إنستغرام الإبداعي',
    handle: '@atheer.plus.studio',
    roleLabel: 'شروحات الفيديو القصيرة (Reels) للمصممين',
    followersCount: '54.1K متابع',
    responseRate: 'محتوى مرئي أسبوعي',
    description: 'مقاطع تطبيقية سريعة لأسرار Photoshop و Figma و Firefly مع عروض خاصة للمصممين المستقلين وطلاب الجامعات.',
    url: 'https://instagram.com/atheer.plus.studio',
    accentColor: '#fbbf24',
  },
];
