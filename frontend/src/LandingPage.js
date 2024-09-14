import React from 'react';
import { Link } from 'react-router-dom';  
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-1 bg-gray-900 shadow">
        <div></div> {/* Empty div for alignment */}
        <div className='pt-6 pr-9'>
          {/* Use Link to navigate to Login and Register */}
          <Link to="/Login" className="text-white text-md font-semibold hover:text-gray-900 mr-4">Login</Link>
          <Link to="/Register" className="bg-blue-600 text-white font-semibold text-md py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Sign Up</Link>
        </div>
      </nav>

      {/* Logo Image */}
      <div className="flex justify-center items-center bg-gray-900">
        <img 
          src="./AI-logo.webp" 
          alt="Login Illustration" 
          className="h-30 w-60" 
        />
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center bg-gray-900 py-10">
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">Empower Your Learning Journey</h1>
        <p className="text-xl text-white mb-8">
          Personalized study plans, quizzes, and resources tailored to help you excel in your studies.
        </p>
        <Link to="/Register" className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300">
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Study Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Learning</h3>
              <p className="text-gray-600">
                Tailored study plans that adapt to your progress and help you achieve your goals efficiently.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Interactive Quizzes</h3>
              <p className="text-gray-600">
                Test your knowledge with engaging quizzes that provide instant feedback and explanations.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Track Your Progress</h3>
              <p className="text-gray-600">
                Visualize your learning journey with comprehensive progress tracking and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "Study Assistant has completely transformed how I prepare for exams. The personalized quizzes are a game-changer!"
              </p>
              <div className="text-gray-800 font-semibold">- Sarah Johnson, Student</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "The progress tracking feature keeps me motivated and focused. I love how easy it is to see my improvements."
              </p>
              <div className="text-gray-800 font-semibold">- Mark Wilson, Professional</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">
            Sign up today and take the first step towards mastering your studies.
          </p>
          <Link to="/Register" className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300">
            Join Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
