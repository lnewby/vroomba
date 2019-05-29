import {gameState} from '../app/gameState.js'
import {sky, groundPlane, box, sphere} from '../app/gameObject.js';

AFRAME.registerState({
    initialState: gameState(),

    handlers: {
        decreaseScore: function (state, action) {
            state.score -= action.points;
            console.log(AFRAME.scenes[0].systems.hudUpdate.updateScore(state.score));
            console.log("Score decreased");
        },

        increaseScore: function (state, action) {
            state.score += action.points;
            console.log(AFRAME.scenes[0].systems.hudUpdate.updateScore(state.score));
            console.log("Score increased");
        }
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


        window.onkeyup = function(e) {
            if (e.key == 1) {
                sceneEl.emit('increaseScore', {points: 1});
            } else if (e.key == 2) {
                sceneEl.emit('decreaseScore', {points: 1});
            } else if (e.key == 3){

            }
        };
    }
});

AFRAME.registerSystem('hudUpdate', {

    updateScore: function(score){
        document.getElementById('score-label').innerHTML = "Score: " + score;
    }

});