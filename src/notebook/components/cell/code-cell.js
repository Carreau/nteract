import React from 'react';

import Inputs from './inputs';

import Editor from './editor';
import Display from 'react-jupyter-display-area';

import Immutable from 'immutable';

import {
  executeCell,
  focusNextCell,
} from '../../actions';

const CodeCell = (props, context) => {
  function keyDown(e) {
    if (e.key !== 'Enter') {
      return;
    }

    const shiftXORctrl = (e.shiftKey || e.ctrlKey) && !(e.shiftKey && e.ctrlKey);
    if (!shiftXORctrl) {
      return;
    }

    e.preventDefault();

    if (e.shiftKey) {
      context.dispatch(focusNextCell(props.id));
    }

    context.dispatch(executeCell(context.channels,
                                 props.id,
                                 props.cell.get('source')));
  }

  return (
    <div className="code_cell">
      <div className="input_area" onKeyDown={keyDown}>
        <Inputs executionCount={props.cell.get('execution_count')} />
        <Editor
          id={props.id}
          input={props.cell.get('source')}
          language={props.language}
          focused={props.id === props.focusedCell}
        />
      </div>
      <Display
        className="cell_display"
        outputs={props.cell.get('outputs')}
        displayOrder={props.displayOrder}
        transforms={props.transforms}
      />
    </div>
  );
};

CodeCell.propTypes = {
  cell: React.PropTypes.any,
  displayOrder: React.PropTypes.instanceOf(Immutable.List),
  id: React.PropTypes.string,
  language: React.PropTypes.string,
  theme: React.PropTypes.string,
  transforms: React.PropTypes.instanceOf(Immutable.Map),
  focusedCell: React.PropTypes.string,
};

CodeCell.contextTypes = {
  channels: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default CodeCell;
