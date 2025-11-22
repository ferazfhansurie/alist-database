// KOL Database Models

export const KOL_TYPES = {
  SOCIAL_MEDIA: 'social-media',
  TWITTER_THREAD: 'twitter-thread',
  BLOGGER: 'blogger',
  PRODUCTION_TALENT: 'production-talent'
};

export const TIERS = [
  'Celebrity',
  'NANO',
  'MICRO',
  'MACRO',
  'MEGA',
  'MID-TIER',
  'Affiliate'
];

export const GENDERS = [
  'Male',
  'Female',
  'Other'
];

export const NICHES = [
  'Fashion & Beauty',
  'Lifestyle',
  'Food & Dining',
  'Travel',
  'Technology',
  'Fitness & Health',
  'Parenting',
  'Business & Finance',
  'Entertainment',
  'Education',
  'Sports',
  'Automotive',
  'Gaming',
  'Art & Design',
  'Music',
  'Comedy',
  'News & Politics',
  'Religion & Spirituality',
  'Pet & Animal',
  'Home & Garden',
  'GENERAL',
  'BEAUTY',
  'COMEDY/ TREND',
  'PROFESSIONAL/ MEDICAL',
  'EDUCATION',
  'SKINCARE',
  'AUTOMOTIVE'
];

// Talent-specific niches (used for production/talent KOLs)
export const TALENT_NICHES = [
  'Videographer',
  'MUA',
  'Voice Over Talent',
  'Model',
  'Photographer',
  'Stylist',
  'Studio',
  'Hairdo',
  'Fashion Designer',
  'MC/Host'
];

export const HAIR_STYLES = [
  'Hijab',
  'Free Hair',
  'Not Related'
];

export const RACES = [
  'Malay',
  'Chinese',
  'Indian',
  'Other Asian',
  'Caucasian',
  'African',
  'Mixed Race',
  'Other'
];

export const STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya'
];

export const PICS = [
  'Amir',
  'Tika',
  'Aina'
];

export class KOLRecord {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.name = data.name || '';
    this.instagram = data.instagram || '';
    this.tiktok = data.tiktok || '';
    this.facebook = data.facebook || '';
    this.twitter = data.twitter || '';
    this.thread = data.thread || '';
    this.blog = data.blog || '';
      this.youtube = data.youtube || '';
      this.lemon8 = data.lemon8 || '';
      this.xhs = data.xhs || '';
    this.rate = data.rate || 0;
    this.instagramRate = data.instagramRate || data.instagram_rate || 0;
    this.tiktokRate = data.tiktokRate || data.tiktok_rate || 0;
    this.facebookRate = data.facebookRate || data.facebook_rate || 0;
    this.twitterRate = data.twitterRate || data.twitter_rate || 0;
    this.threadRate = data.threadRate || data.thread_rate || 0;
    this.blogRate = data.blogRate || data.blog_rate || 0;
  this.youtubeRate = data.youtubeRate || data.youtube_rate || 0;
  this.lemon8Rate = data.lemon8Rate || data.lemon8_rate || 0;
  this.xhsRate = data.xhsRate || data.xhs_rate || 0;
  this.rating = data.rating || data.stars || 0; // 0-5 stars
  this.sellingPrice = data.sellingPrice || data.selling_price || 0; // internal use
    this.tier = data.tier || TIERS[0];
    this.gender = data.gender || GENDERS[0];
    this.niches = data.niches || [];
    this.hairStyle = data.hairStyle || HAIR_STYLES[0];
    this.race = data.race || RACES[0];
    this.address = data.address || STATES[0];
    this.contactNumber = data.contactNumber || '';
    this.submissionDate = data.submissionDate || new Date().toISOString();
    this.rateDetails = data.rateDetails || '';
    this.pic = data.pic || PICS[0];
    this.kolType = data.kolType || KOL_TYPES.SOCIAL_MEDIA;
    this.notes = data.notes || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  generateId() {
    return 'kol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  validate() {
    const errors = [];
    
    if (!this.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!this.contactNumber.trim()) {
      errors.push('Contact number is required');
    }
    
    if (this.rate < 0) {
      errors.push('Rate must be a positive number');
    }
    
    if (this.niches.length === 0) {
      errors.push('At least one niche must be selected');
    }
    
    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      instagram: this.instagram,
      tiktok: this.tiktok,
      facebook: this.facebook,
      twitter: this.twitter,
      thread: this.thread,
      blog: this.blog,
  youtube: this.youtube,
  lemon8: this.lemon8,
  xhs: this.xhs,
      rate: this.rate,
      instagramRate: this.instagramRate,
      tiktokRate: this.tiktokRate,
      facebookRate: this.facebookRate,
      twitterRate: this.twitterRate,
      threadRate: this.threadRate,
      blogRate: this.blogRate,
  youtubeRate: this.youtubeRate,
  lemon8Rate: this.lemon8Rate,
  xhsRate: this.xhsRate,
  rating: this.rating,
  sellingPrice: this.sellingPrice,
      tier: this.tier,
      gender: this.gender,
      niches: this.niches,
      hairStyle: this.hairStyle,
      race: this.race,
      address: this.address,
      contactNumber: this.contactNumber,
      submissionDate: this.submissionDate,
      rateDetails: this.rateDetails,
      pic: this.pic,
      kolType: this.kolType,
      notes: this.notes,
      isActive: this.isActive
    };
  }
}

