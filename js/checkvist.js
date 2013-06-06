/**
 * @license Copyright 2012 YDN Authors, Yathit. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");.
 */
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * @fileoverview Main app.
 */


goog.provide('ydn.db.demo.Checkvist');
goog.require('goog.debug.Logger');
goog.require('goog.net.XhrIo');
goog.require('ydn.db.Storage');



/**
 * Create the app.
 * @constructor
 */
ydn.db.demo.Checkvist = function() {
  var form_ele = document.getElementById('login-form');
  var me = this;
  form_ele.onsubmit = function(e) {
    e.preventDefault();
    var url = 'http://checkvist.com//auth/login.json';
    var data = new FormData(e.target);
    me.logger.info('sending login');
    goog.net.XhrIo.send(url, function(e) {
      var xhr = /** @type {goog.net.XhrIo} */ (e.target);
      window.console.log(xhr.getStatus());
      window.console.log(xhr.getResponseText());
    }, 'POST', data);
    return false;
  };

  // CORS not enable. crap.
};


/**
 * @protected
 * @type {goog.debug.Logger} logger.
 */
ydn.db.demo.Checkvist.prototype.logger =
    goog.debug.Logger.getLogger('ydn.db.demo.Checkvist');


/**
 * Run the app.
 */
ydn.db.demo.Checkvist.prototype.run = function() {

};


