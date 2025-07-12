import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/public/redux/reducers/authReducer';
import blogsReducer from '../components/public/redux/reducers/blogsReducer';
import writeupsReducer from '../components/public/redux/reducers/writeupReducer';
import projectsReducer from '../components/public/redux/reducers/projectsReducer';
import podcastsReducer from '../components/public/redux/reducers/podcastsReducer';
import achievementsReducer from '../components/public/redux/reducers/achievementsReducer';
import eventsReducer from '../components/public/redux/reducers/eventReducer';
import latestReducer from '../components/public/redux/reducers/latestReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogsReducer,
    writeups: writeupsReducer,
    projects: projectsReducer,
    podcasts: podcastsReducer,
    achievements: achievementsReducer,
    events: eventsReducer,
    latest: latestReducer,
  }
});

export default store;
