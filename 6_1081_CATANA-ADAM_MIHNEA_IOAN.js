let svg = document.getElementById("svg");
let btnLine = document.getElementById("line");

let colorLinie = document.getElementById("color-line");
let colorBackground = document.getElementById("color-background");
let grosimeLinie = document.getElementById("range-picker");

let downloadSVG = document.getElementById("save-svg");
let downloadPNG = document.getElementById("save-png");
let clear = document.getElementById("clear");
let undoButton = document.getElementById("undo");

function setareCoordonateDreptunghi(obiect, x1, y1, x2, y2) {
  obiect.setAttributeNS(null, "x", Math.min(x1, x2));
  obiect.setAttributeNS(null, "y", Math.min(y1, y2));
  obiect.setAttributeNS(null, "width", Math.max(x1, x2) - Math.min(x1, x2));
  obiect.setAttributeNS(null, "height", Math.max(y1, y2) - Math.min(y1, y2));
}
function setareCoordonateRomb(obiect, x1, y1, x2, y2) {
  obiect.setAttributeNS(
    null,
    "points",
    `${(x1 + x2) / 2},${Math.min(y1, y2)} 
  ${Math.max(x1, x2)},${(y1 + y2) / 2}
  ${(x1 + x2) / 2},${Math.max(y1, y2)}
  ${Math.min(x1, x2)},${(y1 + y2) / 2}`
  );
}

function setareCoordonateElipsa(obiect, x1, y1, x2, y2) {
  //cx cy rx ry
  obiect.setAttributeNS(null, "cx", (x1 + x2) / 2);
  obiect.setAttributeNS(null, "cy", (y1 + y2) / 2);
  obiect.setAttributeNS(null, "rx", (Math.max(x1, x2) - Math.min(x1, x2)) / 2);
  obiect.setAttributeNS(null, "ry", (Math.max(y1, y2) - Math.min(y1, y2)) / 2);
}

function setareCoordonateLinie(obiect, x, y) {}

var MOUSE_LEFT = 0,
  MOUSE_RIGHT = 2,
  KEY_DEL = 46;
var x1 = 0,
  y1 = 0;
var elementSelectat = null;
var figura = "dreptunghi";

var editor = document.getElementById("editor");
var selectieDreptunghi = document.getElementById("selectieDreptunghi");
var selectieElipsa = document.getElementById("selectieElipsa");
var selectieRomb = document.getElementById("selectieRomb");
var elemente = document.getElementById("elemente");

window.addEventListener("load", () => {
  const itemNew = document.createElement("svg");
  itemNew.innerHTML = localStorage.getItem("elemente");
  elemente.innerHTML = itemNew.innerHTML;
});

function dreptunghi() {
  figura = "dreptunghi";
}
function elipsa() {
  figura = "elipsa";
}

function romb() {
  figura = "romb";
}

function linie() {
  figura = "linie";
}

let directieLinie = "";

editor.onmousedown = function (e) {
  if (e.button == MOUSE_LEFT) {
    x1 = e.pageX - this.getBoundingClientRect().left;
    y1 = e.pageY - this.getBoundingClientRect().top;
    if (figura == "dreptunghi") {
      setareCoordonateDreptunghi(selectieDreptunghi, x1, y1, x1, y1);
      selectieDreptunghi.style.display = "block";
    }
    if (figura == "elipsa") {
      setareCoordonateElipsa(selectieElipsa, x1, y1, x1, y1);
      selectieElipsa.style.display = "block";
    }
    if (figura == "romb") {
      setareCoordonateRomb(selectieRomb, x1, y1, x1, y1);
      selectieRomb.style.display = "block";
    }
    if (figura == "linie") {
      directieLinie = `${x1},${y1} `;
    }
  }
  if (e.button == MOUSE_RIGHT) {
    elementSelectat.classList.remove("selectat");
    elementSelectat = null;
  }
};

editor.onmousemove = function (e) {
  x2 = e.pageX - this.getBoundingClientRect().left;
  y2 = e.pageY - this.getBoundingClientRect().top;
  if (figura == "dreptunghi") {
    setareCoordonateDreptunghi(selectieDreptunghi, x1, y1, x2, y2);
  }
  if (figura == "romb") {
    setareCoordonateRomb(selectieRomb, x1, y1, x2, y2);
  }
  if (figura == "elipsa") {
    setareCoordonateElipsa(selectieElipsa, x1, y1, x2, y2);
  }
  if (figura == "linie") {
    directieLinie += `${x2},${y2} `;
  }
};

var deleteLastElement = false;

