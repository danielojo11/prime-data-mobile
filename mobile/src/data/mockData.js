export const DEMO_USER = {
  name: 'Ibrahim',
  email: 'demo@primedata.com',
  phone: '08012345678',
  password: 'demo1234',
  role: 'user',
  twoFactorEnabled: false,
  referralCode: 'PRIME10',
  referralsCount: 3,
  referralsEarned: 1500,
  transferPin: '1234',
  biometricEnabled: false,
  biometricType: 'fingerprint',
  walletBalance: 14500.5,
  commission: 250,
};

export const ADMIN_USER = {
  name: 'PrimeData Admin',
  email: 'admin@primedata.com',
  phone: '08000000000',
  password: 'admin1234',
  role: 'admin',
  twoFactorEnabled: true,
  referralCode: 'ADMIN01',
  referralsCount: 0,
  referralsEarned: 0,
  transferPin: '1234',
  biometricEnabled: false,
  biometricType: 'fingerprint',
  walletBalance: 0,
  commission: 0,
};

export const CATEGORIES = [
  {
    id: 'c1',
    name: 'Data',
    icon: 'Wifi',
    color: '#3EAEFF',
    desc: 'SME, CG, Gifting',
    services: [
      { id: 'd1', name: 'Buy Data', icon: 'Wifi', color: '#3EAEFF', badge: 'Hot' },
      { id: 'd2', name: 'SME Data', icon: 'Database', color: '#8B5CF6', badge: 'Cheap' },
      { id: 'd3', name: 'Data Pins', icon: 'CreditCard', color: '#14B8A6' },
      { id: 'd4', name: 'Corporate Data', icon: 'Briefcase', color: '#6366F1' },
    ],
  },
  {
    id: 'c2',
    name: 'Airtime',
    icon: 'Phone',
    color: '#10B981',
    desc: 'Buy & Convert',
    services: [
      { id: 'a1', name: 'Buy Airtime', icon: 'Phone', color: '#10B981' },
      { id: 'a2', name: 'Airtime to Cash', icon: 'Repeat', color: '#F59E0B' },
      { id: 'a3', name: 'Airtime Transfer', icon: 'Send', color: '#6366F1' },
      { id: 'a4', name: 'Print Recharge Card', icon: 'Printer', color: '#F43F5E', badge: 'New' },
    ],
  },
  {
    id: 'c3',
    name: 'Bills',
    icon: 'Zap',
    color: '#F59E0B',
    desc: 'Power & TV',
    services: [
      { id: 'b1', name: 'Electricity', icon: 'Zap', color: '#F59E0B' },
      { id: 'b2', name: 'Cable TV', icon: 'Tv', color: '#8B5CF6' },
      { id: 'b3', name: 'Internet Subscription', icon: 'Globe', color: '#3B82F6' },
      { id: 'b4', name: 'Exam Pins', icon: 'GraduationCap', color: '#EF4444' },
    ],
  },
  {
    id: 'c4',
    name: 'Wallet',
    icon: 'Wallet',
    color: '#6366F1',
    desc: 'Fund & Transfer',
    services: [
      { id: 'w1', name: 'Fund Wallet', icon: 'PlusCircle', color: '#10B981' },
      { id: 'w2', name: 'Transfer to User', icon: 'Users', color: '#3B82F6' },
      { id: 'w3', name: 'Withdraw Money', icon: 'ArrowDownCircle', color: '#EF4444' },
      { id: 'w4', name: 'History', icon: 'Clock', color: '#8B5CF6' },
    ],
  },
  {
    id: 'c5',
    name: 'Rewards',
    icon: 'Gift',
    color: '#F43F5E',
    desc: 'Bonus & Promos',
    services: [
      { id: 'r1', name: 'Auto Renew Bonus', icon: 'RefreshCw', color: '#10B981' },
      { id: 'r2', name: 'Referral Program', icon: 'UserPlus', color: '#6366F1', badge: 'Hot' },
      { id: 'r3', name: 'Daily Cashback', icon: 'Coins', color: '#F59E0B' },
    ],
  },
  {
    id: 'c7',
    name: 'Support',
    icon: 'LifeBuoy',
    color: '#9CA3AF',
    desc: 'Help & FAQ',
    services: [
      { id: 's1', name: 'WhatsApp Support', icon: 'MessageCircle', color: '#10B981' },
      { id: 's2', name: 'FAQs', icon: 'HelpCircle', color: '#3B82F6' },
      { id: 's3', name: 'Report Issue', icon: 'AlertTriangle', color: '#EF4444' },
    ],
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'Data Purchase',
    service: 'Data Purchase',
    desc: 'MTN 1GB (SME)',
    amount: 260,
    status: 'Successful',
    date: 'Today, 10:42 AM',
    isCredit: false,
    userEmail: DEMO_USER.email,
  },
  {
    id: '2',
    type: 'Wallet Funding',
    service: 'Wallet Funding',
    desc: 'Bank Transfer via Monnify',
    amount: 5000,
    status: 'Successful',
    date: 'Yesterday, 2:15 PM',
    isCredit: true,
    userEmail: DEMO_USER.email,
  },
  {
    id: '3',
    type: 'Airtime',
    service: 'Airtime',
    desc: 'Airtel VTU N500',
    amount: 490,
    status: 'Successful',
    date: 'Mar 28, 8:20 AM',
    isCredit: false,
    userEmail: DEMO_USER.email,
  },
  {
    id: '4',
    type: 'Cable TV',
    service: 'Cable TV',
    desc: 'GOTV Jinja',
    amount: 2700,
    status: 'Successful',
    date: 'Mar 25, 4:00 PM',
    isCredit: false,
    userEmail: DEMO_USER.email,
  },
];

