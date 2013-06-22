#!/usr/bin/env node
"use strict";

// イベントを発生するオブジェクト
var events = require('events');
var emitter = new events.EventEmitter();

// リスナ関数定義
var sampleListener = function(arg1){
  console.log(arg1);
};

// イベント名とリスナ関数の紐付け
emitter.on('occurrence', sampleListener);

// 補足: リスナ関数を無名関数で定義
emitter.on('occurrence_', function(){
  console.log('arg1');
});

// イベント発生
emitter.emit('occurrence', 'occured!');


// 一度だけのイベント
emitter.once('occurrence__', function(){
  console.log('only this time');
});
emitter.emit('occurrence__'); // 実行されない

// 10個以上イベント登録する場合(デフォルト10個)
emitter.setMaxListeners(100); // 100個
emitter.setMaxListeners(0); // 無制限

// イベント削除
emitter.removeListener('occurrence_');
emitter.removeAllListeners();


