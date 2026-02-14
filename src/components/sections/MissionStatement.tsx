import React from 'react';

interface MissionStatementProps {
  title?: string;
  paragraphs: string[];
}

export const MissionStatement: React.FC<MissionStatementProps> = ({
  title,
  paragraphs,
}) => {
  return (
    <section className="bg-bg-canvas py-12">
      <div className="max-w-[720px] mx-auto px-6">
        {title && (
          <h2 className="text-h3 font-heading font-medium text-text-primary mb-6 text-center">
            {title}
          </h2>
        )}
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-md text-text-secondary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};