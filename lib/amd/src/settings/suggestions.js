import jQuery as $ from 'jquery';
import {debounce} from 'core/utils';
import {arrowUp, arrowDown, enter} from 'core/key_codes';

const ARROWDOWN = 40;
const ARROWUP = 38;
const ENTER = 13;

let found = [];
let $results = null;
let $query = null;

export const init = () => {
    $(document).ready(() => {
        $query = $('#id_query');
        $($query.parent()).append('<ul id="search_live" style="position: absolute; z-index: 999999; list-style: none;" ' +
            'class="bg-white border border-top-0 border-warning pl-0">' +
            '</ul>');
        $results = $('#search_live');
        $results.hide();
        $query.keyup(keyup);
        $query.keydown(keydown);
        $results.keydown(keydown);

        $('body').click(hideResults);
    });
};

const keydown  = (e) => {
    if (found.length === 0) {
        return;
    }
    var keyCode = e.keyCode;
    var $current = $results.find('li.bg-secondary');
    var $next = null;
    if (keyCode === ARROWDOWN) {
        e.preventDefault();
        if ($current.length === 0) {
            $next = $results.find('li:first-child');
        } else {
            $next = $current.next();
        }
    } else if (keyCode === ARROWUP) {
        e.preventDefault();
        if ($current.length === 0) {
            $next = $results.find('li:last-child');
        } else {
            $next = $current.prev();
        }
    } else if (keyCode === ENTER) {
        if ($current.length > 0) {
            e.preventDefault();
            return;
        }
    }
    if ($next !== null) {
        $next.addClass('bg-secondary');
        $current.removeClass('bg-secondary');
    }
};

const keyup = (e) => {
    var keyCode = e.keyCode;
    var query = e.currentTarget.value.toLowerCase();
    var c = console;
    var $current = $results.find('li.bg-secondary');
    var links = document.querySelectorAll('.tab-pane ul li a');
    if (keyCode === ARROWDOWN || keyCode === ARROWUP) {
        e.preventDefault();
        return;
    } else if (keyCode === ENTER) {
        if ($current.length > 0) {
            e.preventDefault();
            window.location = $current.find('a').attr('href');
            return;
        }
    }
    $results.html('');
    found.length = 0;
    if (query.length >= 2) {
        c.log(query);
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
        $results.hide();
    } else {
        $results.show();
    }
};

const hideResults = (e) => {
    var $target = $(e.target);
    var $parents = $target.parents('#search_live');
    if ($parents.length === 0 && !$target.is($query)) {
        $results.hide();
    }
};