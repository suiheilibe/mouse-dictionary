/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import React from "react";
import { ChromePicker } from "react-color";
import * as res from "../logic/resource";
import env from "../../settings/env";
import { MouseDictionaryBasicSettings, UpdateEventHandler, InitialPosition, Scroll } from "../types";
import { SimpleSelect } from "./SimpleSelect";
import immer from "immer";

type Props = {
  settings: MouseDictionaryBasicSettings;
  trialText: string;
  busy: boolean;
  onUpdate: UpdateEventHandler;
  trigger: (type: "loadInitialDict") => void;
};

const FONT_SIZES = [
  { name: "xx-small", value: "xx-small" },
  { name: "x-small", value: "x-small" },
  { name: "smaller", value: "smaller" },
  { name: "small", value: "small" },
  { name: "medium", value: "medium" },
  { name: "large", value: "large" },
  { name: "larger", value: "larger" },
  { name: "x-large", value: "x-large" },
  { name: "xx-large", value: "xx-large" },
];

export const BasicSettings: React.FC<Props> = (props) => {
  const settings = props.settings;
  if (!settings) {
    return <div></div>;
  }

  const positions = [
    { name: res.get("positionLeft"), value: "left" },
    { name: res.get("positionRight"), value: "right" },
  ];
  if (!env.disableKeepingWindowStatus) {
    positions.push({
      name: res.get("positionKeep"),
      value: "keep",
    });
  }

  const scrolls = [
    { name: res.get("scrollOn"), value: "scroll" },
    { name: res.get("scrollOff"), value: "hidden" },
  ];

  const update = (patch: Partial<MouseDictionaryBasicSettings>) => {
    const newPatch = immer(patch, (d) => {
      for (const name of Object.keys(patch)) {
        const value = patch[name];
        if (Number.isNaN(value) || (Number.isInteger(value) && value < 0)) {
          d[name] = 0;
        }
      }
    });
    props.onUpdate(null, newPatch);
  };

  return (
    <form className="settingsForm">
      <fieldset>
        <h2>{res.get("basicSettings")}</h2>
        <label>{res.get("abbreviateShortWordDesc")}</label>
        <span> {res.get("abbreviateShortWordDesc0")} </span>
        <input
          type="number"
          name="shortWordLength"
          value={settings.shortWordLength}
          style={{ width: 60 }}
          onChange={(e) => update({ [e.target.name]: parseInt(e.target.value, 10) })}
        />
        <span> {res.get("abbreviateShortWordDesc1")} </span>
        <input
          type="number"
          name="cutShortWordDescription"
          value={settings.cutShortWordDescription}
          style={{ width: 60 }}
          onChange={(e) => update({ [e.target.name]: parseInt(e.target.value, 10) })}
        />
        <span> {res.get("abbreviateShortWordDesc2")}</span>
        <label>{res.get("initialSize")}</label>
        <span>{res.get("width")}</span>
        <input
          type="number"
          name="width"
          value={settings.width}
          style={{ width: 90 }}
          onChange={(e) => update({ [e.target.name]: parseInt(e.target.value, 10) })}
        />
        <span> {res.get("height")}</span>
        <input
          type="number"
          name="height"
          value={settings.height}
          style={{ width: 90 }}
          onChange={(e) => update({ [e.target.name]: parseInt(e.target.value, 10) })}
        />
        <label>{res.get("initialPosition")}</label>
        <SimpleSelect
          value={settings.initialPosition}
          options={positions}
          style={{ width: 250 }}
          onChange={(value: InitialPosition) => update({ initialPosition: value })}
        />

        <label>{res.get("scrollBar")}</label>
        <SimpleSelect
          value={settings.scroll}
          options={scrolls}
          style={{ width: 250 }}
          onChange={(value: Scroll) => update({ scroll: value })}
        />

        <br />

        <h3>{res.get("colorAndFont")}</h3>
        <div className="container">
          <div className="row" style={{ width: 690 }}>
            <div className="column">
              <h4>{res.get("headFont")}</h4>
              <ChromePicker
                width={200}
                color={settings.headFontColor}
                disableAlpha={true}
                onChange={(e) => update({ headFontColor: e.hex })}
              />
              <br />
              <SimpleSelect
                value={settings.headFontSize}
                options={FONT_SIZES}
                style={{ width: 200 }}
                onChange={(value) => update({ headFontSize: value })}
              />
            </div>
            <div className="column">
              <h4>{res.get("descFont")}</h4>
              <ChromePicker
                width={200}
                color={settings.descFontColor}
                disableAlpha={true}
                onChange={(e) => update({ descFontColor: e.hex })}
              />
              <br />
              <SimpleSelect
                value={settings.descFontSize}
                options={FONT_SIZES}
                style={{ width: 200 }}
                onChange={(value) => update({ descFontSize: value })}
              />
            </div>
            <div className="column">
              <h4>{res.get("background")}</h4>
              <ChromePicker
                width={200}
                color={settings.backgroundColor}
                disableAlpha={true}
                onChange={(e) => update({ backgroundColor: e.hex })}
              />
            </div>
          </div>
        </div>
        <label>{res.get("dictionaryData")}</label>
        <input
          type="button"
          className="button-outline button-small"
          value={res.get("loadInitialDict")}
          style={{ marginRight: 5, cursor: "pointer" }}
          disabled={props.busy}
          onClick={() => props.trigger("loadInitialDict")}
        />
      </fieldset>
    </form>
  );
};
