/**
 * Skool AI Assistant Service
 * Provides ChatGPT-style conversational assistant with real database CRUD actions:
 * - Add/Delete Student
 * - Add/Delete Staff
 * - Add/Delete Class
 * - Add/Delete Notice
 * - Add/Delete Subject & Coursework
 * - Global Theme and Custom Color switching across all screens
 */

import {
  getStudents,
  createStudent,
  deleteStudent,
  getStaff,
  createStaff,
  deleteStaff,
  getClasses,
  createClass,
  deleteClass,
  getNotices,
  createNotice,
  deleteNotice,
  getFees,
  getAttendance,
  isUserAdmin
} from './api';

// ============================================================================
// DUAL-COLOR THEME SYSTEM (Two Matching Complementary Colors for All Screens)
// ============================================================================

export const TWO_COLOR_PRESETS = [
  { id: 'sky-violet', name: 'Sky & Royal Violet', primary: '#0284c7', secondary: '#8b5cf6' },
  { id: 'emerald-cyan', name: 'Emerald & Cyan', primary: '#10b981', secondary: '#06b6d4' },
  { id: 'sunset-rose', name: 'Sunset Amber & Rose', primary: '#f59e0b', secondary: '#f43f5e' },
  { id: 'indigo-pink', name: 'Royal Indigo & Pink', primary: '#6366f1', secondary: '#ec4899' },
  { id: 'cyber-blue', name: 'Cyberpunk Teal & Blue', primary: '#06b6d4', secondary: '#3b82f6' },
  { id: 'velvet-amber', name: 'Velvet Purple & Gold', primary: '#a855f7', secondary: '#f59e0b' },
  { id: 'midnight-electric', name: 'Midnight OLED & Indigo', primary: '#38bdf8', secondary: '#6366f1' },
  { id: 'crimson-purple', name: 'Crimson Flame & Purple', primary: '#f43f5e', secondary: '#a855f7' }
];

export const PRESET_THEMES = TWO_COLOR_PRESETS.map(t => ({
  id: t.id,
  name: t.name,
  color: t.primary,
  secondary: t.secondary
}));

