// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Admin search suggestions to the site admin settings page.
 *
 * @module     core/settings/suggestions
 * @package    core/settings
 * @copyright  2020 Simeon Naydenov <moniNaydenov@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import {debounce} from 'core/utils';
import {arrowUp, arrowDown, enter} from 'core/key_codes';

let found = [];
let $results = null;
const searchBox = document.querySelector(selectors.searchBox);
let resultBox = null;
var c = console;
const ulHTML = '<ul data-searchResults style="position: absolute; z-index: 999999; list-style: none;" ' +
    'class="bg-white border border-top-0 border-warning pl-0"></ul>';
const selectors = {
    body: 'body',
    currentResult: 'li.bg-secondary',
    firstResult: 'li:first-child',
    lastResult: 'li:last-child',
    resultBox: 'ul[data-searchResults]',
    searchBox: '#id_query'
};

const cssClasses = {
    selectedResult: 'bg-secondary'
};

/**
 * TODO: mention what does this does.
 *
 * @method init
 */
export const init = () => {
    c.log(searchBox);
    searchBox.outerHTML += ulHTML;
    resultBox = document.querySelector(selectors.resultBox);
    hideResultBox();
    searchBox.addEventListener('input', debounce((e) => {c.log(e); c.log('test');}, 300));
    c.log(keyUp);
    c.log(keyDown);
    /*searchBox.addEventListener('keyup', event => { keyUp(event); });
    searchBox.addEventListener('keydown', keyDown);*/
    //resultBox.addEventListener('keydown', keyDown);
    document.querySelector(selectors.body).addEventListener('click', (e) => {
        let target = e.target;
        let parents = e.composedPath().indexOf(selectors.resultBox);
        c.log(target);
        c.log(parents);
        /*if ($parents.length === 0 && !$target.is($query)) {
        }*/
    });
};

/**
 * Listener that handles keyDown event. Depending on the keyCode, it does:
 *   * arrowDown, arrowUp - iterates through the results in resultBox (if present)
 *   * enter - if no item is selected, submits the form, if an item is selected, does nothing and waits for keyup event
 * @method keyDown
 */
const keyDown = (e) => {
    c.log(e);
    if (found.length === 0) {
        return;
    }
    let current = resultBox.querySelector(selectors.currentResult);
    let next = null;
    if (e.keyCode === arrowDown) {
        e.preventDefault();
        if (current === null) {
            next = resultBox.querySelector(selectors.firstResult);
        } else {
            next = current.nextElementSibling;
        }
    } else if (e.keyCode === arrowUp) {
        e.preventDefault();
        if (current === null) {
            next = resultBox.querySelector(selectors.lastResult);
        } else {
            next = current.previousElementSibling;
        }
    } else if (e.keyCode === enter) {
        if (current !== null) {
            e.preventDefault();
            return;
        }
    }
    if (next !== null) {
        next.classList.add(cssClasses.selectedResult);
        if (current !== null) {
            current.classList.remove(cssClasses.selectedResult);
        }
    }
};

/**
 * TODO: mention what does this does.
 *
 * @method keyUp
 */
const keyUp = (e) => {
    var keyCode = e.keyCode;
    var query = e.currentTarget.value.toLowerCase();
    c.log(e);
    var $current = $results.find('li.bg-secondary');
    var links = document.querySelectorAll('.tab-pane ul li a');
    if (keyCode === arrowDown || keyCode === arrowUp) {
        e.preventDefault();
        return;
    } else if (keyCode === enter) {
        if ($current.length > 0) {
            e.preventDefault();
            window.location = $current.find('a').attr('href');
            return;
        }
    }
    resultBox.innerHTML = '';
    found.length = 0;
    if (query.length >= 2) {
        window.console.log(query);
        links.forEach(link => {
            var content = link.textContent.toLowerCase();
            if (content.indexOf(query) !== -1) {
                if ($.inArray(content, found) === -1) {
                    found.push(content);
                    var $item = $('<li class="px-3 py-1"></li>');
                    $item.append(link.outerHTML);
                    $results.append($item);
                }
            }
        });
    }
    if (found.length === 0) {
        hideResultBox();
    } else {
        showResultBox();
    }
};

/**
 * TODO: mention what does this does.
 *
 * @method hideResultBox
 */
const hideResultBox = () => {
    resultBox.style.display = 'none';
};

/**
 * Makes the resultBox visible
 *
 * @method showResultBox
 */

const showResultBox = () => {
    resultBox.style.display = 'block';
};
