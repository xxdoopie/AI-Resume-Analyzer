import React from 'react'

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let badgeStyles = '';
    let textStyles = '';
    let label = '';

    if (score > 69) {
        badgeStyles = 'bg-badge-green';
        textStyles = 'text-badge-green-text';
        label = 'Strong';
    } else if (score > 49) {
        badgeStyles = 'bg-badge-yellow';
        textStyles = 'text-badge-yellow-text';
        label = 'Good Start';
    } else {
        badgeStyles = 'bg-badge-red';
        textStyles = 'text-badge-red-text';
        label = 'Needs Work';
    }

    return (
        <div className={`score-badge ${badgeStyles}`}>
            <p className={`font-semibold text-sm ${textStyles}`}>{label}</p>
        </div>
    )
}

export default ScoreBadge