import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Bell, BookOpenText, Check,
  CheckCircle2, ChevronDown, CircleDollarSign, Clock3, FileCheck2, FileText,
  Flower2, HandCoins, Image, LayoutDashboard, LoaderCircle, LogIn, LogOut, Menu,
  PackageCheck, Plus, ReceiptText, Search, Send, ShieldCheck, Sparkles,
  Truck, UserPlus, UsersRound, WandSparkles, X,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Orders', icon: PackageCheck },
  { label: 'People', icon: UsersRound },
  { label: 'AI classroom', icon: WandSparkles },
  { label: 'Approvals', icon: ShieldCheck },
]

const banglaText = (value = '') => {
  const translations = {
    Overview: 'সারসংক্ষেপ', Orders: 'অর্ডার', People: 'সদস্য', 'AI classroom': 'এআই পাঠশালা', Approvals: 'অনুমোদন',
    admin: 'প্রশাসক', Admin: 'প্রশাসক', artisan: 'কারিগর', buyer: 'ক্রেতা', learner: 'শিক্ষার্থী',
    Pending: 'অপেক্ষমাণ', Approved: 'অনুমোদিত', Rejected: 'প্রত্যাখ্যাত', Confirmed: 'নিশ্চিত', Accepted: 'গৃহীত',
    'Awaiting artisan': 'কারিগরের অপেক্ষায়', 'Advance pending': 'অগ্রিম বাকি', 'Advance paid': 'অগ্রিম পরিশোধিত',
    'In production': 'উৎপাদন চলছে', 'In transit': 'পথে আছে', 'Not dispatched': 'পাঠানো হয়নি',
    Delivered: 'পৌঁছে দেওয়া হয়েছে', Processing: 'প্রক্রিয়াধীন', 'Picked up': 'সংগ্রহ করা হয়েছে', Cancelled: 'বাতিল',
    Dhaka: 'ঢাকা', Chattogram: 'চট্টগ্রাম', Bangladesh: 'বাংলাদেশ', Manual: 'ম্যানুয়াল',
    'Something went wrong. Please try again.': 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    'AI provider is not configured.': 'এআই সেবা এখনো সংযুক্ত নয়। প্রশাসকের সঙ্গে যোগাযোগ করুন।',
    'AI provider request failed.': 'এআই সেবার অনুরোধ সম্পন্ন হয়নি। আবার চেষ্টা করুন।',
    'AI provider is unreachable.': 'এআই সেবায় সংযোগ করা যাচ্ছে না।',
    'AI provider returned an invalid response.': 'এআই সেবা থেকে সঠিক উত্তর পাওয়া যায়নি।',
    'AI provider returned an empty response.': 'এআই সেবা কোনো উত্তর দেয়নি।',
    'AI provider returned invalid project feedback.': 'এআই সেবা কাজের পর্যালোচনা দিতে পারেনি। আবার চেষ্টা করুন।',
    'A valid bearer token is required.': 'একটি বৈধ সেশন টোকেন প্রয়োজন।',
    'Session is invalid or expired.': 'সেশনটি অবৈধ বা মেয়াদোত্তীর্ণ।',
    'Session user no longer exists.': 'এই সেশনের ব্যবহারকারী আর নেই।',
    'সাইন ইন করুন to continue.': 'চালিয়ে যেতে সাইন ইন করুন।',
    'Admin approval is required.': 'প্রশাসকের অনুমোদন প্রয়োজন।',
    'An account with this email already exists.': 'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট আগে থেকেই রয়েছে।',
    'Email or password is incorrect.': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
    'Jamdani sample order': 'জামদানি নমুনার অর্ডার',
    'Handwoven jamdani table runner': 'হাতে বোনা জামদানি টেবিল রানার',
    'Jamdani motif planning': 'জামদানি নকশা পরিকল্পনা',
    'Pricing handmade work': 'হস্তশিল্পের মূল্য নির্ধারণ',
    'Product photography': 'পণ্যের আলোকচিত্র',
    'Other district': 'অন্যান্য জেলা',
    'AI tutor': 'এআই শিক্ষক',
    'Demo services connected': 'ডেমো সেবা সংযুক্ত',
    'Local preview mode': 'স্থানীয় প্রিভিউ মোড',
    'Account roles and verification at a glance': 'অ্যাকাউন্টের ধরন ও যাচাইয়ের সংক্ষিপ্ত চিত্র',
    'Check identity submissions before approving access to protected workflows.': 'সুরক্ষিত কার্যপ্রবাহে প্রবেশাধিকার দেওয়ার আগে পরিচয় যাচাইয়ের আবেদন পর্যালোচনা করুন।',
    'From a buyer’s first request through the final delivery scan.': 'ক্রেতার প্রথম অনুরোধ থেকে চূড়ান্ত ডেলিভারি পর্যন্ত।',
    'Learners, artisans, and buyers with clear profiles and verification status.': 'শিক্ষার্থী, কারিগর ও ক্রেতাদের পরিচিতি এবং যাচাইয়ের অবস্থা এক নজরে দেখুন।',
    'A practical companion for craft questions, pricing, and project reflection.': 'কারুশিল্প, মূল্য নির্ধারণ ও কাজের পর্যালোচনায় ব্যবহারিক সহায়তা।',
    'Community members': 'কমিউনিটির সদস্য',
    'Active wholesale': 'চলমান পাইকারি অর্ডার',
    'Advance collected': 'সংগৃহীত অগ্রিম',
    'Needs your review': 'আপনার পর্যালোচনা প্রয়োজন',
    'Orders moving through production': 'উৎপাদন পর্যায়ে থাকা অর্ডার',
    'Simulated payment records': 'নমুনা পেমেন্টের হিসাব',
    'Identity checks awaiting approval': 'অনুমোদনের অপেক্ষায় পরিচয় যাচাই',
    'Awaiting a next step': 'পরবর্তী ধাপের অপেক্ষায়',
    '50% of product subtotal': 'পণ্যের উপমোটের ৫০%',
    'Shipment tracking active': 'চালানের অবস্থান অনুসরণ চালু',
    'Across all account types': 'সব ধরনের অ্যাকাউন্ট মিলিয়ে',
    'Makers on the platform': 'প্ল্যাটফর্মের কারিগর',
    'Identity reviewed by admin': 'প্রশাসক পরিচয় যাচাই করেছেন',
    'Submitted identity records': 'জমা দেওয়া পরিচয়পত্র',
    'Approved or returned': 'অনুমোদিত বা ফেরত',
    'Demo document review': 'নমুনা নথি পর্যালোচনা',
    'Available · local demo': 'উপলভ্য · স্থানীয় ডেমো',
    'In production': 'উৎপাদন চলছে',
    'In transit': 'পথে আছে',
    'বাংলা কারুশিল্পের শিক্ষক': 'বাংলা কারুশিল্পের শিক্ষক',
    'শিখুন, তৈরি করুন, এগিয়ে যান': 'শিখুন, তৈরি করুন, এগিয়ে যান',
    'Connecting…': 'সংযোগ করা হচ্ছে…', 'Retry connection': 'সংযোগ আবার চেষ্টা করুন',
    'অ্যাকাউন্ট তৈরি করুন': 'অ্যাকাউন্ট তৈরি করুন', 'সাইন ইন করুন': 'সাইন ইন করুন', 'Your password': 'আপনার পাসওয়ার্ড',
    'At least 8 characters': 'কমপক্ষে ৮টি অক্ষর', 'অর্ডার নিশ্চিত করুন': 'অর্ডার নিশ্চিত করুন',
    'অগ্রিম নিশ্চিত করুন': 'অগ্রিম নিশ্চিত করুন', 'রসিদ প্রিন্ট করুন': 'রসিদ প্রিন্ট করুন',
    'কাজের পর্যালোচনা': 'কাজের পর্যালোচনা', 'শুধুমাত্র ডেমো পেমেন্ট।': 'শুধুমাত্র ডেমো পেমেন্ট।',
    'ডেমো অ্যাকাউন্টের পাসওয়ার্ড': 'ডেমো অ্যাকাউন্টের পাসওয়ার্ড', 'ইস্যুর তারিখ': 'ইস্যুর তারিখ',
    'বাস্তব ব্যবহারের আগে প্রকৃত পরিচয় যাচাই সেবা যুক্ত করুন।': 'বাস্তব ব্যবহারের আগে একটি প্রকৃত পরিচয় যাচাই সেবা যুক্ত করুন।',
    'Find orders or people': 'অর্ডার বা সদস্য খুঁজুন', 'New wholesale order': 'নতুন পাইকারি অর্ডার',
    'Meet your AI tutor': 'এআই শিক্ষকের সঙ্গে পরিচিত হোন', 'View all': 'সব দেখুন', 'Review': 'পর্যালোচনা',
    'Open orders': 'খোলা অর্ডার', 'Advance due': 'বকেয়া অগ্রিম', Artisans: 'কারিগর',
    'Verified profiles': 'যাচাইকৃত পরিচিতি', 'Awaiting review': 'পর্যালোচনার অপেক্ষায়',
    'Reviewed profiles': 'পর্যালোচিত পরিচিতি', 'Review policy': 'পর্যালোচনার নীতি',
    'যাচাইয়ের নথি যোগ করুন': 'যাচাইয়ের নথি যোগ করুন', 'যাচাইয়ের আবেদন জমা দিন': 'যাচাইয়ের আবেদন জমা দিন',
    'নতুন অ্যাকাউন্ট শিক্ষার্থী, কারিগর বা ক্রেতা হিসেবে খোলা যায়। প্রশাসকের অনুমতি আলাদাভাবে দেওয়া হয়।': 'নতুন অ্যাকাউন্ট শিক্ষার্থী, কারিগর বা ক্রেতা হিসেবে খোলা যায়। প্রশাসকের অনুমতি আলাদাভাবে দেওয়া হয়।',
    'শুধু ডেমো যাচাই। এই পর্দায় এনআইডি নথি বা আইনগত পরিচয় যাচাই করা হয় না।': 'শুধু ডেমো যাচাই। এই পর্দায় এনআইডি নথি বা আইনগত পরিচয় যাচাই করা হয় না।',
    'শুধুমাত্র ডেমো পেমেন্ট।': 'শুধুমাত্র ডেমো পেমেন্ট।',
    'রসিদ প্রিন্ট করুন': 'রসিদ প্রিন্ট করুন', 'ডিজিটাল রসিদ দেখুন': 'ডিজিটাল রসিদ দেখুন',
    'অগ্রিম নিশ্চিত করুন': 'অগ্রিম নিশ্চিত করুন', 'Confirm simulated advance': 'নমুনা অগ্রিম নিশ্চিত করুন',
    'অ্যাকাউন্ট তৈরি করুন': 'অ্যাকাউন্ট তৈরি করুন', 'অ্যাকাউন্ট খুলুন': 'অ্যাকাউন্ট খুলুন',
    'Your password': 'আপনার পাসওয়ার্ড', 'At least 8 characters': 'কমপক্ষে ৮টি অক্ষর',
    'Full name': 'পুরো নাম', 'Email address': 'ইমেইল ঠিকানা', Password: 'পাসওয়ার্ড',
    'I am joining as': 'আমি যোগ দিচ্ছি', Location: 'ঠিকানা', Product: 'পণ্য',
    'Quantity (pieces)': 'পরিমাণ (টি)', 'Unit price (৳)': 'একক মূল্য (৳)', 'Delivery zone': 'ডেলিভারির এলাকা',
    'WHOLESALE WORKFLOW': 'পাইকারি অর্ডারের কার্যপ্রবাহ', 'Orders & delivery': 'অর্ডার ও ডেলিভারি',
    'COMMUNITY DIRECTORY': 'কমিউনিটির সদস্য তালিকা', 'People & identity': 'সদস্য ও পরিচয়',
    'LEARN BY MAKING': 'কাজের মাধ্যমে শিখুন', 'AI classroom': 'এআই পাঠশালা',
    'ADMIN DESK': 'প্রশাসনিক ডেস্ক', 'Review & approvals': 'পর্যালোচনা ও অনুমোদন',
    'Connecting to your workspace': 'আপনার কর্মক্ষেত্রের সঙ্গে সংযোগ করা হচ্ছে',
    'Workspace is offline': 'কর্মক্ষেত্র সংযোগ বিচ্ছিন্ন',
    'Join the craft community': 'কারুশিল্প কমিউনিটিতে যোগ দিন',
    'Welcome back': 'আবার স্বাগতম', 'Checking the API and database connection.': 'এপিআই ও ডেটাবেসের সংযোগ পরীক্ষা করা হচ্ছে।',
    'Start XAMPP MySQL and the FastAPI server, then try again.': 'XAMPP MySQL ও FastAPI সার্ভার চালু করে আবার চেষ্টা করুন।',
    'সাইন ইন করুন or create a learner, artisan, or buyer account.': 'সাইন ইন করুন অথবা শিক্ষার্থী, কারিগর বা ক্রেতা হিসেবে অ্যাকাউন্ট খুলুন।',
    'Orders in motion': 'চলমান অর্ডার', 'Order accepted and assigned to the artisan.': 'অর্ডারটি গ্রহণ করে কারিগরের কাছে বরাদ্দ করা হয়েছে।',
    'Demo advance confirmed. No money was moved.': 'ডেমো অগ্রিম নিশ্চিত হয়েছে। কোনো অর্থ লেনদেন হয়নি।',
    'Verification submitted to the admin queue.': 'যাচাইয়ের আবেদন প্রশাসকের তালিকায় জমা হয়েছে।',
    'Account created. Welcome to ShilpoShikha.': 'অ্যাকাউন্ট তৈরি হয়েছে। ShilpoShikha-তে স্বাগতম।',
    'Wholesale order placed. The artisan can now review it.': 'পাইকারি অর্ডার দেওয়া হয়েছে। এখন কারিগর এটি পর্যালোচনা করতে পারবেন।',
    'Digital order receipt': 'ডিজিটাল অর্ডার রসিদ', 'Create your account': 'আপনার অ্যাকাউন্ট তৈরি করুন',
    'ইতোমধ্যে কমিউনিটির সদস্য?': 'ইতোমধ্যে কমিউনিটির সদস্য?', 'ShilpoShikha-তে নতুন?': 'ShilpoShikha-তে নতুন?',
    'অ্যাকাউন্ট খুলুন': 'অ্যাকাউন্ট খুলুন', 'ডেমো অ্যাকাউন্টের পাসওয়ার্ড': 'ডেমো অ্যাকাউন্টের পাসওয়ার্ড',
    'Welcome back': 'আবার স্বাগতম', 'Jamdani sample order': 'জামদানি নমুনার অর্ডার',
    'Handwoven jamdani table runner': 'হাতে বোনা জামদানি টেবিল রানার',
    'Sonargaon': 'সোনারগাঁও', 'Rajshahi': 'রাজশাহী',
    'Artisan': 'কারিগর', 'Buyer': 'ক্রেতা', 'Learner': 'শিক্ষার্থী',
    '6 short lessons': '৬টি সংক্ষিপ্ত পাঠ', '4 short lessons': '৪টি সংক্ষিপ্ত পাঠ', '3 short lessons': '৩টি সংক্ষিপ্ত পাঠ',
    'Place a wholesale order': 'পাইকারি অর্ডার দিন',
    'NID · RB-1184.pdf': 'জাতীয় পরিচয়পত্র · RB-1184.pdf',
    'Trade licence · ARF-2026.pdf': 'ব্যবসায়িক লাইসেন্স · ARF-2026.pdf',
  }
  if (translations[value]) return translations[value]
  const verifiedArtisans = value.match(/^(\d+) verified artisans$/)
  if (verifiedArtisans) return `${new Intl.NumberFormat('bn-BD').format(Number(verifiedArtisans[1]))} জন যাচাইকৃত কারিগর`
  const accountCount = value.match(/^(\d+) accounts$/)
  if (accountCount) return `${new Intl.NumberFormat('bn-BD').format(Number(accountCount[1]))}টি অ্যাকাউন্ট`
  return value
}

