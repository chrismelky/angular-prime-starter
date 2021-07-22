export interface NavigationItem {
  id?: string;
  title: string;
  subTitle?: string;
  iconName?: string;
  route: string;
  children?: NavigationSubItem[];
  authorities?: string[];
}

export interface NavigationSubItem {
  id?: string;
  title: string;
  subTitle?: string;
  iconName?: string;
  route: string;
  authorities?: string[];
  children?: NavigationSubItem[];
}
