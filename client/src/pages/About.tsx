import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🏘️</div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-brand-red">
              {t('about.title')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {t('about.missionText1')}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about.missionText2')}
          </p>
        </div>

        {/* What is Mutual Aid */}
        <div className="bg-brand-red/10 rounded-3xl p-8 md:p-12 mb-8 border border-red-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.whyMutualAid')}</h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              {t('about.whyMutualAidText1')}
            </p>
            <p>
              {t('about.whyMutualAidText2')}
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold text-xl mb-2">{t('about.reciprocal')}</h3>
                <p className="text-gray-600">
                  {t('about.reciprocalDesc')}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="font-bold text-xl mb-2">{t('about.equal')}</h3>
                <p className="text-gray-600">
                  {t('about.equalDesc')}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="font-bold text-xl mb-2">{t('about.empowering')}</h3>
                <p className="text-gray-600">
                  {t('about.empoweringDesc')}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-bold text-xl mb-2">{t('about.sustainable')}</h3>
                <p className="text-gray-600">
                  {t('about.sustainableDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How We're Different */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.howDifferent')}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🏘️</span> {t('about.communityCentered')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.communityCenteredDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🗺️</span> {t('about.hyperlocal')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.hyperlocalDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔒</span> {t('about.privacyFirst')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.privacyFirstDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>❤️</span> {t('about.communityLed')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.communityLedDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>✨</span> {t('about.alwaysFree')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.alwaysFreeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.communityValues')}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="flex gap-4">
              <span className="text-2xl">🫶</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('about.leadCompassion')}</h3>
                <p>{t('about.leadCompassionDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🌈</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('about.celebrateDiversity')}</h3>
                <p>{t('about.celebrateDiversityDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('about.communicateClearly')}</h3>
                <p>{t('about.communicateClearlyDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🛡️</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('about.keepSafe')}</h3>
                <p>{t('about.keepSafeDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🤲</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('about.shareGenerously')}</h3>
                <p>{t('about.shareGenerouslyDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