const money = (amount = 0) => `৳${new Intl.NumberFormat('bn-BD').format(Number(amount) || 0)}`
const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

async function request(path, { userId = 1, method = 'GET', body } = {}) {
  const token = window.localStorage.getItem('shilposhikha-session')
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : { 'X-User-Id': String(userId) }),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(banglaText(result.detail || 'Something went wrong. Please try again.'))
  return result
}

async function loadWorkspace(userId) {
  const health = await request('/api/health').catch(() => null)
  if (!health) {
    return { dashboard: null, orders: [], users: [], verifications: [], online: false, mode: null, authenticated: false, aiAvailable: false }
  }
  const token = window.localStorage.getItem('shilposhikha-session')
  if (health.mode === 'production' && !token) {
    return { dashboard: null, orders: [], users: [], verifications: [], online: true, mode: health.mode, authenticated: false, aiAvailable: Boolean(health.ai_available) }
  }
  const dashboard = await request('/api/dashboard', { userId }).catch(() => null)
  if (!dashboard) {
    return { dashboard: null, orders: [], users: [], verifications: [], online: true, mode: health.mode, authenticated: false, aiAvailable: Boolean(health.ai_available) }
  }
  const [orders, users, verifications] = await Promise.all([
    request('/api/orders', { userId }).catch(() => null),
    request('/api/users', { userId }).catch(() => null),
    request('/api/verifications', { userId }).catch(() => null),
  ])
  return {
    dashboard,
    orders: orders || [],
    users: users || [],
    verifications: verifications || [],
    online: true,
    mode: health.mode,
    authenticated: true,
    aiAvailable: Boolean(health.ai_available),
  }
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-[#78350F] text-white hover:bg-[#5f2a0d] shadow-sm',
    outline: 'border border-stone-200 bg-white text-stone-700 hover:border-amber-700/40 hover:bg-amber-50/50',
    quiet: 'text-stone-600 hover:bg-stone-100',
    gold: 'bg-amber-400 text-stone-950 hover:bg-amber-300',
  }
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>
}

