var editing = true;
function getItems() {
    let struct = {};
    for (let i = 0; i < $('.barIcon img').length; i++) {
        let srcName = $('.barIcon img').eq(i).attr("src");
        struct[srcName.substring(9, srcName.length-4)] = {"name": $('.barTip span').eq(i).text(), "list":[]};
    }
    for (let i = 0; i < $('.item').length; i++) {
        let elem = $('.item').eq(i);
        let className = elem[0].classList[1];
        if(!Object.keys(struct).includes(className)) {
            console.log("unknown item type");
            continue;
        }
        let posX = elem.css("left");
        let posY = elem.css("bottom");
        let number = parseInt($(elem).children(".number").html());
        let desc = $(elem).children(".tooltip").html();
        
        if(desc.indexOf('(') != -1)
            desc = desc.replace(/ \(\d+\)/g, "");

        struct[className]["list"].push({"x": parseFloat(posX), "y": parseFloat(posY), "desc": desc, "nb": number || 1});
    }
    let json = JSON.stringify(struct);
    let jsonFormat = [json.slice(0, 1), '\n', json.slice(1)].join('').replace(/":{/g, '":\n\t{').replace(/":\[/g, '":\[\n\t\t').replace(/},{/g, '},\n\t\t{').replace(/]},/g, '\n\t]},\n').replace(/]}}/g, '\n\t]}\n}')
    console.log(json);
}

var wheelEvent = '';

var clickX, clickY, wheelX, wheelY;
const stepZoom = 17;
var mapZoom = mapLerp = 17;
var lerpRatio = 0.2;
var dragElem = null;
var hovItem = null;
var zIndex = 0;
$(document).ready(function() {
    let lowImg = document.querySelector("#lowResMap");
    lowImg.decode().then(() => {
        let highImg = document.querySelector("#highResMap");
        highImg.decode().then(() => {
            highImg.style.visibility = "visible";
            lowImg.parentNode.removeChild(lowImg);
        })
    })

    var tipBar = $("<div>").prependTo($('#bar')).addClass("barTip");
    var imgBar = $("<div>").prependTo($('#bar')).addClass("barIcon");
    for (let i = Object.keys(items).length-1; i >= 0; i--) {
        let itemName = Object.keys(items)[i];
        let itemNameClean = Object.values(items)[i]["name"];
        imgBar.prepend("<div><img draggable='false' ondragstart='return false;' src='res/icon_"+itemName+".png'/></div>");
        tipBar.prepend("<div><div><span>"+itemNameClean+"</span></div></div>");
        for (let j = 0; j < Object.values(items)[i]["list"].length; j++) {
            let itemInfo = Object.values(items)[i]["list"][j];
            let itemNode = $("<div style= 'left: "+itemInfo.x+"px; bottom: "+itemInfo.y+"px' class='item "+itemName+"'><img draggable='false' ondragstart='return false;' src='res/icon_"+itemName+".png'/></div>");
            let itemTip = "<span class='tooltip'>"+itemInfo.desc+"</span>";
            if(itemInfo.nb > 1)
                itemTip = "<span class='number'>"+itemInfo.nb+"</span>" + itemTip.replace(/<br>/g, " ("+itemInfo.nb+")<br>")
            itemNode.append(itemTip);
            $("#map").append(itemNode);
        }
    }

    $(".barIcon > div").hover(
        function() {
            $(".barTip").children().eq($(this).index()).css("opacity", 1).css("visibility", "visible");
        },
        function() {
            $(".barTip").children().eq($(this).index()).css("opacity", 0).css("visibility", "hidden");
        }
    );

    $(".barIcon > div").click(function(e) {
        if(e.ctrlKey) {
            $.each($('.barIcon img'), function() {
                showClass(this, false);
            });
            showClass($(this).find("img"), true);
        } else if(e.altKey) {
            $.each($('.barIcon img'), function() {
                showClass(this, $(this).hasClass("iconHide"));
            });
        } else if(e.shiftKey) {
            $.each($('.barIcon img'), function() {
                showClass(this, true);
            });
        } else {
            showClass($(this).find("img"), $(this).find("img").hasClass("iconHide"));
        }
    });

    $("#compass").click(function() {
        mapZoom = mapLerp = stepZoom;
        $('#map').css("transform", "translate(0px, 0px) scale("+zoomFunc(stepZoom)+")");
        $('.item').css("transform", "");
        setSliderHeight(stepZoom);
    });

    $(".item").hover(
        function() {
            $(this).css("z-index", ++zIndex);
            hovItem = $(this);
        },
        function() {
            hovItem = null;
        }
    );
    wheelEvent = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
});

$(document).on({
    'mousemove': function(e) {
        let className;
        if (editing && dragElem && (className = dragElem.attr("class")) !== undefined && className.includes("item")) {
            let transform = dragElem.css("transform");
            let scale = parseFloat(transform.substring(7, transform.indexOf(',')));
            let mapX = parseFloat(dragElem.css("left")) - (clickX - e.pageX) * scale;
            let mapY = parseFloat(dragElem.css("bottom")) + (clickY - e.pageY) * scale;
            dragElem.css("left", mapX+"px").css("bottom", mapY+"px");
        } else if(dragElem && (dragElem[0].id == "map" || dragElem[0].nodeName == "#document")) {
            let transform = $('#map').css("transform").split(',');
            let scale = parseFloat(transform[3]);
            let mapX = parseFloat(transform[4]) - (clickX - e.pageX);
            let mapY = parseFloat(transform[5]) - (clickY - e.pageY);
            $('#map').css("transform", "translate("+mapX+"px, "+mapY+"px) scale("+scale+")");
        }
        clickX = e.pageX;
        clickY = e.pageY;
    },
    'mousedown': function(e) {
        dragElem = $(e.target).parent();

        if(e.ctrlKey && dragElem && (className = dragElem.attr("class")) !== undefined && className.includes("item"))
            dragElem.clone(true).appendTo(dragElem.parent());

        clickX = e.pageX;
        clickY = e.pageY;
    },
    'mouseup': function() {
        dragElem = null;
    },
    'mousewheel': function(e){
        wheelX = e.pageX;
        wheelY = e.pageY;
        let step = (mapZoom < 2 || (mapZoom == 2 && e.originalEvent.wheelDelta > 0)) ? .5 : 1;
        mapZoom = Math.min(Math.max(mapZoom + (e.originalEvent.wheelDelta > 0 ? -step : step), 1), stepZoom);
    },
    'DOMMouseScroll': function(e){
        wheelX = e.pageX;
        wheelY = e.pageY;
        let step = (mapZoom < 2 || (mapZoom == 2 && -e.originalEvent.detail > 0)) ? .5 : 1;
        mapZoom = Math.min(Math.max(mapZoom + (-e.originalEvent.detail > 0 ? -step : step), 1), stepZoom);
    },
    'keydown': function(e) {
        if(hovItem == null || !editing) return;

        if(e.which == 107 || e.which == 109) {
            let itemNb = hovItem.children(".number");

            if(itemNb.length == 0 && e.which == 107)
                itemNb = $("<span class='number'>1</span>").appendTo(hovItem);

            if(e.which == 107) itemNb.html(parseInt(itemNb.html())+1);
            if(e.which == 109) itemNb.html(parseInt(itemNb.html())-1);

            if(itemNb.html() == "1")
                itemNb.remove();
        } else {
            let tipText = hovItem.children(".tooltip");
            switch(e.which) {
                case 8:
                    tipText.html(tipText.html().substring(0, tipText.html().length-1));
                    break;
                case 13:
                    tipText.append("<br>");
                    break;
            }
            if(e.key.length == 1)
                hovItem.children(".tooltip").html(hovItem.children(".tooltip").html()+e.key);
        }

    }
});

$(".menu input").on("input", function(e) {
    if(e.target.value.length > 0) {
        $.each($(".item .tooltip"), function() {
            if ($(this).parent().text().toLowerCase().indexOf(e.target.value) == -1) { 
                $(this).parent().removeClass("searchShown").addClass("searchHidden");
                $(this).removeClass("searchShown").addClass("searchHidden");
            } else {
                $(this).parent().removeClass("searchHidden").addClass("searchShown");
                $(this).removeClass("searchHidden").addClass("searchShown");
            }
        });
    } else {
        $.each($(".item .tooltip"), function() {
            $(this).parent().removeClass("searchShown").removeClass("searchHidden");
            $(this).removeClass("searchShown").removeClass("searchHidden");
        });
    }
});

function zoomMap() {
    if(mapLerp != mapZoom) {
        let epsilon = 0.0001;
        let ratio = 0;
        if(Math.abs(mapZoom-mapLerp) < epsilon) {
            mapLerp = mapZoom;
        } else {
            let nextZoom = lerp(mapLerp, mapZoom, lerpRatio);
            ratio = 1-zoomFunc(nextZoom)/zoomFunc(mapLerp);
            mapLerp = nextZoom;
        }

        let transform = $('#map').css("transform");

        let yComma = transform.lastIndexOf(',');
        let xComma = transform.lastIndexOf(',', yComma-1);

        let yRaw = parseFloat(transform.substring(yComma+2, transform.length-1));
        let xRaw = parseFloat(transform.substring(xComma+2, yComma));

        let container = $("#mapContainer")[0];

        let y = yRaw + (wheelY -container.offsetTop - yRaw) * ratio;
        let x = xRaw + (wheelX -container.offsetLeft - xRaw) * ratio;

        let invLerp = zoomFunc(mapLerp);
        $('#map').css("transform", "matrix("+invLerp+", 0, 0, "+invLerp+", "+x+", "+y+")");
        
        $('.item').css("transform", "scale("+1/invLerp+")");

        setSliderHeight(mapZoom);
    }

    requestAnimationFrame(zoomMap);
}

requestAnimationFrame(zoomMap);

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t;
}

function zoomFunc(v) {
    return 1/v*2;
}

function showClass(elem, bool) {
    bool ? $(elem).removeClass("iconHide") : $(elem).addClass("iconHide");
    let src = $(elem).attr("src");
    let name = src.substring(src.indexOf('_')+1, src.length-4);

    if(bool)
        $("."+name).removeClass("itemHidden");
    else
        $("."+name).addClass("itemHidden");
}

var setSliderHeight =  function(curZoom) {
    slider.style.height = (100/(stepZoom-1)*(mapZoom-1)) + '%';
}

var container = document.getElementById("slider-container");
var slider = document.getElementById("slider-bar");
var handle = document.getElementById("slider-handle");

var isSliding = false;

var move = function(e) {
    var mouseY = 0;
    var containerTop = 0;
    var newHeight = 0;
    var containerHeight = 0;
    var percentHght = 0;
    var x = 0;
    var y = 0;

    if (!e) var e = window.event;

    if(e.pageY) // all browsers except IE before version 9
        mouseY = e.pageY;
    else if (e.clientY) // IE before version 9
        mouseY = e.clientY;   

    containerTop = container.offsetTop;
    newHeight = mouseY - containerTop;
    containerHeight = container.offsetHeight;
    percentHght = newHeight * 100 / containerHeight;

    if(percentHght < 0) {
        percentHght = 0;
    } else if(percentHght > 100) {
        percentHght = 100;
    }
    slider.style.height = percentHght + '%';
    y = percentHght;
    x = y * (stepZoom-1) / 100;

    wheelX = $(window).width()/2;
    wheelY = $(window).height()/2;
    mapZoom = x+1;
};

var addSlide = function() {
    isSliding = true;
    if (!window.addEventListener)
        document.attachEvent('onmousemove',move);
    else
        document.addEventListener('mousemove', move, false);
};

var cancelSlide = function() {
    if(isSliding) {
        if(window.removeEventListener)
            document.removeEventListener('mousemove', move, false);
        else if (window.detachEvent)
            document.detachEvent('onmousemove', move );
    }
};

var cancelBubble = function(e) {
    var evt = e ? e:window.event;

    if (evt.stopPropogation)
        evt.stopPropogation();

    if (evt.cancelBubble != null)
        evt.cancelBubble = true;

    if (evt.preventDefault)
        evt.preventDefault();
    else
        evt.returnValue = false;
};

var addSlideEvent = function(e) {
    addSlide();
    cancelBubble(e);
};
var cancelSlideEvent = function(e) {
    cancelSlide();
    cancelBubble(e);
};
var moveEvent = function(e) {
    move(e);
    cancelBubble(e);
};

handle.onmousedown = addSlideEvent;
handle.onmouseup = cancelSlideEvent;

slider.onmousedown = moveEvent;
slider.onmouseup = cancelSlideEvent;

container.onmousedown = moveEvent;
container.onmouseup = cancelSlideEvent;

document.onmouseup = cancelSlideEvent;

jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};