export const NETWORKS = [
  { name: 'MTN', color: '#F59E0B' },
  { name: 'Airtel', color: '#EF4444' },
  { name: 'Glo', color: '#10B981' },
  { name: '9Mobile', color: '#059669' },
];

export const DATA_PLANS = {
  MTN: [
    { label: '500MB (SME) · 30 Days', price: '140' },
    { label: '1GB (SME) · 30 Days', price: '260' },
    { label: '2GB (SME) · 30 Days', price: '520' },
    { label: '3GB (SME) · 30 Days', price: '780' },
    { label: '5GB (SME) · 30 Days', price: '1300' },
    { label: '10GB (SME) · 30 Days', price: '2600' },
    { label: '500MB (CG) · 30 Days', price: '150' },
    { label: '1GB (CG) · 30 Days', price: '280' },
    { label: '2GB (CG) · 30 Days', price: '560' },
    { label: '3GB (CG) · 30 Days', price: '840' },
    { label: '5GB (CG) · 30 Days', price: '1400' },
    { label: '10GB (CG) · 30 Days', price: '2800' },
  ],
  Airtel: [
    { label: '500MB (CG) · 30 Days', price: '150' },
    { label: '1GB (CG) · 30 Days', price: '280' },
    { label: '2GB (CG) · 30 Days', price: '560' },
    { label: '5GB (CG) · 30 Days', price: '1400' },
    { label: '10GB (CG) · 30 Days', price: '2800' },
    { label: '15GB (CG) · 30 Days', price: '4200' },
    { label: '20GB (CG) · 30 Days', price: '5600' },
  ],
  Glo: [
    { label: '500MB (CG) · 30 Days', price: '145' },
    { label: '1GB (CG) · 30 Days', price: '250' },
    { label: '2GB (CG) · 30 Days', price: '500' },
    { label: '3GB (CG) · 30 Days', price: '750' },
    { label: '5GB (CG) · 30 Days', price: '1250' },
    { label: '10GB (CG) · 30 Days', price: '2500' },
    { label: '1.05GB (Direct) · 14 Days', price: '500' },
    { label: '2.9GB (Direct) · 30 Days', price: '1000' },
  ],
  '9Mobile': [
    { label: '500MB (SME) · 30 Days', price: '120' },
    { label: '1GB (SME) · 30 Days', price: '240' },
    { label: '2GB (SME) · 30 Days', price: '480' },
    { label: '3GB (SME) · 30 Days', price: '720' },
    { label: '4GB (SME) · 30 Days', price: '960' },
    { label: '5GB (SME) · 30 Days', price: '1200' },
    { label: '10GB (SME) · 30 Days', price: '2400' },
  ],
};

