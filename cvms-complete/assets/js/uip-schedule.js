// Indian UIP Schedule (25 Doses)
// Complete vaccination schedule as per Government of India guidelines

const UIP_SCHEDULE = [
  // Birth (0 days)
  { vaccine: 'BCG', dose: 1, ageDays: 0, ageLabel: 'At Birth', category: 'essential' },
  { vaccine: 'OPV-0', dose: 1, ageDays: 0, ageLabel: 'At Birth', category: 'essential' },
  { vaccine: 'Hepatitis B-1', dose: 1, ageDays: 0, ageLabel: 'At Birth', category: 'essential' },

  // 6 Weeks
  { vaccine: 'DPT-1', dose: 1, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },
  { vaccine: 'OPV-1', dose: 1, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },
  { vaccine: 'Hepatitis B-2', dose: 2, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },
  { vaccine: 'Hib-1', dose: 1, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },
  { vaccine: 'Rotavirus-1', dose: 1, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },
  { vaccine: 'PCV-1', dose: 1, ageDays: 42, ageLabel: '6 Weeks', category: 'essential' },

  // 10 Weeks
  { vaccine: 'DPT-2', dose: 2, ageDays: 70, ageLabel: '10 Weeks', category: 'essential' },
  { vaccine: 'OPV-2', dose: 2, ageDays: 70, ageLabel: '10 Weeks', category: 'essential' },
  { vaccine: 'Hib-2', dose: 2, ageDays: 70, ageLabel: '10 Weeks', category: 'essential' },
  { vaccine: 'Rotavirus-2', dose: 2, ageDays: 70, ageLabel: '10 Weeks', category: 'essential' },
  { vaccine: 'PCV-2', dose: 2, ageDays: 70, ageLabel: '10 Weeks', category: 'essential' },

  // 14 Weeks
  { vaccine: 'DPT-3', dose: 3, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },
  { vaccine: 'OPV-3', dose: 3, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },
  { vaccine: 'Hib-3', dose: 3, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },
  { vaccine: 'Rotavirus-3', dose: 3, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },
  { vaccine: 'PCV-3', dose: 3, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },
  { vaccine: 'IPV-1', dose: 1, ageDays: 98, ageLabel: '14 Weeks', category: 'essential' },

  // 6 Months
  { vaccine: 'Hepatitis B-3', dose: 3, ageDays: 180, ageLabel: '6 Months', category: 'essential' },

  // 9 Months
  { vaccine: 'Measles-1', dose: 1, ageDays: 270, ageLabel: '9 Months', category: 'essential' },
  { vaccine: 'OPV-4', dose: 4, ageDays: 270, ageLabel: '9 Months', category: 'essential' },

  // 12 Months
  { vaccine: 'PCV Booster', dose: 4, ageDays: 365, ageLabel: '12 Months', category: 'essential' },

  // 15 Months
  { vaccine: 'Measles-2', dose: 2, ageDays: 455, ageLabel: '15 Months', category: 'essential' },

  // 16-24 Months (additional vaccines)
  { vaccine: 'Vitamin A-1', dose: 1, ageDays: 365, ageLabel: '12 Months', category: 'supplemental' },
  { vaccine: 'Vitamin A-2', dose: 2, ageDays: 455, ageLabel: '15 Months', category: 'supplemental' }
];

// Generate vaccination schedule for a child
function generateVaccinationSchedule(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  return UIP_SCHEDULE.map(schedule => {
    const dueDate = new Date(dob);
    dueDate.setDate(dueDate.getDate() + schedule.ageDays);

    return {
      vaccine: schedule.vaccine,
      dose: schedule.dose,
      ageLabel: schedule.ageLabel,
      category: schedule.category,
      scheduledDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
      batchNumber: null,
      completedDate: null,
      notes: null
    };
  });
}

// Get vaccination status based on due date
function getVaccinationStatus(scheduledDate) {
  const today = new Date();
  const scheduled = new Date(scheduledDate);
  const diffDays = Math.floor((today - scheduled) / (1000 * 60 * 60 * 24));

  if (diffDays > 30) return 'overdue';
  if (diffDays >= 0) return 'due';
  return 'upcoming';
}

// Calculate age in years and months
function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}

// Get next vaccination due
function getNextVaccination(childId) {
  const vaccinations = DB.where('vaccinations', v => v.childId === childId && v.status !== 'completed');
  if (vaccinations.length === 0) return null;

  // Sort by scheduled date
  vaccinations.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return vaccinations[0];
}

// Get vaccination completion percentage
function getVaccinationProgress(childId) {
  const vaccinations = DB.where('vaccinations', v => v.childId === childId);
  if (vaccinations.length === 0) return 0;

  const completed = vaccinations.filter(v => v.status === 'completed').length;
  return Math.round((completed / vaccinations.length) * 100);
}

// Get overdue vaccinations count
function getOverdueCount(childId) {
  const vaccinations = DB.where('vaccinations', v => v.childId === childId);
  return vaccinations.filter(v => v.status === 'overdue').length;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Format date and time for display
function formatDateTime(dateString, timeString = null) {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (timeString) {
    return `${dateStr} at ${timeString}`;
  }

  return dateStr;
}

// Check if vaccination is due within next N days
function isDueWithinDays(scheduledDate, days = 7) {
  const today = new Date();
  const scheduled = new Date(scheduledDate);
  const diffDays = Math.floor((scheduled - today) / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= days;
}

// Get vaccination reminders for a parent
function getVaccinationReminders(parentId) {
  const children = DB.where('children', c => c.parentId === parentId);
  const reminders = [];

  children.forEach(child => {
    const nextVax = getNextVaccination(child.id);
    if (nextVax && (nextVax.status === 'due' || isDueWithinDays(nextVax.scheduledDate, 7))) {
      reminders.push({
        childName: child.name,
        vaccine: nextVax.vaccine,
        dueDate: nextVax.scheduledDate,
        status: nextVax.status
      });
    }
  });

  return reminders;
}

// Export functions for global use
window.UIP = {
  generateVaccinationSchedule,
  getVaccinationStatus,
  calculateAge,
  getNextVaccination,
  getVaccinationProgress,
  getOverdueCount,
  formatDate,
  formatDateTime,
  isDueWithinDays,
  getVaccinationReminders
};