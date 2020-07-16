/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import React, { useState } from "react";
import { SimpleSelect } from "./SimpleSelect";
import * as res from "../logic/resource";
import env from "../../settings/env";

type Encoding = "Shift-JIS" | "UTF-8" | "UTF-16";
type Format = "EIJIRO" | "TSV" | "PDIC_LINE" | "JSON";

type Props = {
  defaultEncoding?: Encoding;
  defaultFormat?: Format;
  busy: boolean;
  progress: string;
  trigger: (e: TriggerEvent) => void;
};

type TriggerEvent =
  | {
      type: "load";
      payload: {
        encoding: Encoding;
        format: Format;
      };
    }
  | { type: "clear" };

export const LoadDictionary: React.FC<Props> = (props) => {
  const [encoding, setEncoding] = useState(props.defaultEncoding);
  const [format, setFormat] = useState(props.defaultFormat);

  const ENCODINGS = [
    { value: "Shift-JIS", name: "Shift-JIS" },
    { value: "UTF-8", name: "UTF-8" },
    { value: "UTF-16", name: "UTF-16" },
  ];

  const FORMATS = [
    { value: "EIJIRO", name: res.get("formatEijiroText") },
    { value: "TSV", name: res.get("formatTsv") },
    { value: "PDIC_LINE", name: res.get("formatPdicOneLine") },
    { value: "JSON", name: res.get("formatJson") },
  ];

  return (
    <div>
      <label>{res.get("dictDataEncoding")}</label>
      <SimpleSelect value={encoding} options={ENCODINGS} onChange={(value) => setEncoding(value as Encoding)} />
      <label>{res.get("dictDataFormat")}</label>
      <SimpleSelect value={format} options={FORMATS} onChange={(value) => setFormat(value as Format)} />
      <label>{res.get("readDictData")}</label>
      <input type="file" id="dictdata" />
      <br />
      <input
        type="button"
        value={res.get("loadSelectedFile")}
        style={{ marginRight: 5 }}
        onClick={() =>
          props.trigger({
            type: "load",
            payload: { encoding, format },
          })
        }
        disabled={props.busy}
      />
      {!env.disableClearDataButton && (
        <input
          type="button"
          value={res.get("clearLoadedData")}
          style={{ marginRight: 5 }}
          onClick={() => props.trigger({ type: "clear" })}
          disabled={props.busy}
        />
      )}
      <img
        src="loading.gif"
        width="32"
        height="32"
        style={{ verticalAlign: "middle", display: props.busy ? "inline" : "none" }}
      />
    </div>
  );
};

LoadDictionary.defaultProps = {
  defaultEncoding: "Shift-JIS",
  defaultFormat: "EIJIRO",
};
