import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./Signup";
import HomeRoute from "./HomeRoute";
import SampleRequireLogin from "./routes/SampleRequireLogin";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";

function SomeOtherPage() {
  return <div>Some other page</div>;
}

function SomeOtherPage2() {
  return <div>Some other page 2</div>;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<SampleRequireLogin />} />
            <Route path="someotherpage" element={<SomeOtherPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/someotherpage2" element={<SomeOtherPage2 />} />
        </Route>
      </Routes>
    </div>
  );
  //
}

export default App;
