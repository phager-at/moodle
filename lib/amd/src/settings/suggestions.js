define(['jquery'], function($) {
    $(document).ready(function() {
        // Open site administration tab from anchor (hash) in URL
        var hash = window.location.hash.toString();
        //document.querySelectorAll("a[href='#"+hash+"']")[0].click();
        var $headinglink = $('a[href="' + hash + '"]');
        if ($headinglink.length > 0) {
            $('a[href="#linkroot"]').removeClass('active');
            $('.tab-pane.active#linkroot').removeClass('active');
            $headinglink.addClass('active');
            $('.tab-pane' + hash).addClass('active');
        }
        const ARROWDOWN = 40;
        const ARROWUP = 38;
        const ENTER = 13;
        var $query = $('#id_query');
        $($query.parent()).append('<ul id="search_live" style="position: absolute; z-index: 999999; list-style: none;" ' +
            'class="bg-white border border-top-0 border-warning pl-0">' +
            '</ul>');
        var $results = $('#search_live');
        var found = [];
        $results.hide();
        $query.keyup(function(e) {
            var keyCode = e.keyCode;
            var query = $(this).val().toLowerCase();
            var $current = $results.find('li.bg-secondary');
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
                $('.tab-pane ul li a').each(function() {
                    var $this = $(this);
                    var content = $this.text().toLowerCase();
                    if (content.indexOf(query) !== -1) {
                        if ($.inArray(content, found) === -1) {
                            found.push(content);
                            var $item = $('<li class="px-3 py-1"></li>');
                            $item.append($this.clone());
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
        });
        var keydown  = function(e) {
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
        $query.keydown(keydown);
        $results.keydown(keydown);
        var hideResults = function(e) {
            var $target = $(e.target);
            var $parents = $target.parents('#search_live');
            if ($parents.length === 0 && !$target.is($query)) {
                $results.hide();
            }
        };
        $('body').click(hideResults);
        $('ul.nav.nav-tabs > li.nav-item > a.nav-link').click(function() {
            window.location.hash = $(this).attr('href');
        });
    });
});