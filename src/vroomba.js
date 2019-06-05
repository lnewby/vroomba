import {gameState} from '../app/gameState.js'
import {sky, groundPlane, box, sphere} from '../app/gameObject.js';

AFRAME.registerState({
    initialState: gameState(),

    handlers: {
        enemyCreated: function(state, action){
            let enemyId = action.enemyId;
            state.enemyIds.push(enemyId);
        },
        enemyHit: function(state, action){
            let enemyId = action.enemyId;
            let damage = action.damage;

            //testing
            let randomEnemy = state.enemyIds[Math.floor(Math.random() * (state.enemyIds.length + 1))];
            let enemyEl = document.querySelector('#' + randomEnemy);
            if (enemyEl) {
                AFRAME.scenes[0].systems.monster.onHit(document.querySelector('#' + randomEnemy), damage);
            } else {
                console.log("Missed!");
            }
        },
        enemyDefeated: function(state, action){
            state.enemiesDefeated += 1;
            if (!(state.currentLevel > state.endLevel)) {
                state.levelMap[state.currentLevel].enemiesDefeated += 1;
                let levelObj = state.levelMap[state.currentLevel];
                if (levelObj.enemiesDefeated >= levelObj.totalEnemies) {
                    state.currentLevel += 1;
                    AFRAME.scenes[0].systems.hudUpdate.updateLevel(state.currentLevel);
                }
            }
        },
        playerHit: function(state, action){
            let damage = action.damage;
            state.playerHealth -= damage;
            if (state.playerHealth < 0){
                // TODO: player dead, game over
            }
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
            if (e.key == 1){
                sceneEl.emit('enemyHit', {enemyId: 0, damage: 10});
            } else if (e.key == 2){
                sceneEl.emit('enemyDefeated', {});
            } else if (e.key == 3){
                sceneEl.emit('playerHit', {damage: 5});
            }
        };
    }
});

AFRAME.registerSystem('hudUpdate', {

    updateLevel: function(level){
        document.querySelector('#levelLabel').setAttribute('text', {value: "Level " + level});
    }

});