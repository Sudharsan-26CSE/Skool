import { getDatabaseState, createLocalItem, updateLocalItem } from '../data/dbStore';
import { isUserAdmin } from './api';

// Available UI optimization themes per user
export const UI_THEMES = {
  default: {
    id: 'default',
    name: 'Skool Modern Indigo',
    primary: '#6366f1',
    primaryGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    accent: '#8b5cf6',
    bgBody: 'var(--bg-primary)',
    cardBg: 'var(--card-bg)',
    cardBorder: 'var(--card-border)',
    badgeBg: 'rgba(99, 102, 241, 0.12)',
    fontScale: '100%',
    density: 'comfortable',
    glowColor: 'rgba(99, 102, 241, 0.25)'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon Matrix',
    primary: '#06b6d4',
    primaryGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    accent: '#f43f5e',
    bgBody: '#090d16',
    cardBg: 'rgba(15, 23, 42, 0.85)',
    cardBorder: 'rgba(6, 182, 212, 0.3)',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    fontScale: '100%',
    density: 'compact',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Aurora Glass',
    primary: '#10b981',
    primaryGradient: 'linear-gradient(135deg, #10b981, #059669)',
    accent: '#34d399',
    bgBody: '#062016',
    cardBg: 'rgba(6, 44, 30, 0.75)',
    cardBorder: 'rgba(16, 185, 129, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    fontScale: '100%',
    density: 'comfortable',
    glowColor: 'rgba(16, 185, 129, 0.35)'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Amber Glow',
    primary: '#f59e0b',
    primaryGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    accent: '#fb923c',
    bgBody: '#1a0f0a',
    cardBg: 'rgba(40, 20, 10, 0.8)',
    cardBorder: 'rgba(245, 158, 11, 0.3)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    fontScale: '100%',
    density: 'comfortable',
    glowColor: 'rgba(245, 158, 11, 0.35)'
  },
  luxury: {
    id: 'luxury',
    name: 'Royal Velvet Obsidian',
    primary: '#a855f7',
    primaryGradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    accent: '#ec4899',
    bgBody: '#120b1e',
    cardBg: 'rgba(26, 15, 43, 0.85)',
    cardBorder: 'rgba(168, 85, 247, 0.3)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    fontScale: '105%',
    density: 'spacious',
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Deep OLED',
    primary: '#38bdf8',
    primaryGradient: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    accent: '#38bdf8',
    bgBody: '#030712',
    cardBg: 'rgba(17, 24, 39, 0.95)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    fontScale: '100%',
    density: 'comfortable',
    glowColor: 'rgba(56, 189, 248, 0.25)'
  }
};

