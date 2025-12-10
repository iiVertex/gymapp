declare module 'lucide-react-native' {
  import { SvgProps } from 'react-native-svg';
  import { ComponentType } from 'react';
  
  export interface IconProps extends SvgProps {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }
  
  export type Icon = ComponentType<IconProps>;
  
  export const Play: Icon;
  export const ChevronRight: Icon;
  export const Activity: Icon;
  export const Plus: Icon;
  export const Search: Icon;
  export const ArrowLeft: Icon;
  export const Calendar: Icon;
  export const User: Icon;
  export const Home: Icon;
  export const History: Icon;
  export const Dumbbell: Icon;
  export const Clock: Icon;
  export const Check: Icon;
  export const Copy: Icon;
  export const X: Icon;
  export const Trash2: Icon;
  export const MoreVertical: Icon;
  export const MoreHorizontal: Icon;
  export const Settings: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
  export const Edit2: Icon;
  export const Save: Icon;
  export const RotateCcw: Icon;
  export const GripVertical: Icon;
  export const BarChart: Icon;
  export const TrendingUp: Icon;
  export const Trophy: Icon;
  export const LogOut: Icon;
  export const Bell: Icon;
  export const Moon: Icon;
  export const Shield: Icon;
  export const Download: Icon;
}