export const CABLE_PROVIDERS = [
  { name: 'GoTV', color: '#F59E0B' },
  { name: 'DSTV', color: '#3B82F6' },
  { name: 'StarTimes', color: '#EF4444' },
];

export const CABLE_PACKAGES = {
  GoTV: [
    { label: 'GoTV Smallie', duration: '1 Month', price: '1575' },
    { label: 'GoTV Jinja', duration: '1 Month', price: '2700' },
    { label: 'GoTV Jolli', duration: '1 Month', price: '4150' },
    { label: 'GoTV Max', duration: '1 Month', price: '5500' },
    { label: 'GoTV Supa', duration: '1 Month', price: '6400' },
    { label: 'GoTV Supa Plus', duration: '1 Month', price: '7200' },
  ],
  DSTV: [
    { label: 'DStv Padi', duration: '1 Month', price: '3000' },
    { label: 'DStv Yanga', duration: '1 Month', price: '4615' },
    { label: 'DStv Confam', duration: '1 Month', price: '7900' },
    { label: 'DStv Compact', duration: '1 Month', price: '15700' },
    { label: 'DStv Compact Plus', duration: '1 Month', price: '24900' },
    { label: 'DStv Premium', duration: '1 Month', price: '37000' },
  ],
  StarTimes: [
    { label: 'Nova', duration: '1 Month', price: '1200' },
    { label: 'Basic', duration: '1 Month', price: '2200' },
    { label: 'Smart', duration: '1 Month', price: '2800' },
    { label: 'Classic', duration: '1 Month', price: '3600' },
    { label: 'Super', duration: '1 Month', price: '5600' },
    { label: 'Korean', duration: '1 Month', price: '8500' },
  ],
};

export const ELECTRICITY_PROVIDERS = [
  { label: 'Abuja Electricity (AEDC)', value: 'AEDC' },
  { label: 'Ikeja Electric (IE)', value: 'IE' },
  { label: 'Eko Electricity (EKEDC)', value: 'EKEDC' },
  { label: 'Ibadan Electricity (IBEDC)', value: 'IBEDC' },
  { label: 'Benin Electricity (BEDC)', value: 'BEDC' },
  { label: 'Port Harcourt Electricity (PHED)', value: 'PHED' },
  { label: 'Enugu Electricity (EEDC)', value: 'EEDC' },
  { label: 'Kano Electricity (KEDCO)', value: 'KEDCO' },
  { label: 'Kaduna Electricity (KAEDCO)', value: 'KAEDCO' },
  { label: 'Jos Electricity (JED)', value: 'JED' },
  { label: 'Yola Electricity (YEDC)', value: 'YEDC' },
];

export const EXAM_TYPES = [
  { label: 'WAEC Result Checker', value: 'WAEC', price: '3500' },
  { label: 'NECO Result Token', value: 'NECO', price: '1200' },
  { label: 'JAMB E-Pin', value: 'JAMB', price: '4700' },
];

export const CARD_DENOMINATIONS = [100, 200, 500, 1000, 2000, 5000];

export const FAQS = [
  {
    id: 1,
    category: 'Data Purchase',
    q: 'How to buy data?',
    a: 'Go to the Services tab, select Data, choose your network, and enter the phone number.',
  },
  {
    id: 2,
    category: 'Data Purchase',
    q: 'Why is my data delayed?',
    a: 'Network providers sometimes experience slight delays. Please wait up to 15 minutes or check your transaction status.',
  },
  {
    id: 3,
    category: 'Payments',
    q: 'Failed payment but debited?',
    a: "If your wallet wasn't credited, the bank will automatically reverse the transaction within 24 hours. Contact support otherwise.",
  },
  {
    id: 4,
    category: 'Account',
    q: 'How to reset password?',
    a: 'Log out and choose "Forgot Password" on the login screen, then follow the prompts sent to your email.',
  },
];
