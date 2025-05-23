'use client';
import * as React from 'react';
import { File, GraduationCap } from 'lucide-react';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
	TooltipProvider,
} from '@atsumedia/shared-ui';
import { cn } from '@atsumedia/shared-util';
import { Nav } from '@admin/(auth)/_components/nav';

interface LayoutMenuProps {
	children: React.ReactNode;
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}

export function LayoutMenu({
	children,
	defaultLayout = [265, 655],
	defaultCollapsed = false,
	navCollapsedSize,
}: LayoutMenuProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
				}}
				className="h-full items-stretch">
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible={true}
					minSize={15}
					maxSize={20}
					onExpand={() => {
						setIsCollapsed(false);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
					}}
					onCollapse={() => {
						setIsCollapsed(true);
						// setIsCollapsed(collapsed)
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
					}}
					className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}>
					{/*<Nav*/}
					{/*	isCollapsed={isCollapsed}*/}
					{/*	links={[*/}
					{/*		{*/}
					{/*			title: '管理员管理',*/}
					{/*			icon: UserRoundCog,*/}
					{/*			href: '/manager',*/}
					{/*		},*/}
					{/*	]}*/}
					{/*/>*/}
					{/*<Separator />*/}
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: '作品',
								icon: GraduationCap,
								href: '/article',
							},
							{
								title: 'カテゴリ',
								icon: File,
								href: '/category',
							},
							{
								title: '放送局',
								icon: File,
								href: '/network',
							},
							{
								title: 'キャスト',
								icon: File,
								href: '/person',
							},
							{
								title: 'シーズン',
								icon: File,
								href: '/season',
							},
							{
								title: 'Vod',
								icon: File,
								href: '/vod',
							},
							{
								title: '曲',
								icon: File,
								href: '/music',
							},
							{
								title: 'ページ表示設定',
								icon: File,
								href: '/pageSetting',
							},
							{
								title: '制作会社',
								icon: File,
								href: '/production',
							},
							{
								title: 'ニュース',
								icon: File,
								href: '/news',
							},
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={defaultLayout[1]}>
					<ScrollArea className="flex h-full items-start justify-start px-8 py-3">{children}</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
