'use client';

import React from 'react';
import "./globals.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ClientEnvWrap from './utils/clientEnvWrap';
// 数据模型
import model from './utils/model';
// 数据包装器
import Data from './utils/dataWrap';

import SysManage from './sysManage';
import B from "./pageB";
import B1 from './pageB1';
import B2 from './pageB2';
import B3 from './pageB3';
import B4 from './pageB4';
import B5 from './pageB5';
import B6 from './pageB6';

export default function View() {

	return (
		<main>
			<ClientEnvWrap >
				<Router>
					<Routes>
						<Route path='/' element={<B />} />
						<Route path="/B1" element={<B1 />} />
						<Route path="/B2" element={<B2 />} />
						<Route path="/B3" element={<B3 />} />
						<Route path='/B4' element={<B4 />} />
						<Route path='/B5' element={<B5 />} />
						<Route path='/B6' element={<B6 />} />
						<Route path='/sysManage' element={<SysManage />} />
					</Routes>
				</Router>
			</ClientEnvWrap>
		</main>
	);
}