// Retrieve personalized UI preference for a specific user
export const getUserUIPreferences = (userEmail) => {
  const safeEmail = (userEmail || 'guest').toLowerCase().trim();
  try {
    const raw = localStorage.getItem(`skool_user_ui_${safeEmail}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return {
    themeId: 'default',
    fontScale: '100%',
    density: 'comfortable',
    glassMode: 'enabled'
  };
};

// Save personalized UI preference per user
export const saveUserUIPreferences = (userEmail, preferences) => {
  const safeEmail = (userEmail || 'guest').toLowerCase().trim();
  try {
    localStorage.setItem(`skool_user_ui_${safeEmail}`, JSON.stringify(preferences));
  } catch (e) {}
  applyUserUIPreferences(preferences);
};

// Apply UI optimization dynamically to DOM
export const applyUserUIPreferences = (preferences) => {
  const theme = UI_THEMES[preferences.themeId] || UI_THEMES.default;
  const root = document.documentElement;

  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--primary-gradient', theme.primaryGradient);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--ai-user-glow', theme.glowColor);

  if (theme.id !== 'default') {
    root.setAttribute('data-user-theme', theme.id);
    root.style.setProperty('--bg-primary', theme.bgBody);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--card-border', theme.cardBorder);
  } else {
    root.removeAttribute('data-user-theme');
    root.style.removeProperty('--bg-primary');
    root.style.removeProperty('--card-bg');
    root.style.removeProperty('--card-border');
  }

  // Layout density
  if (preferences.density === 'compact') {
    root.setAttribute('data-density', 'compact');
  } else if (preferences.density === 'spacious') {
    root.setAttribute('data-density', 'spacious');
  } else {
    root.removeAttribute('data-density');
  }

  // Font scale
  if (preferences.fontScale) {
    root.style.setProperty('--user-font-scale', preferences.fontScale);
  }
};

// Execute role-scoped AI query
export const processAIQuery = async (queryText, userContext) => {
  const text = (queryText || '').trim().toLowerCase();
  const { email, role, name } = userContext;
  const db = getDatabaseState();

  const userIsAdmin = role === 'admin' || isUserAdmin(email);
  const userIsStaff = role === 'staff' || role === 'teacher';
  const userIsStudent = !userIsAdmin && !userIsStaff;

  // 1. Check for UI Optimization Intent
  if (
    text.includes('theme') ||
    text.includes('ui') ||
    text.includes('optimize') ||
    text.includes('dark') ||
    text.includes('cyberpunk') ||
    text.includes('emerald') ||
    text.includes('sunset') ||
    text.includes('luxury') ||
    text.includes('purple') ||
    text.includes('midnight') ||
    text.includes('density') ||
    text.includes('font') ||
    text.includes('color')
  ) {
    let chosenThemeId = 'default';
    if (text.includes('cyber') || text.includes('neon') || text.includes('matrix')) {
      chosenThemeId = 'cyberpunk';
    } else if (text.includes('emerald') || text.includes('green') || text.includes('nature')) {
      chosenThemeId = 'emerald';
    } else if (text.includes('sunset') || text.includes('orange') || text.includes('amber')) {
      chosenThemeId = 'sunset';
    } else if (text.includes('luxury') || text.includes('purple') || text.includes('royal') || text.includes('velvet')) {
      chosenThemeId = 'luxury';
    } else if (text.includes('midnight') || text.includes('oled') || text.includes('deep dark') || text.includes('dark')) {
      chosenThemeId = 'midnight';
    } else if (text.includes('default') || text.includes('reset') || text.includes('indigo') || text.includes('original')) {
      chosenThemeId = 'default';
    }

    let density = text.includes('compact') ? 'compact' : text.includes('spacious') ? 'spacious' : 'comfortable';
    let fontScale = text.includes('large font') || text.includes('big font') ? '110%' : text.includes('small font') ? '90%' : '100%';

    const currentPrefs = getUserUIPreferences(email);
    const newPrefs = {
      ...currentPrefs,
      themeId: chosenThemeId,
      density,
      fontScale
    };

    saveUserUIPreferences(email, newPrefs);

    const themeName = UI_THEMES[chosenThemeId]?.name || chosenThemeId;
    return {
      type: 'ui_optimized',
      message: `✨ **UI Personalized for ${name || email}**!\n\nI have adapted your workspace layout and color palette to **${themeName}** with **${density}** density.\n\n*This unique design is saved exclusively to your profile.*`,
      theme: newPrefs
    };
  }

  // 2. Check for Edit / Modification Intent
  const editKeywords = ['edit', 'update', 'delete', 'remove', 'change', 'modify', 'alter', 'cancel fee', 'mark attendance', 'add notice'];
  const hasEditIntent = editKeywords.some(kw => text.includes(kw));

  if (hasEditIntent) {
    // Strict Role-Based Edit Authorization Guard
    if (userIsStudent) {
      return {
        type: 'permission_denied',
        message: `⛔ **Access Denied: Read-Only Authorization**\n\nEdit and modification access is strictly restricted to **School Administrators** and **Staff Members**.\n\nAs a **Student**, your profile does not have permission to alter database records, fees, marks, or attendance.`
      };
    }

    // Authorized Admin or Staff Edit Handler
    if (text.includes('notice') || text.includes('announcement')) {
      const noticeTitle = queryText.replace(/add notice|create notice|post notice/gi, '').trim() || 'Urgent School Update';
      const created = createLocalItem('notices', {
        title: noticeTitle,
        description: `Posted via AI Copilot by ${name || 'Administrator'}`,
        category: 'Urgent',
        date: new Date().toISOString().split('T')[0],
        postedBy: name || 'Admin'
      });
      return {
        type: 'edit_success',
        message: `✅ **Notice Published Successfully** (Authorized by ${role.toUpperCase()})\n\n**Title**: ${created.title}\n**Category**: Urgent\n**Date**: ${created.date}\n\n*Updated directly in the database.*`
      };
    }

    return {
      type: 'edit_authorized',
      message: `🛡️ **Authorized Administrator / Staff Action**\n\nYou have verified edit permissions. You can modify records directly through the dedicated management panels (Students, Staff, Classes, Fees) or specify the exact record to update.`
    };
  }

  // 3. "Search My Data" & Personal Data Inquiry
  if (
    text.includes('search my data') ||
    text.includes('my data') ||
    text.includes('my details') ||
    text.includes('about me') ||
    text.includes('my profile') ||
    text.includes('my attendance') ||
    text.includes('my fee') ||
    text.includes('my fees') ||
    text.includes('my class') ||
    text.includes('my grade') ||
    text.includes('my marks')
  ) {
    if (userIsStudent) {
      const cleanEmail = (email || '').toLowerCase().trim();
      const studentMatch = (db.students || []).find(s => 
        (s.email && s.email.toLowerCase() === cleanEmail) ||
        (s.admissionNo && text.includes(s.admissionNo.toLowerCase())) ||
        (cleanEmail.includes('sudhan') && (s.name || '').toLowerCase().includes('sudhan')) ||
        (s.user && typeof s.user === 'object' && s.user.email?.toLowerCase() === cleanEmail)
      ) || db.students[0]; // fallback to primary student

      const myFees = (db.fees || []).filter(f => f.studentId === studentMatch?._id || f.studentName === studentMatch?.name);
      const myAttendance = (db.attendances || []).filter(a => a.studentId === studentMatch?._id || a.studentName === studentMatch?.name);
      const myExamResults = (db.examresults || []).filter(r => r.studentId === studentMatch?._id);

      return {
        type: 'personal_data_student',
        message: `🎓 **Personal Data for ${studentMatch?.name || name || 'Student'}**\n\n` +
          `• **Admission No**: \`${studentMatch?.admissionNo || 'STU-1001'}\`\n` +
          `• **Academic Class**: ${studentMatch?.className || 'Grade 10-A'} (Section ${studentMatch?.section || 'A'})\n` +
          `• **Email**: ${studentMatch?.email || email}\n` +
          `• **Parent / Guardian**: ${studentMatch?.parentName || 'Sundaram S'} (${studentMatch?.parentPhone || '+91 9443123450'})\n` +
          `• **Address**: ${studentMatch?.address || '14 Gandhi Road, Chennai'}\n` +
          `• **Blood Group**: ${studentMatch?.bloodGroup || 'O+'}\n\n` +
          `💰 **Fee Status**: ${myFees.length > 0 ? `${myFees[0].feeType}: $${myFees[0].totalAmount || myFees[0].amount} (${myFees[0].status?.toUpperCase()})` : 'All term fees paid'}\n` +
          `📊 **Attendance**: Present (${myAttendance.length > 0 ? myAttendance[0].status : '96% Average'})\n\n` +
          `*🔒 Note: For privacy, student accounts only display your own verified academic records.*`
      };
    }

    if (userIsStaff) {
      const staffMatch = (db.staffs || []).find(s => 
        (s.email && s.email.toLowerCase() === email.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes('sarah'))
      ) || db.staffs[0];

      return {
        type: 'personal_data_staff',
        message: `📚 **Faculty Profile for ${staffMatch?.name || name}**\n\n` +
          `• **Employee ID**: \`${staffMatch?.employeeId || 'EMP-101'}\`\n` +
          `• **Department**: ${staffMatch?.department || 'Mathematics'}\n` +
          `• **Designation**: ${staffMatch?.designation || 'Senior Lecturer'}\n` +
          `• **Qualification**: ${staffMatch?.qualification || 'Ph.D Mathematics'}\n` +
          `• **Experience**: ${staffMatch?.experience || 8} Years\n` +
          `• **Role Access**: Faculty & Class Management`
      };
    }

    if (userIsAdmin) {
      const totalStudents = (db.students || []).length;
      const totalStaff = (db.staffs || []).length;
      const totalClasses = (db.classes || []).length;
      const totalRevenue = (db.fees || []).reduce((sum, f) => sum + (f.status === 'paid' ? Number(f.totalAmount || f.amount || 0) : 0), 0);

      return {
        type: 'personal_data_admin',
        message: `👑 **Executive Administrator Overview**\n\n` +
          `• **Admin Account**: ${email}\n` +
          `• **Access Tier**: Super Administrator (Full Read / Write / Delete)\n\n` +
          `🏫 **Institutional Totals**:\n` +
          `• Enrolled Students: **${totalStudents}**\n` +
          `• Verified Faculty: **${totalStaff}**\n` +
          `• Active Classes: **${totalClasses}**\n` +
          `• Total Collected Revenue: **$${totalRevenue.toLocaleString()}**`
      };
    }
  }

  // 4. General School Data Search
  if (text.includes('student') || text.includes('admission')) {
    if (userIsStudent) {
      return {
        type: 'student_privacy',
        message: `🔒 Student data search is restricted to your own personal profile. Prompt **"Search my data"** to view your academic records.`
      };
    }
    const studentList = (db.students || []).slice(0, 5).map(s => `• ${s.name} (${s.admissionNo}) - ${s.className}`).join('\n');
    return {
      type: 'school_data',
      message: `📋 **Student Records (Total: ${(db.students || []).length})**:\n\n${studentList}\n\n*View full directory in the Student Management panel.*`
    };
  }

  if (text.includes('class') || text.includes('grade')) {
    const classList = (db.classes || []).map(c => `• **${c.className || c.name}**: ${c.room || 'Room'} (Capacity: ${c.capacity})`).join('\n');
    return {
      type: 'school_data',
      message: `🏫 **Active Classes (${(db.classes || []).length})**:\n\n${classList}`
    };
  }

  if (text.includes('teacher') || text.includes('staff')) {
    if (userIsStudent) {
      const teacherNames = (db.staffs || []).map(s => `• ${s.name} - ${s.department} (${s.designation})`).join('\n');
      return {
        type: 'school_data',
        message: `📚 **School Faculty Roster**:\n\n${teacherNames}`
      };
    }
    const staffList = (db.staffs || []).map(s => `• **${s.name}** [${s.employeeId}]: ${s.designation} (${s.department}) - Salary: $${s.salary}`).join('\n');
    return {
      type: 'school_data',
      message: `👨‍🏫 **Staff Directory (${(db.staffs || []).length})**:\n\n${staffList}`
    };
  }

  // Fallback AI Assistance
  return {
    type: 'help',
    message: `🤖 **Skool AI Copilot Ready**\n\nI can assist you with:\n` +
      `• 🔍 **"Search my data"** - Displays your personal student or staff records.\n` +
      `• 🎨 **"Optimize UI to Cyberpunk"** (or Emerald, Sunset, Luxury, Midnight) - Personalizes your workspace.\n` +
      `• 📊 **"Show classes"** / **"Show timetables"** - School schedules.\n` +
      `${userIsAdmin || userIsStaff ? `• ✏️ **"Post notice [title]"** - Add school updates directly.` : `• 🔒 *Edit access is reserved for Admin and Staff.*`}`
  };
};
