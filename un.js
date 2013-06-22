#!/usr/bin/env node
"use strict";

process.on('uncaughtException', function(err){
  console.log(err);
});
throw new Error("An error occured");

// uncaughtExceptionは将来的に廃止.
// Node 0.8以降はdomains機能を利用する.
