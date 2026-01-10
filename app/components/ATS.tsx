import React from 'react'

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
    // Determine gradient background based on score
    let gradientClass = '';
    let iconSrc = '';
    let scoreLabel = '';
    let scoreDescription = '';

    if (score > 69) {
        gradientClass = 'bg-gradient-to-b from-green-100 to-white';
        iconSrc = '/icons/ats-good.svg';
        scoreLabel = 'Excellent ATS Compatibility';
        scoreDescription = 'Your resume is well-optimized for Applicant Tracking Systems. It follows best practices and should pass through most ATS filters successfully.';
    } else if (score > 49) {
        gradientClass = 'bg-gradient-to-b from-yellow-100 to-white';
        iconSrc = '/icons/ats-warning.svg';
        scoreLabel = 'Good ATS Compatibility';
        scoreDescription = 'Your resume has good ATS compatibility but could be improved. Consider implementing the suggestions below to enhance your chances.';
    } else {
        gradientClass = 'bg-gradient-to-b from-red-100 to-white';
        iconSrc = '/icons/ats-bad.svg';
        scoreLabel = 'Needs ATS Improvement';
        scoreDescription = 'Your resume may face challenges with Applicant Tracking Systems. Please review and implement the suggestions below to improve your ATS score.';
    }

    return (
        <div className={`flex flex-col gap-6 p-6 rounded-2xl ${gradientClass} shadow-sm`}>
            {/* Top Section with Icon and Title */}
            <div className="flex flex-row items-center gap-4">
                <img src={iconSrc} alt="ATS Status" className="w-12 h-12" />
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold text-gray-900">{scoreLabel}</h3>
                    <p className="text-sm font-semibold text-gray-600">ATS Score: {score}/100</p>
                </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold text-gray-800">What This Means</h4>
                <p className="text-gray-600 leading-relaxed">{scoreDescription}</p>
            </div>

            {/* Suggestions List */}
            {suggestions && suggestions.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h4 className="text-lg font-semibold text-gray-800">Recommendations</h4>
                    <ul className="flex flex-col gap-3">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex flex-row items-start gap-3">
                                <img
                                    src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
                                    alt={suggestion.type}
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                />
                                <p className="text-gray-700 leading-relaxed">{suggestion.tip}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Closing Encouragement */}
            <div className="mt-2 p-4 bg-white/50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 text-center font-medium">
                    💪 Keep refining your resume to maximize your chances of landing your dream job!
                </p>
            </div>
        </div>
    )
}

export default ATS