function Status({ children }) {
  const label = String(children || 'Pending')
  const lower = label.toLowerCase()
  const tone = lower.includes('paid') || lower.includes('delivered') || lower === 'approved' || lower === 'confirmed'
    ? 'bg-emerald-50 text-emerald-800'
    : lower.includes('transit') || lower.includes('production') || lower === 'picked up'
      ? 'bg-blue-50 text-blue-800'
      : lower.includes('reject') || lower.includes('cancel')
        ? 'bg-red-50 text-red-700'
        : 'bg-amber-50 text-amber-800'
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 text-[11px] font-semibold ${tone}`}><span className="size-1.5 rounded-full bg-current" />{banglaText(label)}</span>
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">{banglaText(eyebrow)}</p>}<h1 className="font-display text-[30px] leading-tight text-stone-900">{banglaText(title)}</h1>{description && <p className="mt-1 text-sm text-stone-500">{banglaText(description)}</p>}</div>{action}</div>
}

function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-stone-200 bg-[#fdfbf7] shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-[#fdfbf7]/95 px-5 py-4 backdrop-blur"><h2 className="font-display text-[22px] text-stone-900">{banglaText(title)}</h2><button type="button" title="বন্ধ করুন" aria-label="ডায়ালগ বন্ধ করুন" onClick={onClose} className="rounded p-2 text-stone-500 hover:bg-stone-100"><X size={18} /></button></div><div className="p-5">{children}</div></section></div>
}

function App() {
  const [activeUser, setActiveUser] = useState(null)
  const [activeView, setActiveView] = useState('Overview')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [verifications, setVerifications] = useState([])
  const [stats, setStats] = useState({ users: 0, artisans: 0, active_orders: 0, pending_verifications: 0, advance_collected: 0 })
  const [apiOnline, setApiOnline] = useState(false)
  const [apiMode, setApiMode] = useState(null)
  const [aiAvailable, setAiAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [modal, setModal] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [projectText, setProjectText] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [busy, setBusy] = useState(false)

  async function refreshData(userId = activeUser.id) {
    setLoading(true)
    const data = await loadWorkspace(userId)
    setStats((current) => data.dashboard || current)
    setOrders(data.orders)
    setUsers(data.users)
    setVerifications(data.verifications)
    setApiOnline(data.online)
    setAiAvailable(data.aiAvailable)
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    loadWorkspace(activeUser?.id).then((data) => {
      if (!active) return
      setStats(data.dashboard || { users: 0, artisans: 0, active_orders: 0, pending_verifications: 0, advance_collected: 0 })
      setOrders(data.orders)
      setUsers(data.users)
      setVerifications(data.verifications)
      setApiOnline(data.online)
      setAiAvailable(data.aiAvailable)
      setApiMode(data.mode)
      setApiMode(data.mode)
      if (!activeUser && data.mode === 'demo' && data.users.length) {
        setActiveUser(data.users.find((user) => user.role === 'admin') || data.users[0])
      }
      if (data.mode === 'production' && !data.authenticated) {
        window.localStorage.removeItem('shilposhikha-demo-token')
        window.localStorage.removeItem('shilposhikha-session')
        setActiveUser(null)
      }
      setLoading(false)
    })
    return () => { active = false }
  }, [activeUser])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  function showNotice(message, tone = 'success') { setNotice({ message, tone }) }
  async function switchUser(event) {
    const next = users.find((user) => String(user.id) === event.target.value)
    if (!next) return
    try {
      const result = await request('/api/auth/login', { method: 'POST', body: { email: next.email, password: 'demo-pass' } })
      window.localStorage.setItem('shilposhikha-session', result.access_token)
      setActiveUser(result.user)
    } catch (error) { showNotice(error.message, 'error') }
  }

  async function submitOrder(values) {
    setBusy(true)
    try {
      await request('/api/orders', { userId: activeUser.id, method: 'POST', body: values })
      await refreshData()
      setModal(null)
      showNotice('পাইকারি অর্ডার দেওয়া হয়েছে। এখন কারিগর এটি পর্যালোচনা করতে পারবেন।')
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  async function handleOrderAction(order, action) {
    setBusy(true)
    try {
      if (action === 'pay') {
        await request(`/api/orders/${order.id}/payments`, { userId: activeUser.id, method: 'POST' })
        showNotice('ডেমো অগ্রিম নিশ্চিত হয়েছে। কোনো অর্থ লেনদেন হয়নি।')
      } else if (action === 'accept') {
        await request(`/api/orders/${order.id}/accept`, { userId: activeUser.id, method: 'PATCH' })
        showNotice('অর্ডারটি গ্রহণ করে কারিগরের কাছে বরাদ্দ করা হয়েছে।')
      } else if (action.startsWith('ship:')) {
        const status = action.slice(5)
        await request(`/api/orders/${order.id}/shipment`, { userId: activeUser.id, method: 'PATCH', body: { status, carrier: 'Pathao Courier' } })
        showNotice(`ডেলিভারির অবস্থা হালনাগাদ হয়েছে: ${banglaText(status)}।`)
      } else if (action === 'receipt') {
        const receipt = await request(`/api/orders/${order.id}/receipt`, { userId: activeUser.id })
        setModal({ type: 'receipt', data: receipt })
      }
      if (action !== 'receipt') await refreshData()
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  async function handleVerification(id, status) {
    try {
      await request(`/api/verifications/${id}`, { userId: activeUser.id, method: 'PATCH', body: { status } })
      await refreshData()
      showNotice(`যাচাই ${banglaText(status)} হয়েছে।`)
    } catch (error) { showNotice(error.message, 'error') }
  }

  async function submitChat(event) {
    event.preventDefault()
    const message = chatInput.trim()
    if (!message) return
    setChatInput('')
    setChatMessages((items) => [...items, { role: 'user', text: message }])
    setBusy(true)
    try {
      const result = await request('/api/ai/chat', { userId: activeUser.id, method: 'POST', body: { message, topic: 'হাতের কাজ', locale: 'bn' } })
      setChatMessages((items) => [...items, { role: 'assistant', text: result.answer }])
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  async function submitFeedback(event) {
    event.preventDefault()
    if (projectText.trim().length < 8) return
    setBusy(true)
    try {
      const result = await request('/api/ai/feedback', { userId: activeUser.id, method: 'POST', body: { project: projectText } })
      setFeedback(result)
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  async function createMember(values) {
    setBusy(true)
    try {
      const result = await request('/api/auth/register', { method: 'POST', body: values })
      window.localStorage.setItem('shilposhikha-session', result.access_token)
      setActiveUser(result.user)
      await refreshData(result.user.id)
      setModal(null)
      showNotice('অ্যাকাউন্ট তৈরি হয়েছে। ShilpoShikha-তে স্বাগতম।')
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  async function signIn(values) {
    setBusy(true)
    try {
      const result = await request('/api/auth/login', { method: 'POST', body: values })
      window.localStorage.setItem('shilposhikha-session', result.access_token)
      setActiveUser(result.user)
      setModal(null)
      showNotice(`আবার স্বাগতম, ${result.user.name.split(' ')[0]}.`)
    } catch (error) { showNotice(error.message, 'error') } finally { setBusy(false) }
  }

  const isAdmin = activeUser?.role === 'admin'
  const visibleNav = activeUser ? (isAdmin ? navItems : navItems.filter((item) => item.label !== 'Approvals')) : []

  if (loading) return <AccessScreen mode="loading" />
  if (!apiOnline) return <AccessScreen mode="offline" onRetry={() => refreshData(null)} />
  if (!activeUser) {
    return <AccessScreen mode="production" busy={busy} notice={notice} onLogin={signIn} onRegister={createMember} />
  }

  return <div className="min-h-screen bg-[#fdfbf7] text-stone-900"><div className="flex min-h-screen">
    <aside className="hidden w-60.5 shrink-0 flex-col border-r border-stone-200 bg-[#faf8f3] lg:flex"><Brand /><div className="px-3 pt-6"><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">কর্মক্ষেত্র</p><nav className="space-y-1">{visibleNav.map((item) => <NavButton key={item.label} item={item} active={activeView === item.label} onClick={() => setActiveView(item.label)} />)}</nav></div><div className="mt-auto p-4"><div className="soft-grid overflow-hidden rounded-md border border-amber-900/10 bg-[#fff9e9] p-4"><div className="mb-3 flex size-8 items-center justify-center rounded bg-amber-400 text-amber-950"><Sparkles size={16} /></div><p className="text-sm font-bold text-stone-900">ঐতিহ্য এগিয়ে যাক।</p><p className="mt-1 text-xs leading-5 text-stone-600">প্রথম নমুনা থেকে চূড়ান্ত ডেলিভারি পর্যন্ত প্রতিটি ধাপে সহায়তা।</p><button onClick={() => setActiveView('AI classroom')} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-700">এআই শিক্ষকের সঙ্গে পরিচিত হোন <ArrowRight size={13} /></button></div><div className="mt-4 flex items-center gap-2 border-t border-stone-200 pt-4 text-[11px] text-stone-500"><span className={`size-2 rounded-full ${apiOnline ? 'bg-emerald-600' : 'bg-amber-500'}`} />{banglaText(apiOnline ? 'Demo services connected' : 'Local preview mode')}</div></div></aside>

    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-stone-200 bg-[#fdfbf7]/95 px-4 backdrop-blur-md sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => setMobileNavOpen((open) => !open)} className="rounded p-2 text-stone-600 hover:bg-stone-100 lg:hidden" aria-label="নেভিগেশন খুলুন"><Menu size={19} /></button>
                    <div className="hidden items-center gap-2 text-xs text-stone-400 sm:flex"><span>কর্মক্ষেত্র</span><span>/</span><span className="font-semibold text-stone-700">{banglaText(activeView)}</span></div>
          <span className="text-sm font-semibold text-stone-800 sm:hidden">{banglaText(activeView)}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setActiveView('Orders')} className="hidden h-9 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-xs text-stone-400 sm:flex"><Search size={14} /><span>অর্ডার বা সদস্য খুঁজুন</span><span className="ml-4 rounded border border-stone-200 px-1.5 py-0.5 text-[10px]">/</span></button>
          <button title="বিজ্ঞপ্তি" aria-label="বিজ্ঞপ্তি" onClick={() => setActiveView('Approvals')} className="relative rounded-md p-2 text-stone-500 hover:bg-stone-100"><Bell size={17} />{stats.pending_verifications > 0 && <span className="absolute right-1 top-1 size-2 rounded-full border border-[#fdfbf7] bg-red-600" />}</button>
          <div className="hidden h-7 w-px bg-stone-200 sm:block" />
            {apiMode === 'demo' ? <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white py-1 pl-2.5 pr-2 text-sm">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#78350F] text-[10px] font-bold text-white">{activeUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                        <select aria-label="ডেমো অ্যাকাউন্ট পরিবর্তন করুন" value={activeUser.id} onChange={switchUser} className="max-w-28 cursor-pointer appearance-none bg-transparent text-xs font-semibold text-stone-700 outline-none sm:max-w-33">{users.map((user) => <option key={user.id} value={user.id}>{user.name} · {banglaText(titleCase(user.role))}</option>)}</select>
            <ChevronDown size={13} className="text-stone-400" />
          </label> : <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-white py-1 pl-2.5 pr-2 text-xs font-semibold text-stone-700">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#78350F] text-[10px] font-bold text-white">{activeUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
            <span className="max-w-32 truncate">{activeUser.name}</span>
            <button title="সাইন আউট" aria-label="সাইন আউট" onClick={async () => { await request('/api/auth/logout', { method: 'POST' }).catch(() => null); window.localStorage.removeItem('shilposhikha-session'); setActiveUser(null) }} className="rounded p-1.5 text-stone-500 hover:bg-stone-100"><LogOut size={15} /></button>
          </div>}
        </div>
      </header>

      {mobileNavOpen && <div className="absolute z-40 w-full border-b border-stone-200 bg-[#fdfbf7] px-4 py-3 shadow-lg lg:hidden"><nav className="grid grid-cols-2 gap-1">{visibleNav.map((item) => <NavButton key={item.label} item={item} active={activeView === item.label} onClick={() => { setActiveView(item.label); setMobileNavOpen(false) }} />)}</nav></div>}

      <main className="mx-auto max-w-375 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-9">{notice && <div role="status" className={`rise-in mb-5 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${notice.tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}><span className="flex items-center gap-2">{notice.tone === 'error' ? <X size={16} /> : <CheckCircle2 size={16} />}{notice.message}</span><button aria-label="বার্তা বন্ধ করুন" onClick={() => setNotice(null)}><X size={15} /></button></div>}
        {activeView === 'Overview' && <Overview stats={stats} orders={orders} verifications={verifications} loading={loading} onNavigate={setActiveView} onNewOrder={activeUser.role === 'buyer' || isAdmin ? () => setModal({ type: 'order' }) : null} currentUser={activeUser} />}
        {activeView === 'Orders' && <OrdersView orders={orders} user={activeUser} busy={busy} onNewOrder={() => setModal({ type: 'order' })} onAction={handleOrderAction} />}
        {activeView === 'People' && <PeopleView users={users} onAdd={() => setModal({ type: 'register' })} onVerify={async () => { try { await request(`/api/users/${activeUser.id}/verification`, { userId: activeUser.id, method: 'POST', body: { document_name: `${activeUser.name} · identity document.pdf` } }); await refreshData(); showNotice('যাচাইয়ের আবেদন প্রশাসকের তালিকায় জমা হয়েছে।') } catch (error) { showNotice(error.message, 'error') } }} user={activeUser} />}
        {activeView === 'AI classroom' && <AiClassroom aiAvailable={aiAvailable} messages={chatMessages} input={chatInput} setInput={setChatInput} onChat={submitChat} projectText={projectText} setProjectText={setProjectText} onFeedback={submitFeedback} feedback={feedback} busy={busy} />}
        {activeView === 'Approvals' && <ApprovalsView verifications={verifications} onDecision={handleVerification} />}
      </main>
      </div>
  </div>

    <div className={`fixed inset-x-0 bottom-0 z-30 grid ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} border-t border-stone-200 bg-[#fdfbf7]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur lg:hidden`}>{visibleNav.map((item) => <button key={item.label} onClick={() => setActiveView(item.label)} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] font-semibold ${activeView === item.label ? 'text-amber-900' : 'text-stone-400'}`}><item.icon size={18} strokeWidth={activeView === item.label ? 2.2 : 1.7} />{banglaText(item.label === 'AI classroom' ? 'AI tutor' : item.label)}</button>)}</div>
  {modal?.type === 'order' && <OrderDialog busy={busy} onClose={() => setModal(null)} onSubmit={submitOrder} />}
  {modal?.type === 'register' && <AuthDialog mode="register" busy={busy} onClose={() => setModal(null)} onSubmit={createMember} onModeChange={(mode) => setModal({ type: mode })} />}
  {modal?.type === 'login' && <AuthDialog mode="login" busy={busy} onClose={() => setModal(null)} onSubmit={signIn} onModeChange={(mode) => setModal({ type: mode })} />}
  {modal?.type === 'receipt' && <ReceiptDialog receipt={modal.data} onClose={() => setModal(null)} />}
  </div>
}

function AccessScreen({ mode, busy = false, notice, onRetry, onLogin, onRegister }) {
  const [formMode, setFormMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', location: '' })
  const isRegister = formMode === 'register'

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    if (isRegister) {
      onRegister(form)
    } else {
      onLogin({ email: form.email, password: form.password })
    }
  }

  return <div className="flex min-h-screen flex-col bg-[#fdfbf7]">
    <Brand />
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">শিখুন, তৈরি করুন, এগিয়ে যান</p>
      <h1 className="mt-2 font-display text-[32px] leading-tight text-stone-900">{banglaText(mode === 'loading' ? 'Connecting to your workspace' : mode === 'offline' ? 'Workspace is offline' : isRegister ? 'Join the craft community' : 'Welcome back')}</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">{banglaText(mode === 'loading' ? 'Checking the API and database connection.' : mode === 'offline' ? 'Start XAMPP MySQL and the FastAPI server, then try again.' : 'সাইন ইন করুন or create a learner, artisan, or buyer account.')}</p>
      {mode === 'loading' && <div className="mt-6 flex items-center gap-2 text-sm text-stone-500"><LoaderCircle size={16} className="animate-spin" />{banglaText('Connecting…')}</div>}
      {mode === 'offline' && <Button onClick={onRetry} className="mt-6 self-start"><ArrowRight size={15} />{banglaText('Retry connection')}</Button>}
      {mode === 'production' && <section className="mt-6 rounded-md border border-stone-200 bg-white p-5 shadow-sm">
        {notice && <p role="alert" className={`mb-4 rounded px-3 py-2 text-xs ${notice.tone === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{notice.message}</p>}
        <div className="mb-5 grid grid-cols-2 border-b border-stone-200">
          <button type="button" onClick={() => setFormMode('login')} className={`border-b-2 pb-2 text-sm font-semibold ${!isRegister ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500'}`}>সাইন ইন করুন</button>
          <button type="button" onClick={() => setFormMode('register')} className={`border-b-2 pb-2 text-sm font-semibold ${isRegister ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500'}`}>অ্যাকাউন্ট তৈরি করুন</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {isRegister && <Field label="Full name"><input className={inputClass} name="name" autoComplete="name" required minLength="2" value={form.name} onChange={update} placeholder="আপনার নাম" /></Field>}
          <Field label="Email address"><input className={inputClass} type="email" name="email" autoComplete="email" required value={form.email} onChange={update} placeholder="আপনার ইমেইল" /></Field>
          <Field label="Password"><input className={inputClass} type="password" name="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : 1} value={form.password} onChange={update} placeholder={isRegister ? 'কমপক্ষে ৮টি অক্ষর' : 'আপনার পাসওয়ার্ড'} /></Field>
          {isRegister && <><Field label="I am joining as"><select className={inputClass} name="role" value={form.role} onChange={update}><option value="learner">শিক্ষার্থী</option><option value="artisan">কারিগর</option><option value="buyer">ক্রেতা</option></select></Field><Field label="Location"><input className={inputClass} name="location" value={form.location} onChange={update} placeholder="জেলা বা গ্রামের নাম" /></Field></>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? <LoaderCircle size={15} className="animate-spin" /> : isRegister ? <UserPlus size={15} /> : <LogIn size={15} />}{isRegister ? 'অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন করুন'}</Button>
        </form>
        <p className="mt-4 text-[10px] leading-4 text-stone-500">প্রশাসকের অ্যাকাউন্ট কর্মক্ষেত্রের প্রশাসক তৈরি করেন। নতুন নিবন্ধনে প্রশাসকের অনুমতি নেওয়া যায় না।</p>
      </section>}
    </main>
  </div>
}

