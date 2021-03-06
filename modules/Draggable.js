import interact from "interactjs";
import gsap from "gsap";
import Snap from "snapsvg";

// enable draggables to be dropped into this

export function DraggElement(moveForwards) {
  interact(".draggableItem").draggable({
    listeners: {
      // call this function on every dragmoveevent
      move: dragMoveListener
    }
  });

  interact(".dropzone").dropzone({
    accept: ".draggableItem",
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.5,

    ondragenter: function(event) {
      // feedback the possibility of a drop
      event.target.dataset.moving = "hovering";
    },

    ondragleave: function(event) {
      // remove the drop feedback style
      event.target.dataset.moving = "activeMoving";
    },

    ondrop: function(event) {
      event.target.dataset.moving = "dropped";
      AnimateDraggableObjects(moveForwards);
      // interact(".draggableItem").unset();
    },

    ondropactivate: function(event) {
      event.target.dataset.moving = "activeMoving";
    }
  });
}

function dragMoveListener(event) {
  const target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// ANIMATIONS LEVEL 2

function AnimateDraggableObjects(moveForwards) {
  const ImageContainerChaptervalue = document.querySelector(".ImageContainer")
    .dataset.chapter;
  if (ImageContainerChaptervalue === "lvl2-p2") {
    AnimateFlask(moveForwards);
  } else if (ImageContainerChaptervalue === "lvl2-p3") {
    AnimateLightingTheWick(moveForwards);
  }
}

export function AnimateLightingTheWick(moveForwards) {
  const theMatch = document.querySelector(".draggableItem");
  const theMatchContainer = document.querySelector(".movableitemContainer");
  // theMatchContainer.dataset.droppedmatch = "true";

  const tl = gsap.timeline();

  tl.to(theMatchContainer, { x: -15, y: 105, duration: 0.4 }).to(theMatch, {
    rotation: 30,
    duration: 1,
    onComplete: function() {
      document.querySelector("#light").dataset.show = "true";
      removeItemFromDisplay("#theMatch");
      repeatingMorphing(
        "#oilLampFull",
        "#smallLight",
        "#lightStrokeLarge",
        1500,
        true
      );

      setTimeout(() => {
        moveForwards();
      }, 2500);
    }
  });

  gsap.fromTo(
    ".firedot",
    {
      y: 100,
      scale: 0.2,
      duration: 5,
      opacity: 0,
      ease: "stepped",
      repeat: -1
    },
    {
      y: 0,
      scale: 1.2,
      duration: 5,
      opacity: 1,
      stagger: 0.5,
      ease: "stepped",
      repeat: -1
    }
  );
}

// THE FLASK ITEM
export function AnimateFlask(moveForwards) {
  const flask = document.querySelector(".draggableItem");
  const flaskContainer = document.querySelector(".movableitemContainer");
  flaskContainer.dataset.dropped = "true";

  // const tl = gsap.timeline();
  // tl.to(flaskContainer, { x: +50, y: +50 });

  // flask.dataset.dropped = "true";

  gsap.to(flask, {
    rotation: 100,
    duration: 3
  });

  toMorph("flaskSVG", "#liquid", "#ShiftedLiquid", 1000);
  setTimeout(() => {
    document.querySelector("#startingPoint").dataset.show = "true";
    toMorph("flaskSVG", "#startingPoint", "#pouringliquidOne", 1000);
    turnTheLid();
    fillTheLamp();
    setTimeout(() => {
      document.querySelector("#pouringliquidOne").dataset.show = "true";
      repeatingMorphing(
        "flaskSVG",
        "#pouringliquidOne",
        "#pouringLiquid2",
        800,
        flask,
        moveForwards
      );
    }, 1000);
  }, 1000);
}

function turnTheLid() {
  const lampLid = document.querySelector("#lamp_lid");

  gsap.to(lampLid, {
    rotation: 90,
    transformOrigin: "bottom right",
    duration: 0.5,
    ease: "bounce"
  });
}

function closeTheLampLid() {
  const lampLid = document.querySelector("#lamp_lid");

  gsap.to(lampLid, {
    rotation: 0,
    transformOrigin: "bottom right",
    duration: 0.5,
    ease: "bounce"
  });
}

function fillTheLamp() {
  // THE LAMP LIQUID
  const oilLamp = document.querySelector("#theSquare");
  gsap.fromTo(
    oilLamp,
    0.8,
    {
      attr: {
        x: -400
      }
    },
    {
      attr: {
        x: 0
      },
      repeat: 30
    }
  );

  // "Fill up" animation
  gsap.fromTo(
    oilLamp,
    10,
    {
      attr: {
        y: 420,
        height: 0
      }
    },
    {
      attr: {
        y: -20,
        height: 440
      }
    }
  );
}

function toMorph(svgId, firstPath, pathToMorphto, duration) {
  const svg = document.querySelector(svgId);
  const s = Snap(svg);
  const firstElement = Snap.select(firstPath);
  const secondElement = Snap.select(pathToMorphto);
  const firstElementPoints = firstElement.node.getAttribute("d");
  const secondElementPoints = secondElement.node.getAttribute("d");

  const morphing = function() {
    firstElement.animate({ d: secondElementPoints }, duration, mina.easeout);
  };
  morphing();
}

function repeatingMorphing(
  svgId,
  firstPath,
  pathToMorphto,
  duration,
  infiniteRepeat,
  moveForwards
) {
  const svg = document.querySelector(svgId);
  const s = Snap(svg);
  const firstElement = Snap.select(firstPath);
  const secondElement = Snap.select(pathToMorphto);
  const firstElementPoints = firstElement.node.getAttribute("d");
  const secondElementPoints = secondElement.node.getAttribute("d");

  const toPreviousPath = function() {
    firstElement.animate(
      { d: secondElementPoints },
      duration,
      mina.backout,
      toNextPath
    );
  };
  const toNextPath = function() {
    firstElement.animate(
      { d: firstElementPoints },
      duration,
      mina.backout,
      toPreviousPath
    );
  };

  setTimeout(() => {
    if (infiniteRepeat === true) {
      return;
    } else {
      firstElement.stop();
      closeTheLampLid();
      removeItemFromDisplay(".draggableItem");
      setTimeout(() => {
        moveForwards();
      }, 1000);
    }
  }, 4000);
  toNextPath();
}

function removeItemFromDisplay(itemIdOrClass) {
  const item = document.querySelector(itemIdOrClass);
  gsap.to(item, { opacity: 0, duration: 0.3, ease: "easeout" });
}