export const hexToRgb = (hex) => {
  let c = (hex || '#0284c7').replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

export const hexToHsl = (hex) => {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

/**
 * Intelligent helper to compute a harmonious matching secondary/partner color:
 * Creates an elegant analogous or complementary partner that looks designer-crafted.
 */
export const generateMatchingSecondaryColor = (primaryHex) => {
  if (!primaryHex || !/^#[0-9A-Fa-f]{6}$/.test(primaryHex)) return '#8b5cf6';
  const hsl = hexToHsl(primaryHex);
  const hue = hsl.h;

  let partnerHue;
  if (hue >= 180 && hue <= 220) {
    // Sky Blues -> Royal Violet / Indigo (~265°)
    partnerHue = 265;
  } else if (hue >= 135 && hue < 180) {
    // Emeralds / Greens -> Cyan / Electric Teal (~195°)
    partnerHue = 195;
  } else if (hue >= 20 && hue < 55) {
    // Ambers / Warm Oranges -> Rose / Crimson (~345°)
    partnerHue = 345;
  } else if (hue >= 220 && hue < 260) {
    // Indigos -> Fuchsia / Neon Pink (~310°)
    partnerHue = 310;
  } else if (hue >= 260 && hue < 300) {
    // Purples -> Electric Pink or Sunset Amber
    partnerHue = 330;
  } else if ((hue >= 300 && hue <= 360) || hue < 20) {
    // Crimson / Reds -> Sunset Gold (~40°)
    partnerHue = 40;
  } else {
    partnerHue = (hue + 45) % 360;
  }

  const s = Math.min(92, Math.max(72, hsl.s));
  const l = Math.min(62, Math.max(48, hsl.l));
  return hslToHex(partnerHue, s, l);
};

/**
 * Apply TWO matching colors across all screens:
 * 1. Primary Color (Brand, Navigation, Primary Buttons, Active States)
 * 2. Secondary / Accent Color (Badges, Accents, Gradients, Cards)
 * ONLY changes these two colors, keeping the rest of the UI crisp and readable!
 */
export const applyTwoColorTheme = (primaryHex, secondaryHex) => {
  if (!primaryHex || !/^#[0-9A-Fa-f]{6}$/.test(primaryHex)) return;
  const cleanSecondary = (secondaryHex && /^#[0-9A-Fa-f]{6}$/.test(secondaryHex))
    ? secondaryHex
    : generateMatchingSecondaryColor(primaryHex);

  const pRgb = hexToRgb(primaryHex);
  const sRgb = hexToRgb(cleanSecondary);
  const root = document.documentElement;

  // 1. PRIMARY COLOR (Color 1)
  root.style.setProperty('--primary', primaryHex);
  root.style.setProperty('--primary-color', primaryHex);
  root.style.setProperty('--primary-600', primaryHex);
  root.style.setProperty('--primary-500', primaryHex);
  root.style.setProperty('--text-link', primaryHex);
  root.style.setProperty('--border-focus', primaryHex);

  const hoverR = Math.max(0, pRgb.r - 25);
  const hoverG = Math.max(0, pRgb.g - 25);
  const hoverB = Math.max(0, pRgb.b - 25);
  root.style.setProperty('--primary-hover', `rgb(${hoverR}, ${hoverG}, ${hoverB})`);
  root.style.setProperty('--primary-light', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.12)`);
  root.style.setProperty('--primary-50', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.06)`);
  root.style.setProperty('--primary-100', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.14)`);
  root.style.setProperty('--primary-200', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.24)`);

  // 2. SECONDARY / ACCENT COLOR (Color 2 - Matching Partner)
  root.style.setProperty('--secondary', cleanSecondary);
  root.style.setProperty('--secondary-color', cleanSecondary);
  root.style.setProperty('--accent-color', cleanSecondary);
  root.style.setProperty('--card-accent-color', cleanSecondary);
  root.style.setProperty('--accent-blue', primaryHex);
  root.style.setProperty('--accent-cyan', cleanSecondary);
  root.style.setProperty('--secondary-hover', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.85)`);
  root.style.setProperty('--secondary-light', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.14)`);

  // 3. HARMONIOUS TWO-COLOR DUAL GRADIENT
  root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${primaryHex} 0%, ${cleanSecondary} 100%)`);
  root.style.setProperty('--ai-user-glow', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.35)`);

  // Persist both matching colors
  localStorage.setItem('skool-primary-color', primaryHex);
  localStorage.setItem('skool-secondary-color', cleanSecondary);
  localStorage.setItem('skool-custom-color', primaryHex);
};

export const applyCustomColorTheme = (hexColor, secondaryHex) => {
  applyTwoColorTheme(hexColor, secondaryHex);
};

export const applyPresetTheme = (themeId) => {
  const found = TWO_COLOR_PRESETS.find(t => t.id === themeId);
  if (found) {
    applyTwoColorTheme(found.primary, found.secondary);
    localStorage.setItem('skool-theme-preset', themeId);
  }
};

export const initThemeFromStorage = () => {
  try {
    const savedP = localStorage.getItem('skool-primary-color') || localStorage.getItem('skool-custom-color');
    const savedS = localStorage.getItem('skool-secondary-color');
    if (savedP) {
      applyTwoColorTheme(savedP, savedS || generateMatchingSecondaryColor(savedP));
    }
  } catch (e) {}
};

// Immediately initialize theme on script load
if (typeof window !== 'undefined') {
  initThemeFromStorage();
}

export const getCurrentColors = () => {
  try {
    const p = localStorage.getItem('skool-primary-color') || localStorage.getItem('skool-custom-color') || '#0284c7';
    const s = localStorage.getItem('skool-secondary-color') || generateMatchingSecondaryColor(p);
    return { primary: p, secondary: s };
  } catch (e) {
    return { primary: '#0284c7', secondary: '#8b5cf6' };
  }
};

export const getCurrentColor = () => {
  return getCurrentColors().primary;
};


// ============================================================================
// CHATGPT-STYLE CONVERSATIONAL PROCESSING & CRUD OPERATIONS
// ============================================================================

/**
 * Helper to extract key-value arguments from natural query
 * e.g. "add student John Doe, class 10-A, roll 101, parent Mark"
 */
