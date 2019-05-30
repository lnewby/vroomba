# Enemy System

## Features
- The monster
-- Health damage point
- Spawner
- Following a target

## Structure
The monster (prefab) - example, red ball with eyes
```
<a-entity monster="monsterType: red" id="monster2" geometry="primitive: sphere; radius: 0.15" material="color: red" position="0 0.15 -3" visible="false" monster-prefab>
    <a-sphere radius=0.05 color="#000000" position="0.061 0 0.089" kinematic-body></a-sphere>
    <a-sphere radius=0.05 color="#000000" position="-0.061 0 0.089" kinematic-body></a-sphere>
</a-entity>
```
Spawner
```
<a-entity spawner="monster: #monster2" id="spawner2" position="4, 0.0001, 0"></a-entity>
```
Container for monsters spawned
```
<a-entity monsters></a-entity>
```
## The Monster Component
```
schema: {
	monsterType: {type: 'string'},
	health: {type: 'number', default: 50}
}
```
Use *onHit* function to reduce monster health points
```
this.el.sceneEl.systems.monster.onHit(<'selector'>, <number>);
```
To test the health system, use the script below to deduct damage points from the cursor selected target.
```
AFRAME.registerComponent('cursor-selector', {
    init: function () {
        this.el.addEventListener('click', (e) => {
            var target = e.detail.intersection.object.el;
            console.log("Cursor: selected " + target.id);
            this.el.sceneEl.systems.monster.onHit(target, 10);
        });
    }
});
```
## Spawner Component
Area where monster will spawn from
```
schema: {
	spawnRadius: {type: 'number', default: 1},
	spawnPoolSize: {type: 'number', default: 5},
	spawnRate: {type: 'number', default: 300},

	monster: {type: 'selector', default: '#monster'},
	monsterType: {type: 'string'}
}
```
```
<a-entity spawner="monster: #monster2" id="spawner2" position="4, 0.0001, 0"></a-entity>
```
# Following Target Component
```
schema: {
    target: {type: 'selector'},
    speed: {type: 'number'},
    space: {type: 'number', default: 0.5}
},
```
Use .setAttribute or set under HTML tag
```
monster.setAttribute('follow', {target: '#player', speed: 0.2, space: 0.2});
```
```
<a-entity ] ... follow="target: #player; speed: 0.2; space: 0.2" ...></a-entity>
```