editor.onmouseup = function (e) {
  if (e.button == MOUSE_LEFT) {
    x2 = e.pageX - this.getBoundingClientRect().left;
    y2 = e.pageY - this.getBoundingClientRect().top;

    selectieDreptunghi.style.display = "none";
    selectieElipsa.style.display = "none";
    selectieRomb.style.display = "none";

    if (figura == "dreptunghi") {
      elementnou = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      setareCoordonateDreptunghi(elementnou, x1, y1, x2, y2);
    }
    if (figura == "romb") {
      elementnou = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      setareCoordonateRomb(elementnou, x1, y1, x2, y2);
    }
    if (figura == "elipsa") {
      elementnou = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
      );

      setareCoordonateElipsa(elementnou, x1, y1, x2, y2);
    }

    if (figura == "linie") {
      elementnou = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      elementnou.setAttributeNS(null, "points", directieLinie);
    }

    elementnou.onmousedown = function (e) {
      if (e.button == MOUSE_RIGHT) {
        var elementeCopii = document.querySelectorAll("#elemente *");
        elementeCopii.forEach((el) => el.classList.remove("selectat"));
        e.target.classList.add("selectat");

        elementSelectat = e.target;

        elementSelectat.setAttributeNS(null, "stroke", colorLinie.value);
        elementSelectat.setAttributeNS(null, "fill", colorBackground.value);
        elementSelectat.setAttributeNS(
          null,
          "stroke-width",
          grosimeLinie.value
        );

        selectieDreptunghi.style.display = "none";
        selectieElipsa.style.display = "none";
        selectieRomb.style.display = "none";

        elemente.addEventListener("mousedown", startDrag);
        elemente.addEventListener("mousemove", drag);
        elemente.addEventListener("mouseup", endDrag);
        elemente.addEventListener("mouseleave", endDrag);

        var selectedElement = elementSelectat;

        function startDrag(evt) {
          if (evt.target.classList.contains("selectat")) {
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            if (figura == "dreptunghi") {
              offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
              offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
            }
            if (figura == "elipsa") {
              offset.x -= parseFloat(
                selectedElement.getAttributeNS(null, "cx")
              );
              offset.y -= parseFloat(
                selectedElement.getAttributeNS(null, "cy")
              );
            }
          }
          selectieDreptunghi.style.display = "none";
          selectieElipsa.style.display = "none";
          selectieRomb.style.display = "none";
        }
        function drag(evt) {
          if (selectedElement) {
            evt.preventDefault();
            var coord = getMousePosition(evt);
            if (figura == "dreptunghi") {
              selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
              selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
            }

            if (figura == "elipsa") {
              selectedElement.setAttributeNS(null, "cx", coord.x - offset.x);
              selectedElement.setAttributeNS(null, "cy", coord.y - offset.y);
            }
          }
          selectieDreptunghi.style.display = "none";
          selectieElipsa.style.display = "none";
          selectieRomb.style.display = "none";
        }
        function endDrag(evt) {
          selectedElement = null;
          deleteLastElement = true;
        }
      }
    };

    if (figura != "linie") {
      elementnou.setAttributeNS(null, "stroke", colorLinie.value);
      elementnou.setAttributeNS(null, "fill", colorBackground.value);
      elementnou.setAttributeNS(null, "stroke-width", grosimeLinie.value);
    } else {
      elementnou.setAttributeNS(null, "stroke", colorLinie.value);
      elementnou.setAttributeNS(null, "fill", "none");
      elementnou.setAttributeNS(null, "stroke-width", grosimeLinie.value);
    }

    if (deleteLastElement == false) {
      elemente.appendChild(elementnou);
    }
    deleteLastElement = false;
  }

  localStorage.setItem(
    "elemente",
    new XMLSerializer().serializeToString(elemente)
  );
};

function getMousePosition(evt) {
  return {
    x: evt.clientX,
    y: evt.clientY,
  };
}

editor.oncontextmenu = function () {
  return false;
};

document.onkeydown = function (e) {
  if (e.keyCode == KEY_DEL && elementSelectat) {
    elementSelectat.remove();
    // actualizam in localStorage
    localStorage.setItem(
      "elemente",
      new XMLSerializer().serializeToString(elemente)
    );
  }

  if (e.keyCode == 187 && elementSelectat) {
    elementSelectat.style.fill =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
};

downloadSVG.addEventListener("click", () => {
  const a = document.createElement("a");
  document.body.appendChild(a);

  //get svg source.
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(elemente);

  //add name spaces.
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  //convert svg source to URI data scheme.
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  a.href = url;
  a.download = "svgimage.svg";
  a.click();
  document.body.removeChild(a);
});

clear.addEventListener("click", () => {
  elemente.innerHTML = `<svg id="elemente"> </svg>`;
  localStorage.clear();
});

undoButton.addEventListener("click", () => {
  elemente.removeChild(elemente.lastChild);
  // console.log(elemente.lastChild);
});

downloadPNG.addEventListener("click", () => {
  // get svg data
  var xml = new XMLSerializer().serializeToString(elemente);

  // make it base64
  var svg64 = btoa(xml);
  var b64Start = "data:image/svg+xml;base64,";

  // prepend a "header"
  var image64 = b64Start + svg64;

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = image64;
  img.addEventListener("load", (e) => {
    ctx.drawImage(img, 100, 100);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.toDataURL("image/png");
    a.download = "image.png";
    a.click();
    document.body.removeChild(a);
  });
});
