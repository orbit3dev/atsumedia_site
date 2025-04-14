'use client';
import { DependencyList, useEffect } from 'react';
import { EventBus } from './event-bus';

export function useEventbus<T>(
	key: string | string[],
	listener: (args: T) => void,
	config?: { condition?: (args: T) => boolean; parse?: boolean },
	deps?: DependencyList
) {
	useEffect(() => {
		const listenerFun = (args: T) => {
			const { condition } = config ?? {};
			const parse = config?.parse ?? false;
			let _args = args;
			if (parse && 'string' === typeof args) {
				_args = JSON.parse(args);
			}
			if (!condition || (condition && condition(_args))) {
				listener(_args);
			}
		};
		if (key && typeof key === 'object' && key.constructor === Array) {
			(key as string[]).forEach((key) => {
				EventBus.on(key, listenerFun);
			});
		} else {
			EventBus.on(key as string, listenerFun);
		}
		return () => {
			if (key && typeof key === 'object' && key.constructor === Array) {
				(key as string[]).forEach((key) => {
					EventBus.removeListener(key, listenerFun);
				});
			} else {
				EventBus.removeListener(key as string, listenerFun);
			}
		};
	}, deps ?? []);
}
