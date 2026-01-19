import {
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CalendarDaysIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

interface LessonIconProps {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CalendarDaysIcon,
  PuzzlePieceIcon,
};

export default function LessonIcon({ iconName, className = "w-6 h-6" }: LessonIconProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }

  return <IconComponent className={className} aria-hidden="true" />;
}
