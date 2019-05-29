!function (e) {

	AFRAME.registerComponent('monster' , {

		schema: {
			monsterType: {type: 'string'},
			health: {type: 'number', default: 50}
		},

		init: function () {
		},

	});


	AFRAME.registerSystem('monster', {
		init: function () {
		},

		registerMonster: function (e) {
			e.el.setAttribute('visible', false);
		},

		createMonster: function	(el, loc) {
			// Add monster as entity
		
			if (this.monsterPrefab = el) {
				console.log("Monster: prefabed");

				var monster = this.monsterPrefab.cloneNode(true);
				console.log("Monster: cloned");

				monster.setAttribute('id', 'MM_' + monster.object3D.uuid);
				monster.setAttribute('position', {x: loc.x, y: loc.y, z: loc.z});
				monster.setAttribute('follow', {target: '#player', speed: 0.2, space: 0.2});
				monster.setAttribute('visible', true);
				console.log(monster);

				var healthBar = document.createElement('a-entity');
				healthBar.setAttribute('text', {
					value: el.getAttribute('monster').health,
					width: 0.5,
					wrapCount: 9,
					align: 'center',
					color: 'pink'
				});
				healthBar.setAttribute('position', {x: 0, y: 0.27, z: 0})

				monster.appendChild(healthBar);
				document.querySelector('a-entity[monsters]').appendChild(monster);
			}
		},

		onHit: function(el, damagePoint) {

			// TO DO if monster doesn't exist

			if ((el != null) && (currentHealth = el.getAttribute('monster').health)) {
				if (currentHealth > damagePoint) {
					// If monster still has health, reduce health

					var remainingHealth = currentHealth - damagePoint;

					el.setAttribute('monster', {health: remainingHealth});
					el.querySelector('a-entity[text]').setAttribute('text', {value: remainingHealth});
					console.log("Monster: hit " + el.getAttribute('id') + " " + currentHealth + "->" + remainingHealth);
				} else {
					// else remove monster
					el.setAttribute('monster', {health: 0});
					el.querySelector('a-entity[text]').setAttribute('text', {value: 0});
					console.log("Monster: died");
					this.unregisterMonster(el);
				}
			}

		},

		unregisterMonster: function (el) {
			console.log("Monster: remove");
			document.querySelector('a-entity[monsters]').removeChild(el);

			// TO DO: animate explode
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
			this.monsterCounter = 0;
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

			this.monsterPosition = new THREE.Vector3((r * Math.cos(a)) + this.spawnPosition.x,
										this.data.monster.getAttribute('position').y,
										(r * Math.sin(a)) + this.spawnPosition.z);
			console.log(this.monsterPosition);
		},

		spawn: function (e) {

			if (this.monsterCounter < this.data.spawnPoolSize) {

				this.monsterCounter++;
				console.group("Monster: spawning monster " + this.data.monster.getAttribute('monster').monsterType + " " + this.monsterCounter + "/" + this.data.spawnPoolSize);

				this.spawningCoordinates(this.data.spawnRadius);
				e.sceneEl.systems.monster.createMonster(this.data.monster, this.monsterPosition);

				console.log("Spawn position: " + JSON.stringify(this.monsterPosition));			
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




