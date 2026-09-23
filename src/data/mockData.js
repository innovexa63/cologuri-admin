// --------------- Tour Groups ---------------
export const tourGroups = [
  { id: 'tg1', name: 'ঘুরি বাংলাদেশ', slug: 'ghuri-bd', rating: 4.8, totalTours: 142, verified: true, location: 'ঢাকা' },
  { id: 'tg2', name: 'সবুজ পথিক', slug: 'sobuj-pathik', rating: 4.7, totalTours: 89, verified: true, location: 'চট্টগ্রাম' },
  { id: 'tg3', name: 'পাহাড়ি স্বপ্ন', slug: 'pahadi-swapno', rating: 4.9, totalTours: 63, verified: true, location: 'বান্দরবান' },
  { id: 'tg4', name: 'নীল দিগন্ত ট্যুর', slug: 'nil-diganto', rating: 4.6, totalTours: 117, verified: true, location: 'কক্সবাজার' },
  { id: 'tg5', name: 'সুন্দরবন এক্সপ্লোরার', slug: 'sundarban-explorer', rating: 4.8, totalTours: 55, verified: true, location: 'খুলনা' },
];

// --------------- Destinations ---------------
export const destinations = [
  {
    id: 'd1', slug: 'sajek-valley', name: 'সাজেক ভ্যালি',
    division: 'চট্টগ্রাম', district: 'রাঙামাটি', upazila: 'বাঘাইছড়ি',
    category: 'পাহাড়', description: 'মেঘের রাজ্য সাজেক — বাংলাদেশের সবচেয়ে বড় ইউনিয়ন রুইলুই ও কংলাকে ঘিরে এই স্বপ্নময় উপত্যকা।',
    history: 'সাজেক ভ্যালি রাঙামাটি জেলার বাঘাইছড়ি উপজেলায় অবস্থিত। এটি ১৮৮০ মিটার উচ্চতায় মেঘের মধ্যে ভাসে।',
    highlights: ['মেঘের সমুদ্র', 'সানসেট পয়েন্ট', 'আদিবাসী কটেজ', 'হেলিপ্যাড ভিউ'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    gallery: [], rating: 4.9, totalReviews: 2341, bestSeason: 'অক্টোবর–মার্চ', entryFee: '৳ ১৫০/জন',
  },
  {
    id: 'd2', slug: 'sundarban', name: 'সুন্দরবন',
    division: 'খুলনা', district: 'সাতক্ষীরা', upazila: 'শ্যামনগর',
    category: 'ম্যানগ্রোভ', description: 'পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন — বাঘ, কুমির ও হরিণের আবাসস্থল।',
    history: 'UNESCO বিশ্ব ঐতিহ্যবাহী স্থান। মোগল আমল থেকে এই বনের উপস্থিতি ইতিহাসে দেখা যায়।',
    highlights: ['রয়্যাল বেঙ্গল টাইগার', 'বোট ক্রুজ', 'করমজল বন্যপ্রাণী কেন্দ্র', 'মধুর চাকা'],
    imageUrl: 'https://images.unsplash.com/photo-1624811532702-fc35e8f9b9ff?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1624811532702-fc35e8f9b9ff?w=600&q=80',
    gallery: [], rating: 4.8, totalReviews: 1876, bestSeason: 'নভেম্বর–ফেব্রুয়ারি', entryFee: '৳ ৮০০/জন',
  },
  {
    id: 'd3', slug: 'coxs-bazar', name: 'কক্সবাজার',
    division: 'চট্টগ্রাম', district: 'কক্সবাজার', upazila: 'সদর',
    category: 'সমুদ্র সৈকত', description: 'পৃথিবীর দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত — ১২০ কিলোমিটার অবিচ্ছিন্ন বালির তীর।',
    history: 'কক্সবাজার নামটি ক্যাপ্টেন হিরাম কক্সের নামানুসারে। ব্রিটিশ আমলে এটি একটি গুরুত্বপূর্ণ সামরিক ঘাঁটি ছিল।',
    highlights: ['সূর্যাস্ত সৈকত', 'হিমছড়ি ঝরনা', 'ইনানী বিচ', 'রাখাইন পল্লী'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    gallery: [], rating: 4.7, totalReviews: 5432, bestSeason: 'অক্টোবর–এপ্রিল', entryFee: 'বিনামূল্যে',
  },
  {
    id: 'd4', slug: 'bandarban', name: 'বান্দরবান',
    division: 'চট্টগ্রাম', district: 'বান্দরবান', upazila: 'সদর',
    category: 'পাহাড়', description: 'বাংলাদেশের ছাদ — বগালেক, কেওক্রাডং ও নীলগিরির দেশ।',
    history: 'পার্বত্য চট্টগ্রামের অংশ বান্দরবান ১১টি উপজাতির আবাসস্থল। এর সমৃদ্ধ সংস্কৃতি হাজার বছরের পুরনো।',
    highlights: ['বগালেক', 'কেওক্রাডং শৃঙ্গ', 'নীলগিরি', 'মেঘলা পর্যটন কমপ্লেক্স'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    gallery: [], rating: 4.9, totalReviews: 3102, bestSeason: 'অক্টোবর–মার্চ', entryFee: '৳ ২০০/জন',
  },
  {
    id: 'd5', slug: 'tanguar-haor', name: 'টাঙ্গুয়ার হাওর',
    division: 'সিলেট', district: 'সুনামগঞ্জ', upazila: 'তাহিরপুর',
    category: 'হাওর', description: 'রামসার সাইট — শীতে হাজারো পরিযায়ী পাখির অভয়ারণ্য।',
    history: 'টাঙ্গুয়ার হাওর বাংলাদেশের দ্বিতীয় রামসার সাইট। ৪৬টি গ্রাম ও ৯,৭২৭ হেক্টর জলাভূমি নিয়ে গঠিত।',
    highlights: ['হিজল-করচ বন', 'পরিযায়ী পাখি', 'নৌকা ভ্রমণ', 'ওয়াচ টাওয়ার'],
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    gallery: [], rating: 4.8, totalReviews: 1234, bestSeason: 'ডিসেম্বর–ফেব্রুয়ারি', entryFee: '৳ ৩০০/জন',
  },
  {
    id: 'd6', slug: 'srimangal', name: 'শ্রীমঙ্গল',
    division: 'সিলেট', district: 'মৌলভীবাজার', upazila: 'শ্রীমঙ্গল',
    category: 'চা বাগান', description: 'চায়ের রাজধানী — সবুজ চা বাগানের মাঝে এক অনন্য অভিজ্ঞতা।',
    history: 'ব্রিটিশ আমলে চা চাষের প্রবর্তন হয় এই অঞ্চলে। আজ শ্রীমঙ্গলে ৪০টিরও বেশি চা বাগান রয়েছে।',
    highlights: ['সাত রঙের চা', 'লাউয়াছড়া বন', 'হাইল হাওর', 'চা জাদুঘর'],
    imageUrl: 'https://images.unsplash.com/photo-1467436072131-2063809e7898?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1467436072131-2063809e7898?w=600&q=80',
    gallery: [], rating: 4.7, totalReviews: 987, bestSeason: 'সারা বছর', entryFee: 'বিনামূল্যে',
  },
];

// --------------- Live Tour Packages ---------------
export const liveTourPackages = [
  {
    id: 'tp1', slug: 'sajek-joint-oct', title: 'সাজেক ভ্যালি — পূর্ণিমা ট্যুর',
    operator: tourGroups[0], destination: destinations[0],
    route: 'ঢাকা → খাগড়াছড়ি → সাজেক → ঢাকা',
    startDate: '২৮ অক্টোবর ২০২৬', endDate: '৩১ অক্টোবর ২০২৬',
    duration: '৩ রাত ৪ দিন', totalSeats: 45, bookedSeats: 34,
    pricePerPerson: 4800, isJointTour: true,
    coOrganizers: [tourGroups[1]], inclusions: ['বাস', 'নাস্তা', 'রাতের খাবার', 'কটেজ'],
    exclusions: ['দুপুরের খাবার', 'ব্যক্তিগত খরচ'], status: 'live', category: 'standard',
  },
  {
    id: 'tp2', slug: 'sundarban-winter', title: 'সুন্দরবন শীতকালীন অভিযান',
    operator: tourGroups[4], destination: destinations[1],
    route: 'ঢাকা → মোংলা → সুন্দরবন → ঢাকা',
    startDate: '১৫ নভেম্বর ২০২৬', endDate: '১৭ নভেম্বর ২০২৬',
    duration: '২ রাত ৩ দিন', totalSeats: 30, bookedSeats: 22,
    pricePerPerson: 6500, isJointTour: true,
    coOrganizers: [tourGroups[2]], inclusions: ['লঞ্চ', 'সব খাবার', 'বনবিভাগ অনুমতি'],
    exclusions: ['ব্যক্তিগত খরচ', 'ক্যামেরা ফি'], status: 'live', category: 'premium',
  },
  {
    id: 'tp3', slug: 'bandarban-trek', title: 'বান্দরবান ট্রেকিং অ্যাডভেঞ্চার',
    operator: tourGroups[2], destination: destinations[3],
    route: 'ঢাকা → চট্টগ্রাম → বান্দরবান → বগালেক → ঢাকা',
    startDate: '৫ নভেম্বর ২০২৬', endDate: '৮ নভেম্বর ২০২৬',
    duration: '৩ রাত ৪ দিন', totalSeats: 25, bookedSeats: 19,
    pricePerPerson: 5500, isJointTour: false,
    coOrganizers: [], inclusions: ['বাস', 'গাইড', 'সব খাবার', 'হোটেল'],
    exclusions: ['আর্মি পারমিট ফি', 'ব্যক্তিগত খরচ'], status: 'upcoming', category: 'standard',
  },
];

// --------------- Testimonials ---------------
export const testimonials = [
  {
    id: 'test1', name: 'রাহেলা বেগম', role: 'শিক্ষিকা, রাজশাহী',
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
    rating: 5, quote: 'সাজেক ট্যুরে ঘুরবেসবাইয়ের মাধ্যমে গিয়েছিলাম। সবকিছু এতটাই সুসংগঠিত ছিল যে মনে হয়েছিল পরিবার সাথে আছে। সিট বুকিং থেকে কটেজ — সব পারফেক্ট ছিল।',
    tourName: 'সাজেক ভ্যালি পূর্ণিমা ট্যুর', date: 'সেপ্টেম্বর ২০২৬', verified: true,
  },
  {
    id: 'test2', name: 'মোহাম্মদ কামাল', role: 'সফটওয়্যার ইঞ্জিনিয়ার, ঢাকা',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    rating: 5, quote: 'লাইভ সিট ট্র্যাকার দেখে প্রথমে অবাক হয়েছিলাম — আসলেই রিয়েল-টাইমে দেখাচ্ছিল কতজন বুক করেছে। জয়েন্ট ট্যুরে নতুন বন্ধু হয়ে গেছে কক্সবাজারে!',
    tourName: 'সুন্দরবন শীতকালীন অভিযান', date: 'আগস্ট ২০২৬', verified: true,
  },
  {
    id: 'test3', name: 'ফারহানা ইসলাম', role: 'উদ্যোক্তা, চট্টগ্রাম',
    avatarUrl: 'https://i.pravatar.cc/100?img=32',
    rating: 5, quote: 'কাস্টম ট্যুর বিল্ডারটা অসাধারণ! নিজে নিজে হোটেল গ্রেড বেছে নিয়ে সাথে সাথে দাম দেখতে পারছিলাম। ৮ জনের পরিবারের জন্য পুরোটা আমরাই প্ল্যান করলাম।',
    tourName: 'বান্দরবান কাস্টম ফ্যামিলি ট্যুর', date: 'অক্টোবর ২০২৬', verified: true,
  },
];

// --------------- Blog Posts ---------------
export const blogPosts = [
  {
    id: 'b1', slug: 'sajek-complete-guide', title: 'সাজেক ভ্যালির সম্পূর্ণ গাইড ২০২৬',
    excerpt: 'কীভাবে যাবেন, কোথায় থাকবেন, কী খাবেন — সাজেক ভ্রমণের আগে এই গাইডটি পড়া জরুরি।',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tag: 'ভ্রমণ গাইড', readTime: '৮ মিনিট', publishedAt: '১৫ সেপ্টেম্বর ২০২৬', author: 'নাফিসা হক',
  },
  {
    id: 'b2', slug: 'budget-travel-bangladesh', title: 'মাত্র ৫,০০০ টাকায় ৩ দিনের ট্যুর',
    excerpt: 'বাজেট ট্রাভেলারদের জন্য বাংলাদেশের সেরা ৫টি গন্তব্য যেখানে কম খরচে সর্বোচ্চ অভিজ্ঞতা পাওয়া যায়।',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    tag: 'বাজেট ট্রাভেল', readTime: '৫ মিনিট', publishedAt: '১০ সেপ্টেম্বর ২০২৬', author: 'রাকিব হাসান',
  },
  {
    id: 'b3', slug: 'sundarban-safety-tips', title: 'সুন্দরবনে নিরাপদ ভ্রমণের ১০টি টিপস',
    excerpt: 'সুন্দরবনে যাওয়ার আগে এই নিরাপত্তা টিপসগুলো জানুন — বনবিভাগের নির্দেশিকা সহ।',
    thumbnailUrl: 'https://images.unsplash.com/photo-1624811532702-fc35e8f9b9ff?w=600&q=80',
    tag: 'নিরাপত্তা টিপস', readTime: '৬ মিনিট', publishedAt: '৫ সেপ্টেম্বর ২০২৬', author: 'সুমাইয়া খান',
  },
];

// --------------- Stats ---------------
export const stats = [
  { id: 's1', label: 'সক্রিয় ট্যুর গ্রুপ', value: 284, suffix: '+', description: 'ভেরিফায়েড অপারেটর' },
  { id: 's2', label: 'সফল ভ্রমণকারী', value: 47500, suffix: '+', description: 'সন্তুষ্ট ট্রাভেলার' },
  { id: 's3', label: 'দর্শনীয় স্থান', value: 130, suffix: '+', description: 'সারা বাংলাদেশে' },
  { id: 's4', label: 'সময়মতো নিশ্চিত', value: 98, suffix: '%', description: 'সিট কনফার্মেশন রেট' },
];

// --------------- Hero Destinations (rotating) ---------------
export const heroDestinations = [
  'সাজেক',
  'সুন্দরবন',
  'কক্সবাজার',
  'বান্দরবান',
  'শ্রীমঙ্গল',
  'টাঙ্গুয়ার হাওর',
];

// --------------- Nav Links ---------------
export const navLinks = [
  { label: 'দর্শনীয় স্থান', href: '#destinations' },
  { label: 'কীভাবে কাজ করে', href: '#how-it-works' },
  { label: 'লাইভ ট্যুর', href: '#live-tours' },
  { label: 'কাস্টম ট্যুর', href: '#custom-tour' },
  { label: 'ব্লগ', href: '#blog' },
];