function Brand() {
  return <div className="flex h-17 items-center gap-3 border-b border-stone-200 px-5"><div className="flex size-9 items-center justify-center rounded bg-[#78350F] text-amber-300"><Flower2 size={22} strokeWidth={1.7} /></div><div><p className="font-display text-[19px] font-semibold leading-5 text-[#78350F]">ShilpoShikha</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-500">শিখুন, তৈরি করুন, এগিয়ে যান</p></div></div>
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${active ? 'bg-[#78350F] text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}><Icon size={17} strokeWidth={active ? 2.2 : 1.8} /><span>{banglaText(item.label)}</span>{item.label === 'Approvals' && <span className={`ml-auto rounded px-1.5 py-0.5 text-[10px] ${active ? 'bg-amber-300 text-stone-900' : 'bg-amber-100 text-amber-900'}`}>১</span>}</button>
}

function KpiCard({ label, value, note, icon: Icon, trend, accent = false }) {
  return <article className={`rounded-md border p-4 sm:p-5 ${accent ? 'border-[#78350F] bg-[#78350F] text-white' : 'border-stone-200 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-medium ${accent ? 'text-amber-100' : 'text-stone-500'}`}>{banglaText(label)}</span><span className={`flex size-8 items-center justify-center rounded ${accent ? 'bg-white/10 text-amber-300' : 'bg-amber-50 text-amber-900'}`}><Icon size={16} /></span></div><p className={`mt-4 text-[26px] font-bold leading-none ${accent ? 'text-white' : 'text-stone-900'}`}>{typeof value === 'string' && /^\d+$/.test(value) ? new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: value.length }).format(Number(value)) : banglaText(value)}</p><div className={`mt-2 flex items-center gap-1 text-[11px] ${accent ? 'text-amber-100' : 'text-stone-500'}`}>{trend && <ArrowUpRight size={13} className={accent ? 'text-amber-300' : 'text-emerald-700'} />}{banglaText(note)}</div></article>
}

