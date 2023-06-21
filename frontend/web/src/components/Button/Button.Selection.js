import React from "react";

import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

const ButtonSelection = (props) => {
  const onChangeHandler = (__value__) => {
    props.onSelect(props.id, __value__, props.subgroup);
  };

  return (
    <div key={`ButtonSelection_${props.id}`} id={`ButtonSelection_${props.id}`}>
      <ToggleButtonGroup
        type={props.type}
        name={props.subgroup || props.id}
        onChange={onChangeHandler}
      >
        {props.buttons.map((c, i) => {
          return (
            <ToggleButton
              key={`${props.subgroup || props.id}_${i}`}
              id={`${props.subgroup || props.id}_${i}`}
              value={c}
              className="btn-inactive"
            >
              {c}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
};

export default ButtonSelection;
