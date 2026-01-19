import {
  HomeIcon,
  ChartBarIcon,
  BeakerIcon,
  LightBulbIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BanknotesIcon,
  HeartIcon,
} from '@heroicons/react/24/solid'; // Using solid icons for visual distinction

interface CaseStudyIconProps {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HomeIcon,        // Moving to Opportunity (housing)
  ChartBarIcon,    // FCC Spectrum (data/economics)
  BeakerIcon,      // Needle Exchange (health/science)
  LightBulbIcon,   // Behavioral Nudges (ideas)
  GlobeAltIcon,    // Emissions Trading (environment/global)
  AcademicCapIcon, // Growth Mindset (education)
  BanknotesIcon,   // AMC Vaccines (finance/investment)
  HeartIcon,       // DICE Modeling (care/impact)
};

export default function CaseStudyIcon({ iconName, className = "w-6 h-6" }: CaseStudyIconProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }

  return <IconComponent className={className} aria-hidden="true" />;
}
