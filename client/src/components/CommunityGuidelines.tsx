import React from 'react';

interface CommunityGuidelinesProps {
  onAgree?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

const CommunityGuidelines: React.FC<CommunityGuidelinesProps> = ({
  onAgree,
  onDecline,
  showActions = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">
        The Village Community Guidelines
      </h2>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-4 mb-6">
        <p className="font-medium text-gray-900">
          Our community is built on mutual aid principles and values. By joining, you agree to:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Solidarity, Not Charity</h3>
            <p>
              We support each other as equals. Help is given and received with dignity and respect,
              recognizing that we all have needs and gifts to share.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Everyone Has Something to Contribute</h3>
            <p>
              Every member brings value to our community. Skills, time, knowledge, and care are all
              valuable contributions. No one is just a recipient or just a giver.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Meet Real Needs</h3>
            <p>
              We focus on addressing genuine needs in our community through direct action and support,
              rather than relying on institutions or bureaucracy.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">4. Build Relationships</h3>
            <p>
              Mutual aid is about building connections and trust within our community. We prioritize
              long-term relationships over one-time transactions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">5. Collective Care & Action</h3>
            <p>
              We believe in collective responsibility for our wellbeing. When one of us struggles,
              we all struggle. When one of us thrives, we all benefit.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">6. Respect & Privacy</h3>
            <p>
              We respect each other's privacy, boundaries, and diverse experiences. What's shared in
              the community stays in the community unless permission is given.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">7. Anti-Discrimination</h3>
            <p>
              We do not tolerate discrimination, harassment, or hate speech of any kind. Our community
              welcomes all people regardless of race, ethnicity, religion, gender identity, sexual
              orientation, ability, or socioeconomic status.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">8. Safety First</h3>
            <p>
              We prioritize the safety and wellbeing of all members, especially children. Report any
              concerning behavior to community moderators immediately.
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
          <p className="text-sm font-medium text-purple-900">
            By agreeing to these guidelines, you commit to creating a supportive, caring community
            where we lift each other up and work together for the collective good.
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={onAgree}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            I Agree to These Guidelines
          </button>
          {onDecline && (
            <button
              onClick={onDecline}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityGuidelines;
