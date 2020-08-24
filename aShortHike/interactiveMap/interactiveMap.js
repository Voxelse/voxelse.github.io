var editing=!1;function getItems(){let e={};for(let s=0;s<$(".barIcon img").length;s++){let t=$(".barIcon img").eq(s).attr("src");e[t.substring(9,t.length-4)]={name:$(".barTip span").eq(s).text(),list:[]}}for(let s=0;s<$(".item").length;s++){let t=$(".item").eq(s),a=t[0].classList[1];if(!Object.keys(e).includes(a)){console.log("unknown item type");continue}let n=t.css("left"),i=t.css("bottom"),o=parseInt(t.children(".number").html()),r=t.attr("name"),l=t.attr("src")||t.find("img").attr("src");l=l.substring(l.lastIndexOf("_")+1,l.lastIndexOf(".")),-1!=r.indexOf("(")&&(r=r.replace(/ \(\d+\)/g,"")),e[a].list.push({x:parseFloat(n),y:parseFloat(i),desc:r,...o>1&&{nb:o},...a!=l&&{ico:l}})}let s=JSON.stringify(e),t=[s.slice(0,1),"\n",s.slice(1)].join("").replace(/":{/g,'":\n\t{').replace(/":\[/g,'":[\n\t\t').replace(/},{/g,"},\n\t\t{").replace(/]},/g,"\n\t]},\n").replace(/]}}/g,"\n\t]}\n}");console.log(t)}function getPath(){let e={};for(let s=0;s<$("path").length;s++){let t=$("path").eq(s).attr("id");e[t.substring(4)]={name:$("path").eq(s).attr("name"),list:[]};let a=0;for(;$("#"+t+a).length>0;){let s={},n=parseFloat($("#"+t+a).css("cx")),i=parseFloat($("#"+t+a).css("cy"));s.point={x:n,y:i};let o=parseFloat($("#"+t+a+"_1").css("cx"));if(!isNaN(o)){let e=parseFloat($("#"+t+a+"_1").css("cy"));s.handleL={x:o,y:e}}let r=parseFloat($("#"+t+a+"_2").css("cx"));if(!isNaN(r)){let e=parseFloat($("#"+t+a+"_2").css("cy"));s.handleR={x:r,y:e}}e[t.substring(4)].list[a++]=s}}let s=JSON.stringify(e),t=[s.slice(0,1),"\n",s.slice(1)].join("").replace(/":{"n/g,'":\n\t{"n').replace(/":\[/g,'":[\n\t\t').replace(/},{/g,"},\n\t\t{").replace(/]},/g,"\n\t]},\n").replace(/]}}/g,"\n\t]}\n}");console.log(t)}function getFishRegion(){let e={square:[]};for(let s=0;s<$("svg rect.fish").length;s++){let t=$("svg rect.fish").eq(s),a=parseFloat(t.css("x")),n=parseFloat(t.css("y")),i=2*parseFloat(t.css("width")),o=2*parseFloat(t.css("height"));e.square[s]={x:a,y:n,width:i,height:o,desc:""}}e.circle=[];for(let s=0;s<$("svg circle.fish").length;s++){let t=$("svg circle.fish").eq(s),a=parseFloat(t.css("cx")),n=parseFloat(t.css("cy")),i=parseFloat(t.css("r"));e.circle[s]={x:a,y:n,radius:i,desc:""}}let s=JSON.stringify(e),t=[s.slice(0,1),"\n",s.slice(1)].join("").replace(/":\[/g,'":[\n\t').replace(/},{/g,"},\n\t{").replace(/}\]/g,"}\n]").replace(/],/g,"],\n");console.log(t)}var clickX,clickY,wheelX,wheelY,wheelEvent="";const stepZoom=20;var mapZoom=mapLerp=20,lerpRatio=.2,dragElem=null,dragSvg=null,hovItem=null,zIndex=3;function zoomMap(){if(mapLerp!=mapZoom){let e=1e-4,s=0;if(Math.abs(mapZoom-mapLerp)<e)mapLerp=mapZoom;else{let e=lerp(mapLerp,mapZoom,lerpRatio);s=1-zoomFunc(e)/zoomFunc(mapLerp),mapLerp=e}let t=$("#map").css("transform"),a=t.lastIndexOf(","),n=t.lastIndexOf(",",a-1),i=parseFloat(t.substring(a+2,t.length-1)),o=parseFloat(t.substring(n+2,a)),r=$("#mapContainer")[0],l=i+(wheelY-r.offsetTop-i)*s,c=o+(wheelX-r.offsetLeft-o)*s,d=zoomFunc(mapLerp);$("#map").css("transform","matrix("+d+", 0, 0, "+d+", "+c+", "+l+")");let h=mapLerp/2;$(".item:not(.itemHidden), .searchShown").css("transform","scale("+h+")"),$("#pathTooltip").css("transform","scale("+h+")").css("margin-bottom",20*h+"px"),$("#itemTooltip").css("transform","scale("+h+")").css("margin-bottom",40*h+16+"px"),setSliderHeight(mapZoom)}requestAnimationFrame(zoomMap)}function lerp(e,s,t){return e*(1-t)+s*t}function zoomFunc(e){return 1/e*2}function showClass(e,s){s?$(e).removeClass("iconHide"):$(e).addClass("iconHide");let t=$(e).attr("src"),a=t.substring(t.indexOf("_")+1,t.length-4);if(s){let e=$("."+a);e.hasClass("item")&&e.css("transform","scale("+mapLerp/2+")"),e.removeClass("itemHidden")}else $("."+a).addClass("itemHidden")}$(window).focus(function(){document.querySelector("#highResMap").decode()}),$(document).ready(function(){let e=document.querySelector("#lowResMap");e.decode().then(()=>{let s=document.querySelector("#highResMap");s.decode().then(()=>{s.style.visibility="visible",e.parentNode.removeChild(e)}).catch(t=>{s.style.visibility="visible",e.parentNode.removeChild(e),console.log(t)})});var s=$("<div>").prependTo($("#bar")).addClass("barTip"),t=$("<div>").prependTo($("#bar")).addClass("barIcon");for(let e=Object.keys(items).length-1;e>=0;e--){let a=Object.keys(items)[e],n=Object.values(items)[e].name;t.prepend("<div><img draggable='false' ondragstart='return false;' src='res/icon_"+a+".png'/></div>"),s.prepend("<div><div><span>"+n+"</span></div></div>");for(let s=0;s<Object.values(items)[e].list.length;s++){let t,n=Object.values(items)[e].list[s];n.nb>1?(t=$("<div style= 'left: "+n.x+"px; bottom: "+n.y+"px' class='item "+a+"' name='"+n.desc+"'><img draggable='false' ondragstart='return false;' src='res/icon_"+(n.hasOwnProperty("ico")?n.ico:a)+".png'/><span class='number'>"+n.nb+"</span></div>")).children(0)[0].decode():(t=$("<img style= 'left: "+n.x+"px; bottom: "+n.y+"px' class='item "+a+"' name='"+n.desc+"' draggable='false' ondragstart='return false;' src='res/icon_"+(n.hasOwnProperty("ico")?n.ico:a)+".png'/>"))[0].decode(),$("#map").append(t)}}$("#map").prepend('<div class="tooltip" id="itemTooltip"></div>').prepend('<div class="tooltip" id="pathTooltip"></div>');let a='<svg class="svgData" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" draggable="false" ondragstart="return false">';for(let e=Object.keys(paths).length-1;e>=0;e--){let s="path"+Object.keys(paths)[e],t=Object.values(paths)[e].name,n=Object.values(paths)[e].list[0],i=n.point,o='<path id="'+s+'" name="'+t+'" d="M '+(i.x+(null!=n.handleR?0:16))+" "+(i.y+(null!=n.handleR?0:16)),r='<circle class="path point" id="'+s+'0" cx="'+(n.point.x+(null!=n.handleR?0:16))+'" cy="'+(n.point.y+(null!=n.handleR?0:16))+'" r="7.5"/>';editing&&(r+='<circle class="path handle" id="'+s+'0_2" cx="'+(null!=n.handleR?n.handleR.x:n.point.x+32)+'" cy="'+(null!=n.handleR?n.handleR.y:n.point.y+32)+'" r="5"/>');for(let t=1;t<Object.values(paths)[e].list.length;t++){let a=Object.values(paths)[e].list[t],n=Object.values(paths)[e].list[t-1],i=null!=a.handleL||null!=a.handleR;o+=i?", C "+n.handleR.x+" "+n.handleR.y+" "+a.handleL.x+" "+a.handleL.y+" "+a.point.x+" "+a.point.y:", "+(a.point.x+16)+" "+(a.point.y+16),r+='<circle class="path point" id="'+s+t+'" cx="'+(a.point.x+(i?0:16))+'" cy="'+(a.point.y+(i?0:16))+'" r="7.5"/>',editing&&(r+='<circle class="path handle" id="'+s+t+'_1" cx="'+(i?a.handleL.x:a.point.x)+'" cy="'+(i?a.handleL.y:a.point.y)+'" r="5"/>',t!=Object.values(paths)[e].list.length-1&&(r+='<circle class="path handle" id="'+s+t+'_2" cx="'+(i?a.handleR.x:a.point.x+32)+'" cy="'+(i?a.handleR.y:a.point.y+32)+'" r="5"/>'))}a+=(o+='"></path>')+r}for(let e=Object.keys(fishRegions.square).length-1;e>=0;e--){let s=fishRegions.square[e];a+='<rect class="fish" x="'+s.x+'" y="'+s.y+'" width="'+s.width+'" height="'+s.height+'" desc="'+s.desc+'"/>'}for(let e=Object.keys(fishRegions.circle).length-1;e>=0;e--){let s=fishRegions.circle[e];a+='<circle class="fish" cx="'+s.x+'" cy="'+s.y+'" r="'+s.radius+'" desc="'+s.desc+'"/>'}$("#map").prepend(a+"</svg>"),$(".barIcon div:nth-last-child(-n+3)").each(function(){showClass(this.firstChild)}),$(".barIcon > div").hover(function(){$(".barTip").children().eq($(this).index()).css("opacity",1).css("visibility","visible")},function(){$(".barTip").children().eq($(this).index()).css("opacity",0).css("visibility","hidden")}),$(".barIcon > div").click(function(e){e.ctrlKey?($.each($(".barIcon img"),function(){showClass(this,!1)}),showClass($(this).find("img"),!0)):e.altKey?$.each($(".barIcon img"),function(){showClass(this,$(this).hasClass("iconHide"))}):e.shiftKey?$.each($(".barIcon img"),function(){showClass(this,!0)}):showClass($(this).find("img"),$(this).find("img").hasClass("iconHide"))}),$("#compass").click(function(){mapZoom=mapLerp=20,$("#map").css("transform","translate(0px, 0px) scale("+zoomFunc(20)+")"),$(".item").css("transform",""),setSliderHeight(20)}),$(".item").hover(function(){$(this).css("z-index",++zIndex),hovItem=$(this),$("#itemTooltip").html($(this).attr("name")).css("width","auto");let e=$("#itemTooltip")[0].clientWidth;$("#itemTooltip").css("left",$(this).css("left")).css("bottom",$(this).css("bottom")).css("margin-left",-(e/2-16)+"px").css("visibility","visible").css("opacity",1)},function(){hovItem=null,$("#itemTooltip").css("opacity",0).css("visibility","hidden")}),wheelEvent=/Firefox/i.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel",$("svg .point").hover(function(){let e=$(this).prev();for(;"path"!=e.prop("nodeName");)e=e.prev();$("#pathTooltip").html(e.attr("name")).css("width","auto");let s=$("#pathTooltip")[0].clientWidth;$("#pathTooltip").css("left",this.getAttribute("cx")+"px").css("bottom",this.getAttribute("cy")+32+"px").css("margin-left",-(s/2+10)+"px").css("width",s+"px").css("visibility","visible").css("opacity",1)},function(){$("#pathTooltip").css("opacity",0).css("visibility","hidden")}),$("svg .fish").hover(function(){$("#pathTooltip").html(fishTexts[$(this).attr("desc")]).css("width","auto");let e,s,t=$("#pathTooltip")[0].clientWidth;"rect"==this.nodeName?(e=parseFloat(this.getAttribute("x"))+parseFloat(this.getAttribute("width"))/2,s=parseFloat(this.getAttribute("y"))+parseFloat(this.getAttribute("height"))):(e=parseFloat(this.getAttribute("cx")),s=parseFloat(this.getAttribute("cy"))+parseFloat(this.getAttribute("r"))),$("#pathTooltip").css("left",e+"px").css("bottom",s+"px").css("margin-left",-(t/2+10)+"px").css("width",t+"px").css("visibility","visible").css("opacity",1)},function(){$("#pathTooltip").css("opacity",0).css("visibility","hidden")})}),$(document).on({mousemove:function(e){let s;if(editing&&dragElem&&void 0!==(s=dragElem.attr("class"))&&s.includes("item")){let s=dragElem.css("transform"),t=parseFloat(s.substring(7,s.indexOf(","))),a=parseFloat(dragElem.css("left"))-(clickX-e.pageX)*t,n=parseFloat(dragElem.css("bottom"))+(clickY-e.pageY)*t;dragElem.css("left",a+"px").css("bottom",n+"px")}else if(editing&&dragSvg&&void 0!==(s=dragSvg.attr("class"))&&s.includes("path")){let s=$(".item").eq(0).css("transform"),t=parseFloat(s.substring(7,s.indexOf(","))),a=parseFloat(dragSvg.css("cx"))-(clickX-e.pageX)*t,n=parseFloat(dragSvg.css("cy"))+(clickY-e.pageY)*t;dragSvg.css("cx",a+"px").css("cy",n+"px");for(let e=Object.keys(paths).length-1;e>=0;e--){let s="path"+Object.keys(paths)[e],t="M "+parseFloat($("#"+s+"0").css("cx"))+" "+parseFloat($("#"+s+"0").css("cy"))+", ";for(let a=1;a<Object.values(paths)[e].list.length;a++)t+="C "+parseFloat($("#"+s+(a-1)+"_2").css("cx"))+" "+parseFloat($("#"+s+(a-1)+"_2").css("cy"))+" "+parseFloat($("#"+s+a+"_1").css("cx"))+" "+parseFloat($("#"+s+a+"_1").css("cy"))+" "+parseFloat($("#"+s+a).css("cx"))+" "+parseFloat($("#"+s+a).css("cy"))+", ";$("#"+s).attr("d",t)}}else if(editing&&dragSvg&&void 0!==(s=dragSvg.attr("class"))&&s.includes("fish")){let s=$(".item").eq(0).css("transform"),t=parseFloat(s.substring(7,s.indexOf(",")));if("rect"==dragSvg[0].nodeName){let s=parseFloat(dragSvg.css("x"))-(clickX-e.pageX)*t,a=parseFloat(dragSvg.css("y"))+(clickY-e.pageY)*t;dragSvg.css("x",s+"px").css("y",a+"px")}else{let s=parseFloat(dragSvg.css("cx"))-(clickX-e.pageX)*t,a=parseFloat(dragSvg.css("cy"))+(clickY-e.pageY)*t;dragSvg.css("cx",s+"px").css("cy",a+"px")}}else if(dragElem&&("map"==dragElem[0].id||"#document"==dragElem[0].nodeName||"svg"==dragElem[0].nodeName||void 0!==(s=dragElem.attr("class"))&&s.includes("item"))){let s=$("#map").css("transform").split(","),t=parseFloat(s[3]),a=parseFloat(s[4])-(clickX-e.pageX),n=parseFloat(s[5])-(clickY-e.pageY);$("#map").css("transform","translate("+a+"px, "+n+"px) scale("+t+")")}clickX=e.pageX,clickY=e.pageY},mousedown:function(e){dragSvg=$(e.target),dragElem=$(e.target).hasClass("item")?$(e.target):$(e.target).parent(),e.ctrlKey&&dragElem&&void 0!==(className=dragElem.attr("class"))&&className.includes("item")&&dragElem.clone(!0).appendTo(dragElem.parent()),clickX=e.pageX,clickY=e.pageY},mouseup:function(){dragElem=null,dragSvg=null},mousewheel:function(e){wheelX=e.pageX,wheelY=e.pageY;let s=mapZoom<2||2==mapZoom&&e.originalEvent.wheelDelta>0?.5:1;mapZoom=Math.min(Math.max(mapZoom+(e.originalEvent.wheelDelta>0?-s:s),1),20)},DOMMouseScroll:function(e){wheelX=e.pageX,wheelY=e.pageY;let s=mapZoom<2||2==mapZoom&&-e.originalEvent.detail>0?.5:1;mapZoom=Math.min(Math.max(mapZoom+(-e.originalEvent.detail>0?-s:s),1),20)},keydown:function(e){if(null!=hovItem&&editing)if(107==e.which||109==e.which){let s=hovItem.children(".number");0==s.length&&107==e.which&&(s=$("<span class='number'>1</span>").appendTo(hovItem)),107==e.which&&s.html(parseInt(s.html())+1),109==e.which&&s.html(parseInt(s.html())-1),"1"==s.html()&&s.remove()}else{switch(hovItem.attr("name"),e.which){case 8:hovItem.attr("name",hovItem.attr("name").substring(0,hovItem.attr("name").length-1));break;case 13:tipText.append("<br>")}1==e.key.length&&hovItem.attr("name",hovItem.attr("name")+e.key),$("#itemTooltip").html(hovItem.attr("name"))}}}),$(".menu input").on("input",function(e){e.target.value.length>0?$.each($(".item"),function(){-1==$(this).attr("name").toLowerCase().indexOf(e.target.value)?$(this).removeClass("searchShown").addClass("searchHidden"):($(this).css("transform","scale("+mapLerp/2+")"),$(this).removeClass("searchHidden").addClass("searchShown"))}):$.each($(".item"),function(){$(this).removeClass("searchShown").removeClass("searchHidden")})}),zoomMap();var setSliderHeight=function(e){slider.style.height=100/19*(mapZoom-1)+"%"},container=document.getElementById("slider-container"),slider=document.getElementById("slider-bar"),handle=document.getElementById("slider-handle"),isSliding=!1,move=function(e){var s,t=0,a=0;if(!e)e=window.event;e.pageY?t=e.pageY:e.clientY&&(t=e.clientY),(a=100*(t-container.offsetTop)/container.offsetHeight)<0?a=0:a>100&&(a=100),slider.style.height=a+"%",s=19*a/100,wheelX=$(window).width()/2,wheelY=$(window).height()/2,mapZoom=s+1},addSlide=function(){isSliding=!0,window.addEventListener?document.addEventListener("mousemove",move,!1):document.attachEvent("onmousemove",move)},cancelSlide=function(){isSliding&&(window.removeEventListener?document.removeEventListener("mousemove",move,!1):window.detachEvent&&document.detachEvent("onmousemove",move))},cancelBubble=function(e){var s=e||window.event;s.stopPropogation&&s.stopPropogation(),null!=s.cancelBubble&&(s.cancelBubble=!0),s.preventDefault?s.preventDefault():s.returnValue=!1},addSlideEvent=function(e){addSlide(),cancelBubble(e)},cancelSlideEvent=function(e){cancelSlide(),cancelBubble(e)},moveEvent=function(e){move(e),cancelBubble(e)};handle.onmousedown=addSlideEvent,handle.onmouseup=cancelSlideEvent,slider.onmousedown=moveEvent,slider.onmouseup=cancelSlideEvent,container.onmousedown=moveEvent,container.onmouseup=cancelSlideEvent,document.onmouseup=cancelSlideEvent,jQuery.expr[":"].icontains=function(e,s,t){return jQuery(e).text().toUpperCase().indexOf(t[3].toUpperCase())>=0};var items={feather:{name:"Golden Feathers",list:[{x:900.36,y:4665.87,desc:"Golden Feather<br>Beachstickball (10 hits)"},{x:1363.25,y:621.022,desc:"Golden Feather<br>Artist 6"},{x:1400.21,y:5949.43,desc:"Golden Feather<br>Boat Challenge"},{x:2181.42,y:416.792,desc:"Golden Feather<br>Sand Castle"},{x:2567.86,y:1260.07,desc:"Golden Feather<br>Blackwood Forest"},{x:1665.75,y:1771.63,desc:"Golden Feather Chest<br>Outlook"},{x:3157.34,y:2017.98,desc:"Buried Golden Feather<br>In Her Shadow Treasure"},{x:1624.83,y:2728.23,desc:"Golden Feathers<br>Tough Bird Sales (100 coins)",nb:4},{x:3435.7,y:1668.2,desc:"Golden Feather<br>Aunt May"},{x:2842.82,y:3288.52,desc:"Golden Feather<br>Meteor Lake Cliff"},{x:1436.69,y:1705.48,desc:"Golden Feather<br>Outlook Cliff"},{x:1279.33,y:738.729,desc:"Golden Feathers<br>Visitor Ranger Sales (40 coins)",nb:2},{x:1079.48,y:2482.69,desc:"Golden Feather Chest<br>Stone Tower"},{x:1052.69,y:932.98,desc:"Golden Feather<br>Visitor Camp Rock"},{x:3170.2,y:1729.7,desc:"Golden Feather Chest<br>Lighthouse"},{x:2206.71,y:4858.43,desc:"Golden Feather Chest<br>North Cliff"}]},silver:{name:"Silver Feathers",list:[{x:4383.54,y:561.095,desc:"Silver Feather<br>Secret Island"},{x:1740.86,y:803.167,desc:"Silver Feather<br>Wristwatch"}]},painting:{name:"Artist",list:[{x:1340.94,y:640.877,desc:"Artist 6"},{x:2831.87,y:1677.62,desc:"Artist 2"},{x:1435,y:3181.96,desc:"Artist 3"},{x:1635.3,y:4772.55,desc:"Artist 4"},{x:1680.93,y:1710.61,desc:"Artist 5"},{x:718.437,y:373.377,desc:"Artist 1"}]},treasureMap:{name:"Treasure Maps",list:[{x:3868.04,y:3499,desc:"Map<br>In Her Shadow"},{x:2325.08,y:6071.81,desc:"Map<br>A Stormy View"},{x:1568.93,y:1808.1,desc:"Map<br>The Treasure of Sid Beach"},{x:734.577,y:2606.81,desc:"Map<br>The King"}]},clothes:{name:"Clothes",list:[{x:1891.5,y:1340.7,desc:"Running Shoes",ico:"shoes"},{x:1332.81,y:738.978,desc:"Provincial Park Hat<br>Visitor Ranger Sales (100 coins)"},{x:4775.5,y:4430.56,desc:"Sunhat",ico:"sunHat"},{x:979.395,y:4634.15,desc:"Baseball Cap<br>Beachstickball (30 hits)",ico:"cap"},{x:1916.62,y:1340.4,desc:"Headband",ico:"headband"}]},race:{name:"Races",list:[{x:1042.41,y:604.797,desc:"Race<br>Hawk Peak Start",ico:"avery"},{x:3110.12,y:1689.83,desc:"Race<br>Lighthouse End",ico:"flag"},{x:712.838,y:1705.53,desc:"Race<br>Lighthouse Start",ico:"avery"},{x:1132.34,y:3363.84,desc:"Race<br>Old Building End",ico:"flag"},{x:2293.69,y:3760.47,desc:"Race<br>Hawk Peak End",ico:"flag"},{x:2213.09,y:4982.34,desc:"Race<br>Old Building Start",ico:"avery"}]},shell:{name:"Shells",list:[{x:1305.07,y:2753.98,desc:"Seashell<br>Stone Tower"},{x:771.96,y:4072.5,desc:"Shell<br>North Beach"},{x:3145.89,y:2970.16,desc:"Seashell<br>Meteor Lake"},{x:2847.58,y:717.296,desc:"Seashell<br>Beach Hut"},{x:2329.75,y:747.368,desc:"Seashell<br>Beach Umbrella"},{x:2305.3,y:228.616,desc:"Seashell<br>Sid Beach Mound"},{x:919.87,y:525.652,desc:"Seashell<br>Shirley"},{x:2063.87,y:354.652,desc:"Seashell<br>Sid Beach"},{x:749.37,y:783.152,desc:"Seashell<br>Shirley"},{x:1945.37,y:2015.17,desc:"Seashell<br>Good Creek Path"},{x:616.105,y:1278.08,desc:"Seashell<br>Visitor Center Beach"},{x:3986.58,y:535.117,desc:"Seashell<br>Secret Island"},{x:1088.82,y:2072.88,desc:"Seashell<br>West River"},{x:3941.61,y:3012.62,desc:"Seashell<br>East Coast"},{x:3672.66,y:1724.03,desc:"Seashell<br>Start Beach"},{x:3919,y:2372.55,desc:"Seashell<br>House North Beach"},{x:4314.78,y:1957.43,desc:"Seashell<br>Airstream Island South"},{x:4411.73,y:2727.6,desc:"Seashell<br>Airstream Island North"},{x:1115.32,y:1785.63,desc:"Seashell<br>West River"},{x:3499.69,y:3627.6,desc:"Seashell<br>Boat Isle"},{x:3140.62,y:3557.22,desc:"Seashell<br>Boat Cliff"},{x:2671.96,y:4800.5,desc:"Shell<br>North Coast"}]},shovel:{name:"Miscellaneous",list:[{x:1671.33,y:2727.73,desc:"Wristwatch<br>Tough Bird Sales (400 coins)",ico:"watch"},{x:2157.79,y:467.256,desc:"Shovel"},{x:2132.83,y:1381.83,desc:"Toy Shovel",ico:"toyShovel"},{x:1415.04,y:1424.18,desc:"Toy Shovel",ico:"toyShovel"},{x:615.457,y:1319.92,desc:"Toy Shovel",ico:"toyShovel"},{x:739.831,y:757.217,desc:"Toy Shovel",ico:"toyShovel"},{x:2582.39,y:418.303,desc:"Compass",ico:"compass"},{x:2636.86,y:2418.96,desc:"Bait",ico:"bait"},{x:1695.16,y:6464.78,desc:"Bucket",ico:"bucket"},{x:2816.67,y:4475,desc:"Pickaxe",ico:"pickaxe"},{x:2738.15,y:4406.17,desc:"Pickaxe",ico:"pickaxe"},{x:2767.66,y:4509.03,desc:"Pickaxe",ico:"pickaxe"},{x:3987.5,y:812.5,desc:"Stick",ico:"stick"},{x:2818,y:1039,desc:"Stick",ico:"stick"},{x:2482.5,y:740.5,desc:"Stick",ico:"stick"},{x:874.5,y:2268.5,desc:"Stick",ico:"stick"},{x:3039.5,y:1640,desc:"Stick",ico:"stick"},{x:665.5,y:4017.5,desc:"Stick",ico:"stick"},{x:1705,y:2586.5,desc:"Stick",ico:"stick"},{x:1241.8,y:5848.5,desc:"Boating Manual",ico:"manual"},{x:3298,y:2892,desc:"Fishing Rod",ico:"fishingRod"},{x:3805.5,y:3617,desc:"Fishing Journal",ico:"journal"},{x:3828,y:3595,desc:"Golden Fishing Rod",ico:"goldenRod"},{x:2627.15,y:3092.78,desc:"Bucket",ico:"bucket"},{x:1024.8,y:4713,desc:"Stick",ico:"stick"},{x:1270.8,y:5852.5,desc:"Motorboat Key",ico:"key"}]},coin:{name:"Coins",list:[{x:2868.25,y:4157.55,desc:"Coin Chest<br>East Coast",nb:33},{x:562.003,y:1615.62,desc:"Coins<br>West Creek",nb:7},{x:3803.81,y:2699.06,desc:"Coins<br>Electric Pole",nb:7},{x:1383.5,y:3718,desc:"Coin (slides off)<br>North Waterfall"},{x:2379.72,y:794.998,desc:"Coins<br>Beach Umbrella",nb:3},{x:2664.77,y:295.208,desc:"Coins Chest<br>White Coast Trail",nb:13},{x:3104.39,y:1301.04,desc:"Coin<br>Start Isle"},{x:2352.4,y:379.651,desc:"Buried Coins<br>White Coast Trail",nb:15},{x:1012.75,y:478.129,desc:"Coin<br>Shirley"},{x:1396.21,y:489.272,desc:"Coins<br>Visitor Center Pound",nb:3},{x:1629.18,y:729.275,desc:"Buried Coins<br>Caravan",nb:15},{x:1973.58,y:683.231,desc:"Coins<br>Caravan Heights",nb:3},{x:1729.88,y:315.312,desc:"Buried Coin Chest<br>Sid Beach Treasure Treasure",nb:25},{x:1353.41,y:4040.96,desc:"Buried Coins<br>North Waterfall Top",nb:15},{x:1408.21,y:490.272,desc:"Coins<br>Visitor Center Pound",nb:7},{x:698.686,y:974.33,desc:"Coins<br>Visitor Center West",nb:7},{x:628.003,y:1538.12,desc:"Coin<br>West Creek 2"},{x:629.503,y:1528.62,desc:"Coin<br>West Creek 1"},{x:855.655,y:983.94,desc:"Buried Coins<br>Visitor Center West",nb:15},{x:1483.61,y:698.22,desc:"Buried Coins<br>Visitor Center East",nb:12},{x:1211.93,y:1835.07,desc:"Coins<br>West River",nb:7},{x:2633.63,y:3075.6,desc:"Coin<br>Bucket 4"},{x:1939,y:6089.42,desc:"Buried Coin Chest<br>A Stormy View Treasure",nb:25},{x:2131.92,y:4858.53,desc:"Coin<br>North Coast Cliff 1"},{x:4238.62,y:471.977,desc:"Coin Chest<br>Secret Island Middle",nb:27},{x:1263.71,y:1793.92,desc:"Coins<br>West River",nb:3},{x:1469.4,y:2231.89,desc:"Coins<br>Outlook North",nb:3},{x:3391.5,y:339.5,desc:"Buried Coin Chest<br>Small South Island",nb:13},{x:675.465,y:2194.42,desc:"Coins<br>West Waterfall",nb:7},{x:2106.28,y:2306.97,desc:"Coin Chest<br>Good Creek Path",nb:7},{x:1077.79,y:2819.8,desc:"Coins<br>Stone Tower",nb:3},{x:1766.1,y:2495.05,desc:"Coin<br>Bucket Coin Path 1"},{x:1860.6,y:2490.55,desc:"Coin<br>Bucket Coin Path 2"},{x:1963.1,y:2481.55,desc:"Coin<br>Bucket Coin Path 3"},{x:2015.1,y:2507.55,desc:"Coin<br>Bucket Coin Path 4"},{x:2501.94,y:1386.07,desc:"Coins<br>Blackwood Coin Path 1",nb:7},{x:2223.93,y:1601.63,desc:"Coins<br>Blackwood Mound West",nb:7},{x:2691.32,y:1604.94,desc:"Coins<br>Blackwood Coin Path 3",nb:7},{x:2768.82,y:1655.94,desc:"Coins<br>Blackwood Coin Path 4",nb:7},{x:2623.5,y:2422.5,desc:"Buried Coins<br>Blackwood Camp",nb:12},{x:3267.15,y:1644.56,desc:"Coins<br>Lighthouse East",nb:7},{x:3081.98,y:1913.5,desc:"Coins<br>Lighthouse North",nb:7},{x:1116.49,y:1515.87,desc:"Buried Coin Chest<br>King",nb:25},{x:2667.15,y:2517.26,desc:"Coins<br>Blackwood Camp 1",nb:7},{x:1809.57,y:1652.96,desc:"Buried Coin Chest<br>Good Creek Path",nb:21},{x:2466.81,y:2560.67,desc:"Coins<br>Blackwood Camp 2",nb:7},{x:2351.31,y:2152.67,desc:"Coins<br>Magic Rock",nb:36},{x:1041.2,y:2978.96,desc:"Buried Coins<br>Old Building",nb:15},{x:2104.29,y:1355.68,desc:"Buried Coins<br>Blackwood Trail 1st",nb:15},{x:1590.7,y:1350.13,desc:"Buried Coins<br>Hawk Peak Trail",nb:15},{x:471.517,y:2402.34,desc:"Coin Chest<br>West Waterfall",nb:13},{x:1915.09,y:2176.36,desc:"Coin Chest<br>Good Creek Path",nb:33},{x:2577.44,y:1574.07,desc:"Coins<br>Blackwood Coin Path 2",nb:7},{x:2449.34,y:1685.85,desc:"Coins<br>Blackwood Mound East",nb:7},{x:2241.9,y:449.651,desc:"Coin Chest<br>Sid Beach",nb:13},{x:677.663,y:447.761,desc:"Coin Chest<br>Shirley",nb:13},{x:4241.22,y:2075.16,desc:"Coin Chest<br>Airstream Island",nb:18},{x:4165.62,y:797.335,desc:"Coin Chest<br>Secret Island Bottom",nb:13},{x:3799.15,y:2180.93,desc:"Coin Chest<br>House North Beach",nb:13},{x:3952.64,y:2741.18,desc:"Coin Chest<br>East Coast",nb:13},{x:2234.76,y:2918.74,desc:"Coin Chest<br>Bucket Cliff",nb:33},{x:1453.02,y:3270.09,desc:"Coin Chest<br>Artist 3",nb:25},{x:1783.4,y:4243.63,desc:"Buried Coins<br>Hawk Peak West",nb:11},{x:1309.21,y:4380.3,desc:"Buried Coins<br>North Waterfall Bottom",nb:15},{x:1433.47,y:6786.59,desc:"Coins<br>Orange Islands",nb:7},{x:1672.77,y:359.546,desc:"Coin Chest<br>Sid Beach Cliff",nb:13},{x:2367.04,y:1089.46,desc:"Coin Chest<br>Blackwood Cliff",nb:13},{x:1239.77,y:795.01,desc:"Coin Chest<br>Hidden Visitor Center",nb:33},{x:2573,y:4256.02,desc:"Coin<br>Hawk Peak East 2"},{x:3914,y:817,desc:"Coins (slides off)<br>Secret Island 3",nb:3},{x:3693.5,y:933.5,desc:"Coin (slides off)<br>Secret Island 1"},{x:3828.77,y:844.255,desc:"Coin<br>Secret Island 2"},{x:3826.5,y:882,desc:"Buried Coins<br>Secret Island",nb:30},{x:2600.13,y:3082.6,desc:"Coin<br>Bucket 1"},{x:2610.13,y:3061.1,desc:"Coin<br>Bucket 2"},{x:2622.63,y:3070.1,desc:"Coin<br>Bucket 3"},{x:3433.06,y:2659.31,desc:"Coin Chest<br>Meteor Lake",nb:7},{x:2428.11,y:2885.93,desc:"Coin Chest<br>Bucket",nb:33},{x:2082.1,y:2559.05,desc:"Coin<br>Bucket Coin Path 5"},{x:4483,y:2673.5,desc:"Buried Coins<br>Airstream Island",nb:30},{x:2290.03,y:2688.08,desc:"Coin<br>Bucket Coin Path 6"},{x:937.982,y:4651.26,desc:"Coins<br>Beachstickball (20 hits)",nb:50},{x:1983.5,y:4844,desc:"Coin (slides off)<br>North Coast Cliff 3"},{x:2099.91,y:5005.95,desc:"Coin<br>North Coast 1"},{x:3893.5,y:3459,desc:"Coin Chest<br>Boat",nb:7},{x:2150.42,y:4986.46,desc:"Coin<br>North Coast 2"},{x:1443.96,y:6788.31,desc:"Coin<br>Orange Islands"},{x:2801.96,y:3613.63,desc:"Buried Coin Chest<br>Hawk Peak East",nb:21},{x:606.15,y:3272.76,desc:"Coin<br>Old Building 1"},{x:2803.97,y:4460.59,desc:"Coins<br>Pickaxe 1",nb:7},{x:2514.7,y:4453.64,desc:"Coin Chest<br>Hawk Peak East",nb:25},{x:2047.21,y:4863.27,desc:"Coin<br>North Coast Cliff 2"},{x:2252.67,y:1803.55,desc:"Buried Coins<br>Blackwood Trail 2nd",nb:15},{x:610.659,y:3327.85,desc:"Coin Chest<br>Old Building 2",nb:13},{x:1125.5,y:3396,desc:"Coin Chest<br>Old Building 1",nb:13},{x:1453.02,y:3270.09,desc:"Coin Chest<br>Artist 3",nb:25},{x:1264.47,y:3056.1,desc:"Coins<br>Stone Tower North",nb:7},{x:706.587,y:3960.21,desc:"Coins<br>North Beach Table",nb:7},{x:3698,y:3266,desc:"Buried Coins<br>Boat Pier",nb:12},{x:1815.84,y:1103.56,desc:"Coin Chest<br>Caravan Arch",nb:13},{x:710.7,y:1890.4,desc:"Buried Coins<br>West River",nb:21},{x:1977.53,y:3264.25,desc:"Buried Coins<br>Hawk Peak Camp",nb:12},{x:1293.5,y:3468.36,desc:"Coin Chest<br>Old Building 3",nb:32},{x:2335.53,y:2778.08,desc:"Coin<br>Bucket Coin Path 7"},{x:1821.81,y:3874.24,desc:"Coins<br>Hawk Peak West 1",nb:3},{x:1849.55,y:3978.72,desc:"Coins<br>Hawk Peak West 2",nb:3},{x:1770.66,y:4077.06,desc:"Coins<br>Hawk Peak West 3",nb:3},{x:2654.18,y:6143.7,desc:"Coin<br>Orange Islands"},{x:1949.68,y:4345.7,desc:"Coin<br>Hawk Peak North"},{x:2462,y:4378.02,desc:"Coin<br>Hawk Peak East 1"},{x:3122.31,y:2627.92,desc:"Buried Coin Chest<br>Meteor Lake",nb:13},{x:1811.45,y:3932.14,desc:"Coin Chest<br>Hawk Peak West",nb:13},{x:1551.56,y:434.513,desc:"Buried Coin Chest<br>Secret Visitor Center",nb:13},{x:1422.27,y:1010.51,desc:"Coin Chest<br>Caravan Cliff",nb:13},{x:604.587,y:3258.71,desc:"Coin<br>Old Building 2"},{x:716.087,y:3941.21,desc:"Coin<br>North Beach"},{x:722.087,y:3961.21,desc:"Coin<br>North Beach Table"},{x:4872.5,y:4602.5,desc:"Buried Coin Chest<br>Sunhat Island",nb:25},{x:2485,y:5802.54,desc:"Coin Chest<br>Orange Islands South",nb:13},{x:2009.18,y:4323.2,desc:"Coins<br>Hawk Peak North",nb:3},{x:2546,y:4730.04,desc:"Coin Chest<br>North Coast",nb:33},{x:1984.68,y:5947.7,desc:"Coins<br>Orange Islands",nb:3},{x:2689.68,y:6210.2,desc:"Coins<br>Orange Islands",nb:3},{x:895.5,y:6557.04,desc:"Buried Coin Chest<br>Orange Islands North",nb:15},{x:2481.51,y:4991.4,desc:"Buried Coin Chest<br>North Coast",nb:25},{x:2672.5,y:6586.54,desc:"Coin Chest<br>Orange Islands East",nb:13},{x:1001,y:6051.04,desc:"Coin Chest<br>Orange Islands West",nb:13},{x:858.5,y:5345.04,desc:"Buried Coin Chest<br>Orange Islands South",nb:13},{x:1921.46,y:4800.81,desc:"Coin<br>North Coast Cliff 4"},{x:2773.97,y:4410.09,desc:"Coins<br>Pickaxe 2",nb:7}]},flower:{name:"Flowers",list:[{x:3951.95,y:2808.02,desc:"Rubber Flower<br>East Coast Top"},{x:2705.15,y:3401.28,desc:"Rubber Flower<br>Hawk Peak 1"},{x:698.002,y:3577.91,desc:"Rubber Flower<br>Old Building 1"},{x:715.584,y:3471.25,desc:"Rubber Flower<br>Old Building 2"},{x:2467.15,y:3055.28,desc:"Rubber Flower<br>Bucket"},{x:2297.65,y:6289.78,desc:"Rubber Flower<br>Orange Islands"},{x:2705.15,y:3401.28,desc:"Rubber Flower<br>Hawk Peak 1"},{x:2227.65,y:3286.28,desc:"Rubber Flower<br>Hawk Peak 2"},{x:2039.65,y:3420.28,desc:"Rubber Flower<br>Hawk Peak 3"},{x:1254.27,y:2938.33,desc:"Rubber Flower<br>Stone Tower"},{x:1357.02,y:491.57,desc:"Rubber Flower<br>Visitor Center"},{x:3171.96,y:1869.07,desc:"Rubber Flower<br>Lighthouse"},{x:2057.69,y:995.78,desc:"Rubber Flower<br>Beach Umbrella"},{x:4032.95,y:2861.02,desc:"Rubber Flower<br>East Coast Bottom"},{x:3056.95,y:3574.52,desc:"Rubber Flower<br>East Coast Boat"},{x:2888.7,y:3231.02,desc:"Rubber Flower<br>Meteor Lake Top"},{x:3027.7,y:3060.27,desc:"Rubber Flower<br>Meteor Lake Bottom"},{x:1831.2,y:1870.77,desc:"Rubber Flower<br>Good Creek Path"},{x:2154.7,y:1929.27,desc:"Rubber Flower<br>Blackwood Forest"},{x:1939.7,y:1916.77,desc:"Rubber Flower<br>Blackwood Waterfall"},{x:1529.65,y:4106.28,desc:"Rubber Flower<br>Hawk Peak 4"},{x:1160.15,y:4359.78,desc:"Rubber Flower<br>North Beach"},{x:978.774,y:3382.82,desc:"Rubber Flower<br>Old Building 3"},{x:1611.7,y:1168.27,desc:"Rubber Flower<br>South Waterlily Pound"},{x:1521.65,y:5160.78,desc:"Rubber Flower<br>North Coast"},{x:1750.15,y:6481.28,desc:"Rubber Flower<br>Orange Islands Bucket"},{x:2829.02,y:1268.07,desc:"Rubber Flower<br>Start Waterfall"},{x:3475.46,y:1903.07,desc:"Rubber Flower<br>Home"}]},svgData:{name:"Fishes and Paths",list:[]}},paths={boat:{name:"Boat Challenge",list:[{point:{x:1162,y:6358},handleR:{x:1020,y:6305}},{point:{x:830,y:6065},handleL:{x:901.5,y:6211.5},handleR:{x:682.5,y:5865}},{point:{x:647.257,y:5237.5},handleL:{x:593,y:5416.25},handleR:{x:688.5,y:4921}},{point:{x:1430.96,y:5350.5},handleL:{x:1302,y:5239},handleR:{x:1667,y:5532.5}},{point:{x:1565.03,y:6406.5},handleL:{x:1521,y:5966},handleR:{x:1582.5,y:6639.5}},{point:{x:1927,y:6612.5},handleL:{x:1782.5,y:6689},handleR:{x:1989,y:6552.5}},{point:{x:1894.5,y:6364.75},handleL:{x:1958.5,y:6457.5},handleR:{x:1628,y:6032.5}},{point:{x:1858.51,y:5765.46},handleL:{x:1763.5,y:5870},handleR:{x:2049,y:5535}},{point:{x:2353.5,y:5317},handleL:{x:2198.5,y:5429},handleR:{x:2503,y:5221}},{point:{x:2753,y:5392},handleL:{x:2666.5,y:5182},handleR:{x:2841,y:5633.5}},{point:{x:2858,y:5980},handleL:{x:2869,y:5832.5},handleR:{x:2843,y:6127.25}},{point:{x:2804.5,y:6348},handleL:{x:2826,y:6246.75},handleR:{x:2787.5,y:6513.5}},{point:{x:2534.5,y:6404},handleL:{x:2502.5,y:6453.5},handleR:{x:2542.25,y:6301.25}},{point:{x:2573,y:6095},handleL:{x:2570,y:6144.75},handleR:{x:2563.5,y:5554}},{point:{x:3814.5,y:4309.25},handleL:{x:3259.25,y:5061}}]},turtle:{name:"Turtle Path",list:[{point:{x:2135,y:1430},handleR:{x:2128,y:1486}},{point:{x:2099,y:1521},handleL:{x:2108.5,y:1475.5},handleR:{x:2093,y:1568.5}},{point:{x:2158.5,y:1692},handleL:{x:2109,y:1626},handleR:{x:2222.5,y:1772.5}},{point:{x:2229.5,y:1851},handleL:{x:2226,y:1822},handleR:{x:2227,y:1957}},{point:{x:2191.5,y:2058},handleL:{x:2189,y:1987},handleR:{x:2188,y:2186}},{point:{x:2293,y:2279.5},handleL:{x:2228.5,y:2238.5},handleR:{x:2374,y:2354.5}},{point:{x:2592.5,y:2269},handleL:{x:2466.5,y:2339.5},handleR:{x:2638.5,y:2230.5}},{point:{x:2672.5,y:2059},handleL:{x:2550,y:2105},handleR:{x:2778.5,y:2023.5}},{point:{x:2903.5,y:2008},handleL:{x:2803.5,y:2057}}]},wolf:{name:"Wolf Path",list:[{point:{x:2579,y:767},handleR:{x:2597.5,y:759}},{point:{x:2619.5,y:733},handleL:{x:2612.5,y:749.5},handleR:{x:2623,y:659}},{point:{x:2620.5,y:491},handleL:{x:2620.5,y:538.5},handleR:{x:2621,y:462}},{point:{x:2585.5,y:422.5},handleL:{x:2612.5,y:435},handleR:{x:2546.5,y:414.5}},{point:{x:2411.5,y:407},handleL:{x:2448,y:418.5},handleR:{x:2406,y:423.5}},{point:{x:2412.5,y:466},handleL:{x:2404,y:445}}]},dog:{name:"Dog Path",list:[{point:{x:1360,y:1446},handleR:{x:1363.5,y:1556.5}},{point:{x:1395.5,y:1646.5},handleL:{x:1398.5,y:1543},handleR:{x:1382,y:1759}},{point:{x:1344.25,y:1905},handleL:{x:1373,y:1884.25},handleR:{x:1168.5,y:2071}},{point:{x:1207,y:2153.5},handleL:{x:1198,y:2019},handleR:{x:1205,y:2188}},{point:{x:1204,y:2203.5},handleL:{x:1205.5,y:2164},handleR:{x:1212,y:2267.5}},{point:{x:1242,y:2320.5},handleL:{x:1227,y:2296},handleR:{x:1275.5,y:2364.5}},{point:{x:1294.5,y:2426.5},handleL:{x:1283.5,y:2392},handleR:{x:1319,y:2498}},{point:{x:1321,y:2568},handleL:{x:1342,y:2521.5},handleR:{x:1315.5,y:2618}},{point:{x:1386.5,y:2644},handleL:{x:1301,y:2621.5},handleR:{x:1405,y:2645.5}},{point:{x:1452,y:2531.5},handleL:{x:1444,y:2614.5},handleR:{x:1448.5,y:2342.5}},{point:{x:1399,y:2303},handleL:{x:1446,y:2365.5},handleR:{x:1387,y:2268.5}},{point:{x:1378.5,y:2113.5},handleL:{x:1376,y:2268.5},handleR:{x:1378.5,y:2045}},{point:{x:1457,y:1949},handleL:{x:1418,y:2090},handleR:{x:1491.5,y:1994.5}},{point:{x:1509.75,y:2041.5},handleL:{x:1478,y:2003},handleR:{x:1546,y:2086}},{point:{x:1566,y:2153.5},handleL:{x:1502.5,y:2166.5},handleR:{x:1632.5,y:2139.5}},{point:{x:1676.75,y:2122.75},handleL:{x:1594,y:2148.5},handleR:{x:1666.5,y:2044}},{point:{x:1612.75,y:2005.75},handleL:{x:1675,y:2074.5},handleR:{x:1595.5,y:1982}},{point:{x:1596.5,y:1867.75},handleL:{x:1592,y:1974}}]}},fishRegions={square:[{x:973,y:4242,width:165,height:165,desc:"Spotted"},{x:1023,y:3895,width:155,height:160,desc:"Spotted"}],circle:[{x:3634.5,y:1594,radius:107,desc:"Ocean"},{x:1280,y:569.504,radius:50.3,desc:"LittlePond"},{x:3202,y:2882,radius:93.6,desc:"Pike"},{x:3006.5,y:2738.5,radius:66.4,desc:"Lake"},{x:3212,y:2479,radius:66.4,desc:"Lake"},{x:2226,y:3975,radius:71.5,desc:"Cold"},{x:2031,y:4521.51,radius:39.2,desc:"Cold"},{x:3041.5,y:956.001,radius:107,desc:"Ocean"},{x:3717.5,y:731,radius:107,desc:"Ocean"},{x:1134.5,y:285.002,radius:107,desc:"Ocean"},{x:914,y:464,radius:107,desc:"Bluegill"},{x:614.5,y:767,radius:107,desc:"Ocean"},{x:559.928,y:1530.88,radius:107,desc:"Ocean"},{x:2441.5,y:662.5,radius:107,desc:"Bluegill"},{x:1570.56,y:1097.04,radius:50.3,desc:"Pond"},{x:616.947,y:2400.86,radius:118.1,desc:"Ocean"},{x:517.437,y:2948.02,radius:107,desc:"Ocean"},{x:2831.75,y:4823.74,radius:107,desc:"Ocean"},{x:3430.25,y:3866.42,radius:107,desc:"Ocean"},{x:4163.5,y:2326.5,radius:107,desc:"Ocean"},{x:3994,y:3374.5,radius:107,desc:"Ocean"},{x:3926.97,y:3746.5,radius:107,desc:"Ocean"},{x:3393.25,y:4055.75,radius:118.1,desc:"Ocean"},{x:3334.25,y:4212.25,radius:118.1,desc:"Ocean"},{x:3218.76,y:4399.26,radius:118.1,desc:"Ocean"},{x:3170.75,y:4560.25,radius:118.1,desc:"Ocean"},{x:2424.25,y:5170.82,radius:118.1,desc:"Ocean"}]},fishTexts={Spotted:"Spotted Brook Trout Hotspot<br>100% Spotted Brook Trout",Pike:"Northern Pike Hotspot<br>100% Northern Pike",Bluegill:"Bluegill Hotspot<br>100% Bluegill",Pond:"Pond Hotspot<br>100% Pumpkinseed Fish",LittlePond:"Little Pond Hotspot<br>100% Crayfish",Cold:"Cold Hotspot<br>75% White Bass<br>25% Brook Trout",Lake:"Lake Hotspot<br>62.5% Yellow Perch<br>37.5% Rainbow Trout",Ocean:"Ocean Hotspot<br>36.4% Rainbow Trout<br>27.3% Brook Trout<br>18.2% Common Carp<br>18.2% Spotted Brook Trout"};