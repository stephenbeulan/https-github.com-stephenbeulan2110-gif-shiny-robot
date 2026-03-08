import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';

const CertificatePage = () => {
  return (
    <>
      <Helmet>
        <title>Certificates - VaxTracker</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Vaccination Certificates</h1>
          <p className="text-muted-foreground">Generate and download certificates</p>
        </div>
      </div>
    </>
  );
};

export default CertificatePage;