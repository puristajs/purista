import { getSidebarItems as getHandbookSidebarItems } from '../data/handbook';

export interface SidebarItem {
  title: string;
  id: string;
  order: number;
  href?: string;
  items?: SidebarItem[];
}

export async function getHandbookSidebar(): Promise<SidebarItem[]> {
  return getHandbookSidebarItems();
}

export function findActiveItem(
  items: SidebarItem[],
  currentId: string
): SidebarItem | undefined {
  for (const item of items) {
    const itemBase = item.id.replace(/\/index$/, '');
    const currentBase = currentId.replace(/\/index$/, '');

    if (itemBase === currentBase) {
      return item;
    }

    if (item.items) {
      const found = findActiveItem(item.items, currentId);
      if (found) return found;
    }
  }
  return undefined;
}
