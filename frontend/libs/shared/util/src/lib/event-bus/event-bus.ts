'use client';
import { EventEmitter } from 'events';

const EventBus: EventEmitter = new EventEmitter();

export { EventBus };