const parseEntityArgs = (inputStr) => {
  const args = {};
  const segments = inputStr.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

  segments.forEach((seg, idx) => {
    if (idx === 0) {
      args.main = seg;
      return;
    }
    const colonIdx = seg.indexOf(':');
    if (colonIdx !== -1) {
      const key = seg.slice(0, colonIdx).trim().toLowerCase();
      const val = seg.slice(colonIdx + 1).trim();
      args[key] = val;
    } else {
      // Check for space-separated keyword e.g. "class 10-A"
      const match = seg.match(/^(class|grade|roll|parent|phone|email|dept|department|role|section|due|fee|salary)\s+(.+)$/i);
      if (match) {
        args[match[1].toLowerCase()] = match[2].trim();
      } else {
        args[`field_${idx}`] = seg;
      }
    }
  });

  return args;
};

// Module state to remember recently created items for "delete this/last student"
let lastCreatedStudent = null;
let lastCreatedStaff = null;
let lastCreatedNotice = null;

/**
 * Intelligent helper to extract student search parameters from any query format:
 * - Direct name: "Aryan Patel"
 * - Full copied block: "Name: Aryan Patel • Class: 10-A • Admission / Roll No: 108..."
 * - Roll / Admission No: "108" or "STU-108"
 * - Email: "aryanpatel@skool.edu.in"
 * - Substring containment in either direction
 */
const findMatchingStudent = (students, rawTarget) => {
  if (!students || !students.length || !rawTarget) return null;

  const target = rawTarget
    .replace(/^(student|staff|notice|data|record)\s*[:\-]?\s*/i, '')
    .trim();
  const targetLower = target.toLowerCase();

  // 1. Check for "this", "last", or empty target if student was just created
  if (
    (targetLower === '' || targetLower === 'this' || targetLower === 'last' || targetLower.includes('last student') || targetLower.includes('this student')) &&
    lastCreatedStudent
  ) {
    const found = students.find(s => s._id === lastCreatedStudent._id || s.admissionNo === lastCreatedStudent.admissionNo);
    if (found) return found;
  }

  // 2. Extract "Name: <name>" if pasted from formatted output card
  const nameMatch = rawTarget.match(/Name:\s*([^•\n,\r]+)/i);
  if (nameMatch) {
    const extractedName = nameMatch[1].trim().toLowerCase();
    const found = students.find(s => s.name && s.name.toLowerCase().includes(extractedName));
    if (found) return found;
  }

  // 3. Extract Roll / Admission number from text
  const rollMatch = rawTarget.match(/(?:admission\s*\/\s*roll\s*no|roll\s*no|admission\s*no|roll|admission):\s*`?([^•\n,\r`\s]+)`?/i);
  if (rollMatch) {
    const extractedRoll = rollMatch[1].trim().toLowerCase();
    const found = students.find(s =>
      (s.admissionNo && s.admissionNo.toLowerCase() === extractedRoll) ||
      (s.rollNumber && s.rollNumber.toLowerCase() === extractedRoll)
    );
    if (found) return found;
  }

  // 4. Extract Email
  const emailMatch = rawTarget.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    const extractedEmail = emailMatch[0].toLowerCase();
    const found = students.find(s => s.email && s.email.toLowerCase() === extractedEmail);
    if (found) return found;
  }

  // 5. Match by exact ID
  const byId = students.find(s => s._id && (s._id === target || s._id === rawTarget.trim()));
  if (byId) return byId;

  // 6. Direct student name match (either direction)
  const byName = students.find(s => {
    if (!s.name) return false;
    const sNameLower = s.name.toLowerCase().trim();
    if (sNameLower.length < 2) return false;
    return sNameLower === targetLower ||
           sNameLower.includes(targetLower) ||
           targetLower.includes(sNameLower);
  });
  if (byName) return byName;

  // 7. Match admission number or roll number
  const byRoll = students.find(s => {
    const adm = (s.admissionNo || s.rollNumber || '').toLowerCase().trim();
    if (!adm || adm.length < 2) return false;
    return adm === targetLower || targetLower.includes(adm);
  });
  if (byRoll) return byRoll;

  return null;
};

/**
 * Intelligent helper to extract staff search parameters
 */
const findMatchingStaff = (staffList, rawTarget) => {
  if (!staffList || !staffList.length || !rawTarget) return null;

  const target = rawTarget
    .replace(/^(staff|teacher|data|record)\s*[:\-]?\s*/i, '')
    .trim();
  const targetLower = target.toLowerCase();

  if (
    (targetLower === '' || targetLower === 'this' || targetLower === 'last' || targetLower.includes('last staff') || targetLower.includes('this staff')) &&
    lastCreatedStaff
  ) {
    const found = staffList.find(s => s._id === lastCreatedStaff._id || s.employeeId === lastCreatedStaff.employeeId);
    if (found) return found;
  }

  const nameMatch = rawTarget.match(/Name:\s*([^•\n,\r]+)/i);
  if (nameMatch) {
    const extractedName = nameMatch[1].trim().toLowerCase();
    const found = staffList.find(s => s.name && s.name.toLowerCase().includes(extractedName));
    if (found) return found;
  }

  const empMatch = rawTarget.match(/(?:employee\s*id|emp\s*id|id):\s*`?([^•\n,\r`\s]+)`?/i);
  if (empMatch) {
    const extractedEmp = empMatch[1].trim().toLowerCase();
    const found = staffList.find(s => s.employeeId && s.employeeId.toLowerCase() === extractedEmp);
    if (found) return found;
  }

  const emailMatch = rawTarget.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    const extractedEmail = emailMatch[0].toLowerCase();
    const found = staffList.find(s => s.email && s.email.toLowerCase() === extractedEmail);
    if (found) return found;
  }

  const byId = staffList.find(s => s._id && (s._id === target || s._id === rawTarget.trim()));
  if (byId) return byId;

  const byName = staffList.find(s => {
    if (!s.name) return false;
    const sNameLower = s.name.toLowerCase().trim();
    if (sNameLower.length < 2) return false;
    return sNameLower === targetLower ||
           sNameLower.includes(targetLower) ||
           targetLower.includes(sNameLower);
  });
  if (byName) return byName;

  const byEmp = staffList.find(s => {
    const emp = (s.employeeId || '').toLowerCase().trim();
    if (!emp || emp.length < 2) return false;
    return emp === targetLower || targetLower.includes(emp);
  });
  if (byEmp) return byEmp;

  return null;
};

