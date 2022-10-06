export interface MenuItem {
  id: string;
}

export type MenuItems = Record<string, MenuItem>;
export type SubMenu = MenuItem & { x: MenuItems };
export type Menu = Record<string, SubMenu>;

export const EXPECTED_MENU: Menu = {
  FILE: {
    id: 'File',
    x: {
      SAVE: {
        id: 'Save'
      }
    }
  },
  WINDOW: {
    id: 'Window',
    x: {
      SERVER_TOOLS: {
        id: 'Server Tools'
      }
    }
  }
};
