import k from '../k.js';

export function draggable(id = false) {
  // private states
  let idDrag = id;

  return {
    // called when the object is add()-ed
    add() {
      k.mouseRelease(() => {
        idDrag = false;
        this.trigger('dragEnd', idDrag);
      });
    },

    drag(id) {
      idDrag = id;
    },

    // called every frame
    update() {
      if (idDrag) {
        this.pos = k.mousePos();
      }
    },
  };
}

export default draggable;
