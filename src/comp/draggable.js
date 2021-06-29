import k from '../k.js';

export function draggable(cardId = false) {
  let idDrag = cardId;

  return {
    add() {
      k.mouseRelease(() => {
        if (idDrag) this.trigger('dragEnd', idDrag);
        idDrag = false;
      });
    },

    drag(cardId) {
      idDrag = cardId;
    },

    update() {
      if (idDrag) {
        this.pos = k.mousePos();
      }
    },
  };
}

export default draggable;
