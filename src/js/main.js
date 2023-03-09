import "../css/style.css";

import { play } from "./play.js";
import { aboutAddObserver } from "./about.js";
import { initControls } from "./controls.js";
import { controlVh } from "./viewport-height.js";

controlVh();
play();
aboutAddObserver();
initControls();