function Overview({ stats, orders, verifications, loading, onNavigate, onNewOrder, currentUser }) {
  const pending = verifications.filter((item) => item.status === 'Pending')
  return <div className="rise-in"><SectionHeading eyebrow={new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} title={`শুভ সকাল, ${currentUser.name.split(' ')[0]}`} description="আপনার কারুশিল্প কমিউনিটিতে আজকের কার্যক্রমের সারসংক্ষেপ।" action={onNewOrder && <Button onClick={onNewOrder}><Plus size={16} />নতুন পাইকারি অর্ডার</Button>} />
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Community members" value={loading ? '—' : new Intl.NumberFormat('bn-BD').format(stats.users)} note={`${stats.artisans} verified artisans`} icon={UsersRound} trend /><KpiCard label="Active wholesale" value={loading ? '—' : new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: 2 }).format(stats.active_orders)} note="Orders moving through production" icon={PackageCheck} trend /><KpiCard label="Advance collected" value={loading ? '—' : money(stats.advance_collected)} note="Simulated payment records" icon={CircleDollarSign} accent /><KpiCard label="Needs your review" value={loading ? '—' : new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: 2 }).format(stats.pending_verifications)} note="Identity checks awaiting approval" icon={FileCheck2} /></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.85fr)]"><div className="space-y-5">
      <section className="overflow-hidden rounded-md border border-stone-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4"><div><h2 className="text-sm font-bold text-stone-900">চলমান অর্ডার</h2><p className="mt-1 text-xs text-stone-500">আপনার নেটওয়ার্কজুড়ে উৎপাদন ও ডেলিভারি</p></div><button onClick={() => onNavigate('Orders')} className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-700">সব দেখুন <ArrowRight size={14} /></button></div><div className="grid grid-cols-12 gap-1 border-b border-stone-100 px-5 pb-3 pt-4 text-[10px] font-bold uppercase tracking-wide text-stone-400"><span className="col-span-6 sm:col-span-5">অর্ডার ও কারিগর</span><span className="col-span-3 hidden sm:block">অগ্রিম</span><span className="col-span-4 sm:col-span-3">অবস্থা</span><span className="col-span-2 text-right">পরবর্তী</span></div><div className="divide-y divide-stone-100">{orders.slice(0, 3).map((order) => <div key={order.id} className="grid grid-cols-12 items-center gap-1 px-5 py-3.5"><div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-5"><div className="hidden size-9 shrink-0 items-center justify-center rounded bg-[#faf2df] text-amber-900 sm:flex"><Image size={16} /></div><div className="min-w-0"><p className="truncate text-xs font-bold text-stone-800">{banglaText(order.product)}</p><p className="mt-1 truncate text-[10px] text-stone-500">{order.artisan} · {new Intl.NumberFormat('bn-BD').format(order.quantity)} টি</p></div></div><span className="col-span-3 hidden text-xs font-semibold text-stone-700 sm:block">{money(order.advance_amount)}</span><div className="col-span-4 sm:col-span-3"><Status>{order.status}</Status></div><div className="col-span-2 flex justify-end"><button title="অর্ডার দেখুন" onClick={() => onNavigate('Orders')} className="rounded p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800"><ArrowRight size={15} /></button></div></div>)}{orders.length === 0 && <p className="px-5 py-8 text-center text-sm text-stone-500">এখনও কোনো অর্ডার নেই। শুরু করতে প্রথম পাইকারি অর্ডারটি দিন।</p>}</div></section>
      <section className="rounded-md border border-stone-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-stone-900">অর্ডারের কার্যক্রম</h2><p className="mt-1 text-xs text-stone-500">বাস্তব কার্যক্রমের তথ্য যোগ হলে এখানে দেখা যাবে।</p></div><span className="rounded-sm bg-stone-100 px-2 py-1 text-[10px] font-bold text-stone-600">তথ্য নেই</span></div><div className="mt-6 flex h-37.5 items-center justify-center border-b border-stone-200 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_36px,#e7e5e4_37px)] px-1 text-xs text-stone-400">এখনও কোনো কার্যক্রমের তথ্য নেই</div></section>
    </div><div className="space-y-5">
      <section className="relative overflow-hidden rounded-md bg-[#78350F] p-5 text-white"><div className="absolute -right-7 -top-8 size-36 rounded-full border border-amber-300/20" /><div className="absolute -right-2 -top-3 size-24 rounded-full border border-amber-300/20" /><div className="relative"><div className="flex items-center gap-2 text-amber-300"><Sparkles size={15} /><span className="text-[10px] font-bold uppercase tracking-[0.13em]">এআই শেখার সহচর</span></div><h2 className="mt-3 max-w-65 font-display text-[24px] leading-[1.12]">আপনার কাজের আরেকটি সহায়ক হাত।</h2><p className="mt-2 max-w-70 text-xs leading-5 text-amber-50/80">কৌশল জানুন, পণ্যের দাম নির্ধারণ করুন, অথবা আপনার কাজের পরামর্শ নিন।</p><Button variant="gold" className="mt-4 min-h-9" onClick={() => onNavigate('AI classroom')}>এআই পাঠশালা খুলুন <ArrowRight size={14} /></Button></div></section>
      <section className="rounded-md border border-stone-200 bg-white"><div className="flex items-center justify-between border-b border-stone-100 px-4 py-3.5"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-800" /><h2 className="text-sm font-bold text-stone-900">যাচাইয়ের সারি</h2></div><button onClick={() => onNavigate('Approvals')} className="text-xs font-semibold text-stone-500 hover:text-amber-900">পর্যালোচনা</button></div><div className="divide-y divide-stone-100">{pending.slice(0, 2).map((item) => <div key={item.id} className="flex items-center gap-3 px-4 py-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-900">{item.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-stone-800">{item.name}</p><p className="truncate text-[10px] text-stone-500">{banglaText(item.document_name)}</p></div><Clock3 size={14} className="shrink-0 text-amber-600" /></div>)}{pending.length === 0 && <p className="px-4 py-5 text-xs text-stone-500">সব পরিচয় যাচাই হালনাগাদ।</p>}</div><button onClick={() => onNavigate('Approvals')} className="flex w-full items-center justify-center gap-1 border-t border-stone-100 py-3 text-xs font-bold text-amber-900 hover:bg-amber-50/50">অনুমোদন ডেস্ক খুলুন <ArrowRight size={13} /></button></section>
      <section className="rounded-md border border-stone-200 bg-[#fffdfa] p-4"><div className="flex items-start gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-800"><HandCoins size={16} /></div><div><p className="text-xs font-bold text-stone-800">ক্রেতার সুরক্ষা, স্পষ্টভাবে</p><p className="mt-1 text-[11px] leading-5 text-stone-500">অর্ডারের শুরুতে ৫০% অগ্রিম দিতে হয়। বাকি টাকা ডেলিভারি চার্জ থেকে আলাদাভাবে হিসাব করা হয়।</p></div></div></section>
    </div></div>
  </div>
}

