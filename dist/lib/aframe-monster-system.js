!function (e) {

    AFRAME.registerComponent('monster' , {

        schema: {
            monsterType: {type: 'string'},
            health: {type: 'number', default: 50},
            maxHealth: {type: 'number'},
            healthBarWidth: {type: 'number', default: 0.7},
            healthBarHeight: {type: 'number', default: 0.06},
            damageRate: {type: 'number', default: 100},
            damagePt: {type: 'number', default: 10},
            opacity: {type: 'number', default: 1}
        },

        init: function () {
            this.data.maxHealth = this.data.health;

            //var healthBar = this.el.querySelector('a-entity[text]');
            var healthBar = this.el.querySelector('a-plane');

            //console.log("Monster: add health bar to " + this.el.id);
            if (!healthBar) {
                healthBar = document.createElement('a-plane');
                healthBar.setAttribute('width', this.data.healthBarWidth);
                healthBar.setAttribute('height', this.data.healthBarHeight);
                healthBar.setAttribute('color', 'green');
                this.el.appendChild(healthBar);
            }

            // healthBar.setAttribute('text', {
            //     value: this.data.health,
            //     width: 0.5,
            //     wrapCount: 9,
            //     align: 'center',
            //     color: 'pink'
            // });
            healthBar.setAttribute('position', {x: 0, y: 0.727, z: 0});

            this.el.addEventListener('model-loaded', this.update.bind(this));
        },

        update: function () {
            var mesh = this.el.getObject3D('mesh');
            var opacity = this.data.opacity;
            if (!mesh) { return; }
            mesh.traverse(function (node) {
                if (node.isMesh) {
                    node.material.opacity = opacity;
                    node.material.transparent = opacity < 1.0;
                    node.material.needsUpdate = true;
                }
            });
        }
    });


    AFRAME.registerSystem('monster', {
        init: function () {
        },

        registerMonster: function (e) {
        },

        createMonster: function	(el, loc) {
            // Add monster as entity

            if (this.monsterPrefab = el) {

                var monster = this.monsterPrefab.cloneNode(true);
                //console.log("Monster: cloned");

                var monster_id = 'MM_' + monster.object3D.uuid;
                monster.setAttribute('id', monster_id);
                monster.setAttribute('class', 'collidable');
                monster.setAttribute('position', {x: loc.x, y: loc.y, z: loc.z});
                monster.setAttribute('follow', {target: '#player', speed: 0.2, space: 2.5});
                monster.setAttribute('visible', true);
                //console.log('Monster ID: MM_' + monster_id);

                document.querySelector('a-entity[monsters]').appendChild(monster);
                this.el.sceneEl.emit('enemyCreated', {enemyId: 'MM_' + monster.object3D.uuid});
            }
        },

        onHit: function(el, damagePoint) {

            // TO DO if monster doesn't exist

            var monsterData = el.getAttribute('monster');

            if ((el != null) && (el.getAttribute('monster')) && (currentHealth = monsterData.health)) {
                if (currentHealth > damagePoint) {
                    // If monster still has health, reduce health

                    var remainingHealth = currentHealth - damagePoint;

                    el.setAttribute('monster', {health: remainingHealth});
                    var healthBarValue = (remainingHealth/monsterData.maxHealth) * monsterData.healthBarWidth;
                    el.querySelector('a-plane').setAttribute('width', healthBarValue);
                    //el.querySelector('a-entity[text]').setAttribute('text', {value: remainingHealth});
                    //console.log("Monster: hit " + el.id + " " + currentHealth + "->" + remainingHealth);
                } else {
                    // else remove monster
                    //el.setAttribute('monster', {health: 0});
                    //el.querySelector('a-entity[text]').setAttribute('text', {value: 0});
                    //console.log("Monster: died");
                    this.unregisterMonster(el);
                    this.el.sceneEl.emit('enemyDefeated', {enemyId: el.id});
                }
            }

        },

        unregisterMonster: function (el) {
            console.log("Monster: removed");
            
            

            // TO DO: animate explode
            var position = el.getAttribute('position');
            console.log(position);
            sceneEl.systems.trigger.trigger(position);
            document.querySelector('a-entity[monsters]').removeChild(el);
            
            
        }
    });

    AFRAME.registerSystem('trigger', {
      init: function() {
      },

      trigger: function(monsterPosition) {
        //console.log("hello");
        var el = document.querySelector('#explosion');
        el.emit('particleplayerstart',{position:monsterPosition});
      }
    });

    AFRAME.registerComponent('spawner', {

        // Circular area where monsters should spawn

        schema: {
            gameStarted: {type: 'boolean', default: false},
            spawnRadius: {type: 'number', default: 1},
            spawnPoolSize: {type: 'number', default: 5},
            spawnRate: {type: 'number', default: 300},

            monster: {type: 'selector', default: '#monster'},
            monsterType: {type: 'string'}
        },

        init: function () {
            this.timer = 0;
            this.monsterCounter = 0;
            this.spawnPosition = this.el.object3D.position;
            this.registerSpawningZone();
            console.log(this.spawnPosition);
        },

        gameStarted: function() {
            this.data.gameStarted = true;

        },

        nextLevel: function(poolSize){
            this.monsterCounter = 0;
            this.data.spawnPoolSize = poolSize;
        },

        registerSpawningZone: function() {
            // Show spawning zone

            console.log("Spawning zone: " + this.el.id + " creating...");

            this.spawningZone = document.createElement('a-entity');
            this.spawningZone.setAttribute('geometry', {
                primitive: 'circle',
                radius: this.data.spawnRadius
            });
            this.spawningZone.setAttribute('color', 'red');
            this.spawningZone.setAttribute('position', this.spawnPosition);
            this.spawningZone.setAttribute('rotation', {x: -90, y: 0, z: 0});
            this.el.sceneEl.appendChild(this.spawningZone);

            console.log("Spawning zone: created at " + JSON.stringify(this.spawnPosition));
        },

        tick: function () {
            if (this.timer == this.data.spawnRate) {
                this.spawn(this.data.monster);
                this.timer = 0;
            }
            this.timer++;
        },

        spawningCoordinates: function() {
            // Generate random coordinates in spawning zone
            var a = Math.random() * 2 * Math.PI;
            var r = this.data.spawnRadius * Math.sqrt(Math.random());

            this.monsterPosition = new THREE.Vector3((r * Math.cos(a)) + this.spawnPosition.x,
                this.data.monster.getAttribute('position').y,
                (r * Math.sin(a)) + this.spawnPosition.z);
            //console.log(this.monsterPosition);
        },

        spawn: function () {

            if (this.data.gameStarted && (this.monsterCounter < this.data.spawnPoolSize)) {

                this.monsterCounter++;
                //console.group("Monster: spawning monster " + this.data.monster.getAttribute('monster').monsterType + " " + this.monsterCounter + "/" + this.data.spawnPoolSize);

                this.spawningCoordinates(this.data.spawnRadius);
                sceneEl.systems.monster.createMonster(this.data.monster, this.monsterPosition);

                //console.log("Spawn position: " + JSON.stringify(this.monsterPosition));
                //console.groupEnd();
            }
        }

    });




    AFRAME.registerComponent('follow', {

        schema: {
            target: {type: 'selector'},
            speed: {type: 'number'},
            space: {type: 'number', default: 1},
        },

        init: function () {
            this.directionVec3 = new THREE.Vector3();
            this.playerDamageTracker = 0;
        },

        tick: function (time, timeDelta) {
            var directionVec3 = this.directionVec3;

            var bufferZone = this.data.space;
            var targetPosition = this.data.target.object3D.position;
            var currentPosition = this.el.object3D.position;


            currentPosition.x += (Math.round(Math.random()) * 2 - 1)*Math.random()/50;
            currentPosition.y += (Math.round(Math.random()) * 2 - 1)*Math.random()/50;
            currentPosition.z += (Math.round(Math.random()) * 2 - 1)*Math.random()/50;


            directionVec3.copy(targetPosition).sub(currentPosition);
            var distance = directionVec3.length();

            // Monster hit damage player
            if (distance < bufferZone) {
                if (this.playerDamageTracker == this.el.getAttribute('monster').damageRate) {
                    //console.log("Monster: player hit (" + this.el.getAttribute('monster').damagePt + ") by " + this.el.id);

                    // this.el.sceneEl.emit('playerHit', {damage: 5});
                    this.el.sceneEl.emit('playerHit', {damage: 5, enemyId: this.el.id});

                    this.playerDamageTracker = 0;
                }
                else {
                    this.playerDamageTracker++;
                }
                return;
            }

            // Move monster towards player
            this.el.object3D.lookAt(targetPosition);

            var factor = this.data.speed / distance;
            directionVec3.x *= factor * (timeDelta / 1000);
            directionVec3.y *= factor * (timeDelta / 1000);
            directionVec3.z *= factor * (timeDelta / 1000);

            this.el.setAttribute('position', {
                x: currentPosition.x + directionVec3.x,
                y: currentPosition.y + directionVec3.y,
                z: currentPosition.z + directionVec3.z
            });

        }
    });

}()
