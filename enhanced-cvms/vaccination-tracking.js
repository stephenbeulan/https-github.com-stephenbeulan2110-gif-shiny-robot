// Vaccination Tracking Application
class VaccinationTracker {
    constructor() {
        this.currentChildId = null;
        this.currentFilters = {
            search: '',
            status: 'all',
            upcomingOnly: false
        };
        this.allVaccinations = [];
        this.init();
    }

    init() {
        // Check authentication
        if (!this.checkAuthentication()) {
            window.location.href = '/enhanced-cvms/login.html';
            return;
        }

        // Set user name
        this.updateUserInfo();

        // Load children
        this.loadChildren();

        // Set up event listeners
        this.setupEventListeners();
    }

    checkAuthentication() {
        // In a real app, this would check session on server
        return true;
    }

    updateUserInfo() {
        const userName = localStorage.getItem('userName');
        if (userName) {
            document.getElementById('userName').textContent = userName;
        }
    }

    setupEventListeners() {
        document.getElementById('childSelect').addEventListener('change', (e) => {
            this.currentChildId = e.target.value;
            if (this.currentChildId) {
                this.loadVaccinations();
                this.loadStatistics();
                document.getElementById('filterContainer').style.display = 'block';
                document.getElementById('vaccinationsContainer').style.display = 'block';
                document.getElementById('statsContainer').style.display = 'grid';
                document.getElementById('timelineContainer').style.display = 'block';
                document.getElementById('emptyState').style.display = 'none';
                document.getElementById('progressContainer').style.display = 'block';
            } else {
                this.resetInterface();
            }
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.filterVaccinations();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.filterVaccinations();
        });

        document.getElementById('upcomingToggle').addEventListener('click', (e) => {
            this.currentFilters.upcomingOnly = !this.currentFilters.upcomingOnly;
            e.target.classList.toggle('active');
            this.filterVaccinations();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    loadChildren() {
        // Load children from localStorage (demo)
        // In real app, fetch from API
        const children = JSON.parse(localStorage.getItem('children') || '[]');
        const select = document.getElementById('childSelect');

        select.innerHTML = '<option value="">-- Select a child --</option>';
        children.forEach(child => {
            const option = document.createElement('option');
            option.value = child.id;
            option.textContent = `${child.name} - ${new Date(child.dateOfBirth).toLocaleDateString('en-IN')}`;
            select.appendChild(option);
        });
    }

    loadVaccinations() {
        // In real app, fetch from API
        // For demo, use localStorage
        const vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
        this.allVaccinations = vaccinations.filter(v => v.childId == this.currentChildId);
        this.filterVaccinations();
    }

    filterVaccinations() {
        let filtered = [...this.allVaccinations];

        // Search filter
        if (this.currentFilters.search) {
            const search = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(vax =>
                vax.vaccineName.toLowerCase().includes(search) ||
                (vax.doseNumber && vax.doseNumber.toString().includes(search))
            );
        }

        // Status filter
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(vax => vax.status === this.currentFilters.status);
        }

        // Upcoming only filter
        if (this.currentFilters.upcomingOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            filtered = filtered.filter(vax => {
                const scheduledDate = new Date(vax.scheduledDate);
                scheduledDate.setHours(0, 0, 0, 0);
                return scheduledDate >= today && vax.status !== 'completed';
            });
        }

        // Sort by scheduled date
        filtered.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

        this.renderVaccinations(filtered);
        document.getElementById('recordCount').textContent = filtered.length;
    }

    renderVaccinations(vaccinations) {
        const tbody = document.getElementById('vaccinationsBody');

        if (vaccinations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        ${this.currentFilters.search || this.currentFilters.status !== 'all' ? 'No vaccinations match your filters' : 'No vaccinations found'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = vaccinations.map(vax => `
            <tr class="table-row-${vax.status}">
                <td>
                    <strong>${vax.vaccineName}</strong>
                    <div class="vaccine-info" style="font-size: 0.8rem; color: #999; margin-top: 0.25rem;">
                        ${this.getVaccineInfo(vax.vaccineName)}
                    </div>
                </td>
                <td>${vax.doseNumber || '-'}</td>
                <td>${new Date(vax.scheduledDate).toLocaleDateString('en-IN')}</td>
                <td>${this.getStatusBadge(vax.status)}</td>
                <td>${vax.completedDate ? new Date(vax.completedDate).toLocaleDateString('en-IN') : '-'}</td>
                <td>
                    ${vax.status !== 'completed' ? `
                        <button class="btn btn-sm btn-outline" onclick="tracker.showCompletionModal('${vax.id}')">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                    ` : '<span class="badge-completed"><i class="fas fa-check"></i> Completed</span>'}
                </td>
            </tr>
        `).join('');

        this.renderTimeline(vaccinations);
        this.showAlerts();
    }

    renderTimeline(vaccinations) {
        const timeline = document.getElementById('timeline');

        timeline.innerHTML = vaccinations.map(vax => `
            <div class="timeline-item">
                <div class="timeline-marker ${vax.status}">
                    ${vax.status === 'completed' ? '<i class="fas fa-check"></i>' :
                      vax.status === 'pending' ? '<i class="fas fa-clock"></i>' :
                      '<i class="fas fa-exclamation"></i>'}
                </div>
                <div class="timeline-content">
                    <h4>${vax.vaccineName}</h4>
                    <p>Dose ${vax.doseNumber || 'N/A'}</p>
                    <p>Scheduled: ${new Date(vax.scheduledDate).toLocaleDateString('en-IN')}</p>
                    ${vax.completedDate ? `<p style="color: #4caf50;"><strong>Completed: ${new Date(vax.completedDate).toLocaleDateString('en-IN')}</strong></p>` : ''}
                    <div class="timeline-meta">
                        <span class="timeline-status">${vax.status}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showAlerts() {
        const container = document.getElementById('alertsContainer');
        container.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        // Upcoming alerts
        const upcoming = this.allVaccinations.filter(vax => {
            const scheduled = new Date(vax.scheduledDate);
            scheduled.setHours(0, 0, 0, 0);
            return scheduled >= today && scheduled <= nextWeek && vax.status !== 'completed';
        });

        if (upcoming.length > 0) {
            container.innerHTML += `
                <div class="alert alert-info">
                    <div class="alert-icon"><i class="fas fa-bell"></i></div>
                    <div class="alert-content">
                        <h3>Upcoming Vaccinations</h3>
                        <p>${upcoming.length} vaccination${upcoming.length > 1 ? 's' : ''} due in the next 7 days</p>
                    </div>
                </div>
            `;
        }

        // Overdue alerts
        const overdue = this.allVaccinations.filter(vax => {
            const scheduled = new Date(vax.scheduledDate);
            scheduled.setHours(0, 0, 0, 0);
            return scheduled < today && vax.status !== 'completed';
        });

        if (overdue.length > 0) {
            container.innerHTML += `
                <div class="alert alert-danger">
                    <div class="alert-icon"><i class="fas fa-exclamation-circle"></i></div>
                    <div class="alert-content">
                        <h3>Overdue Vaccinations</h3>
                        <p>${overdue.length} vaccination${overdue.length > 1 ? 's' : ''} ${overdue.length > 1 ? 'are' : 'is'} overdue</p>
                    </div>
                </div>
            `;
        }
    }

    loadStatistics() {
        const total = this.allVaccinations.length;
        const completed = this.allVaccinations.filter(v => v.status === 'completed').length;
        const pending = this.allVaccinations.filter(v => v.status === 'pending').length;
        const overdue = this.allVaccinations.filter(v => v.status === 'overdue').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalVaccines').textContent = total;
        document.getElementById('completedVaccines').textContent = completed;
        document.getElementById('pendingVaccines').textContent = pending;
        document.getElementById('overdueVaccines').textContent = overdue;

        document.getElementById('progressText').textContent = `${completed}/${total} (${progress}%)`;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    getStatusBadge(status) {
        return `<span class="status-badge badge-${status}">
            ${status === 'completed' ? '<i class="fas fa-check-circle"></i>' :
              status === 'pending' ? '<i class="fas fa-clock"></i>' :
              '<i class="fas fa-exclamation-circle"></i>'}
            ${status}
        </span>`;
    }

    getVaccineInfo(vaccineName) {
        const info = {
            'BCG': 'Bacillus Calmette-Guérin vaccine protects against tuberculosis',
            'Hepatitis B': 'Protects against Hepatitis B virus infection',
            'OPV': 'Oral Polio Vaccine protects against poliomyelitis',
            'IPV': 'Inactivated Polio Vaccine provides additional polio protection',
            'DTP': 'Diphtheria, Tetanus, Pertussis vaccine protects against three diseases',
            'Hib': 'Haemophilus influenzae type b vaccine prevents bacterial infections',
            'Rotavirus': 'Protects against severe rotavirus diarrhea',
            'PCV': 'Pneumococcal Conjugate Vaccine prevents pneumococcal diseases',
            'MMR': 'Measles, Mumps, Rubella vaccine protects against three viral diseases',
            'JE': 'Japanese Encephalitis vaccine prevents viral brain infection',
        };
        return info[vaccineName] || 'Standard vaccination as per national immunization schedule';
    }

    showCompletionModal(vaxId) {
        const vax = this.allVaccinations.find(v => v.id == vaxId);
        if (!vax) return;

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('completionDate').value = today;
        document.getElementById('completionDate').max = today;
        document.getElementById('saveCompletionBtn').dataset.vaxId = vaxId;

        document.getElementById('completionModal').style.display = 'flex';
        document.getElementById('modalBackdrop').style.display = 'block';
    }

    saveCompletion(vaxId) {
        const completionDate = document.getElementById('completionDate').value;
        if (!completionDate) {
            this.showToast('Please select a date', 'error');
            return;
        }

        const vaxIndex = this.allVaccinations.findIndex(v => v.id == document.getElementById('saveCompletionBtn').dataset.vaxId);
        if (vaxIndex !== -1) {
            this.allVaccinations[vaxIndex].status = 'completed';
            this.allVaccinations[vaxIndex].completedDate = completionDate;

            // Save to localStorage
            let vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
            const index = vaccinations.findIndex(v => v.id == this.allVaccinations[vaxIndex].id);
            if (index !== -1) {
                vaccinations[index] = this.allVaccinations[vaxIndex];
            }
            localStorage.setItem('vaccinations', JSON.stringify(vaccinations));

            this.closeCompletionModal();
            this.filterVaccinations();
            this.loadStatistics();
            this.showToast('Vaccination marked as completed', 'success');
        }
    }

    closeCompletionModal() {
        document.getElementById('completionModal').style.display = 'none';
        document.getElementById('modalBackdrop').style.display = 'none';
    }

    exportToCSV() {
        if (this.allVaccinations.length === 0) {
            this.showToast('No vaccinations to export', 'warning');
            return;
        }

        let csv = 'Vaccine Name,Dose,Scheduled Date,Status,Completed Date\n';

        this.allVaccinations.forEach(vax => {
            csv += `"${vax.vaccineName}",${vax.doseNumber || '-'},${vax.scheduledDate},${vax.status},"${vax.completedDate || '-'}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vaccinations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Vaccination data exported successfully', 'success');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        container.appendChild(toast);

        setTimeout(() => toast.remove(), 4000);
    }

    resetInterface() {
        document.getElementById('filterContainer').style.display = 'none';
        document.getElementById('vaccinationsContainer').style.display = 'none';
        document.getElementById('statsContainer').style.display = 'none';
        document.getElementById('timelineContainer').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('alertsContainer').innerHTML = '';
    }
}

// Initialize tracker
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new VaccinationTracker();
});

// Modal functions
function closeCompletionModal() {
    tracker.closeCompletionModal();
}

function saveCompletion() {
    tracker.saveCompletion();
}

// Logout
function logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('children');
    localStorage.removeItem('vaccinations');
    window.location.href = '/enhanced-cvms/index.html';
}
