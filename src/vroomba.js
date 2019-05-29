import {gameState} from '../app/gameState.js'
import {sky, groundPlane, box, sphere} from '../app/gameObject.js';

AFRAME.registerState({
    initialState: gameState(),

    handlers: {
        decreaseScore: function (state, action) {  // TODO: Remove and replace with real handlers for game
            state.score -= action.points;          //
        },                                         //
                                                   //
        increaseScore: function (state, action) {  //
            state.score += action.points;          //
        }                                          //
    }
});

AFRAME.registerComponent('vroomba-scene-setup', {
    init() {
        // Attach objects to global scene
        const sceneEl = document.querySelector('a-scene');

        sceneEl.appendChild(sky());
        sceneEl.appendChild(groundPlane());
        sceneEl.appendChild(box());
        sceneEl.appendChild(sphere());
    }
});