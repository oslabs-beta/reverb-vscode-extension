import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Input from './Input';
import { context } from '../redux/reducers/inputContext';

function Main() {
  const { inputViewContext } = useSelector(context);
  console.log(inputViewContext, 'main render');

  return (
    <div className="container__main">
      <Header />
      <Input />
      <Sidebar />
    </div>
  );
}

export default Main;
