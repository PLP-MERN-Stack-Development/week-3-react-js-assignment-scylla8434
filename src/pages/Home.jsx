import React from 'react';
import Layout from '../components/Layout';
import TaskManager from '../components/TaskManager';
import ApiData from '../components/ApiData';

const Home = () => (
  <Layout>
    <TaskManager />
    <div className="mt-8">
      <ApiData />
    </div>
  </Layout>
);

export default Home;
