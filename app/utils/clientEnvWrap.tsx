'use client';
/**
 * @module 动态加载包装器
 */
import dynamic from 'next/dynamic';

const DynamicLoadWrap = dynamic(() => import('./dynamicLoadWrap'), {
	ssr: false
});

export default function ClientEnvWrap({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<DynamicLoadWrap>
			{children}
		</DynamicLoadWrap>
	);
}