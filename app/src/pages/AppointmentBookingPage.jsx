import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';

const AppointmentBookingPage = () => {
  return (
    <>
      <Helmet>
        <title>Appointments - VaxTracker</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Appointment Booking</h1>
          <p className="text-muted-foreground">Schedule vaccination appointments</p>
        </div>
      </div>
    </>
  );
};

export default AppointmentBookingPage;