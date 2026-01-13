
export type Category = '전체' | '채널' | '대고객' | '보험금' | '경영지원';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  provider: string;
  userCount: string;
  isPinned?: boolean;
}

export interface CategoryTab {
  id: Category;
  label: string;
}
