import * as React from "react";
import * as AntD from "antd";
/**
 * @typedef {{
 *   name: string | number | (string | number)[];
 *   value?: any;
 *   touched?: boolean;
 *   validating?: boolean;
 *   errors?: string[];
 * }} FieldData
 */
/**
 * @template T
 * @typedef {{ state: any; stateKeys: string[] } & AntD.FormProps<T>} StatefulFormProps
 */
/**
 * WIP
 *
 * @template T
 * @type React.FunctionComponent<StatefulFormProps<T>>
 */
export const StatefulForm = (props) => {
  const { state, stateKeys, children, ...restProps } = props;
  const fields = mapStateToFields(state, stateKeys);

  return (
    <AntD.Form {...restProps} fields={fields}>
      {children}
    </AntD.Form>
  );
};

/**
 * @param {any} state
 * @param {string[]} keys
 * @returns FieldData
 */
export function mapStateToFields(state, keys) {
  return keys.map(key2field);
  function key2field(key) {
    return {
      name: key,
      value: state[key],
    };
  }
}
