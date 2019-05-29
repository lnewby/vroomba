export function gameState() {
    return {
        numEnemiesInLevel: 10,
        totalEnemiesDefeated: 0,
        currentLevel: 1,
        endLevel: 3,
        enemyIds: [],
        levelMap: {
            1: {
                enemiesDefeated: 0,
                totalEnemies: 2,
            },
            2: {
                enemiesDefeated: 0,
                totalEnemies: 3,
            },
            3: {
                enemiesDefeated: 0,
                totalEnemies: 4,
            },
        }
    };
};
