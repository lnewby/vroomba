!function (e) {

	AFRAME.registerComponent('monster' , {

		schema: {
			spawnPosition: {type: 'vec3', default: {x: 0, y: 0.0001, z: 0}},
			spawnRadius: {type: 'number', default: 1},
			spawnSize: {type: 'number', default: 5},
			spawnRate: {type: 'number', default: 300}
		},

		init: function () {
			this.el.visible = false;
			this.timer = 0;
			this.system.registerMonster(this);
			this.system.registerSpawningZone(this);
		},

		tick: function () {
			if (this.timer == this.data.spawnRate) {;
				this.system.spawn(this);
				this.timer = 0;
			}
			this.timer++;
		},

		remove: function () {
			this.system.unregisterMonster(this);
		}

	});


	AFRAME.registerSystem('monster', {
		init: function () {
			this.monsterPrefab;
			this.monsters = {}
			this.monsterCounter = 0;
			this.spawningZone;
		},

		registerMonster: function (e) {
			console.log("Monster: cloning");
			if (this.monsterPrefab = e.el.sceneEl.querySelector('#monster')) {
				this.monsterPrefab.setAttribute('visible', false);
				this.monsterPrefab.position = this.monsterPrefab.getAttribute('position');
				console.log(this.monsterPrefab);
			}
		},

		registerSpawningZone: function(e) {
			// Show spawning zone
			this.spawningZone = document.createElement('a-entity');
			this.spawningZone.setAttribute('geometry', {
	            primitive: 'circle',
	            radius: e.data.spawnRadius
        	});
        	this.spawningZone.setAttribute('color', 'red');
			this.spawningZone.setAttribute('position', e.data.spawnPosition);
			this.spawningZone.setAttribute('rotation', {x: -90, y: 0, z: 0});
			this.el.sceneEl.appendChild(this.spawningZone);
		},

		spawningCoordinates: function(spawnRadius) {
			// Generate random coordinates in spawning zone
			var a = Math.random() * 2 * Math.PI;
			var r = spawnRadius * Math.sqrt(Math.random());

			this.x = r * Math.cos(a);
			this.y = this.monsterPrefab.position.y;
			this.z = r * Math.sin(a);
		},

		spawn: function (e) {

			if (this.monsterCounter < e.data.spawnSize) {

				console.group("Monster: spawning monster" + this.monsterCounter );

				this.spawningCoordinates(e.data.spawnRadius);

				console.log("Spawn position: {x: " + this.x + ", y:" + this.y + ", z:" + this.z + "}");

				if (0) {
					// Add monster as object 3D
					var monster = new THREE.Object3D();
					monster = this.monsterPrefab.object3D.clone();
					monster.position.set(this.x, this.y, this.z);
					monster.visible = true;
					this.monsters[this.monsterCounter] = [];
					this.monsters[this.monsterCounter].push(monster);
					console.log(monster);
					this.el.sceneEl.object3D.add(monster);
				} else {
					// Add monster as entity
					var monster = this.monsterPrefab.cloneNode(true);
					monster.removeAttribute('monster');
					monster.setAttribute('monster-clone', '');
					monster.setAttribute('id', 'monster' + this.monsterCounter);
					monster.setAttribute('position', {x: this.x, y: this.y, z: this.z});
					monster.setAttribute('follow', {target: '#player', speed: 0.2, space: 0.2});
					monster.setAttribute('visible', true);
					console.log(monster);
					this.el.sceneEl.appendChild(monster);
				}

				this.monsterCounter++;
			
				console.groupEnd();
			}
		},

		unregisterMonster: function () {
		}

	});


   AFRAME.registerComponent('follow', {
   
	   schema: {
	      target: {type: 'selector'},
	      speed: {type: 'number'},
	      space: {type: 'number', default: 0.5}
	   },

	   init: function () {
	      this.directionVec3 = new THREE.Vector3();
	   },
	   
	   tick: function (time, timeDelta) {
	      var directionVec3 = this.directionVec3;

	      var bufferZone = this.data.space + this.el.getAttribute('geometry').radius;
	      var targetPosition = this.data.target.object3D.position;
	      var currentPosition = this.el.object3D.position;
	      
	      directionVec3.copy(targetPosition).sub(currentPosition);

	      var distance = directionVec3.length();
	      if (distance < bufferZone) { return; }

	      var factor = this.data.speed / distance;
	      directionVec3.x *= factor * (timeDelta / 1000);
	      directionVec3.y *= 0;
	      directionVec3.z *= factor * (timeDelta / 1000);

	      this.el.setAttribute('position', {
	         x: currentPosition.x + directionVec3.x,
	         y: currentPosition.y + directionVec3.y,
	         z: currentPosition.z + directionVec3.z
	      });

	   }
	});

}()




