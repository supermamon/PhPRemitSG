/*
.SYNOPSIS
  This app pulls Singapore Dollar to Philippine Peso exchange rates
  from the websites of popular remittance centers.

.LICENSE
	Copyright 2014 Raymond M. Velasquez (www.supermamon.com)

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	 
  http://www.apache.org/licenses/LICENSE-2.0
  
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
  
 */
//------------------------------------------------------------------------------
var UI = require('ui');
var ajax = require('ajax');
//------------------------------------------------------------------------------
/* define sources */
var sources = [
  {name:'PNB Singapore'   , match:/Php<\/strong>(.*?)<\/span>/, url:'http://www.pnb.com.ph/singapore/Rates/ExchangeRates.asp' },
  {name:'I-Remit'         , match:/<div align='center'>(.*?)<\/div>/, url:'http://www.myiremit.com/forex.php?forex_c_code=ISINPL' },
  {name:'Metro Remittance', match:/The Philippines: 1 SGD = (.*?) PHP/,url:'https://www.facebook.com/metroremittancecenter'},
  {name:'A Express Remit' , match:/1 = PHP (.*?)<\/span>/,url:'https://www.facebook.com/aexpressremit'}
];

//------------------------------------------------------------------------------
/* Create the Menu */
var menuItems = [];
var menu = new UI.Menu({sections: [{items: menuItems}]});

menu.on('select', function(e) {
  updateRates();
});
//------------------------------------------------------------------------------
/* Update the rate from a single source */
function updateRate(i) {
    ajax(
      {
        url: sources[i].url,
        cache: false,
        type: 'html'
      },
      function(data) {
        var rate = data.match(sources[i].match)[1];
        menu.item(0, i, {title : ('PhP ' + rate) } );
      },
      function(error) {
        menu.item(0, i, {title : 'Unavailable'} );
      }
    );  
} //function
//------------------------------------------------------------------------------
/* Loop through all sources and update the rates */
function updateRates() {
  for (var j=0;j<sources.length;j++) {
    menu.item(0, j, {title : 'Updating...', subtitle:sources[j].name} );
  }
  for (var i=0;i<sources.length;i++) {
    updateRate(i);
  } // for
} // function
//------------------------------------------------------------------------------
/* Main */
menu.show();
updateRates();