function OrdersView({ orders, user, busy, onNewOrder, onAction }) {
  const canAccept = ['artisan', 'admin'].includes(user.role)
  const canPay = ['buyer', 'admin'].includes(user.role)
  return <div className="rise-in"><SectionHeading eyebrow="WHOLESALE WORKFLOW" title="Orders & delivery" description="From a buyer’s first request through the final delivery scan." action={user.role === 'buyer' || user.role === 'admin' ? <Button onClick={onNewOrder}><Plus size={16} />অর্ডার দিন</Button> : null} />
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><KpiCard label="Open orders" value={String(orders.filter((order) => order.status !== 'Delivered').length).padStart(2, '0')} note="Awaiting a next step" icon={PackageCheck} /><KpiCard label="Advance due" value={money(orders.filter((order) => order.payment_status !== 'Advance paid').reduce((sum, order) => sum + order.advance_amount, 0))} note="50% of product subtotal" icon={HandCoins} /><KpiCard label="In transit" value={String(orders.filter((order) => order.delivery_status === 'In transit').length).padStart(2, '0')} note="Shipment tracking active" icon={Truck} /></div>
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-210 border-collapse text-left"><thead><tr className="border-b border-stone-200 bg-stone-50/70 text-[10px] font-bold uppercase tracking-wide text-stone-500"><th className="px-4 py-3">অর্ডার</th><th className="px-4 py-3">ক্রেতা · কারিগর</th><th className="px-4 py-3">মোট</th><th className="px-4 py-3">অগ্রিম</th><th className="px-4 py-3">উৎপাদন</th><th className="px-4 py-3">ডেলিভারি</th><th className="px-4 py-3 text-right">কাজ</th></tr></thead><tbody className="divide-y divide-stone-100">{orders.map((order) => <tr key={order.id} className="align-middle hover:bg-[#fdfbf7]"><td className="px-4 py-4"><p className="max-w-55 truncate text-xs font-bold text-stone-800">{banglaText(order.product)}</p><p className="mt-1 text-[10px] text-stone-500">#{String(order.id).padStart(5, '0')} · {new Intl.NumberFormat('bn-BD').format(order.quantity)} টি</p></td><td className="px-4 py-4 text-xs text-stone-700">{order.buyer}<span className="mx-1.5 text-stone-300">/</span>{order.artisan}</td><td className="px-4 py-4 text-xs font-bold text-stone-800">{money(order.total_amount)}</td><td className="px-4 py-4"><div className="text-xs font-semibold text-stone-800">{money(order.advance_amount)}</div><div className="mt-1"><Status>{order.payment_status}</Status></div></td><td className="px-4 py-4"><Status>{order.status}</Status></td><td className="px-4 py-4"><button onClick={() => order.delivery_status === 'In transit' ? onAction(order, 'ship:Delivered') : onAction(order, 'ship:In transit')} disabled={!canAccept || busy} className="text-left disabled:cursor-default"><Status>{order.delivery_status}</Status><span className="mt-1 block text-[10px] text-stone-500">{banglaText(order.tracking_code || 'Update tracking')}</span></button></td><td className="px-4 py-4"><div className="flex justify-end gap-1.5">{canAccept && order.status === 'Awaiting artisan' && <button title="অর্ডার গ্রহণ করুন" onClick={() => onAction(order, 'accept')} className="rounded border border-stone-200 p-2 text-emerald-800 hover:bg-emerald-50"><Check size={14} /></button>}{canPay && order.payment_status !== 'Advance paid' && <button title="নমুনা অগ্রিম নিশ্চিত করুন" onClick={() => onAction(order, 'pay')} className="rounded border border-stone-200 p-2 text-amber-900 hover:bg-amber-50"><CircleDollarSign size={14} /></button>}<button title="ডিজিটাল রসিদ দেখুন" onClick={() => onAction(order, 'receipt')} className="rounded border border-stone-200 p-2 text-stone-600 hover:bg-stone-50"><ReceiptText size={14} /></button></div></td></tr>)}{orders.length === 0 && <tr><td colSpan="7" className="px-4 py-12 text-center text-sm text-stone-500">আপনার অর্ডার তালিকা খালি। নতুন পাইকারি অর্ডার এখানে দেখা যাবে।</td></tr>}</tbody></table></div></div>
    <div className="mt-4 flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-5 text-amber-900"><CircleDollarSign size={15} className="mt-0.5 shrink-0" /><p><strong>শুধুমাত্র ডেমো পেমেন্ট।</strong> “অগ্রিম নিশ্চিত করুন” পরীক্ষার জন্য ৫০% নমুনা পেমেন্ট নথিভুক্ত করে। এটি বিকাশ, ব্যাংক বা পেমেন্ট সেবার সঙ্গে সংযুক্ত নয়।</p></div>
  </div>
}

function PeopleView({ users, onAdd, onVerify, user }) {
  return <div className="rise-in"><SectionHeading eyebrow="COMMUNITY DIRECTORY" title="People & identity" description="Learners, artisans, and buyers with clear profiles and verification status." action={<div className="flex gap-2"><Button variant="outline" onClick={onVerify}><FileCheck2 size={15} />{user.verified ? 'যাচাইয়ের নথি যোগ করুন' : 'যাচাইয়ের আবেদন জমা দিন'}</Button><Button onClick={onAdd}><UserPlus size={15} />অ্যাকাউন্ট তৈরি করুন</Button></div>} />
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><KpiCard label="Community members" value={String(users.length).padStart(2, '0')} note="Across all account types" icon={UsersRound} /><KpiCard label="Artisans" value={String(users.filter((item) => item.role === 'artisan').length).padStart(2, '0')} note="Makers on the platform" icon={Flower2} /><KpiCard label="Verified profiles" value={String(users.filter((item) => item.verified).length).padStart(2, '0')} note="Identity reviewed by admin" icon={BadgeCheck} /></div>
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white"><div className="flex items-center justify-between border-b border-stone-100 px-4 py-3.5"><div><h2 className="text-sm font-bold text-stone-900">সদস্য তালিকা</h2><p className="mt-1 text-xs text-stone-500">অ্যাকাউন্টের ধরন ও যাচাইয়ের অবস্থা এক নজরে</p></div><span className="rounded bg-stone-100 px-2 py-1 text-[10px] font-bold text-stone-600">{banglaText(`${users.length} accounts`)}</span></div><div className="divide-y divide-stone-100">{users.map((person) => <div key={person.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#faf2df] text-xs font-bold text-amber-900">{person.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-38.75 flex-1"><p className="text-xs font-bold text-stone-800">{person.name}</p><p className="mt-1 text-[11px] text-stone-500">{person.email}</p></div><span className="min-w-22 rounded-sm bg-stone-100 px-2 py-1 text-center text-[10px] font-bold capitalize text-stone-700">{banglaText(person.role)}</span><span className="flex min-w-27.5 items-center gap-1.5 text-[11px] text-stone-500"><span className="size-1.5 rounded-full bg-stone-300" />{banglaText(person.location || 'Bangladesh')}</span><div className="min-w-25"><Status>{person.verified ? 'Approved' : 'Pending'}</Status></div></div>)}</div></div>
    <p className="mt-4 text-xs text-stone-500">নতুন অ্যাকাউন্ট শিক্ষার্থী, কারিগর বা ক্রেতা হিসেবে খোলা যায়। প্রশাসকের অনুমতি আলাদাভাবে দেওয়া হয়।</p>
  </div>
}

function AiClassroom({ aiAvailable, messages, input, setInput, onChat, projectText, setProjectText, onFeedback, feedback, busy }) {
  return <div className="rise-in"><SectionHeading eyebrow="LEARN BY MAKING" title="AI classroom" description="A practical companion for craft questions, pricing, and project reflection." /><div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
    <section className="flex min-h-140 flex-col overflow-hidden rounded-md border border-stone-200 bg-white"><div className="flex items-center gap-3 border-b border-stone-100 bg-[#fffdfa] px-5 py-4"><div className="flex size-9 items-center justify-center rounded bg-[#78350F] text-amber-300"><BookOpenText size={18} /></div><div className="flex-1"><h2 className="text-sm font-bold text-stone-900">বাংলা কারুশিল্পের শিক্ষক</h2><p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-stone-500"><span className="size-1.5 rounded-full bg-emerald-600" />{aiAvailable ? 'এআই সেবা সংযুক্ত' : 'এআই সেবা এখনো যুক্ত করা হয়নি'}</p></div><span className="rounded bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-900">{aiAvailable ? 'সক্রিয়' : 'অনুপলব্ধ'}</span></div><div className="flex-1 space-y-4 overflow-y-auto bg-[#fffdfa] p-5">{messages.length === 0 && <p className="text-center text-xs text-stone-400">{aiAvailable ? 'শেখার বিষয়ে প্রশ্ন লিখুন।' : 'এআই সেবা যুক্ত হলে এখানে কথোপকথন হবে।'}</p>}{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><div className={`flex size-7 shrink-0 items-center justify-center rounded-full ${message.role === 'user' ? 'bg-stone-200 text-stone-700' : 'bg-[#78350F] text-amber-300'}`}>{message.role === 'user' ? <UsersRound size={13} /> : <Sparkles size={13} />}</div><div className={`max-w-[82%] rounded-md px-3.5 py-3 text-xs leading-5 ${message.role === 'user' ? 'bg-[#78350F] text-white' : 'border border-stone-100 bg-[#faf8f3] text-stone-700'}`}>{message.text}</div></div>)}{busy && <div className="flex items-center gap-2 pl-9 text-xs text-stone-400"><LoaderCircle size={14} className="animate-spin" />ভাবছি…</div>}</div><form onSubmit={onChat} className="border-t border-stone-100 p-4"><label htmlFor="chat-input" className="sr-only">কারুশিল্প নিয়ে প্রশ্ন করুন</label><div className="flex items-end gap-2 rounded-md border border-stone-200 bg-white p-2 focus-within:border-amber-700/60 focus-within:ring-2 focus-within:ring-amber-700/10"><textarea id="chat-input" rows="2" maxLength="2000" value={input} onChange={(event) => setInput(event.target.value)} placeholder={aiAvailable ? "কৌশল, উপকরণ বা মূল্য নিয়ে প্রশ্ন করুন…" : "এআই সেবা যুক্ত হলে প্রশ্ন করতে পারবেন"} className="max-h-28 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-1 text-xs leading-5 text-stone-800 outline-none placeholder:text-stone-400" /><button disabled={!aiAvailable || busy || !input.trim()} aria-label="বার্তা পাঠান" className="flex size-9 shrink-0 items-center justify-center rounded bg-[#78350F] text-white hover:bg-[#5f2a0d] disabled:opacity-50"><Send size={15} /></button></div><p className="mt-2 text-[10px] text-stone-400">এটি শুধু শেখার সহায়তা। এআইয়ের পরামর্শ আপনার উপকরণ ও অভিজ্ঞতার সঙ্গে মিলিয়ে নিন।</p></form></section>
    <div className="space-y-5"><section className="rounded-md border border-stone-200 bg-white p-5"><div className="flex items-start gap-3"><div className="flex size-9 items-center justify-center rounded bg-amber-100 text-amber-900"><WandSparkles size={18} /></div><div><h2 className="text-sm font-bold text-stone-900">কাজের পর্যালোচনা</h2><p className="mt-1 text-xs leading-5 text-stone-500">আপনার কাজের বর্ণনা দিন এবং গুছানো পরামর্শ পান।</p></div></div><form onSubmit={onFeedback} className="mt-4"><label htmlFor="project-description" className="mb-1.5 block text-xs font-semibold text-stone-700">আপনি কী তৈরি করছেন?</label><textarea id="project-description" rows="5" maxLength="3000" value={projectText} onChange={(event) => setProjectText(event.target.value)} placeholder="উপকরণ, কৌশল, ব্যবহার বা আপনার সমস্যাটি লিখুন…" className="w-full resize-y rounded-md border border-stone-200 bg-[#fdfbf7] px-3 py-2.5 text-xs leading-5 text-stone-800 outline-none placeholder:text-stone-400 focus:border-amber-700/60 focus:ring-2 focus:ring-amber-700/10" /><Button type="submit" disabled={!aiAvailable || busy || projectText.trim().length < 8} className="mt-3 w-full"><Sparkles size={15} />আমার কাজ পর্যালোচনা করুন</Button></form>{feedback && <div className="mt-4 border-t border-stone-100 pt-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-800">অনুশীলনের স্কোর</span><span className="text-xl font-bold text-emerald-800">{feedback.score}<span className="text-xs text-stone-400"> / 100</span></span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100"><div style={{ width: `${feedback.score}%` }} className="h-full rounded-full bg-emerald-700" /></div><ul className="mt-3 space-y-2">{feedback.suggestions.map((suggestion) => <li key={suggestion} className="flex gap-2 text-[11px] leading-4 text-stone-600"><ArrowRight size={13} className="mt-0.5 shrink-0 text-amber-800" />{suggestion}</li>)}</ul></div>}</section>
      <section className="rounded-md border border-stone-200 bg-[#fffdfa] p-5"><h2 className="text-sm font-bold text-stone-900">শেখার বিষয়</h2><p className="mt-3 text-xs leading-5 text-stone-500">এখনো কোনো শেখার বিষয় যোগ করা হয়নি।</p></section><div className="rounded border border-blue-200 bg-blue-50/70 px-4 py-3 text-[11px] leading-5 text-blue-900">{aiAvailable ? 'এআই শিক্ষক প্রস্তুত। আপনার প্রশ্ন লিখুন।' : 'এআই সেবা এখনো সংযুক্ত নয়। প্রশাসক সংযোগ করলে এখানে শেখার সহায়তা পাওয়া যাবে।'}</div></div>
  </div></div>
}

function ApprovalsView({ verifications, onDecision }) {
  const pending = verifications.filter((item) => item.status === 'Pending')
  return <div className="rise-in"><SectionHeading eyebrow="ADMIN DESK" title="Review & approvals" description="Check identity submissions before approving access to protected workflows." /><div className="mb-5 grid gap-3 sm:grid-cols-3"><KpiCard label="Awaiting review" value={String(pending.length).padStart(2, '0')} note="Submitted identity records" icon={Clock3} /><KpiCard label="Reviewed profiles" value={String(verifications.length - pending.length).padStart(2, '0')} note="Approved or returned" icon={FileCheck2} /><KpiCard label="Review policy" value="Manual" note="Demo document review" icon={ShieldCheck} /></div><section className="overflow-hidden rounded-md border border-stone-200 bg-white"><div className="border-b border-stone-100 px-5 py-4"><h2 className="text-sm font-bold text-stone-900">পরিচয় যাচাইয়ের আবেদন</h2><p className="mt-1 text-xs text-stone-500">এই ডেমোর জন্য শুধু নথির নাম রাখা হয়; কোনো ফাইল আপলোড বা সংরক্ষণ করা হয় না।</p></div><div className="divide-y divide-stone-100">{verifications.map((item) => <div key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4"><div className="flex size-10 shrink-0 items-center justify-center rounded bg-amber-50 text-amber-900"><FileText size={18} /></div><div className="min-w-45 flex-1"><p className="text-xs font-bold text-stone-800">{item.name}</p><p className="mt-1 text-[11px] text-stone-500">{banglaText(item.document_name)}</p></div><Status>{item.status}</Status>{item.status === 'Pending' && <div className="flex gap-2"><button onClick={() => onDecision(item.id, 'Rejected')} className="min-h-9 rounded border border-stone-200 px-3 text-xs font-semibold text-stone-600 hover:bg-red-50 hover:text-red-700">ফেরত দিন</button><button onClick={() => onDecision(item.id, 'Approved')} className="inline-flex min-h-9 items-center gap-1.5 rounded bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800"><Check size={14} />অনুমোদন করুন</button></div>}</div>)}{verifications.length === 0 && <p className="px-5 py-12 text-center text-sm text-stone-500">পর্যালোচনার জন্য কোনো পরিচয়-সংক্রান্ত আবেদন নেই।</p>}</div></section><div className="mt-4 flex gap-2 rounded border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-5 text-amber-900"><ShieldCheck size={15} className="mt-0.5 shrink-0" /><p>শুধু ডেমো যাচাই। এই পর্দায় এনআইডি নথি বা আইনগত পরিচয় যাচাই করা হয় না।</p></div></div>
}

function Field({ label, children }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-stone-700">{banglaText(label)}</span>{children}</label> }
const inputClass = 'min-h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-amber-700/60 focus:ring-2 focus:ring-amber-700/10'

function OrderDialog({ busy, onClose, onSubmit }) {
  const [form, setForm] = useState({ product: '', quantity: '', unit_price: '', zone: '', artisan_id: null })
  const subtotal = Number(form.quantity) * Number(form.unit_price)
  const delivery = form.zone && Number(form.quantity) >= 20 ? ({ Dhaka: 120, Chattogram: 220, 'Other district': 300 }[form.zone] || 0) + Number(form.quantity) * 15 : null
  const advance = Math.ceil(subtotal / 2)
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value })) }
  function submit(event) { event.preventDefault(); onSubmit({ ...form, quantity: Number(form.quantity), unit_price: Number(form.unit_price), artisan_id: Number(form.artisan_id) || null }) }
  return <Modal title="Place a wholesale order" onClose={onClose}><form onSubmit={submit} className="space-y-4"><Field label="Product"><input className={inputClass} name="product" required minLength="2" value={form.product} onChange={update} placeholder="যেমন: হাতে বোনা জামদানি টেবিল রানার" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Quantity (pieces)"><input className={inputClass} type="number" name="quantity" min="20" max="100000" required value={form.quantity} onChange={update} /></Field><Field label="Unit price (৳)"><input className={inputClass} type="number" name="unit_price" min="1" value={form.unit_price} onChange={update} /></Field></div><Field label="Delivery zone"><select className={inputClass} name="zone" required value={form.zone} onChange={update}><option value="" disabled>ডেলিভারির এলাকা নির্বাচন করুন</option><option>ঢাকা</option><option>চট্টগ্রাম</option><option>অন্যান্য জেলা</option></select></Field><div className="rounded-md border border-stone-200 bg-[#faf8f3] p-4"><div className="flex justify-between text-xs text-stone-600"><span>পণ্যের উপমোট</span><span>{subtotal ? money(subtotal) : '—'}</span></div><div className="mt-2 flex justify-between text-xs text-stone-600"><span>ডেলিভারি চার্জ</span><span>{delivery === null ? '—' : money(delivery)}</span></div><div className="mt-3 flex justify-between border-t border-stone-200 pt-3 text-sm font-bold text-stone-900"><span>এখন পরিশোধ করুন · ৫০% অগ্রিম</span><span>{subtotal ? money(advance) : '—'}</span></div><div className="mt-1 flex justify-between text-[11px] text-stone-500"><span>পণ্যের বাকি টাকা</span><span>{subtotal ? money(subtotal - advance) : '—'}</span></div><p className="mt-2 text-[10px] leading-4 text-stone-500">ডেলিভারি চার্জ আলাদাভাবে হিসাব করা হয় এবং পণ্যের ৫০% অগ্রিমের অন্তর্ভুক্ত নয়।</p></div><div className="flex justify-end gap-2 pt-1"><Button variant="outline" type="button" onClick={onClose}>বাতিল করুন</Button><Button type="submit" disabled={busy || !form.product.trim() || !form.zone || Number(form.unit_price) <= 0 || Number(form.quantity) < 20}>{busy ? <LoaderCircle size={15} className="animate-spin" /> : <Check size={15} />}অর্ডার নিশ্চিত করুন</Button></div></form></Modal>
}

function AuthDialog({ mode, busy, onClose, onSubmit, onModeChange }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', location: '' })
  const registering = mode === 'register'
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  function submit(event) { event.preventDefault(); onSubmit(registering ? form : { email: form.email, password: form.password }) }
  return <Modal title={registering ? 'Create your account' : 'Welcome back'} onClose={onClose}><form onSubmit={submit} className="space-y-4">{registering && <Field label="Full name"><input className={inputClass} name="name" autoComplete="name" required minLength="2" value={form.name} onChange={update} placeholder="আপনার নাম" /></Field>}<Field label="Email address"><input className={inputClass} type="email" name="email" autoComplete="email" required value={form.email} onChange={update} placeholder="আপনার ইমেইল" /></Field><Field label="Password"><input className={inputClass} type="password" name="password" autoComplete={registering ? 'new-password' : 'current-password'} required minLength={registering ? 8 : 1} value={form.password} onChange={update} placeholder={registering ? 'কমপক্ষে ৮টি অক্ষর' : 'আপনার পাসওয়ার্ড'} /></Field>{registering && <><Field label="I am joining as"><select className={inputClass} name="role" value={form.role} onChange={update}><option value="learner">শিক্ষার্থী</option><option value="artisan">কারিগর</option><option value="buyer">ক্রেতা</option></select></Field><Field label="Location"><input className={inputClass} name="location" value={form.location} onChange={update} placeholder="জেলা বা গ্রামের নাম" /></Field></>}<Button type="submit" disabled={busy} className="w-full">{busy ? <LoaderCircle size={15} className="animate-spin" /> : registering ? <UserPlus size={15} /> : <LogIn size={15} />}{registering ? 'অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন করুন'}</Button><p className="text-center text-xs text-stone-500">{registering ? 'ইতোমধ্যে কমিউনিটির সদস্য?' : 'ShilpoShikha-তে নতুন?'} <button type="button" onClick={() => onModeChange(registering ? 'login' : 'register')} className="font-bold text-amber-900 underline decoration-amber-900/30 underline-offset-2">{registering ? 'সাইন ইন করুন' : 'অ্যাকাউন্ট খুলুন'}</button></p>{!registering && <p className="rounded bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-900">ডেমো অ্যাকাউন্টের পাসওয়ার্ড <strong>demo-pass</strong>. বাস্তব ব্যবহারের আগে প্রকৃত পরিচয় যাচাই সেবা যুক্ত করুন।</p>}</form></Modal>
}

function ReceiptDialog({ receipt, onClose }) {
  const order = receipt.order
  return <Modal title="Digital order receipt" onClose={onClose}><div className="receipt-print rounded-md border border-amber-900/20 bg-[#faf8f3] p-5"><div className="flex items-start justify-between border-b border-amber-900/20 pb-4"><div><p className="font-display text-[20px] font-semibold text-[#78350F]">ShilpoShikha</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-stone-500">পাইকারি অর্ডারের রসিদ</p></div><ReceiptText size={22} className="text-amber-800" /></div><div className="mt-4 flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase text-stone-500">রসিদ নম্বর</p><p className="mt-1 text-xs font-bold text-stone-900">SS-{String(order.id).padStart(5, '0')}</p></div><div className="text-right"><p className="text-[10px] uppercase text-stone-500">ইস্যুর তারিখ</p><p className="mt-1 text-xs font-semibold text-stone-800">{new Date(receipt.issued_at).toLocaleDateString('bn-BD')}</p></div></div><div className="mt-4 border-y border-stone-200 py-4"><p className="text-xs font-bold text-stone-900">{banglaText(order.product)}</p><p className="mt-1 text-[11px] text-stone-500">{new Intl.NumberFormat('bn-BD').format(order.quantity)} টি · {order.buyer} থেকে {order.artisan}</p></div><div className="space-y-2 py-4 text-xs"><div className="flex justify-between text-stone-600"><span>পণ্যের উপমোট</span><span>{money(order.subtotal)}</span></div><div className="flex justify-between text-stone-600"><span>ডেলিভারি · {banglaText(order.zone)}</span><span>{money(order.delivery_charge)}</span></div><div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900"><span>মোট অর্ডার</span><span>{money(order.total_amount)}</span></div><div className="flex justify-between text-emerald-800"><span>৫০% অগ্রিম · {banglaText(order.payment_status)}</span><span>{money(order.advance_amount)}</span></div><div className="flex justify-between text-stone-500"><span>পণ্যের বকেয়া</span><span>{money(order.balance_amount)}</span></div></div><div className="border-t border-dashed border-stone-300 pt-3 text-[10px] leading-4 text-stone-500">পেমেন্টের অবস্থা ডেমোর জন্য নমুনা হিসেবে দেখানো হয়েছে। এই রসিদ কর চালান বা প্রকৃত পেমেন্টের প্রমাণ নয়।</div></div><div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>বন্ধ করুন</Button><Button onClick={() => window.print()}><ReceiptText size={15} />রসিদ প্রিন্ট করুন</Button></div></Modal>
}

export default App
