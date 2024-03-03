import extras from 'modules/extras.js';
extras();

import cheatManager from 'modules/cheats.js';
cheatManager.addCheats();

import listenerManager from 'modules/listeners.js';
listenerManager.createListeners();

import patcher from 'modules/patcher.js';
patcher.interceptRequest();

import render from 'modules/render.js';
render();

import createGUI from 'modules/gui.js';
unsafeWindow.addEventListener('DOMContentLoaded', () => createGUI());