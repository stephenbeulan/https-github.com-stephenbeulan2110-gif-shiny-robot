// LocalStorage Database Simulation for CVMS
// CRUD operations for all data entities

const DB = {
  // Initialize with demo data
  init() {
    if (!localStorage.getItem('cvms_users')) {
      localStorage.setItem('cvms_users', JSON.stringify([
        { id: '1', email: 'admin@cvms.com', password: 'demo123', name: 'Admin User', role: 'admin', phone: '9876543210', createdAt: new Date().toISOString() },
        { id: '2', email: 'hospital@cvms.com', password: 'demo123', name: 'Stanley Hospital', role: 'hospital', phone: '9876543211', location: 'Chennai', createdAt: new Date().toISOString() },
        { id: '3', email: 'parent@cvms.com', password: 'demo123', name: 'Priya R', role: 'parent', phone: '9876543212', address: 'Chennai', createdAt: new Date().toISOString() },
        { id: '4', email: 'hospital2@cvms.com', password: 'demo123', name: 'Apollo Hospital', role: 'hospital', phone: '9876543213', location: 'Chennai', createdAt: new Date().toISOString() },
        { id: '5', email: 'parent2@cvms.com', password: 'demo123', name: 'Rajesh K', role: 'parent', phone: '9876543214', address: 'Chennai', createdAt: new Date().toISOString() }
      ]));
    }

    if (!localStorage.getItem('cvms_children')) {
      localStorage.setItem('cvms_children', JSON.stringify([
        { id: '1', parentId: '3', name: 'Aarav Kumar', dob: '2025-05-15', gender: 'M', aadhaar: '123456789012', bloodGroup: 'O+', createdAt: new Date().toISOString() },
        { id: '2', parentId: '3', name: 'Divya Tamil', dob: '2025-03-22', gender: 'F', aadhaar: '123456789013', bloodGroup: 'A+', createdAt: new Date().toISOString() },
        { id: '3', parentId: '5', name: 'Karthik R', dob: '2024-08-10', gender: 'M', aadhaar: '123456789014', bloodGroup: 'B+', createdAt: new Date().toISOString() },
        { id: '4', parentId: '5', name: 'Sneha M', dob: '2025-01-05', gender: 'F', aadhaar: '123456789015', bloodGroup: 'AB+', createdAt: new Date().toISOString() }
      ]));
    }

    if (!localStorage.getItem('cvms_vaccinations')) {
      localStorage.setItem('cvms_vaccinations', JSON.stringify([
        { id: '1', childId: '1', vaccine: 'BCG', dose: 1, scheduledDate: '2025-05-15', status: 'completed', batchNumber: 'BCG2025A', completedDate: '2025-05-15', notes: 'Administered successfully' },
        { id: '2', childId: '1', vaccine: 'OPV-0', dose: 1, scheduledDate: '2025-05-15', status: 'completed', batchNumber: 'OPV2025B', completedDate: '2025-05-15' },
        { id: '3', childId: '1', vaccine: 'Hepatitis B-1', dose: 1, scheduledDate: '2025-05-15', status: 'pending', batchNumber: null, completedDate: null },
        { id: '4', childId: '2', vaccine: 'BCG', dose: 1, scheduledDate: '2025-03-22', status: 'completed', batchNumber: 'BCG2025A', completedDate: '2025-03-22' },
        { id: '5', childId: '2', vaccine: 'OPV-0', dose: 1, scheduledDate: '2025-03-22', status: 'completed', batchNumber: 'OPV2025B', completedDate: '2025-03-22' },
        { id: '6', childId: '3', vaccine: 'BCG', dose: 1, scheduledDate: '2024-08-10', status: 'completed', batchNumber: 'BCG2024C', completedDate: '2024-08-10' },
        { id: '7', childId: '4', vaccine: 'BCG', dose: 1, scheduledDate: '2025-01-05', status: 'overdue', batchNumber: null, completedDate: null }
      ]));
    }

    if (!localStorage.getItem('cvms_appointments')) {
      localStorage.setItem('cvms_appointments', JSON.stringify([
        { id: '1', childId: '1', hospitalId: '2', hospitalName: 'Stanley Hospital', date: '2026-03-15', time: '10:30', status: 'scheduled', notes: 'Routine checkup', createdAt: new Date().toISOString() },
        { id: '2', childId: '2', hospitalId: '2', hospitalName: 'Stanley Hospital', date: '2026-03-20', time: '14:00', status: 'scheduled', notes: 'Vaccination follow-up', createdAt: new Date().toISOString() },
        { id: '3', childId: '4', hospitalId: '4', hospitalName: 'Apollo Hospital', date: '2026-03-10', time: '11:15', status: 'confirmed', notes: 'Overdue vaccination', createdAt: new Date().toISOString() }
      ]));
    }

    if (!localStorage.getItem('cvms_hospitals')) {
      localStorage.setItem('cvms_hospitals', JSON.stringify([
        { id: '2', name: 'Stanley Hospital', email: 'hospital@cvms.com', phone: '9876543211', location: 'Chennai', status: 'approved', approvedAt: new Date().toISOString() },
        { id: '4', name: 'Apollo Hospital', email: 'hospital2@cvms.com', phone: '9876543213', location: 'Chennai', status: 'approved', approvedAt: new Date().toISOString() },
        { id: '6', name: 'Kauvery Hospital', email: 'kauvery@cvms.com', phone: '9876543215', location: 'Chennai', status: 'pending', approvedAt: null },
        { id: '7', name: 'MIOT Hospital', email: 'miot@cvms.com', phone: '9876543216', location: 'Chennai', status: 'approved', approvedAt: new Date().toISOString() },
        { id: '8', name: 'Global Hospital', email: 'global@cvms.com', phone: '9876543217', location: 'Chennai', status: 'approved', approvedAt: new Date().toISOString() }
      ]));
    }

    if (!localStorage.getItem('cvms_certificates')) {
      localStorage.setItem('cvms_certificates', JSON.stringify([
        { id: '1', childId: '1', parentId: '3', certificateNumber: 'CERT-2025-001', generatedDate: '2025-05-15', qrData: 'CERT-2025-001-Aarav', status: 'active' },
        { id: '2', childId: '3', parentId: '5', certificateNumber: 'CERT-2024-002', generatedDate: '2024-08-10', qrData: 'CERT-2024-002-Karthik', status: 'active' }
      ]));
    }
  },

  // Generic CRUD operations
  getAll(table) {
    return JSON.parse(localStorage.getItem(`cvms_${table}`) || '[]');
  },

  getById(table, id) {
    const items = this.getAll(table);
    return items.find(item => item.id === id);
  },

  create(table, data) {
    const items = this.getAll(table);
    const newItem = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    items.push(newItem);
    localStorage.setItem(`cvms_${table}`, JSON.stringify(items));
    return newItem;
  },

  update(table, id, data) {
    const items = this.getAll(table);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(`cvms_${table}`, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  delete(table, id) {
    const items = this.getAll(table);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(`cvms_${table}`, JSON.stringify(filtered));
    return true;
  },

  // Query helpers
  where(table, condition) {
    const items = this.getAll(table);
    return items.filter(condition);
  },

  find(table, condition) {
    const items = this.getAll(table);
    return items.find(condition);
  },

  count(table, condition = null) {
    const items = condition ? this.where(table, condition) : this.getAll(table);
    return items.length;
  },

  // Statistics helpers
  getStats() {
    const children = this.getAll('children');
    const vaccinations = this.getAll('vaccinations');
    const appointments = this.getAll('appointments');
    const hospitals = this.getAll('hospitals');

    return {
      totalChildren: children.length,
      totalVaccinations: vaccinations.length,
      completedVaccinations: vaccinations.filter(v => v.status === 'completed').length,
      pendingVaccinations: vaccinations.filter(v => v.status === 'pending').length,
      overdueVaccinations: vaccinations.filter(v => v.status === 'overdue').length,
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length,
      approvedHospitals: hospitals.filter(h => h.status === 'approved').length,
      totalHospitals: hospitals.length
    };
  },

  // Export helpers
  exportToCSV(table, filename = null) {
    const items = this.getAll(table);
    if (items.length === 0) return null;

    const headers = Object.keys(items[0]);
    const csvContent = [
      headers.join(','),
      ...items.map(item => headers.map(header => `"${item[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || `${table}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  // Clear all data (for testing)
  clear() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cvms_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
};

// Initialize on load
DB.init();