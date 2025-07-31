'use client';

import { 
  CheckCircleIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: CheckCircleIcon,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease. Set priorities, due dates, and never miss a deadline.'
    },
    {
      icon: CalendarIcon,
      title: 'Calendar Integration',
      description: 'View your tasks and events in a beautiful calendar interface. Plan your days, weeks, and months effectively.'
    },
    {
      icon: EnvelopeIcon,
      title: 'Gmail-like Messages',
      description: 'Send and receive messages with a familiar Gmail interface. Organize conversations and stay connected.'
    },
    {
      icon: UserGroupIcon,
      title: 'Personal Profiles',
      description: 'Create your own profile with custom preferences. Your data is private and secure to your account.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely. Only you have access to your personal information.'
    },
    {
      icon: SparklesIcon,
      title: 'Beautiful Interface',
      description: 'Enjoy a clean, modern interface designed for productivity. Customizable themes and preferences.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">TaskSaver</h1>
            </div>
            <button
              onClick={onGetStarted}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Organize Your Life with
            <span className="text-primary-600"> TaskSaver</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate productivity platform that combines task management, calendar planning, 
            and messaging in one beautiful, secure application. Create your profile and start 
            organizing your life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4"
            >
              Create Your Profile - It's Free!
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Organized
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TaskSaver provides all the tools you need to manage your tasks, events, and communications 
              in one secure, personalized platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Organized?
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TaskSaver. 
            Creating your profile takes less than a minute!
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Create Your Profile Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">TaskSaver</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2024 TaskSaver. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}