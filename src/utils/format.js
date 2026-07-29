export function formatDate(dateTime) {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function formatTime(dateTime, locale = 'en-US') {
  if (!dateTime) return '';

  const d = new Date(dateTime);

  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}


// يعرض مدى زمني "3:00 PM - 6:00 PM"، أو وقت البداية فقط لو ما فيه وقت انتهاء
export function formatTimeRange(startDateTime, endDateTime) {
  const start = formatTime(startDateTime);
  if (!endDateTime) return start;
  const end = formatTime(endDateTime);
  if (!end) return start;
  return `${start} - ${end}`;
}

// يتحقق إذا كانت الفعالية قد انتهت (بالاعتماد على وقت الانتهاء إن وُجد، وإلا وقت البداية)
export function isEventPast(startDateTime, endDateTime) {
  const reference = endDateTime || startDateTime;
  if (!reference) return false;
  const d = new Date(reference);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

export function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n === 0 ? 'Free' : `$${n}`;
}

// ===== تخزين وقت الانتهاء داخل description (بدون تعديل قاعدة البيانات) =====
// نظرًا لعدم وجود عمود end_time بجدول events، نخزّن القيمة كعلامة مخفية
// بآخر حقل description ونستخرجها لاحقًا. المستخدم لا يرى هذه العلامة أبدا.
const END_TIME_MARKER = /\n?\[END_TIME:([^\]]+)\]\s*$/;

// يحذف علامة وقت الانتهاء من النص ويرجّع الوصف "النظيف" فقط (للعرض/التحرير)
export function stripEndTimeMarker(description) {
  if (!description) return '';
  return description.replace(END_TIME_MARKER, '').trim();
}

// يستخرج وقت الانتهاء المخزّن (أو undefined لو ما فيه)
export function extractEndTime(description) {
  if (!description) return undefined;
  const match = description.match(END_TIME_MARKER);
  return match ? match[1] : undefined;
}

// يبني نص description جديد فيه علامة وقت الانتهاء مضمّنة، جاهز للإرسال للباك إند
export function encodeEndTime(description, endDateTime) {
  const clean = stripEndTimeMarker(description || '');
  if (!endDateTime) return clean || undefined;
  return `${clean}\n[END_TIME:${endDateTime}]`;
}

export function formatDateBadge(dateTime) {
  if (!dateTime) {
    return {
      day: '',
      month: '',
      year: '',
    };
  }

  const d = new Date(dateTime);

  if (Number.isNaN(d.getTime())) {
    return {
      day: '',
      month: '',
      year: '',
    };
  }

  return {
    day: d.toLocaleDateString('en-GB', {
      day: '2-digit',
    }),
    month: d.toLocaleDateString('en-GB', {
      month: 'short',
    }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}

// يحوّل Date إلى قيمة صالحة لـ <input type="datetime-local"> بالتوقيت المحلي (وليس UTC)
export function toLocalDateTimeInputValue(dateTime) {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// يحوّل Date إلى قيمة صالحة لـ <input type="time"> بالتوقيت المحلي (وليس UTC)
export function toLocalTimeInputValue(dateTime) {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}