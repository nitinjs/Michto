var position = { x: 0, y: 0 };
var calendarMap = [];

$(document).ready(function () {
    function calculateVisualRows() {
        const items = $('figure');
        let currentRowTop = null;
        let visualRowNumber = 0;

        items.each((index, item) => {
            // Get the distance of the element from the top of its offsetParent
            const currentItemTop = $(item).position().top;

            // If this is the first item, OR if its top position is significantly lower 
            // than the previous item's top position, it has wrapped to a new row.
            // (We add a 5px margin of error to account for minor rendering differences)
            if (currentRowTop === null || currentItemTop > currentRowTop + 5) {
                visualRowNumber++;
                currentRowTop = currentItemTop;
            }

            // Assign the calculated row number to a data attribute for logic...
            $(item).attr('data-visual-row', visualRowNumber);
        });
    }

    function onEnabled() {
        $('.swipebox').swipebox();
        calculateVisualRows();
        var maxRows = _.max($("figure[data-visual-row]"), function(figure){ 
            return $(figure).attr("data-visual-row"); 
        });
        var maxRowNumber = parseInt($(maxRows).attr("data-visual-row"));
        for(var i=1; i<=maxRowNumber; i++){
            var maps = []; 
            $("figure[data-visual-row='" + i + "']").each(function (i1, e1) {
                maps.push($(e1));
            });        
            calendarMap.push(maps);
        }
        highlightCell();
    }

    var imageData = [
        { "filename": "vn.jpg", "aspectRatio": "1.3300" },
        { "filename": "vn2.jpg", "aspectRatio": "1.6300" },
        { "filename": "vn3.jpg", "aspectRatio": "1.3300" },
        { "filename": "vn4.jpg", "aspectRatio": "1.3300" },
        { "filename": "vn.jpg", "aspectRatio": "1.3300" },
        { "filename": "vn2.jpg", "aspectRatio": "1.6300" },
        { "filename": "vn3.jpg", "aspectRatio": "1.3300" },
        { "filename": "vn4.jpg", "aspectRatio": "1.3300" },
    ];
    var loaded = false;
    var pig = new Pig(imageData, {
        urlForSize: function (filename, size) {
            return '' + 'img/' + size + '/' + filename;
        },
        addAnchorTag: true,
        anchorTargetDir: "",
        anchorClass: "swipebox",
        onLoad: function () {
            if(!loaded){
                onEnabled();
                loaded = true;
            }
        }
    }).enable();
});

$(window).on('keydown', function (e) {
    if (e.keyCode === 37) // left
        moveLeft();
    else if (e.keyCode === 38) // up
        moveUp();
    else if (e.keyCode === 39) // right
        moveRight();
    else if (e.keyCode === 40) // down
        moveDown();
    else if (e.keyCode === 13) // enter
        openImage();
    highlightCell();
});

function scrollIntoView($el) {
    window.scrollTo({ top: $el.offset().top, behavior: 'auto' });
}

function openImage(){
    calendarMap[position.y][position.x].find('a')[0].click();
}

function moveLeft() {
    position.x--;
    if (position.x < 0)
        position.x = 0;
}

function moveUp() {
    position.y--;
    if (position.y < 0)
        position.y = 0;
}

function moveRight() {
    position.x++;
    if (position.x >= calendarMap[0].length)
        position.x = calendarMap[0].length - 1;
}

function moveDown() {
    position.y++;
    if (position.y >= calendarMap.length)
        position.y = calendarMap.length - 1;
}

function highlightCell() {
    $('figure').removeClass('selected');
    var $figure = calendarMap[position.y][position.x];
    $figure.addClass('selected');
    scrollIntoView($figure);
}