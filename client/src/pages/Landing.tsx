import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/layout/LanguageSelector';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-community">
      {/* Modern Sticky Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img
                src="/villageLogo.png"
                alt="The Village Logo"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-neutral-800">
                {t('common.appName')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <button
                onClick={() => navigate('/login')}
                className="text-neutral-700 hover:text-brand-red font-medium transition px-4 py-2 rounded-lg hover:bg-brand-red/10"
              >
                {t('common.login')}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary hover:shadow-lg hover:scale-105"
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-brand-red">
              {t('landing.heroLine1')}
            </span>
            <br />
            <span className="text-neutral-800">{t('landing.heroLine2')}</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.description')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-4 text-lg hover:shadow-2xl hover:scale-105"
            >
              {t('landing.findYourCommunity')}
            </button>
            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary px-8 py-4 text-lg hover:shadow-lg"
            >
              {t('landing.learnMore')}
            </button>
          </div>
        </div>

        {/* Bento Grid - Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-16">
          {/* Large Feature - School Groups */}
          <div className="md:col-span-4 md:row-span-2 bg-brand-red rounded-3xl p-8 md:p-10 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">🏘️</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.organizedByCommunity')}</h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed max-w-2xl">
                {t('landing.organizedByCommunityDesc')}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">{t('landing.byNeighborhood')}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">{t('landing.bySchool')}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">{t('landing.byInterest')}</span>
              </div>
              <p className="text-white/80 text-sm max-w-xl">
                {t('landing.organizedByCommunityDetail')}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all group">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">{t('landing.directMessages')}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              {t('landing.directMessagesDesc')}
            </p>
            <div className="flex items-center gap-2 text-brand-red text-sm font-medium group-hover:gap-3 transition-all">
              {t('landing.connect')} <span>→</span>
            </div>
          </div>

          {/* Classroom Groups */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all group">
            <div className="text-4xl mb-3">👨‍🏫</div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">{t('landing.classroomGroups')}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              {t('landing.classroomGroupsDesc')}
            </p>
            <div className="flex items-center gap-2 text-brand-red text-sm font-medium group-hover:gap-3 transition-all">
              {t('landing.joinClass')} <span>→</span>
            </div>
          </div>

          {/* Requests & Offers */}
          <div className="md:col-span-3 bg-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">🤝</div>
              <h3 className="text-2xl font-bold mb-3">{t('landing.mutualAidPosts')}</h3>
              <p className="text-green-50 mb-4 leading-relaxed">
                {t('landing.mutualAidPostsDesc')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-3xl mb-1">🙋</div>
                  <div className="text-sm font-semibold">{t('landing.needHelp')}</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-3xl mb-1">👋</div>
                  <div className="text-sm font-semibold">{t('landing.canHelp')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('landing.safeAndPrivate')}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('landing.safeAndPrivateDesc')}
            </p>
          </div>

          {/* Hyperlocal */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('landing.hyperlocal')}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('landing.hyperlocalDesc')}
            </p>
          </div>

          {/* Free Always */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('landing.alwaysFree')}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('landing.alwaysFreeDesc')}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {t('landing.howItWorks')}
            </h2>
            <p className="text-xl text-neutral-600">
              {t('landing.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-brand-red w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold mb-4 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t('landing.step1Title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('landing.step1Desc')}
              </p>
            </div>

            <div className="relative group">
              <div className="bg-neutral-900 w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold mb-4 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t('landing.step2Title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('landing.step2Desc')}
              </p>
            </div>

            <div className="relative group">
              <div className="bg-brand-red w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold mb-4 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t('landing.step3Title')}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('landing.step3Desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 border border-neutral-100">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 text-center">
            {t('landing.perfectFor')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-brand-red/10 rounded-2xl border border-brand-red/20">
              <div className="text-3xl mb-3">🎒</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.roomParents')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.roomParentsDesc')}
              </p>
            </div>

            <div className="p-6 bg-neutral-100 rounded-2xl border border-gray-100">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.carpools')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.carpoolsDesc')}
              </p>
            </div>

            <div className="p-6 bg-neutral-100 rounded-2xl border border-green-100">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.classroomSupplies')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.classroomSuppliesDesc')}
              </p>
            </div>

            <div className="p-6 bg-neutral-100 rounded-2xl border border-yellow-100">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.events')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.eventsDesc')}
              </p>
            </div>

            <div className="p-6 bg-brand-red/10 rounded-2xl border border-red-100">
              <div className="text-3xl mb-3">👶</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.childcareSwaps')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.childcareSwapsDesc')}
              </p>
            </div>

            <div className="p-6 bg-neutral-100 rounded-2xl border border-gray-100">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.familySupport')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.familySupportDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 border border-neutral-100">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 text-center">
            {t('landing.mutualAidPrinciples')}
          </h2>
          <p className="text-lg text-neutral-600 mb-8 text-center max-w-3xl mx-auto">
            {t('landing.mutualAidPrinciplesDesc')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl mb-3">⚖️</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.equal')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.equalDesc')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-3">🔄</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.reciprocal')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.reciprocalDesc')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{t('landing.communityLed')}</h3>
              <p className="text-neutral-600 text-sm">
                {t('landing.communityLedDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-brand-red rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('landing.readyToFind')}
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t('landing.readyToFindDesc')}
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-brand-red px-10 py-4 rounded-xl hover:scale-105 transition-all font-bold text-lg shadow-2xl hover:shadow-xl"
            >
              {t('landing.getStartedNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-neutral-200 bg-white/50 backdrop-blur mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/VillageLogoGreyCircle.png"
                  alt="The Village Logo"
                  className="w-8 h-8"
                />
                <span className="font-bold text-brand-red">
                  {t('common.appName')}
                </span>
              </div>
              <p className="text-neutral-600 text-sm">
                {t('landing.footerTagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">{t('landing.platform')}</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><button onClick={() => navigate('/signup')} className="hover:text-brand-red">{t('landing.joinNow')}</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-brand-red">{t('common.login')}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">{t('landing.community')}</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-brand-red">{t('landing.guidelines')}</a></li>
                <li><a href="#" className="hover:text-brand-red">{t('landing.support')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">{t('landing.legal')}</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-brand-red">{t('landing.privacyLink')}</a></li>
                <li><a href="#" className="hover:text-brand-red">{t('landing.terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-8 text-center">
            <p className="text-neutral-600 text-sm">{t('landing.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
