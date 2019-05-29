!function (e) {

	AFRAME.registerComponent('monster' , {

		schema: {
			health: {type: 'number', default: 50}
		},

		init: function () {
			this.el.visible = false;
			this.system.registerMonster(this);
		},

		onHit: function(damagePoint) {
			if (this.data.health > 0)
				this.data.health -= damagePoint;
		},

		remove: function () {
			this.system.unregisterMonster(this);
		}

	});


	AFRAME.registerSystem('monster', {
		init: function () {
			this.monsterPrefab;
		},

		registerMonster: function (e) {
			console.log("Monster: cloning");
			if (this.monsterPrefab = e.el.sceneEl.querySelector('#monster')) {
				this.monsterPrefab.setAttribute('visible', false);
				console.log(this.monsterPrefab);
			}
		},

		unregisterMonster: function () {
		}

	});


	AFRAME.registerComponent('spawner', {

		// Circular area where monsters should spawn

		schema: {
			spawnRadius: {type: 'number', default: 1},
			spawnPoolSize: {type: 'number', default: 5},
			spawnRate: {type: 'number', default: 300},

			monster: {type: 'selector', default: '#monster'},
			monsterType: {type: 'string'}
		},

		init: function () {
			this.timer = 0;
			this.monsterCounter = 1;
			this.spawnPosition = this.el.object3D.position;
			this.registerSpawningZone();
			console.log(this.spawnPosition);
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

			this.x = (r * Math.cos(a)) + this.spawnPosition.x;
			this.y = this.data.monster.getAttribute('position').y;
			this.z = (r * Math.sin(a)) + this.spawnPosition.z;
		},

		spawn: function (e) {

			if (this.monsterCounter <= this.data.spawnPoolSize) {

				console.group("Monster: spawning monster " + this.monsterCounter + "/" + this.data.spawnPoolSize);

				this.spawningCoordinates(this.data.spawnRadius);

				console.log("Spawn position: {x: " + this.x + ", y:" + this.y + ", z:" + this.z + "}");

				// Add monster as entity
				var monster = this.data.monster.cloneNode(true);
				monster.removeAttribute('monster');
				monster.setAttribute('monster-clone', '');
				monster.setAttribute('id', 'MM_' + monster.object3D.uuid);
				monster.setAttribute('position', {x: this.x, y: this.y, z: this.z});
				monster.setAttribute('follow', {target: '#player', speed: 0.2, space: 0.2});
				monster.setAttribute('visible', true);
				console.log(monster);
				this.el.sceneEl.appendChild(monster);

				this.monsterCounter++;
			
				console.groupEnd();
			}
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

	      this.el.object3D.lookAt(targetPosition);

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