export const sampleKOLData = [
  new KOLRecord({
    name: 'Sarah Ahmad',
    instagram: 'https://instagram.com/sarahahmad',
    tiktok: 'https://tiktok.com/@sarahahmad',
    rate: 2500,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Fashion & Beauty', 'Lifestyle'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[12],
    contactNumber: '+60123456789',
    rateDetails: 'Includes 3 posts + 5 stories + 1 reel',
    pic: PICS[1],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'David Chen',
    twitter: 'https://twitter.com/davidchen',
    thread: 'https://threads.net/@davidchen',
    rate: 1800,
    tier: TIERS[1],
    gender: GENDERS[0],
    niches: ['Technology', 'Business & Finance'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[1],
    address: STATES[12],
    contactNumber: '+60187654321',
    rateDetails: 'Includes 2 tweets + 1 thread post',
    pic: PICS[0],
    kolType: KOL_TYPES.TWITTER_THREAD
  }),

  new KOLRecord({
    name: 'Priya Devi',
    blog: 'https://priyadevi.blogspot.com',
    rate: 1200,
    tier: TIERS[2],
    gender: GENDERS[1],
    niches: ['Food & Dining', 'Travel'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[5],
    contactNumber: '+60111222333',
    rateDetails: 'Includes 1 blog post + social media promotion',
    pic: PICS[2],
    kolType: KOL_TYPES.BLOGGER
  }),

  new KOLRecord({
    name: 'Ahmad Zulkifli',
    rate: 3000,
    tier: TIERS[0],
    gender: GENDERS[0],
    niches: ['Entertainment', 'Music'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[0],
    address: STATES[12],
    contactNumber: '+60199888777',
    rateDetails: 'Voice talent for commercials and videos',
    pic: PICS[0],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  // Additional Social Media KOLs
  new KOLRecord({
    name: 'Nurul Ain',
    instagram: 'https://instagram.com/nurulain',
    tiktok: 'https://tiktok.com/@nurulain',
    facebook: 'https://facebook.com/nurulain',
    rate: 3200,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Fashion & Beauty', 'Lifestyle', 'Travel'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[0],
    contactNumber: '+60123456788',
    rateDetails: 'Includes 5 posts + 10 stories + 2 reels + Facebook content',
    pic: PICS[1],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Lim Wei Jie',
    instagram: 'https://instagram.com/limweijie',
    tiktok: 'https://tiktok.com/@limweijie',
    rate: 2800,
    tier: TIERS[0],
    gender: GENDERS[0],
    niches: ['Fitness & Health', 'Lifestyle'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[1],
    address: STATES[1],
    contactNumber: '+60187654322',
    rateDetails: 'Includes 4 posts + 8 stories + 1 reel + workout videos',
    pic: PICS[0],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Kavitha Raj',
    instagram: 'https://instagram.com/kavitharaj',
    tiktok: 'https://tiktok.com/@kavitharaj',
    rate: 1900,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Food & Dining', 'Home & Living'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[2],
    contactNumber: '+60111222334',
    rateDetails: 'Includes 3 posts + 6 stories + cooking tutorials',
    pic: PICS[2],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Muhammad Firdaus',
    instagram: 'https://instagram.com/mfirdaus',
    tiktok: 'https://tiktok.com/@mfirdaus',
    rate: 1500,
    tier: TIERS[2],
    gender: GENDERS[0],
    niches: ['Gaming', 'Technology'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[0],
    address: STATES[3],
    contactNumber: '+60199888778',
    rateDetails: 'Includes 2 posts + 4 stories + gaming content',
    pic: PICS[0],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Tan Mei Ling',
    instagram: 'https://instagram.com/tanmeiling',
    tiktok: 'https://tiktok.com/@tanmeiling',
    rate: 2100,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Beauty & Skincare', 'Fashion & Beauty'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[1],
    address: STATES[4],
    contactNumber: '+60123456787',
    rateDetails: 'Includes 4 posts + 7 stories + beauty tutorials',
    pic: PICS[1],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  // Additional Twitter/Thread KOLs
  new KOLRecord({
    name: 'Aisha Rahman',
    twitter: 'https://twitter.com/aisharahman',
    thread: 'https://threads.net/@aisharahman',
    rate: 2200,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Politics', 'Social Issues'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[6],
    contactNumber: '+60187654323',
    rateDetails: 'Includes 3 tweets + 2 thread posts + engagement',
    pic: PICS[2],
    kolType: KOL_TYPES.TWITTER_THREAD
  }),

  new KOLRecord({
    name: 'Rajesh Kumar',
    twitter: 'https://twitter.com/rajeshkumar',
    rate: 1600,
    tier: TIERS[1],
    gender: GENDERS[0],
    niches: ['Business & Finance', 'Investment'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[7],
    contactNumber: '+60111222335',
    rateDetails: 'Includes 5 tweets + market analysis threads',
    pic: PICS[0],
    kolType: KOL_TYPES.TWITTER_THREAD
  }),

  new KOLRecord({
    name: 'Siti Aminah',
    twitter: 'https://twitter.com/sitiaminah',
    thread: 'https://threads.net/@sitiaminah',
    rate: 1400,
    tier: TIERS[2],
    gender: GENDERS[1],
    niches: ['Education', 'Parenting'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[8],
    contactNumber: '+60199888779',
    rateDetails: 'Includes 4 tweets + educational threads',
    pic: PICS[1],
    kolType: KOL_TYPES.TWITTER_THREAD
  }),

  // Additional Blogger KOLs
  new KOLRecord({
    name: 'Chong Li Wei',
    blog: 'https://chongliwei.blogspot.com',
    rate: 1800,
    tier: TIERS[1],
    gender: GENDERS[0],
    niches: ['Technology', 'Gadgets'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[1],
    address: STATES[9],
    contactNumber: '+60123456786',
    rateDetails: 'Includes 2 blog posts + social media sharing',
    pic: PICS[0],
    kolType: KOL_TYPES.BLOGGER
  }),

  new KOLRecord({
    name: 'Fatimah Binti Omar',
    blog: 'https://fatimahomar.blogspot.com',
    rate: 1600,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Islamic Lifestyle', 'Family'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[10],
    contactNumber: '+60187654324',
    rateDetails: 'Includes 3 blog posts + community engagement',
    pic: PICS[2],
    kolType: KOL_TYPES.BLOGGER
  }),

  new KOLRecord({
    name: 'Vikram Singh',
    blog: 'https://vikramsingh.blogspot.com',
    rate: 2000,
    tier: TIERS[0],
    gender: GENDERS[0],
    niches: ['Travel', 'Photography'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[11],
    contactNumber: '+60111222336',
    rateDetails: 'Includes 4 blog posts + photo galleries + social media',
    pic: PICS[1],
    kolType: KOL_TYPES.BLOGGER
  }),

  new KOLRecord({
    name: 'Nurul Huda',
    blog: 'https://nurulhuda.blogspot.com',
    rate: 1200,
    tier: TIERS[2],
    gender: GENDERS[1],
    niches: ['Crafts', 'DIY'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[13],
    contactNumber: '+60199888780',
    rateDetails: 'Includes 2 blog posts + tutorial videos',
    pic: PICS[2],
    kolType: KOL_TYPES.BLOGGER
  }),

  // Additional Production Talent KOLs
  new KOLRecord({
    name: 'Lee Jia Hui',
    rate: 3500,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Model', 'Fashion'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[1],
    address: STATES[0],
    contactNumber: '+60123456785',
    rateDetails: 'Professional modeling + social media content',
    pic: PICS[1],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  new KOLRecord({
    name: 'Ahmad Fauzi',
    rate: 2800,
    tier: TIERS[1],
    gender: GENDERS[0],
    niches: ['Voice Talent', 'Narration'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[0],
    address: STATES[1],
    contactNumber: '+60187654325',
    rateDetails: 'Voice over for commercials + video content',
    pic: PICS[0],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  new KOLRecord({
    name: 'Priya Suresh',
    rate: 3200,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Actor', 'Theater'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[2],
    contactNumber: '+60111222337',
    rateDetails: 'Acting performances + promotional content',
    pic: PICS[2],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  new KOLRecord({
    name: 'Mohd Zainal',
    rate: 1900,
    tier: TIERS[2],
    gender: GENDERS[0],
    niches: ['Photographer', 'Videographer'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[0],
    address: STATES[3],
    contactNumber: '+60199888781',
    rateDetails: 'Photo + video content creation',
    pic: PICS[0],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  new KOLRecord({
    name: 'Chen Xiao Wei',
    rate: 2600,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Model', 'Lifestyle'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[1],
    address: STATES[4],
    contactNumber: '+60123456784',
    rateDetails: 'Lifestyle modeling + brand collaborations',
    pic: PICS[1],
    kolType: KOL_TYPES.PRODUCTION_TALENT
  }),

  // More diverse Social Media KOLs
  new KOLRecord({
    name: 'Nurul Izzah',
    instagram: 'https://instagram.com/nurulizzah',
    tiktok: 'https://tiktok.com/@nurulizzah',
    rate: 2400,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Fashion & Beauty', 'Modest Fashion'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[5],
    contactNumber: '+60187654326',
    rateDetails: 'Includes 4 posts + 8 stories + modest fashion tips',
    pic: PICS[2],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Krishnan Muthu',
    instagram: 'https://instagram.com/krishnanmuthu',
    tiktok: 'https://tiktok.com/@krishnanmuthu',
    rate: 1700,
    tier: TIERS[2],
    gender: GENDERS[0],
    niches: ['Comedy', 'Entertainment'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[6],
    contactNumber: '+60111222338',
    rateDetails: 'Includes 3 posts + 6 stories + comedy skits',
    pic: PICS[0],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Siti Nurhaliza',
    instagram: 'https://instagram.com/sitinurhaliza',
    tiktok: 'https://tiktok.com/@sitinurhaliza',
    facebook: 'https://facebook.com/sitinurhaliza',
    rate: 4000,
    tier: TIERS[0],
    gender: GENDERS[1],
    niches: ['Music', 'Entertainment', 'Lifestyle'],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[7],
    contactNumber: '+60199888782',
    rateDetails: 'Includes 6 posts + 12 stories + 3 reels + Facebook live',
    pic: PICS[1],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Wong Kai Ming',
    instagram: 'https://instagram.com/wongkaiming',
    tiktok: 'https://tiktok.com/@wongkaiming',
    rate: 2200,
    tier: TIERS[1],
    gender: GENDERS[0],
    niches: ['Sports', 'Fitness'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[1],
    address: STATES[8],
    contactNumber: '+60123456783',
    rateDetails: 'Includes 4 posts + 8 stories + workout videos',
    pic: PICS[0],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  }),

  new KOLRecord({
    name: 'Deepa Kaur',
    instagram: 'https://instagram.com/deepakaur',
    tiktok: 'https://tiktok.com/@deepakaur',
    rate: 1900,
    tier: TIERS[1],
    gender: GENDERS[1],
    niches: ['Food & Dining', 'Cultural'],
    hairStyle: HAIR_STYLES[1],
    race: RACES[2],
    address: STATES[9],
    contactNumber: '+60187654327',
    rateDetails: 'Includes 3 posts + 7 stories + cooking demos',
    pic: PICS[2],
    kolType: KOL_TYPES.SOCIAL_MEDIA
  })
];
