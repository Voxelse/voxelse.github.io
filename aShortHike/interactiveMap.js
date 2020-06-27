var editing = !1;

function getItems() {
  let e = {};

  for (let t = 0; t < $(".barIcon img").length; t++) {
    let n = $(".barIcon img")
            .eq(t)
            .attr("src");

    e[n.substring(9, n.length - 4)] = {
      name: $(".barTip span")
            .eq(t)
            .text(), 
      list: []
    };
  }

  for (let t = 0; t < $(".item").length; t++) {
    let n = $(".item")
            .eq(t),
        a = n[0].classList[1];

    if (!Object.keys(e).includes(a)) {
      console.log("unknown item type");
      continue;
    }

    let o = n.css("left"),
        s = n.css("bottom"),
        i = parseInt($(n)
            .children(".number")
            .html()),
        l = $(n).children(".tooltip")
            .html();

    -1 != l.indexOf("(") && (l = l.replace(/ \(\d+\)/g, "")),
    e[a].list.push({x: parseFloat(o), y: parseFloat(s), desc: l, nb: i || 1});
  }

  let t = JSON.stringify(e);

  [t.slice(0, 1), "\n", t.slice(1)]
    .join("")
    .replace(/":{/g, '":\n\t{')
    .replace(/":\[/g, '":[\n\t\t')
    .replace(/},{/g, "},\n\t\t{")
    .replace(/]},/g, "\n\t]},\n")
    .replace(/]}}/g, "\n\t]}\n}");

  console.log(t);
}

var clickX, clickY, wheelX, wheelY, wheelEvent = "";
const stepZoom = 17;
var mapZoom = (mapLerp = 17), lerpRatio = 0.2, dragElem = null, hovItem = null, zIndex = 0;

function zoomMap() {
  if (mapLerp != mapZoom) {
    let e = 1e-4, t = 0;

    if (Math.abs(mapZoom - mapLerp) < e) mapLerp = mapZoom;

    else {
      let e = lerp(mapLerp, mapZoom, lerpRatio);

      (t = 1 - zoomFunc(e) / zoomFunc(mapLerp)), (mapLerp = e);
    }
    let n = $("#map").css("transform"),
        a = n.lastIndexOf(","),
        o = n.lastIndexOf(",", a - 1),
        s = parseFloat(n.substring(a + 2, n.length - 1)),
        i = parseFloat(n.substring(o + 2, a)),
        l = $("#mapContainer")[0],
        r = s + (wheelY - l.offsetTop - s) * t,
        c = i + (wheelX - l.offsetLeft - i) * t,
        m = zoomFunc(mapLerp);

    $("#map").css("transform", "matrix(" + m + ", 0, 0, " + m + ", " + c + ", " + r + ")"),
    $(".item").css("transform", "scale(" + 1 / m + ")"),
    setSliderHeight(mapZoom);
  }

  requestAnimationFrame(zoomMap);
}

function lerp(e, t, n) {
  return e * (1 - n) + t * n;
}

function zoomFunc(e) {
  return (1 / e) * 2;
}

function showClass(e, t) {
  t ? $(e).removeClass("iconHide") : $(e).addClass("iconHide");

  let n = $(e).attr("src"),
      a = n.substring(n.indexOf("_") + 1, n.length - 4);

  t ? $("." + a).removeClass("itemHidden") : $("." + a).addClass("itemHidden");
}

