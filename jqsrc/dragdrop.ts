import { POS, SEL } from './datos.js';

export const initDrag = () => {
  $(SEL.MAZO).data({
    pos: POS.MAZO,
    slot: 0,
  });
  $(SEL.VISTA).data({
    pos: POS.VISTA,
    slot: 0,
  });
  $(SEL.PILAS).each(function (slot) {
    $(this).data({
      pos: POS.PILA,
      slot,
    });
  });
  $(SEL.HUECOS).each(function (slot) {
    $(this).data({
      pos: POS.HUECO,
      slot,
    });
  });

  $(SEL.DRAGGABLE).draggable({
    helper: 'clone',
  });

  $(SEL.DROPPABLE)
    .droppable({
      accept: function (source: JQuery) {
        const { pos: fromPos, slot: fromSlot } = $(source)
          .closest(SEL.DROPPABLE)
          .data();
        const { pos: toPos, slot: toSlot } = $(this).data();
        console.log('accept', { fromPos, fromSlot, toPos, toSlot });
        return !!(toSlot % 2);
      },
    })
    .on('drop', function (ev: JQuery.Event, ui: any) {
      const { pos: fromPos, slot: fromSlot } = $(ui.draggable)
        .closest(SEL.DROPPABLE)
        .data();
      const { pos: toPos, slot: toSlot } = $(this).data();
      console.log('drop', { fromPos, fromSlot, toPos, toSlot });
    });
};

export const enableDraggable = (el: JQuery, enabled: boolean) => {
  el.find(SEL.DRAGGABLE).draggable(enabled ? 'enable' : 'disable');
};