/**
 * Main AI Assistant Message Handler
 */
export const handleAIAssistantMessage = async (rawQuery, userContext = {}) => {
  const query = (rawQuery || '').trim();
  const lower = query.toLowerCase();
  const { role = 'admin', email = '', name = 'User' } = userContext;
  const isAdmin = role === 'admin' || isUserAdmin(email);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. COLOR & TWO-COLOR THEME COMMANDS
  // ──────────────────────────────────────────────────────────────────────────
  if (
    lower.includes('change theme') ||
    lower.includes('set theme') ||
    lower.includes('set color') ||
    lower.includes('change color') ||
    lower.includes('custom color') ||
    lower.includes('two color') ||
    lower.includes('apply to all') ||
    lower.startsWith('#')
  ) {
    // Check for hex colors in query (support either 1 or 2 colors)
    const hexMatches = query.match(/#[0-9A-Fa-f]{6}\b/g);
    if (hexMatches && hexMatches.length >= 2) {
      const primary = hexMatches[0];
      const secondary = hexMatches[1];
      applyTwoColorTheme(primary, secondary);
      return {
        reply: `🎨 **Two Matching Colors Applied Globally!**\n\n` +
          `• **Primary Color (Brand & Buttons)**: \`${primary}\`\n` +
          `• **Secondary Color (Accents & Highlights)**: \`${secondary}\`\n\n` +
          `*Only these two harmonious colors have been styled across all screens.*`,
        action: 'theme_changed',
        primaryColor: primary,
        secondaryColor: secondary
      };
    } else if (hexMatches && hexMatches.length === 1) {
      const primary = hexMatches[0];
      const secondary = generateMatchingSecondaryColor(primary);
      applyTwoColorTheme(primary, secondary);
      return {
        reply: `🎨 **Harmonious Two-Color Palette Applied!**\n\n` +
          `• **Primary Color**: \`${primary}\`\n` +
          `• **Auto-Matched Partner Accent**: \`${secondary}\`\n\n` +
          `*Only these two complementary colors have been styled across all screens.*`,
        action: 'theme_changed',
        primaryColor: primary,
        secondaryColor: secondary
      };
    }

    // Check for preset theme names
    if (lower.includes('emerald') || lower.includes('green')) {
      applyPresetTheme('emerald-cyan');
      return { reply: `🌿 **Theme Changed to Emerald Aurora & Cyan!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('indigo') || lower.includes('blue')) {
      applyPresetTheme('indigo-pink');
      return { reply: `💎 **Theme Changed to Royal Indigo & Pink!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('sunset') || lower.includes('amber') || lower.includes('orange')) {
      applyPresetTheme('sunset-rose');
      return { reply: `🌅 **Theme Changed to Sunset Amber & Rose!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('purple') || lower.includes('violet')) {
      applyPresetTheme('velvet-amber');
      return { reply: `🔮 **Theme Changed to Velvet Purple & Gold!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('rose') || lower.includes('red') || lower.includes('crimson')) {
      applyPresetTheme('crimson-purple');
      return { reply: `🌹 **Theme Changed to Crimson & Purple!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('teal') || lower.includes('cyber')) {
      applyPresetTheme('cyber-blue');
      return { reply: `⚡ **Theme Changed to Cyberpunk Teal & Blue!** Applied two matching colors across all screens.` };
    }
    if (lower.includes('sky') || lower.includes('default') || lower.includes('reset')) {
      applyPresetTheme('sky-violet');
      return { reply: `✨ **Theme Set to Sky Blue & Royal Violet!** Applied two matching colors across all screens.` };
    }
  }


  // ──────────────────────────────────────────────────────────────────────────
  // 2. ADD STUDENT (CRUD Operation)
  // ──────────────────────────────────────────────────────────────────────────
  if (
    lower.startsWith('add student') ||
    lower.startsWith('create student') ||
    lower.startsWith('enroll student') ||
    lower.startsWith('new student')
  ) {
    const rawData = query.replace(/^(add student|create student|enroll student|new student)\s*/i, '').trim();
    if (!rawData) {
      return {
        reply: `Please specify the student details.\n\n**Example format:**\n\`Add student Aarav Sharma, class 10-A, roll 101, parent Ramesh Sharma, phone 9876543210\``
      };
    }

    const args = parseEntityArgs(rawData);
    const studentName = args.main || 'New Student';
    const className = args.class || args.grade || 'Grade 10';
    const rollNo = args.roll || `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const parentName = args.parent || 'Parent / Guardian';
    const parentPhone = args.phone || '+91 9876543210';
    const studentEmail = args.email || `${studentName.toLowerCase().replace(/\s+/g, '')}@skool.edu.in`;

    try {
      const res = await createStudent({
        name: studentName,
        admissionNo: rollNo,
        rollNumber: rollNo,
        className: className,
        grade: className,
        section: args.section || 'A',
        parentName: parentName,
        parentPhone: parentPhone,
        email: studentEmail,
        status: 'active',
        dateOfAdmission: new Date().toISOString().split('T')[0]
      });

      lastCreatedStudent = {
        _id: res._id || res.student?._id || res.data?._id,
        name: studentName,
        admissionNo: rollNo,
        className: className
      };

      return {
        reply: `✅ **Student Enrolled Successfully!**\n\n` +
          `• **Name**: ${studentName}\n` +
          `• **Class**: ${className}\n` +
          `• **Admission / Roll No**: \`${rollNo}\`\n` +
          `• **Parent**: ${parentName} (${parentPhone})\n` +
          `• **Email**: ${studentEmail}\n\n` +
          `*The record has been created in the database and is immediately visible in the Student Directory and Dashboard.*`,
        action: 'student_created',
        data: res
      };
    } catch (err) {
      return {
        reply: `❌ **Failed to create student**: ${err.message || 'Server error'}`
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. DELETE STUDENT OR DATA (CRUD Operation with Smart Multi-Format Matcher)
  // ──────────────────────────────────────────────────────────────────────────
  if (
    lower.startsWith('delete student') ||
    lower.startsWith('remove student') ||
    lower.startsWith('drop student') ||
    lower.startsWith('delete an data') ||
    lower.startsWith('delete a data') ||
    lower.startsWith('delete data') ||
    lower.startsWith('delete record')
  ) {
    const rawTarget = query
      .replace(/^(delete|remove|drop)\s*(an|a)?\s*(student|data|record)?\s*[:\-]?\s*/i, '')
      .trim();

    try {
      const res = await getStudents();
      const students = res.students || res.data || (Array.isArray(res) ? res : []);
      const matched = findMatchingStudent(students, rawTarget);

      if (matched) {
        await deleteStudent(matched._id);
        if (lastCreatedStudent && lastCreatedStudent._id === matched._id) {
          lastCreatedStudent = null;
        }

        return {
          reply: `🗑️ **Student Deleted Successfully**\n\n` +
            `• **Name**: ${matched.name}\n` +
            `• **Class**: ${matched.className || matched.grade || 'N/A'}\n` +
            `• **Admission No**: \`${matched.admissionNo || matched.rollNumber || matched._id}\`\n\n` +
            `*The record has been permanently removed from the school system.*`,
          action: 'student_deleted',
          data: matched
        };
      }

      // If not found in students, also check staff in case user said "delete data <staff details>"
      const staffRes = await getStaff();
      const staffList = staffRes.staff || staffRes.data || (Array.isArray(staffRes) ? staffRes : []);
      const matchedStaff = findMatchingStaff(staffList, rawTarget);

      if (matchedStaff) {
        await deleteStaff(matchedStaff._id);
        return {
          reply: `🗑️ **Staff Member Removed Successfully**\n\n` +
            `• **Name**: ${matchedStaff.name}\n` +
            `• **Department**: ${matchedStaff.department || 'N/A'}\n` +
            `• **Employee ID**: \`${matchedStaff.employeeId || matchedStaff._id}\`\n\n` +
            `*Removed from active staff directory.*`,
          action: 'staff_deleted',
          data: matchedStaff
        };
      }

      return {
        reply: `⚠️ Could not find any student or staff record matching:\n> *"${rawTarget.length > 70 ? rawTarget.slice(0, 70) + '...' : rawTarget}"*\n\n` +
          `**Tip**: You can type \`Delete student Aryan Patel\` or \`Delete student 108\` or \`List students\` to see all current records.`
      };
    } catch (err) {
      return {
        reply: `❌ **Failed to delete record**: ${err.message || 'Operation failed'}`
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. ADD STAFF / TEACHER (CRUD Operation)
  // ──────────────────────────────────────────────────────────────────────────
  if (
    lower.startsWith('add staff') ||
    lower.startsWith('create staff') ||
    lower.startsWith('add teacher') ||
    lower.startsWith('create teacher')
  ) {
    const rawData = query.replace(/^(add staff|create staff|add teacher|create teacher)\s*/i, '').trim();
    if (!rawData) {
      return {
        reply: `Please specify the staff details.\n\n**Example format:**\n\`Add staff Dr. Meera Nair, department Science, role Teacher, email meera@skool.edu\``
      };
    }

    const args = parseEntityArgs(rawData);
    const staffName = args.main || 'New Staff';
    const dept = args.dept || args.department || 'Academic';
    const roleType = args.role || 'Teacher';
    const empId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const staffEmail = args.email || `${staffName.toLowerCase().replace(/\s+/g, '')}@skool.edu.in`;

    try {
      const res = await createStaff({
        name: staffName,
        employeeId: empId,
        department: dept,
        designation: roleType,
        email: staffEmail,
        role: roleType.toLowerCase().includes('teacher') ? 'teacher' : 'staff',
        status: 'active',
        joiningDate: new Date().toISOString().split('T')[0]
      });

      lastCreatedStaff = {
        _id: res._id || res.staff?._id || res.data?._id,
        name: staffName,
        employeeId: empId,
        department: dept
      };

      return {
        reply: `✅ **Faculty / Staff Member Added Successfully!**\n\n` +
          `• **Name**: ${staffName}\n` +
          `• **Employee ID**: \`${empId}\`\n` +
          `• **Department**: ${dept}\n` +
          `• **Role**: ${roleType}\n` +
          `• **Email**: ${staffEmail}\n\n` +
          `*Added to the staff roster and ready for timetable and subject assignments.*`,
        action: 'staff_created',
        data: res
      };
    } catch (err) {
      return {
        reply: `❌ **Failed to create staff**: ${err.message || 'Server error'}`
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. DELETE STAFF / TEACHER (CRUD Operation)
  // ──────────────────────────────────────────────────────────────────────────
  if (
    lower.startsWith('delete staff') ||
    lower.startsWith('remove staff') ||
    lower.startsWith('delete teacher') ||
    lower.startsWith('remove teacher')
  ) {
    const rawTarget = query.replace(/^(delete staff|remove staff|delete teacher|remove teacher)\s*/i, '').trim();
    if (!rawTarget) {
      return {
        reply: `Please specify the staff name or ID to remove.\n\n**Example:** \`Delete staff Robert Brown\``
      };
    }

    try {
      const res = await getStaff();
      const staffList = res.staff || res.data || (Array.isArray(res) ? res : []);
      const matched = findMatchingStaff(staffList, rawTarget);

      if (!matched) {
        return {
          reply: `⚠️ Could not find any staff member matching **"${rawTarget}"** in the directory.`
        };
      }

      await deleteStaff(matched._id);
      if (lastCreatedStaff && lastCreatedStaff._id === matched._id) {
        lastCreatedStaff = null;
      }

      return {
        reply: `🗑️ **Staff Member Removed Successfully**\n\n` +
          `• **Name**: ${matched.name}\n` +
          `• **Department**: ${matched.department || 'N/A'}\n` +
          `• **Employee ID**: \`${matched.employeeId || matched._id}\`\n\n` +
          `*Removed from active staff directory.*`,
        action: 'staff_deleted',
        data: matched
      };
    } catch (err) {
      return {
        reply: `❌ **Failed to remove staff**: ${err.message || 'Operation failed'}`
      };
    }
  }


  // ──────────────────────────────────────────────────────────────────────────
  // 6. ADD / DELETE NOTICE
  // ──────────────────────────────────────────────────────────────────────────
  if (lower.startsWith('add notice') || lower.startsWith('post notice') || lower.startsWith('create notice')) {
    const contentText = query.replace(/^(add notice|post notice|create notice)\s*/i, '').trim();
    const args = parseEntityArgs(contentText);
    const title = args.main || 'School Announcement';

    try {
      const res = await createNotice({
        title: title,
        content: args.content || args.description || title,
        priority: lower.includes('urgent') || lower.includes('exam') ? 'urgent' : 'normal',
        targetAudience: args.target || 'all',
        date: new Date().toISOString().split('T')[0]
      });

      return {
        reply: `📢 **Notice Published Successfully!**\n\n` +
          `• **Title**: ${title}\n` +
          `• **Date**: ${new Date().toLocaleDateString()}\n` +
          `• **Audience**: ${args.target || 'All Students & Staff'}\n\n` +
          `*Displayed on the School Noticeboard and Calendar.*`,
        action: 'notice_created',
        data: res
      };
    } catch (err) {
      return { reply: `❌ Failed to post notice: ${err.message}` };
    }
  }

  if (lower.startsWith('delete notice') || lower.startsWith('remove notice')) {
    const rawTarget = query.replace(/^(delete notice|remove notice)\s*/i, '').trim();
    try {
      const res = await getNotices();
      const list = res.notices || res.data || (Array.isArray(res) ? res : []);
      const titleMatch = rawTarget.match(/Title:\s*([^•\n,\r]+)/i);
      const cleanTitle = titleMatch ? titleMatch[1].trim().toLowerCase() : rawTarget.toLowerCase();

      const matched = list.find(n =>
        (n._id && (n._id === rawTarget || n._id === cleanTitle)) ||
        (n.title && (n.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(n.title.toLowerCase())))
      );
      if (!matched) return { reply: `⚠️ Notice matching **"${rawTarget}"** not found.` };
      await deleteNotice(matched._id);
      return { reply: `🗑️ **Notice "${matched.title}" deleted successfully.**` };
    } catch (err) {
      return { reply: `❌ Error deleting notice: ${err.message}` };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. ADD / DELETE CLASS
  // ──────────────────────────────────────────────────────────────────────────
  if (lower.startsWith('add class') || lower.startsWith('create class')) {
    const rawData = query.replace(/^(add class|create class)\s*/i, '').trim();
    const args = parseEntityArgs(rawData);
    const className = args.main || 'Grade 10';

    try {
      const res = await createClass({
        name: className,
        section: args.section || 'A',
        capacity: args.capacity || 40,
        grade: className
      });
      return {
        reply: `🏫 **Class Created Successfully!**\n\n• **Class**: ${className}\n• **Section**: ${args.section || 'A'}\n• **Capacity**: ${args.capacity || 40} Students`
      };
    } catch (err) {
      return { reply: `❌ Failed to create class: ${err.message}` };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. LIST & READ QUERIES (Students, Staff, Classes, Notices, Fees)
  // ──────────────────────────────────────────────────────────────────────────
  if (lower.includes('list student') || lower.includes('show student') || lower.includes('all student') || lower.includes('view student')) {
    try {
      const res = await getStudents();
      const list = res.students || (Array.isArray(res) ? res : []);
      if (list.length === 0) return { reply: '📋 **Student Directory**: No students currently enrolled.' };
      const topList = list.slice(0, 8).map(s => `• **${s.name}** (\`${s.admissionNo || s.rollNumber || 'STU'}\`) - ${s.className || s.grade || 'Class'}`).join('\n');
      return {
        reply: `📋 **Student Records (Total: ${list.length})**:\n\n${topList}\n\n${list.length > 8 ? `*...and ${list.length - 8} more in Student Directory.*` : ''}`
      };
    } catch (err) {
      return { reply: `Error retrieving students: ${err.message}` };
    }
  }

  if (lower.includes('list staff') || lower.includes('show staff') || lower.includes('list teacher') || lower.includes('show teacher')) {
    try {
      const res = await getStaff();
      const list = res.staff || (Array.isArray(res) ? res : []);
      if (list.length === 0) return { reply: '📚 **Faculty Directory**: No staff members currently registered.' };
      const topList = list.slice(0, 8).map(s => `• **${s.name}** (\`${s.employeeId || 'EMP'}\`) - ${s.designation || s.department || 'Teacher'}`).join('\n');
      return {
        reply: `📚 **Faculty & Staff Roster (Total: ${list.length})**:\n\n${topList}`
      };
    } catch (err) {
      return { reply: `Error retrieving staff: ${err.message}` };
    }
  }

  if (lower.includes('show class') || lower.includes('list class')) {
    try {
      const res = await getClasses();
      const list = res.classes || (Array.isArray(res) ? res : []);
      const classRows = list.map(c => `• **${c.name}** (Section ${c.section || 'A'}) - Capacity: ${c.capacity || 40}`).join('\n');
      return {
        reply: `🏫 **Active Classes (${list.length} total)**:\n\n${classRows || 'No classes registered yet.'}`
      };
    } catch (err) {
      return { reply: `Error retrieving classes: ${err.message}` };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 9. GENERAL CHATGPT-STYLE AI CONVERSATION
  // ──────────────────────────────────────────────────────────────────────────
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      reply: `👋 **Hello ${name}! I am your Skool AI Assistant.**\n\nHow can I help you today? You can ask me to:\n` +
        `• ➕ **Add / Delete student** records\n` +
        `• ➕ **Add / Delete staff** & teacher accounts\n` +
        `• 🎨 **Change color theme** (or pick any custom color)\n` +
        `• 📢 **Post a school notice** or circular\n` +
        `• 📋 **List students, classes, or teachers**\n` +
        `• 💬 **Ask any school administration question!**`
    };
  }

  if (lower.includes('help') || lower.includes('what can you do')) {
    return {
      reply: `🤖 **Skool AI Assistant Capabilities**\n\n` +
        `1. **Student Management**:\n` +
        `   • \`Add student [Name], class [Class], roll [RollNo], parent [Parent], phone [Phone]\`\n` +
        `   • \`Delete student [Name or RollNo]\`\n` +
        `   • \`List students\`\n\n` +
        `2. **Staff & Faculty**:\n` +
        `   • \`Add staff [Name], department [Dept], role [Role]\`\n` +
        `   • \`Delete staff [Name]\`\n` +
        `   • \`List staff\`\n\n` +
        `3. **Theme & Custom Colors (All Screens)**:\n` +
        `   • \`Set color #06b6d4\` (or any hex code)\n` +
        `   • \`Change theme to emerald / indigo / sunset / rose / purple\`\n\n` +
        `4. **Notices & Schedules**:\n` +
        `   • \`Add notice [Title], content [Details]\`\n` +
        `   • \`Add class [Class Name], section [A/B]\``
    };
  }

  // Polite general conversational response
  return {
    reply: `🤖 **AI Assistant:** I processed your message: *"**${query}**"*\n\n` +
      `If you'd like to perform actions on the school database, try:\n` +
      `• **\`Add student [Name], class [10-A]\`**\n` +
      `• **\`Delete student [Name]\`**\n` +
      `• **\`Add staff [Name], department [Math]\`**\n` +
      `• **\`Set color #10b981\`**\n` +
      `• **\`List students\`** or **\`List staff\`**`
  };
};