$(document).ready(
  function() {
  let e = document.querySelector("#lowResMap");

  e.decode().then(() => {
    let t = document.querySelector("#highResMap");

    t.decode().then(() => {
      (t.style.visibility = "visible"), e.parentNode.removeChild(e);
    });
  });

  var t = $("<div>")
          .prependTo($("#bar"))
          .addClass("barTip"),
      n = $("<div>")
          .prependTo($("#bar"))
          .addClass("barIcon");

  for (let e = Object.keys(items).length - 1; e >= 0; e--) {
    let a = Object.keys(items)[e],
        o = Object.values(items)[e].name;

    n.prepend("<div><img draggable='false' ondragstart='return false;' src='res/icon_" + a + ".png'/></div>"),
    t.prepend("<div><div><span>" + o + "</span></div></div>");

    for (let t = 0; t < Object.values(items)[e].list.length; t++) {
      let n = Object.values(items)[e].list[t];

      (o = $("<div style= 'left: " + n.x + "px; bottom: " + n.y + "px' class='item " + a + "'><img draggable='false' ondragstart='return false;' src='" + (n.hasOwnProperty("icon") ? n.icon : "res/icon_" + a + ".png") + "'/></div>")),
      (s = "<span class='tooltip'>" + n.desc + "</span>");

      n.nb > 1 && (s = "<span class='number'>" + n.nb + "</span>" + s.replace(/<br>/g, " (" + n.nb + ")<br>")),
      o.append(s),
      $("#map").append(o);
    }
  }

  $(".barIcon > div").hover(
    function() {
      $(".barTip").children().eq($(this).index()).css("opacity", 1).css("visibility", "visible");
    },

    function() {
      $(".barTip").children().eq($(this).index()).css("opacity", 0).css("visibility", "hidden");
    }
  ),

  $(".barIcon > div").click(
    function(e) {
      e.ctrlKey
        ? ($.each($(".barIcon img"),
        function() {
          showClass(this, !1);
        }), 
        showClass($(this).find("img"), !0))
      
      : e.altKey
        ? $.each($(".barIcon img"),
        function() {
          showClass(this, $(this).hasClass("iconHide"));
      })
      
      : e.shiftKey
        ? $.each($(".barIcon img"),
        function() {
          showClass(this, !0);
      })
      
      : showClass($(this).find("img"),
      $(this).find("img").hasClass("iconHide"));
  }),

  $("#compass").click(
    function() {
      (mapZoom = mapLerp = 17),
      $("#map").css("transform", "translate(0px, 0px) scale(" + zoomFunc(17) + ")"),
      $(".item").css("transform", ""),
      setSliderHeight(17);
  }),

  $(".item").hover(
    function() {
      $(this).css("z-index", ++zIndex), (hovItem = $(this));
    },

    function() {
      hovItem = null;
  }),
  
  (wheelEvent = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel");
}),

$(document).on({
  mousemove: function(e) {
    let t;

    if (editing && dragElem && void 0 !== (t = dragElem.attr("class")) && t.includes("item")) {
        let t = dragElem.css("transform"),
            n = parseFloat(t.substring(7, t.indexOf(","))),
            a = parseFloat(dragElem.css("left")) - (clickX - e.pageX) * n,
            o = parseFloat(dragElem.css("bottom")) + (clickY - e.pageY) * n;

        dragElem.css("left", a + "px").css("bottom", o + "px");
    } else if (dragElem && ("map" == dragElem[0].id || "#document" == dragElem[0].nodeName)) {
      let t = $("#map")
              .css("transform")
              .split(","),
          n = parseFloat(t[3]),
          a = parseFloat(t[4]) - (clickX - e.pageX),
          o = parseFloat(t[5]) - (clickY - e.pageY);

      $("#map").css("transform", "translate(" + a + "px, " + o + "px) scale(" + n + ")");
    }

    (clickX = e.pageX), (clickY = e.pageY);
  },

  mousedown: function(e) {
    (dragElem = $(e.target).parent()),
    e.ctrlKey && dragElem && void 0 !== (className = dragElem.attr("class")) && className.includes("item") && dragElem.clone(!0).appendTo(dragElem.parent()),
    (clickX = e.pageX),
    (clickY = e.pageY);
    },

  mouseup: function() {
    dragElem = null;
  },

  mousewheel: function(e) {
    (wheelX = e.pageX),
    (wheelY = e.pageY);

    let t = mapZoom < 2 || (2 == mapZoom && e.originalEvent.wheelDelta > 0) ? 0.5 : 1;

    mapZoom = Math.min(Math.max(mapZoom + (e.originalEvent.wheelDelta > 0 ? -t : t), 1), 17);
  },

  DOMMouseScroll: function(e) {
    (wheelX = e.pageX),
    (wheelY = e.pageY);

    let t = mapZoom < 2 || (2 == mapZoom && -e.originalEvent.detail > 0) ? 0.5 : 1;

    mapZoom = Math.min( Math.max(mapZoom + (-e.originalEvent.detail > 0 ? -t : t), 1), 17);
  },

  keydown: function(e) {
    if (null != hovItem && editing)
    if (107 == e.which || 109 == e.which) {
      let t = hovItem.children(".number");

      0 == t.length && 107 == e.which && (t = $("<span class='number'>1</span>").appendTo(hovItem)),
      107 == e.which && t.html(parseInt(t.html()) + 1),
      109 == e.which && t.html(parseInt(t.html()) - 1),
      "1" == t.html() && t.remove();
    } else {
      let t = hovItem.children(".tooltip");

      switch (e.which) {
        case 8:
          t.html(t.html().substring(0, t.html().length - 1));
          break;
        case 13:
          t.append("<br>");
      }

      1 == e.key.length && hovItem.children(".tooltip")
                                  .html(hovItem.children(".tooltip")
                                  .html() + e.key);
    }
  }
}),

$(".menu input").on("input", function(e) {
  e.target.value.length > 0 ? $.each($(".item .tooltip"),
  function() {
    -1 == $(this).parent().text().toLowerCase().indexOf(e.target.value)
          ? ($(this).parent().removeClass("searchShown").addClass("searchHidden"),
          $(this).removeClass("searchShown").addClass("searchHidden"))
          : ($(this).parent().removeClass("searchHidden").addClass("searchShown"),
          $(this).removeClass("searchHidden").addClass("searchShown"));
    }) : $.each($(".item .tooltip"),
      function() {
        $(this).parent().removeClass("searchShown").removeClass("searchHidden"),
        $(this).removeClass("searchShown").removeClass("searchHidden");
    });
}),

requestAnimationFrame(zoomMap);

var setSliderHeight = function(e) {
    slider.style.height = 6.25 * (mapZoom - 1) + "%";
},

container = document.getElementById("slider-container"),
slider = document.getElementById("slider-bar"),
handle = document.getElementById("slider-handle"),
isSliding = !1,

move = function(e) {
  var t,
      n = 0,
      a = 0;

  if (!e) e = window.event;
    e.pageY ? (n = e.pageY) : e.clientY && (n = e.clientY),
    (a = (100 * (n - container.offsetTop)) / container.offsetHeight) < 0 ? (a = 0) : a > 100 && (a = 100),
    (slider.style.height = a + "%"),
    (t = (16 * a) / 100),
    (wheelX = $(window).width() / 2),
    (wheelY = $(window).height() / 2),
    (mapZoom = t + 1);
},

addSlide = function() {
  (isSliding = !0),
  window.addEventListener
  ? document.addEventListener("mousemove", move, !1)
  : document.attachEvent("onmousemove", move);
},

cancelSlide = function() {
    isSliding && (window.removeEventListener
    ? document.removeEventListener("mousemove", move, !1)
    : window.detachEvent && document.detachEvent("onmousemove", move));
},

cancelBubble = function(e) {
  var t = e || window.event;

  t.stopPropogation && t.stopPropogation(),
  null != t.cancelBubble && (t.cancelBubble = !0),
  t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
},

addSlideEvent = function(e) {
  addSlide(), cancelBubble(e);
},

cancelSlideEvent = function(e) {
  cancelSlide(),
  cancelBubble(e);
},

moveEvent = function(e) {
  move(e),
  cancelBubble(e);
};

(handle.onmousedown = addSlideEvent),
(handle.onmouseup = cancelSlideEvent),
(slider.onmousedown = moveEvent),
(slider.onmouseup = cancelSlideEvent),
(container.onmousedown = moveEvent),
(container.onmouseup = cancelSlideEvent),
(document.onmouseup = cancelSlideEvent),

(jQuery.expr[":"].icontains = function(e, t, n) {
  return (
    jQuery(e).text().toUpperCase().indexOf(n[3].toUpperCase()) >= 0
  );
});
