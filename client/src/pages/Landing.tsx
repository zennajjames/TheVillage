import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-purple-600">The Village</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Sign Up
            </button>
          </div>
        </nav>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            It Takes a Village
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            A community platform where parents and caregivers support each other through mutual aid, 
            shared resources, and genuine connections.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition font-semibold text-lg shadow-lg"
          >
            Join Your Village Today
          </button>
        </div>

        {/* What is Mutual Aid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What is Mutual Aid?
          </h3>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-4">
              Mutual aid is a form of solidarity-based support where community members come together 
              to meet each other's needs, without charity or hierarchy. It's neighbors helping neighbors, 
              based on the understanding that we all do better when we all do better.
            </p>
            <p className="text-lg mb-6">
              Unlike traditional charity, mutual aid is:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">🤝 Reciprocal</h4>
                <p>Everyone both gives and receives. We all have something to offer and something we need.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">🌟 Non-hierarchical</h4>
                <p>No one is above or below anyone else. We support each other as equals.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">💪 Solidarity-based</h4>
                <p>We support each other because we're all in this together, not out of pity.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">🏘️ Community-driven</h4>
                <p>Solutions come from the community itself, not from outside "experts."</p>
              </div>
            </div>
            <p className="text-lg">
              In The Village, mutual aid looks like trading babysitting hours, sharing meals when someone's 
              overwhelmed, lending equipment, offering rides, and supporting each other through the daily 
              challenges of raising families and building community.
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Community Guidelines
          </h3>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Our community is built on shared values that create a safe, supportive space for all members.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🫶 Lead with Compassion</h4>
              <p className="text-gray-700">
                Assume the best intentions. We're all doing our best with the resources and knowledge we have. 
                Respond to others with kindness and understanding, especially during disagreements.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🌈 Celebrate Diversity</h4>
              <p className="text-gray-700">
                Our community includes families of all configurations, backgrounds, and beliefs. Respect 
                different parenting styles, cultural practices, and life choices. Discrimination, hate speech, 
                and exclusionary behavior have no place here.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🔒 Respect Privacy</h4>
              <p className="text-gray-700">
                What's shared in The Village stays in The Village. Don't share others' personal information, 
                photos of their children, or private conversations without explicit permission. Respect 
                boundaries and consent always.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">💬 Communicate Clearly</h4>
              <p className="text-gray-700">
                Be honest and direct in your requests and offers. If you commit to helping someone, follow 
                through. If circumstances change, communicate that promptly. Clear communication builds trust.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🚫 No Commercial Promotion</h4>
              <p className="text-gray-700">
                This is a space for genuine community support, not sales. Don't promote MLMs, sell products, 
                or solicit for business. Sharing recommendations when asked is fine; unsolicited promotion is not.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">⚖️ Give What You Can, Take What You Need</h4>
              <p className="text-gray-700">
                We all have different capacities at different times. Sometimes you'll be the one offering 
                support; other times you'll need it. Both are equally valuable. Don't keep score—trust that 
                the community balances over time.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🛡️ Keep Kids Safe</h4>
              <p className="text-gray-700">
                Children's safety is paramount. Never share identifying information about minors without 
                parental consent. If arranging childcare or activities, ensure appropriate safety measures 
                and communication with parents.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🗣️ Speak Up, Step Up</h4>
              <p className="text-gray-700">
                If you see behavior that violates these guidelines or makes someone uncomfortable, say 
                something. Use the report feature or contact moderators. We're all responsible for maintaining 
                a healthy community culture.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🌱 Assume Growth, Not Perfection</h4>
              <p className="text-gray-700">
                We all make mistakes and have room to learn. When someone missteps, approach them with grace. 
                When you misstep, be open to feedback. Our goal is growth and understanding, not punishment.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-50 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2">💜 Remember:</h4>
            <p className="text-gray-700">
              This platform is a tool for building real, meaningful community connections. The magic happens 
              when we show up for each other authentically, vulnerably, and consistently. Your village is 
              waiting—be the neighbor you'd want to have.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            How The Village Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Create Your Profile</h4>
              <p className="text-gray-600">
                Share a bit about yourself and your family. Connect with neighbors in your area.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Request or Offer Help</h4>
              <p className="text-gray-600">
                Post what you need or what you can offer. Join groups based on your interests and neighborhood.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Build Your Village</h4>
              <p className="text-gray-600">
                Connect, support each other, and create the community you want to live in.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Start building meaningful connections in your community today.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition font-semibold text-lg shadow-lg"
          >
            Sign Up Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 The Village. Built with 💜 for community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;