import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, Clock, AlertCircle, Calendar, Search, Filter, Download, Info, Bell, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import Header from '@/components/Header.jsx';
import VaccinationHistoryTimeline from '@/components/VaccinationHistoryTimeline.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useToast } from '@/hooks/use-toast.js';
import { useLocation } from 'react-router-dom';

const VaccinationTrackingPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(null);
  const [completionDate, setCompletionDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const childParam = params.get('child');
    if (childParam && children.length > 0) {
      setSelectedChildId(childParam);
    }
  }, [location.search, children]);

  useEffect(() => {
    if (selectedChildId) {
      fetchVaccinations();
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const currentUser = pb.authStore.model;
      const records = await pb.collection('children').getFullList({
        filter: `parentId = "${currentUser.id}"`,
        sort: 'name',
        $autoCancel: false
      });
      setChildren(records);
      if (records.length > 0 && !selectedChildId) {
        setSelectedChildId(records[0].id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: 'Error',
        description: 'Failed to load children',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const records = await pb.collection('vaccinations').getFullList({
        filter: `childId = "${selectedChildId}"`,
        sort: 'scheduledDate',
        $autoCancel: false
      });
      setVaccinations(records);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vaccinations',
        variant: 'destructive'
      });
    }
  };

  const handleMarkComplete = async (vaccinationId) => {
    if (!completionDate) {
      toast({
        title: 'Error',
        description: 'Please select a completion date',
        variant: 'destructive'
      });
      return;
    }

    try {
      await pb.collection('vaccinations').update(
        vaccinationId,
        {
          status: 'completed',
          completedDate: completionDate
        },
        { $autoCancel: false }
      );

      toast({
        title: 'Success',
        description: 'Vaccination marked as completed'
      });

      setMarkingComplete(null);
      setCompletionDate('');
      fetchVaccinations();
    } catch (error) {
      console.error('Error updating vaccination:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vaccination',
        variant: 'destructive'
      });
    }
  };

  const exportVaccinations = () => {
    if (!selectedChild) return;

    const csvContent = [
      ['Vaccine Name', 'Dose', 'Scheduled Date', 'Status', 'Completed Date', 'Notes'],
      ...filteredVaccinations.map(vax => [
        vax.vaccineName,
        vax.doseNumber || '-',
        new Date(vax.scheduledDate).toLocaleDateString('en-IN'),
        vax.status,
        vax.completedDate ? new Date(vax.completedDate).toLocaleDateString('en-IN') : '-',
        vax.notes || '-'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedChild.name}_vaccinations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Success',
      description: 'Vaccination data exported successfully'
    });
  };

  const getVaccineInfo = (vaccineName) => {
    const vaccineInfo = {
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
      'DTP Booster': 'Booster dose for Diphtheria, Tetanus, Pertussis',
      'OPV Booster': 'Booster dose for Oral Polio Vaccine',
      'Vitamin A': 'Essential nutrient supplement for immune system support'
    };
    return vaccineInfo[vaccineName] || 'Standard vaccination as per national immunization schedule';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      pending: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: Clock },
      overdue: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const getRowColor = (status) => {
    const colors = {
      completed: 'bg-green-50 dark:bg-green-950/20',
      pending: 'bg-orange-50 dark:bg-orange-950/20',
      overdue: 'bg-red-50 dark:bg-red-950/20'
    };
    return colors[status] || '';
  };

  const calculateProgress = () => {
    if (vaccinations.length === 0) return 0;
    const completed = vaccinations.filter(v => v.status === 'completed').length;
    return Math.round((completed / vaccinations.length) * 100);
  };

  const filteredVaccinations = useMemo(() => {
    let filtered = vaccinations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vax =>
        vax.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vax.doseNumber && vax.doseNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vax => vax.status === statusFilter);
    }

    // Upcoming only filter
    if (showUpcomingOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(vax => {
        const scheduledDate = new Date(vax.scheduledDate);
        scheduledDate.setHours(0, 0, 0, 0);
        return scheduledDate >= today && vax.status !== 'completed';
      });
    }

    return filtered;
  }, [vaccinations, searchTerm, statusFilter, showUpcomingOnly]);

  const upcomingVaccinations = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return vaccinations.filter(vax => {
      const scheduledDate = new Date(vax.scheduledDate);
      return scheduledDate >= today && scheduledDate <= nextWeek && vax.status !== 'completed';
    });
  }, [vaccinations]);

  const overdueVaccinations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return vaccinations.filter(vax => {
      const scheduledDate = new Date(vax.scheduledDate);
      scheduledDate.setHours(0, 0, 0, 0);
      return scheduledDate < today && vax.status !== 'completed';
    });
  }, [vaccinations]);

  const selectedChild = children.find(c => c.id === selectedChildId);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vaccinations...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Vaccination Tracking - VaxTracker</title>
        <meta name="description" content="Track and manage your child's vaccination schedule" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Vaccination Tracking</h1>
            <p className="text-muted-foreground">Monitor and update vaccination records</p>
          </div>

          {children.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Calendar className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Children Found</h2>
              <p className="text-muted-foreground">
                Please add a child first to track vaccinations
              </p>
            </div>
          ) : (
            <>
              {/* Alerts Section */}
              {selectedChildId && (upcomingVaccinations.length > 0 || overdueVaccinations.length > 0) && (
                <div className="mb-8 space-y-4">
                  {upcomingVaccinations.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Upcoming Vaccinations</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {upcomingVaccinations.length} vaccination{upcomingVaccinations.length > 1 ? 's' : ''} due in the next 7 days
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {overdueVaccinations.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-900 dark:text-red-100">Overdue Vaccinations</h3>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {overdueVaccinations.length} vaccination{overdueVaccinations.length > 1 ? 's' : ''} {overdueVaccinations.length > 1 ? 'are' : 'is'} overdue
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <Label htmlFor="childSelect" className="text-lg font-semibold mb-3 block">
                  Select Child
                </Label>
                <select
                  id="childSelect"
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full md:w-96 px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {new Date(child.dateOfBirth).toLocaleDateString('en-IN')}
                    </option>
                  ))}
                </select>

                {selectedChild && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                      <span className="text-sm font-bold text-foreground">
                        {vaccinations.filter(v => v.status === 'completed').length}/{vaccinations.length} ({calculateProgress()}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {selectedChildId && (
                <>
                  {/* Search and Filter Controls */}
                  <div className="bg-card border border-border rounded-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search vaccines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </select>

                          <Button
                            variant={showUpcomingOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Upcoming
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={exportVaccinations}
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-lg font-semibold text-foreground">
                        Vaccination Records ({filteredVaccinations.length})
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vaccine Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dose</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Scheduled Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Completed Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredVaccinations.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                                {searchTerm || statusFilter !== 'all' || showUpcomingOnly ? 'No vaccinations match your filters' : 'No vaccinations found'}
                              </td>
                            </tr>
                          ) : (
                            filteredVaccinations.map((vax) => (
                              <tr key={vax.id} className={`hover:bg-muted/50 transition-colors ${getRowColor(vax.status)}`}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-foreground">{vax.vaccineName}</span>
                                    <div className="group relative">
                                      <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        {getVaccineInfo(vax.vaccineName)}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{vax.doseNumber || '-'}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                  {new Date(vax.scheduledDate).toLocaleDateString('en-IN')}
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(vax.status)}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                  {vax.completedDate ? new Date(vax.completedDate).toLocaleDateString('en-IN') : '-'}
                                </td>
                                <td className="px-6 py-4">
                                  {vax.status !== 'completed' && (
                                    markingComplete === vax.id ? (
                                      <div className="flex items-center space-x-2">
                                        <Input
                                          type="date"
                                          value={completionDate}
                                          onChange={(e) => setCompletionDate(e.target.value)}
                                          max={new Date().toISOString().split('T')[0]}
                                          className="w-40"
                                        />
                                        <Button size="sm" onClick={() => handleMarkComplete(vax.id)}>
                                          Save
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setMarkingComplete(null)}>
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setMarkingComplete(vax.id);
                                          setCompletionDate(new Date().toISOString().split('T')[0]);
                                        }}
                                      >
                                        Mark Complete
                                      </Button>
                                    )
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Vaccination Timeline</h2>
                    <VaccinationHistoryTimeline childId={selectedChildId} />
                  </div>
                </>
              )}

              {/* Statistics Section */}
              {selectedChildId && vaccinations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Vaccines</p>
                        <p className="text-3xl font-bold text-foreground">{vaccinations.length}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{vaccinations.filter(v => v.status === 'completed').length}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-orange-600">{vaccinations.filter(v => v.status === 'pending').length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                        <p className="text-3xl font-bold text-red-600">{overdueVaccinations.length}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              {selectedChildId && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Vaccination Timeline</h2>
                  <VaccinationHistoryTimeline childId={selectedChildId} />
                </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VaccinationTrackingPage;