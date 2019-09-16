(() => {
  'use strict';

  const obnizID = '1234-5678';
  const indexViewID = 5741990;
  const customViewID = 5741991;

  const wait = TIME => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), TIME * 1000);
    });
  };
  const obnizCar = {
    forward: MOTOR => new Promise(resolve => {
      MOTOR.forward();
      setTimeout(() => {
        MOTOR.stop();
        resolve();
      }, 1000);
    }),
    reverse: MOTOR => new Promise(resolve => {
      MOTOR.reverse();
      setTimeout(() => {
        MOTOR.stop();
        resolve();
      }, 1000);
    }),
    center: SERVO => new Promise(resolve => {
      SERVO.angle(100);
      resolve();
    }),
    turnLeft: SERVO => new Promise(resolve => {
      SERVO.angle(50);
      resolve();
    }),
    turnRight: SERVO => new Promise(resolve => {
      SERVO.angle(170);
      resolve();
    }),
  };

  const events = [
    'app.record.index.show',
    'mobile.app.record.index.show'
  ];
  kintone.events.on(events, e => {
    if (e.viewId === indexViewID) {
      const header = e.type === 'app.record.index.show' ? kintone.app.getHeaderMenuSpaceElement() : kintone.mobile.app.getHeaderSpaceElement();
      const executeBtn = new kintoneUIComponent.Button({
        text: 'Execute!!',
        type: 'submit'
      });
      $(header).append($(executeBtn.render()));

      const obniz = new Obniz(obnizID);
      obniz.onconnect = () => {
        const motor = obniz.wired('DCMotor', {forward: 0, back: 1});
        const servo = obniz.wired('ServoMotor', {gnd: 2, vcc: 3, signal: 4});
        // 実行
        $(executeBtn).on('click', () => {
          $(e.records).each(async function() {
            switch (this.radio.value) {
              case '前進': {
                await obnizCar.forward(motor);
                await wait(1.5);
                break;
              }
              case '後退': {
                await obnizCar.reverse(motor);
                await wait(1.5);
                break;
              }
              case '左回転': {
                await obnizCar.turnLeft(servo);
                await obnizCar.forward(motor);
                await obnizCar.center(servo);
                await wait(1.5);
                break;
              }
              case '右回転': {
                await obnizCar.turnRight(servo);
                await obnizCar.forward(motor);
                await obnizCar.center(servo);
                await wait(1.5);
                break;
              }
            }
          });
        });
      };
    }
  });

  kintone.events.on(events, e => {
    if (e.viewId === customViewID) {
      const obniz = new Obniz(obnizID);
      obniz.onconnect = () => {
        const motor = obniz.wired('DCMotor', {forward: 0, back: 1});
        const servo = obniz.wired('ServoMotor', {gnd: 2, vcc: 3, signal: 4});

        // 前進
        $('#forward').on('click', async () => {
          await obnizCar.forward(motor);
          await wait(1.5);
        });
        // 後退
        $('#reverse').on('click', async () => {
          await obnizCar.reverse(motor);
          await wait(1.5);
        });
        // 中央
        $('#center').on('click', async () => {
          await obnizCar.center(servo);
        });
        // 左回転
        $('#left').on('click', async () => {
          await obnizCar.turnLeft(servo);
        });
        // 右回転
        $('#right').on('click', async () => {
          await obnizCar.turnRight(servo, motor);
        });
      };
    }
  });
})();