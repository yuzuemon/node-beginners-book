#!/usr/bin/env node
"use strict";

// TCPによるエコーサーバーの実装
var net = require('net');
var readline = require('readline');

var server = net.createServer();
server.maxConnections = 3; //TCPクライアントの最大接続数

// クライアントコンストラクタ
function Client(socket){
  this.socket = socket;
}
Client.prototype.writeData = function(d){
  var socket = this.socket;
  if(socket.writable){
    var key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d);
  }
};
var clients = {};

// クライアント接続時のイベント1
// 接続開始のログ
server.on('connection', function(socket){
  var status = server.connections + '/' + server.maxConnections;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);
});

// クライアント接続時のイベント2
// socketにたいして, dataイベントリスナを登録する
server.on('connection', function(socket){
  var data = '';
  var newline = /\r\n|\n/;
  socket.on('data', function(chunk){
    // 改行コードが送られてくるまで食べておく(Windowsのtelnetクライアント対応)
    data += chunk.toString();
    var key = socket.remoteAddress + ':' + socket.remotePort;
    if (newline.test(data)){
      clients[key].writeData(data);
      data = '';
    }
  });
});

// クライアント接続時のイベント3
// クライアント接続終了時のイベントリスナを登録する
server.on('connection', function(socket){
  var key = socket.remoteAddress + ':' + socket.remotePort;
  // socketが切断(FIN)を要求してきた時
  socket.on('end', function(){
    var status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
});


// サーバソケットクローズ時のイベント
// server.close()後, すべての接続が終了した時にイベントが発生する
server.on('close', function(){
  console.log('Server Closed');
});

// サーバの開始と終了処理
server.listen(11111, '127.0.0.1', function(){
  var addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

// ^cでサーバソケットをクローズ
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  //すべてのソケットを終了する
  for (var i in clients){
  var socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
});
