/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import storage from "../lib/storage";
import defaultSettings from "../settings/defaultsettings";
import env from "../settings/env";

const KEY_USER_CONFIG = "**** config ****";
const KEY_LAST_POSITION = "**** last_position ****";
const KEY_LOADED = "**** loaded ****";

const JSON_FIELDS = new Set(["normalDialogStyles", "movingDialogStyles", "hiddenDialogStyles"]);

const loadAll = async () => {
  if (env.disableUserSettings) {
    return { settings: parseSettings(defaultSettings), position: {} };
  }
  const data = await getStoredData([KEY_USER_CONFIG, KEY_LAST_POSITION]);
  const mergedSettings = { ...defaultSettings, ...data[KEY_USER_CONFIG] };
  const settings = parseSettings(mergedSettings);

  const position = data[KEY_LAST_POSITION];
  return { settings, position };
};

const loadSettings = async () => {
  const rawSettings = await loadRawSettings();
  return parseSettings(rawSettings);
};

const loadRawSettings = async () => {
  if (env.disableUserSettings) {
    return { ...defaultSettings };
  }

  const data = await getStoredData([KEY_USER_CONFIG]);
  const userSettings = data[KEY_USER_CONFIG];
  return { ...defaultSettings, ...userSettings };
};

const parseSettings = (settings) => {
  const result = {};
  const keys = Object.keys(settings);
  for (let i = 0; i < keys.length; i++) {
    const field = keys[i];
    const value = settings[field];
    if (value === null || value === undefined) {
      continue;
    }
    result[field] = JSON_FIELDS.has(field) ? parseJson(value) : value;
  }
  if (env.disableKeepingWindowStatus && settings.initialPosition === "keep") {
    result.initialPosition = "right";
  }
  return result;
};

const parseJson = (json) => {
  if (!json) {
    return null;
  }
  let result;
  try {
    result = JSON.parse(json);
  } catch (e) {
    result = null;
    console.error("Failed to parse json:" + json);
    console.error(e);
  }
  return result;
};

const saveSettings = (settings) => storage.sync.set({ [KEY_USER_CONFIG]: JSON.stringify(settings) });

const savePosition = async (e) => {
  if (env.disableUserSettings || env.disableKeepingWindowStatus) {
    return;
  }
  return storage.sync.set({
    [KEY_LAST_POSITION]: JSON.stringify(e),
  });
};

const getStoredData = async (keys) => {
  const result = {};
  const storedData = await storage.sync.get(keys);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const json = storedData[key] ?? "{}";
    result[key] = parseJson(json) ?? {};
  }

  return result;
};

const isDataReady = () => storage.local.pickOut(KEY_LOADED);

const setDataReady = (ready) => storage.local.set({ [KEY_LOADED]: ready });

export default {
  loadAll,
  loadSettings,
  loadRawSettings,
  saveSettings,
  savePosition,
  isDataReady,
  setDataReady,
};
