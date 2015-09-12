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



/**
 * Create the app.
 * @constructor
 */
var Checkvist = function() {
  this.session = {};

  this.ele_login_panel = document.getElementById('login-panel');
  this.ele_username = document.getElementById('username');
  this.btn_logout = document.getElementById('btn_logout');

  var form_ele = document.getElementById('login-form');
  var me = this;
  form_ele.onsubmit = function(e) {
    e.preventDefault();
    var login = document.getElementById('login').value;
    var pass = document.getElementById('pass').value;
    me.login(function(result) {
      if (result) {
        form_ele.style.display = 'none';
      }
    }, login, pass);
    return false;
  };

  var me = this;
  this.btn_logout.onclick = function(e) {
    me.session = {};
    sessionStorage.removeItem('Checkvist.session');
    me.ele_username.textContent = '';
    me.btn_logout.style.display = 'none';
    form_ele.style.display = '';
  }

};


/**
 * Do login.
 * @param {function(string?)} cb callback.
 * @param {string=} login user name.
 * @param {string=} pass password.
 */
Checkvist.prototype.login = function(cb, login, pass) {
  var params = {};
  this.session.username = this.session.username || login;
  this.session.password = this.session.password || pass;
  this.session.remote_key = this.session.password;
  this.send('/auth/login.json', function(result) {
    // console.log(result);
    if (result) {
      this.session.remote_key = result;
      this.ele_username.textContent = this.session.username;
      this.btn_logout.style.display = '';
    } else {
      this.session = {};
      this.ele_username.textContent = '';
      this.btn_logout.style.display = 'none';
    }
    sessionStorage.setItem('Checkvist.session', JSON.stringify(this.session));
    cb(result);
    var me = this;
    setTimeout(function() {
      me.refresh();
    }, 100);
    //this.send('/auth/curr_user.json', function(data) {
    //  console.log(data);
    //});
  }, 'POST', params);
};


/**
 * Send request to checkvist server.
 * @param {string} path
 * @param {Function} cb callback
 * @param {string=} method
 * @param {Object=} params
 */
Checkvist.prototype.send = function(path, cb, method, params) {
  method = method || 'GET';
  params = params || {};
  params['username'] = this.session.username;
  params['remote_key'] = this.session.remote_key;
  var host = 'beta.checkvist.com';
  var url = 'https://' + host + path;
  var query = [];
  for (var q in params) {
    query.push(q + '=' + encodeURIComponent(params[q]));
  }
  url += '?' + query.join('&');
  var req = new XMLHttpRequest();
  req.open(method, url, false);
  // req.withCredentials = true;
  var me = this;
  req.onload = function(e) {
    // console.log(req.status);
    // console.log(req.responseText)
    cb.call(me, JSON.parse(req.responseText));
  };
  console.info('sending ' + url);
  req.send();
};


/**
 * Refresh UI.
 */
Checkvist.prototype.refresh = function() {
  this.send('/checklists.json', function(checklist) {
    console.log(checklist);
  });
};


/**
 * Run the app.
 */
Checkvist.prototype.run = function() {
  var cache = sessionStorage.getItem('Checkvist.session');
  if (cache) {
    this.session = JSON.parse(cache);
    this.btn_logout.style.display = '';
    var me = this;
    this.login(function(result) {
    });
  } else {
    this.ele_login_panel.style.display = '';
    this.btn_logout.style.display = 'none';
  }
};


