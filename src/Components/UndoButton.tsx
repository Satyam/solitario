import { MouseEventHandler } from 'react';

export const UndoButton: React.FC = ({ children }) => {
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
  };
  const disabled = true;
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default UndoButton;
