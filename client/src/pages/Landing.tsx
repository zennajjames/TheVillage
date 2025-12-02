import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Modern Sticky Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏫</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                The Village
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-purple-600 font-medium transition px-4 py-2 rounded-lg hover:bg-purple-50"
              >
                {t('common.login')}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                {t('common.signup')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
            School Community Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Your School Community,
            </span>
            <br />
            <span className="text-gray-900">Connected</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A hyperlocal platform for school PTAs to organize, communicate, and support each other—built on mutual aid and genuine community connection.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-semibold text-lg"
            >
              Join Your School
            </button>
            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all font-semibold text-lg"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Bento Grid - Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-16">
          {/* Large Feature - School Groups */}
          <div className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Organized by School</h3>
              <p className="text-purple-50 text-lg mb-6 leading-relaxed max-w-2xl">
                Join your school's community. Connect with parents in your child's classroom, coordinate with teachers, and organize class-specific activities.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">By School</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">By Grade</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">By Teacher</span>
              </div>
              <p className="text-purple-100 text-sm max-w-xl">
                Each school has its own dedicated space with class-specific groups, making it easy to coordinate room parents, field trips, and classroom needs.
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Messages</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Chat with other parents, coordinate carpools, and organize playdates.
            </p>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium group-hover:gap-3 transition-all">
              Connect <span>→</span>
            </div>
          </div>

          {/* Classroom Groups */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-3">👨‍🏫</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Classroom Groups</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Join your child's class group to stay in the loop and coordinate support.
            </p>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium group-hover:gap-3 transition-all">
              Join class <span>→</span>
            </div>
          </div>

          {/* Requests & Offers */}
          <div className="md:col-span-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">🤝</div>
              <h3 className="text-2xl font-bold mb-3">Mutual Aid Posts</h3>
              <p className="text-green-50 mb-4 leading-relaxed">
                Request help or offer support within your school community.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-3xl mb-1">🙋</div>
                  <div className="text-sm font-semibold">Need Help</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-3xl mb-1">👋</div>
                  <div className="text-sm font-semibold">Can Help</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Safe & Private</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              School-verified members only. Your data stays private.
            </p>
          </div>

          {/* Hyperlocal */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hyperlocal</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connect with families at your exact school.
            </p>
          </div>

          {/* Free Always */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">💜</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Always Free</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No ads, no fees. Built for community, not profit.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to connect with your school community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Your School</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up and join your child's school community. Connect with other parents at your school.
              </p>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Classroom Groups</h3>
              <p className="text-gray-600 leading-relaxed">
                Find your child's teacher and grade. Join class-specific groups to coordinate and stay connected.
              </p>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Support Each Other</h3>
              <p className="text-gray-600 leading-relaxed">
                Share needs, offer help, and build the supportive school community your kids deserve.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Perfect For
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="text-3xl mb-3">🎒</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Room Parents</h3>
              <p className="text-gray-600 text-sm">
                Coordinate class events, organize volunteers, and keep parents informed about classroom needs.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Carpool Coordination</h3>
              <p className="text-gray-600 text-sm">
                Find families nearby to share pickup/dropoff duties and after-school activity transportation.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Classroom Supplies</h3>
              <p className="text-gray-600 text-sm">
                Share school supplies, textbooks, and materials. No family should have to choose between supplies and groceries.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Events & Field Trips</h3>
              <p className="text-gray-600 text-sm">
                Organize fundraisers, coordinate volunteers for field trips, and plan class parties together.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
              <div className="text-3xl mb-3">👶</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Childcare Swaps</h3>
              <p className="text-gray-600 text-sm">
                Trade babysitting hours with trusted families from your school. Support each other with after-school care.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Family Support</h3>
              <p className="text-gray-600 text-sm">
                Request help during tough times or offer support to families in need. Build genuine community bonds.
              </p>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Built on Mutual Aid Principles
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            This isn't charity—it's community. We support each other as equals, building the village our children need to thrive.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl mb-3">⚖️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Equal</h3>
              <p className="text-gray-600 text-sm">
                No hierarchy. We all give and receive. Both are valuable.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-3">🔄</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Reciprocal</h3>
              <p className="text-gray-600 text-sm">
                Support flows both ways. Everyone has something to offer.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Community-Led</h3>
              <p className="text-gray-600 text-sm">
                Built by parents, for parents. No corporate agenda.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Connect With Your School?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join your school community today. It's free, always.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-purple-600 px-10 py-4 rounded-xl hover:scale-105 transition-all font-bold text-lg shadow-2xl hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">🏫</span>
                </div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  The Village
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Connecting school communities through mutual aid.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate('/signup')} className="hover:text-purple-600">Join Now</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-purple-600">Log In</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Guidelines</a></li>
                <li><a href="#" className="hover:text-purple-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2024 The Village. Built with 💜 for school communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
