(() => {
  'use strict';

  const obnizId = 'XXXX-XXXX'; // Your obniz ID
  const radioFieldCode = 'Radio' // Radio button field's fieldcode
  const select = { // Radio button choices
    yes: '知ってる',
    no: '知らない'
  };

  // Post record data function
  const postRecord = TEXT => {
    const params = {
      app: kintone.app.getId(),
      record: {
        [radioFieldCode]: {
          value: TEXT
        }
      }
    };
    return kintone.api(kintone.api.url('/k/v1/record', true), 'POST', params)
      .then(resp => console.log('成功！')).catch(err => console.log('失敗'));
  };

  // kintone event
  kintone.events.on('app.record.index.show', e => {
    // Connecting obniz
    const obniz = new Obniz(obnizId);
    obniz.onconnect = async () => {
      obniz.display.clear();
      obniz.display.print('Connected!');

      // Set obniz buttons
      const btn_yes = obniz.wired('Button', {signal: 0, gnd: 1});
      const btn_no = obniz.wired('Button', {signal: 2, gnd: 3});

      // Buttons event
      // Select "Yes"
      btn_yes.onchange = async pressed => {
        if (!pressed) return;
        obniz.display.clear();
        await postRecord(select.yes);
      };

      // Select "No"
      btn_no.onchange = async pressed => {
        if (!pressed) return;
        obniz.display.clear();
        await postRecord(select.no);
      };
    };
    return e;
  });
})();
