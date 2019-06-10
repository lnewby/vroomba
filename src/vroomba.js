import {gameState} from '../app/gameState.js'
import {sky, groundPlane, box, sphere} from '../app/gameObject.js';

AFRAME.registerState({
    initialState: gameState(),

    handlers: {
        enemyCreated: function(state, action){
            let enemyId = action.enemyId;
            state.enemyIds.push(enemyId);
        },
        entityHit: function(state, action){
            let systems = AFRAME.scenes[0].systems;
            let entityId = action.entityId;
            if (entityId == null || !entityId.startsWith("MM_")){
                //TODO: handle non-enemy hit (weapon switched)
                if (entityId == "pull" || entityId == "push" || entityId == "areaOfEffect" || entityId == "sniper"){
                    AFRAME.scenes[0].emit('weaponChanged', {effect: entityId});
                }
                return;
            }
            let enemyId = entityId;
            let enemyEl = document.querySelector('#' + enemyId);
            let player = document.querySelector('#player');
            if (enemyEl) {
                systems.weapon.doEffect(player, enemyEl, state.enemyIds);
                systems.weapon.dealDamage(player, enemyEl, state.enemyIds);
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
        },
        weaponChanged: function(state, action){
            AFRAME.scenes[0].systems.weapon.weaponChanged(action.effect);
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
            } else if (e.key == 4){
                sceneEl.emit('weaponChanged', {effect: "pull"});
            } else if (e.key == 5){
                sceneEl.emit('weaponChanged', {effect: "push"});
            } else if (e.key == 6){
                sceneEl.emit('weaponChanged', {effect: "areaOfEffect"});
            } else if (e.key == 7){
                sceneEl.emit('weaponChanged', {effect: "sniper"});
            } else if (e.key == 8){
                sceneEl.emit('weaponChanged', {effect: "normal"});
            }
        };
    }
});

AFRAME.registerSystem('hudUpdate', {

    updateLevel: function(level){
        document.querySelector('#levelLabel').setAttribute('text', {value: "Level " + level});
    }

});

AFRAME.registerSystem('weapon', {
    schema: {
        effect: { type: 'string', default: 'normal'},
        damage: { type: 'number', default: 10}
    },

    init: function () {

    },

    tick: function () {
    },

    weaponChanged: function ( weaponEffect ) {
      this.data.effect = weaponEffect;

      let weapon = document.querySelector('#weapon');
      console.log(weapon);
      if (weaponEffect == "pull"){
          weapon.setAttribute('material', {color: 'purple'});
      } else if (weaponEffect == "push") {
          weapon.setAttribute('material', {color: 'orange'});
      } else if (weaponEffect == "areaOfEffect"){
          weapon.setAttribute('material', {color: 'red'});
      } else if (weaponEffect == "sniper"){
          weapon.setAttribute('material', {color: 'blue'});
      } else if (weaponEffect == "normal"){
          weapon.setAttribute('material', {color: 'grey'});
      }
    },

    getDamage: function() {
        return this.data.damage;
    },

    doEffect: function(player, target, enemyIds){
        if (this.data.effect == "pull"){
            this.moveMonstersToTarget(target, enemyIds);
        } else if (this.data.effect == "push") {
            this.blastMonstersAwayFromTarget(player, target, enemyIds);
        }
    },

    dealDamage: function(player, target, enemyIds){
        if (this.data.effect == "normal") {
            this.el.sceneEl.systems.monster.onHit(target, this.data.damage);
        } else if (this.data.effect == "areaOfEffect"){
            let nearbyEnemies = this.getMonstersWithinDistanceOfTarget(target, enemyIds, 2);
            for (let i = 0; i < nearbyEnemies.length; i++){
                let enemy = nearbyEnemies[i];
                this.el.sceneEl.systems.monster.onHit(enemy, this.data.damage/2);
            }
            this.el.sceneEl.systems.monster.onHit(target, this.data.damage);
        } else if (this.data.effect == "sniper"){
            let nearbyEnemies = this.getMonstersWithinDistanceOfTarget(target, enemyIds, 1);
            console.log(nearbyEnemies);
            if (nearbyEnemies.length == 0){
                this.el.sceneEl.systems.monster.onHit(target, this.data.damage*2);
            } else {
                this.el.sceneEl.systems.monster.onHit(target, this.data.damage/2);
            }
        }
    },

    moveMonstersToTarget: function( target, monsterIds ){
        let targetPosition = target.getAttribute('position');
        console.log(targetPosition);
        for (let i = 0; i < monsterIds.length; i++){
            var id = monsterIds[i];
            if (id == target.id){
                continue;
            }
            var el = document.querySelector('#' + id);
            if (el != null) {
                var newPos = {
                    x: targetPosition.x + ((Math.random() * 0.8) + -0.8),
                    y: targetPosition.y,
                    z: targetPosition.z + ((Math.random() * 0.8) + -0.8),
                };
                el.setAttribute('animation', 'property: position; to: ' + newPos.x + " " + newPos.y  + " " + newPos.z);
            }
        }
    },

    blastMonstersAwayFromTarget: function( player, target, monsterIds ){
        let playerPosition = player.getAttribute('position');
        let targetPosition = target.getAttribute('position');
        for (let i = 0; i < monsterIds.length; i++){
            var id = monsterIds[i];
            if (id == player.id){
                continue;
            }
            var el = document.querySelector('#' + id);
            var elPosition = el.getAttribute('position');
            if (el != null) {
                let d = Math.sqrt(((playerPosition.x - elPosition.x)*(playerPosition.x - elPosition.x))
                    + ((playerPosition.z - elPosition.z)*(playerPosition.z - elPosition.z)));
                let d2target = Math.sqrt(((targetPosition.x - elPosition.x)*(targetPosition.x - elPosition.x))
                    + ((targetPosition.z - elPosition.z)*(targetPosition.z - elPosition.z)));
                console.log("d: " + d.toFixed(2));
                if (Math.abs(d2target) < 3) {
                    let newX = playerPosition.x - (((d + 1.5) * (playerPosition.x - elPosition.x)) / d);
                    let newZ = playerPosition.z - (((d + 1.5) * (playerPosition.z - elPosition.z)) / d);
                    var newPos = {
                        x: newX,
                        y: elPosition.y,
                        z: newZ,
                    };
                    el.setAttribute('animation', 'property: position; to: ' + newPos.x + " " + newPos.y  + " " + newPos.z + "; dur: 500");
                }
            }
        }
    },

    getMonstersWithinDistanceOfTarget( target, monsterIds, distance){
        let targetPosition = target.getAttribute('position');
        let nearbyMonsters = [];
        for (let i = 0; i < monsterIds.length; i++) {
            var id = monsterIds[i];
            if (id == target.id) {
                continue;
            }
            var el = document.querySelector('#' + id);
            if (el == null){
                continue;
            }
            var elPosition = el.getAttribute('position');
            if (el != null && targetPosition != null && elPosition != null) {
                let d2target = Math.sqrt(((targetPosition.x - elPosition.x)*(targetPosition.x - elPosition.x)) + ((targetPosition.z - elPosition.z)*(targetPosition.z - elPosition.z)));
                console.log("distance " + d2target);
                if (Math.abs(d2target) <= distance) {
                    nearbyMonsters.push(el);
                }
            }
        }
        return nearbyMonsters;
    }
});