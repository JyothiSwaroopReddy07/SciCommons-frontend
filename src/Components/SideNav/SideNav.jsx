import React from "react";
import "./SideNav.css";
import { Sidebar } from "flowbite-react";
import {
  HiUserGroup,
} from "react-icons/hi";
import {AiOutlineUsergroupAdd} from 'react-icons/ai';
import { CgFeed } from "react-icons/cg";
import {RxCross2} from 'react-icons/rx';
import {MdEventNote} from 'react-icons/md';
import {TbMessageCircle2} from 'react-icons/tb';
import {MdOutlineForum} from 'react-icons/md';
import {ImBlog} from 'react-icons/im';


const SideNav = ({onMenuChange}) => {
  return (
    <div className="sidenav">
      <Sidebar aria-label="Sidebar with logo branding example" className="w-full h-full bg-white">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="flex flex-row items-center justify-between">
                <Sidebar.Item href="/">
                <p className="text-3xl font-bold text-green-600">Sci Commons</p>
                </Sidebar.Item>
                <button onClick={onMenuChange}>
                    <RxCross2 className="h-5 w-5 mt-2 active:shadow-none text-gray-500"/>
                </button>
            </div>
            <Sidebar.Item href="/myfeed" icon={CgFeed} className="mt-5">
              <p>My Feed</p>
            </Sidebar.Item>
            <Sidebar.Item href="/createcommunity" icon={AiOutlineUsergroupAdd}>
              <p>Create Community</p>
            </Sidebar.Item>
            <Sidebar.Item href="/mycommunity" icon={HiUserGroup}>
              <p>MyCommunity</p>
            </Sidebar.Item>
            <Sidebar.Item href="/events" icon={MdEventNote}>
              <p>Events</p>
            </Sidebar.Item>
            <Sidebar.Item href="/messages" icon={TbMessageCircle2}>
              <p>Messages</p>
            </Sidebar.Item>
            <Sidebar.Item href="/forums" icon={MdOutlineForum}>
              <p>Forums</p>
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ImBlog}>
              <p>Blogs</p>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default SideNav;
