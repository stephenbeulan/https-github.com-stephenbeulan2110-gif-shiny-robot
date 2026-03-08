import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Syringe, Shield, Clock, FileText, CheckCircle, Users } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Syringe className="h-8 w-8" />,
      title: 'Complete Vaccination Tracking',
      description: 'Track all vaccinations as per Indian Universal Immunization Programme (UIP) schedule'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Your child\'s health data is encrypted and accessible only to you'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Smart Reminders',
      description: 'Get timely notifications for upcoming and overdue vaccinations'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Digital Certificates',
      description: 'Generate and download official vaccination certificates with QR codes'
    }
  ];

  return (
    <>
      <Helmet>
        <title>VaxTracker - Child Vaccination Management</title>
        <meta name="description" content="Track, Schedule & Manage Your Child's Vaccinations with Ease" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Syringe className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">VaxTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Child Vaccination
            <span className="text-primary block">Management App</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track, Schedule & Manage Your Child's Vaccinations with Ease
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Tracking Today
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Login to Account
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose VaxTracker?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to keep your child healthy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="bg-card border border-border rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of parents who trust VaxTracker for their child's vaccination management
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;