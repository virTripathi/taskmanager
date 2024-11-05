import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children }) {
  return (
    <div className='w-full px-1 sm:px-0'>
      <Tab.Group>
        <Tab.Panels className='w-full mt-2'>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}
