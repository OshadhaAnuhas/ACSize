import { NavigatorScreenParams } from '@react-navigation/native';
export type LibraryMode = 'browse' | 'select';
export type DetailsOrigin = 'library' | 'lab' | 'recommendation';
export type MainTabParamList = { Home: undefined; Library: { mode?: LibraryMode } | undefined; Saved: undefined };
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RoomSetup: { edit?: boolean } | undefined; Recommendation: undefined;
  RoomLab: { initialSelectedACId?: string } | undefined;
  LibrarySelect: undefined;
  ACDetails: { acId: string; origin: DetailsOrigin; mode?: LibraryMode };
};
