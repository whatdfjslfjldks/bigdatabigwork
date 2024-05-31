'use client';

import { useState, useEffect } from 'react';

import Model from './utils/model';
import Data from './utils/dataWrap';
import View from './view';
import Image from 'next/image';
import loadingGif from '../public/pic/loading.gif'

// import docxtpl from './utils/docxtpl';
// docxtpl.registTpl("example.docx");
// docxtpl.use("example.docx").make("demo.docx", {}, { head: 'title' });


export default function Home() {

  const [loadState, setLoadState] = useState('loading');

  function modelInitCallback() {
    setLoadState('loading');
    Model.init().then(() => {
      setLoadState('loaded');
    }).catch(() => {
      setLoadState('fail');
    });
  }

  useEffect(modelInitCallback, []);

  switch (loadState) {
    case 'loaded': // 加载成功
      return (
        <View />
      );
      break;

    case 'fail':
      return (
        <main>
          <div className='fixed flex flex-col items-center justify-center bg-indigo-900 h-full w-full z-50'>
            <p className='text-red-500'>加载失败</p>
            <p className='text-white'>
              无法连接到服务器。请检查您的网络连接并重试。
            </p>
          </div>
        </main>
      );
      break;

    default:
      return (
        <main>
          <div className='fixed flex flex-col items-center justify-center h-full w-full z-50 bg-indigo-900 text-white'>
            <Image src={loadingGif} alt="Loading" className='w-16 h-16 mb-4' />
            <p className='text-gray-300'>加载中...</p>
          </div>
        </main>
      );
      break;
  }
}
