import React from 'react';

export interface navigationState {
  name?: string;
  hi_name?: string;
  component?: () => React.JSX.Element;
  tabBarLabelStyle?: { display: string };
  tabBarLabelStyleActive?: { color: string; fontSize: number };
  tabBarIconName?: string;
  tabBarIconStyle?: { color: string; fontSize: number };
  tabBarIconStyleActive?: { color: string; fontSize: number };
  headerLeft?: () => JSX.Element;
  headerRight?: () => JSX.Element;
  // active?: boolean;
  tabBarLabel?: string;
}
