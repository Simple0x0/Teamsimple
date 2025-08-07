import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../components/public/layout/MainLayout';
import DashBoardLayout from '../components/dashboard/layout/DashBoardLayout';

// Sections
import Home from '../components/public/sections/Home';
import Blogs from '../components/public/sections/Blogs';
import WriteUps from '../components/public/sections/WriteUps';
import Projects from '../components/public/sections/Projects';
import PodCast from '../components/public/sections/PodCast';
import Achievements from '../components/public/sections/Achievements';
import BlogRender from '../components/public/contents/BlogRender/BlogRender'
import WriteUpRender from '../components/public/contents/WriteUpRender/WriteUpRender'
import ProjectRender from '../components/public/contents/ProjectRender/ProjectRender'
import Events from '../components/public/sections/Events';

// Auth
import {AuthRoute} from '../components/dashboard/Auth/AuthPrivateRoute';
import Login from '../components/dashboard/Auth/Login';
import ResetPassword from '../components/dashboard/Auth/ResetPassword';

// Dashboards
import Dashboard from '../components/dashboard/ui/Dashboard';
import BlogsMgmt from '../components/dashboard/ui/blogs/BlogsMgmt';
import BlogEdit from '../components/dashboard/ui/blogs/BlogEdit';
import BlogAdd from '../components/dashboard/ui/blogs/BlogAdd';
import WritupMgmt from '../components/dashboard/ui/writeups/WritupMgmt';
import WritupEdit from '../components/dashboard/ui/writeups/WritupEdit';
import WritupAdd from '../components/dashboard/ui/writeups/WritupAdd';
import ProjectMgmt from '../components/dashboard/ui/projects/ProjectMgmt';
import ProjectEdit from '../components/dashboard/ui/projects/ProjectEdit';
import ProjectAdd from '../components/dashboard/ui/projects/ProjectAdd';
import PodcastMgmt from '../components/dashboard/ui/podcasts/PodcastMgmt';
import PodcastEdit from '../components/dashboard/ui/podcasts/PodcastEdit';
import PodcastAdd from '../components/dashboard/ui/podcasts/PodcastAdd';
import AchievementMgmt from '../components/dashboard/ui/achievements/AchievementMgmt';
import AchievementEdit from '../components/dashboard/ui/achievements/AchievementEdit';
import AchievementAdd from '../components/dashboard/ui/achievements/AchievementAdd';
import ContributorsMgmt from '../components/dashboard/ui/contributors/ContributorsMgmt';
import TeamMgmt from '../components/dashboard/ui/team/TeamMgmt';
import WhoWeAre from '../components/dashboard/ui/who-we-are/WhoWeAre';
import EventMgmt from '../components/dashboard/ui/events/EventMgmt';
import EventAdd from '../components/dashboard/ui/events/EventAdd';
import EventEdit from '../components/dashboard/ui/events/EventEdit';
import PlatformContacts from '../components/dashboard/ui/contacts/PlatformContacts';

import TeamWhoWeAre from '../components/public/team/TeamWhoWeAre';
import TeamVisionMission from '../components/public/team/TeamVisionMission';
import TeamValues from '../components/public/team/TeamValues';
import TheTeam from '../components/public/team/TheTeam';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}> 
        <Route index element={<Home />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="writeups" element={<WriteUps />} />
        <Route path="projects" element={<Projects />} />
        <Route path="podcasts" element={<PodCast />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="events" element={<Events />} />
        <Route path="blogs/:slug" element={<BlogRender />} />
        <Route path="writeups/:slug" element={<WriteUpRender />} />
        <Route path="projects/:slug" element={<ProjectRender />} />
        <Route path="/team" element={<TeamWhoWeAre />} />
        <Route path="/team/vision-mission" element={<TeamVisionMission />} />
        <Route path="/team/values" element={<TeamValues />} />
        <Route path="/team/members" element={<TheTeam />} />
      </Route>


      <Route path="/login" element={<AuthRoute > <Login /> </ AuthRoute >} />
      <Route path="/reset-password" element={<AuthRoute > <ResetPassword /> </ AuthRoute >} />
      <Route path="/dashboard" element={<DashBoardLayout /> } >
        <Route index element={<Dashboard />} /> 
        <Route path="/dashboard/blogs" element={<BlogsMgmt />} /> 
        <Route path="/dashboard/blogs/edit" element={<BlogEdit />} /> 
        <Route path="/dashboard/blogs/new" element={<BlogAdd />} /> 
        <Route path="/dashboard/writeups" element={<WritupMgmt />} /> 
        <Route path="/dashboard/writeups/edit" element={<WritupEdit />} /> 
        <Route path="/dashboard/writeups/new" element={<WritupAdd />} /> 
        <Route path="/dashboard/projects" element={<ProjectMgmt />} /> 
        <Route path="/dashboard/projects/edit" element={<ProjectEdit />} /> 
        <Route path="/dashboard/projects/new" element={<ProjectAdd />} /> 
        <Route path="/dashboard/podcasts" element={<PodcastMgmt />} /> 
        <Route path="/dashboard/podcasts/edit" element={<PodcastEdit />} /> 
        <Route path="/dashboard/podcasts/new" element={<PodcastAdd />} /> 
        <Route path="/dashboard/achievements" element={<AchievementMgmt />} /> 
        <Route path="/dashboard/achievements/edit" element={<AchievementEdit />} /> 
        <Route path="/dashboard/achievements/new" element={<AchievementAdd />} /> 
        <Route path="/dashboard/events" element={<EventMgmt />} /> 
        <Route path="/dashboard/events/new" element={<EventAdd />} />
        <Route path="/dashboard/events/edit" element={<EventEdit />} />

        
        <Route path="/dashboard/contributors" element={<ContributorsMgmt />} /> 
        <Route path="/dashboard/platform-contacts" element={<PlatformContacts />} />
        <Route path='/dashboard/who-we-are' element={<WhoWeAre />} />
        <Route path='/dashboard/team-management' element={<TeamMgmt />} />
        
        <Route path='/dashboard/*' element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  ),
  {
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
      v7_fetcherPersist: true,   // Retains fetcher state during navigation
      v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
      v7_partialHydration: true, // Supports partial hydration for server-side rendering
      v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
    }
  }
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
