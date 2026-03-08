import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const VaccinationHistoryTimeline = ({ childId }) => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      fetchVaccinations();
    }
  }, [childId]);

  const fetchVaccinations = async () => {
    try {
      const records = await pb.collection('vaccinations').getFullList({
        filter: `childId = "${childId}"`,
        sort: 'scheduledDate',
        $autoCancel: false
      });
      setVaccinations(records);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      case 'pending':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'overdue':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (vaccinations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No vaccination records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vaccinations.map((vax, index) => (
        <div key={vax.id} className="flex items-start space-x-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(vax.status)}`}>
              {getStatusIcon(vax.status)}
            </div>
            {index < vaccinations.length - 1 && (
              <div className="w-0.5 h-16 bg-border mt-2"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{vax.vaccineName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Dose {vax.doseNumber || 'N/A'} • Scheduled: {new Date(vax.scheduledDate).toLocaleDateString('en-IN')}
                  </p>
                  {vax.completedDate && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Completed: {new Date(vax.completedDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    vax.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    vax.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {vax.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VaccinationHistoryTimeline;