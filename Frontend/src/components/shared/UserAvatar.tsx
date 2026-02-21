import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { RxAvatar } from 'react-icons/rx';
import { Link } from 'react-router-dom';

export function UserAvatar() {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex h-9 w-9 items-center justify-center rounded-full text-black ring-1 ring-gray-300 hover:bg-gray-100 dark:text-white dark:ring-white/10 dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        <span className="sr-only">Open user menu</span>
        <RxAvatar className="h-8 w-8" aria-hidden />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <MenuItem>
          <Link
            to="/employee-page"
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
          >
            Employee
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="/foster-page"
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
          >
            Foster Parents
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
