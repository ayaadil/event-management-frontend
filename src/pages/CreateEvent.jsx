import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Calendar, MapPin, DollarSign, Users, User, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const t = {
  ar: {
    title: 'إنشاء فعالية',
    subtitle: 'املأ التفاصيل أدناه لنشر فعاليتك الجديدة',
    imageTitle: 'رفع صورة الفعالية',
    imageDesc: 'PNG, JPG, أو GIF بحد أقصى 10MB',
    eventName: 'اسم الفعالية',
    eventNamePlaceholder: 'أدخل اسم الفعالية..',
    ticketPrice: 'سعر التذكرة',
    pricePlaceholder: 'أدخل السعر (مثال: $25 أو مجاني)',
    category: 'الفئة',
    capacity: 'السعة',
    capacityPlaceholder: 'أدخل السعة (عدد الحضور)',
    date: 'التاريخ والوقت',
    datePlaceholder: 'اختر التاريخ والوقت',
    organizer: 'اسم المنظم',
    organizerPlaceholder: 'أدخل اسم المنظم',
    location: 'الموقع',
    locationPlaceholder: 'أدخل موقع الفعالية',
    description: 'الوصف',
    descPlaceholder: 'اكتب وصفاً قصيراً...',
    publish: 'نشر الفعالية',
    successMsg: 'تم إنشاء الفعالية بنجاح!',
    categories: {
      music: 'موسيقى',
      tech: 'تكنولوجيا',
      art: 'فن وتصميم',
      sports: 'رياضة',
      business: 'أعمال وتجارة',
      education: 'تعليم وورش عمل',
      food: 'طعام ومأكولات',
    }
  },
  ku: {
    title: 'دروستکردنی چالاکی',
    subtitle: 'وردەکارییەکان پڕبکەرەوە بۆ بڵاوکردنەوەی چالاکییە نوێیەکەت',
    imageTitle: 'بارکردنی وێنەی چالاکی',
    imageDesc: 'PNG, JPG, یان GIF تا ١٠ مێگابایت',
    eventName: 'ناوی چالاکی',
    eventNamePlaceholder: 'ناوی چالاکی بنووسه..',
    ticketPrice: 'نرخی بلیت',
    pricePlaceholder: 'نرخ بنووسە (بنموونه: $25 یان خۆڕایی)',
    category: 'پۆل',
    capacity: 'توانای وەرگرتن',
    capacityPlaceholder: 'توانای شوێنەکە بنووسە',
    date: 'بەوار و کات',
    datePlaceholder: 'بەوار و کات هەڵبژێرە',
    organizer: 'ناوی ڕێکخەر',
    organizerPlaceholder: 'ناوی ڕێکخەر بنووسە',
    location: 'شوێن',
    locationPlaceholder: 'شوێن بنووسە',
    description: 'پێناسە',
    descPlaceholder: 'پێناسەیەکی کورت بنووسە...',
    publish: 'بڵاوکردنەوەی چالاکی',
    successMsg: 'چالاکییەکە بە سەرکەوتوویی دروستکرا!',
    categories: {
      music: 'مۆسیقا',
      tech: 'تەکنەلۆژیا',
      art: 'هونەر و دیزاین',
      sports: 'وەرزش',
      business: 'کار و بازرگانی',
      education: 'پەروەردە و وۆرکشۆپ',
      food: 'خواردن و خواردنەوە',
    }
  },
  en: {
    title: 'Create Event',
    subtitle: 'Fill in the details below to publish your new event',
    imageTitle: 'Upload Event Image',
    imageDesc: 'PNG, JPG, or GIF up to 10MB',
    eventName: 'Event name',
    eventNamePlaceholder: 'Enter Event name..',
    ticketPrice: 'Ticket price',
    pricePlaceholder: 'Enter price (e.g. $25 or Free)',
    category: 'Category',
    capacity: 'Capacity',
    capacityPlaceholder: 'Enter Capacity',
    date: 'Date & Time',
    datePlaceholder: 'Select date & time',
    organizer: 'Organizer Name',
    organizerPlaceholder: 'Enter organizer name',
    location: 'Location',
    locationPlaceholder: 'Enter location',
    description: 'Description',
    descPlaceholder: 'Write a short description...',
    publish: 'Publish Event',
    successMsg: 'Event created successfully!',
    categories: {
      music: 'Music',
      tech: 'Technology',
      art: 'Art & Design',
      sports: 'Sports',
      business: 'Business',
      education: 'Education & Workshops',
      food: 'Food & Drink',
    }
  }
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'music',
    date: '',
    location: '',
    price: '',
    capacity: '',
    organizer: '',
    description: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(text.successMsg);
    navigate('/explore');
  };

  const inputClass = "w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 px-4 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500";
  const inputClassWithIcon = (isRtl) => `w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500`;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-10 font-sans space-y-8 max-w-5xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-purple-900/30 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-500/50 text-purple-600 dark:text-purple-300 transition cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white">{text.title}</h1>
          <p className="text-purple-600/60 dark:text-purple-300/60 text-xs mt-1">{text.subtitle}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Image Box */}
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-slate-300 dark:border-purple-900/60 bg-slate-50/50 dark:bg-[#150a21]/50 rounded-3xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500/50 transition cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
          ) : (
            <>
              <div className="p-4 bg-purple-100 dark:bg-purple-600/10 border border-purple-300 dark:border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{text.imageTitle}</p>
                <p className="text-xs text-slate-500 dark:text-purple-300/50 mt-1">{text.imageDesc}</p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.eventName}</label>
            <input
              type="text"
              required
              placeholder={text.eventNamePlaceholder}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Ticket Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.ticketPrice}</label>
            <div className="relative">
              <DollarSign className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
              <input
                type="text"
                required
                placeholder={text.pricePlaceholder}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.category}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 px-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="music">{text.categories.music}</option>
              <option value="tech">{text.categories.tech}</option>
              <option value="art">{text.categories.art}</option>
              <option value="sports">{text.categories.sports}</option>
              <option value="business">{text.categories.business}</option>
              <option value="education">{text.categories.education}</option>
              <option value="food">{text.categories.food}</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.capacity}</label>
            <div className="relative">
              <Users className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
              <input
                type="text"
                placeholder={text.capacityPlaceholder}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.date}</label>
            <div className="relative">
              <Calendar className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
              <input
                type="text"
                placeholder={text.datePlaceholder}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
          </div>

          {/* Organizer Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.organizer}</label>
            <div className="relative">
              <User className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
              <input
                type="text"
                placeholder={text.organizerPlaceholder}
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.location}</label>
          <div className="relative">
            <MapPin className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
            <input
              type="text"
              placeholder={text.locationPlaceholder}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClassWithIcon(isRtl)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.description}</label>
          <div className="relative">
            <FileText className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
            <textarea
              rows="4"
              placeholder={text.descPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClassWithIcon(isRtl)} resize-none`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-2xl transition shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 cursor-pointer"
        >
          {text.publish}
        </button>
      </form>
    </div>
  );
}