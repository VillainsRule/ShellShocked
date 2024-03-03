import cheatManager from 'modules/cheats.js';
import listenerManager from 'modules/listeners.js';
import patcher from 'modules/patcher.js';

import variables from 'utils/variables.js';
import logger from 'utils/logger';

// This code is added to the game system to change how the game is rendered (allows for ESP drawings & similar changes)
export default () => unsafeWindow[variables.render] = function (babylon, players, myPlayer) {
    if (!myPlayer) return;

    unsafeWindow[variables.leaderboardUpdate]();

    // Creates the origin point for all lines and exposes it to the window
    if (!unsafeWindow[variables.lineOrigin]) {
        logger.log(`Creating a new LineOrigin`);
        unsafeWindow[variables.lineOrigin] = new babylon[patcher.keys.Vector3]();
        unsafeWindow[variables.lineArray] = [];
    };

    let lineArray = unsafeWindow[variables.lineArray];
    let lineOrigin = unsafeWindow[variables.lineOrigin];

    lineOrigin.copyFrom(myPlayer[patcher.keys.actor][patcher.keys.mesh].position);

    if (document.querySelector('#coords'))
        document.querySelector('#coords').innerHTML = `${lineOrigin.x.toFixed(1)}, ${lineOrigin.y.toFixed(1)}, ${lineOrigin.z.toFixed(1)}`;

    // Adjusts the line origin based on player yaw
    const yaw = myPlayer[patcher.keys.actor][patcher.keys.mesh].rotation.y;

    lineOrigin.x += Math.sin(yaw);
    lineOrigin.z += Math.cos(yaw);
    lineOrigin.y += Math.sin(-myPlayer[patcher.keys.pitch]);

    for (let i = 0; i < lineArray.length; i++) lineArray[i].playerExists = false;

    // Loop through each player
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player || player === myPlayer) continue; // Ignore the local player

        if (player.sphere === undefined) { // Give newly spawned players ESP boxes
            logger.log(`Creating a sphere for ${player.name || player.normalName || player.safeName || 'a player'}`);

            const material = new babylon.StandardMaterial('myMaterial', player[patcher.keys.actor].scene); // Create the ESP box & adjust it
            material.emissiveColor = material.diffuseColor = new babylon.Color3(1, 0, 0);
            material.wireframe = true;

            const sphere = babylon[patcher.keys.MeshBuilder][patcher.keys.CreateBox]('mySphere', {
                width: 0.5,
                height: 0.75,
                depth: 0.5
            }, player[patcher.keys.actor].scene);
            sphere.material = material;
            sphere.position.y = 0.3;
            sphere.parent = player[patcher.keys.actor][patcher.keys.mesh];
            sphere.renderingGroupId = 1;

            player.sphere = sphere; // Link the box to the player
        };

        if (player.lines === undefined) { // Give newly spawned players ESP lines
            logger.log(`Creating a line for ${player.name || player.normalName || player.safeName || 'a player'}`);

            const options = {
                points: [lineOrigin, player[patcher.keys.actor][patcher.keys.mesh].position],
                updatable: true
            };

            // Create the lines & style them
            const lines = options.instance = babylon[patcher.keys.MeshBuilder][patcher.keys.CreateLines]('lines', options, player[patcher.keys.actor].scene);
            lines.color = new babylon.Color3(1, 0, 0);
            lines.alwaysSelectAsActiveMesh = true;
            lines.renderingGroupId = 1;

            player.lines = lines;
            player.lineOptions = options;

            lineArray.push(lines); // Add the lines to the list
        };

        player.lines.playerExists = true;
        player.lines = babylon[patcher.keys.MeshBuilder][patcher.keys.CreateLines]('lines', player.lineOptions);

        // Handle rendering of the ESP lines/boxes
        let isEnemy = myPlayer.team === 0 || myPlayer.team !== player.team;
        player.sphere.visibility = cheatManager.enabled('ESP Boxes') && isEnemy;
        player.lines.visibility = player[patcher.keys.playing] && cheatManager.enabled('ESP Lines') && isEnemy;

        // egg esp!
        player[patcher.keys.actor][patcher.keys.bodyMesh].renderingGroupId = cheatManager.enabled('Skin ESP') ? 1 : 0;

        if (cheatManager.enabled('Nametags') && player[patcher.keys.actor] && player[patcher.keys.actor].nameSprite) {
            const x = player[patcher.keys.actor][patcher.keys.mesh].position.x - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.x;
            const y = player[patcher.keys.actor][patcher.keys.mesh].position.y - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.y;
            const z = player[patcher.keys.actor][patcher.keys.mesh].position.z - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.z;

            player[patcher.keys.actor].nameSprite._manager.renderingGroupId = 1;
            player[patcher.keys.actor].nameSprite.renderingGroupId = 1;

            let distance = Math.length3(x, y, z);
            let widthCalculation = Math.pow(distance, 1.25) * 2;
            player[patcher.keys.actor].nameSprite.width = widthCalculation / 10 + .6;
            player[patcher.keys.actor].nameSprite.height = widthCalculation / 20 + .3;
            player[patcher.keys.actor].scene.activeCamera.fov = 0.75;
        };
    };

    for (let i = 0; i < lineArray.length; i++) {
        if (!lineArray[i].playerExists) { // Remove lines of dead players
            logger.log(`Removing a line (due to a death)`);
            lineArray[i].dispose();
            lineArray.splice(i, 1);
        };
    };

    if ( // Handle aimbot
        ((cheatManager.enabled('Snap Mode') === 'Always On') ||
            (cheatManager.enabled('Snap Mode') === 'Right Mouse') && listenerManager.mouseDown() ||
            (cheatManager.enabled('Snap Mode') === 'Trackpad') && listenerManager.trackpadActive())
        && myPlayer[patcher.keys.playing]
    ) {
        let minDistance = Infinity;
        let targetPlayer;

        for (let i = 0; i < players.length; i++) { // Find the closest player
            const player = players[i];

            // Make sure the player is valid (right team, not dead, etc)
            if (player && player !== myPlayer && player[patcher.keys.playing] && (myPlayer.team === 0 || player.team !== myPlayer.team)) {
                const x = player[patcher.keys.actor][patcher.keys.mesh].position.x - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.x;
                const y = player[patcher.keys.actor][patcher.keys.mesh].position.y - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.y;
                const z = player[patcher.keys.actor][patcher.keys.mesh].position.z - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.z;

                const distance = Math.hypot(x, y, z);
                if (distance < minDistance) {
                    minDistance = distance;
                    targetPlayer = player;
                };
            };
        };

        logger.log(`Aimbot is targeting ${targetPlayer?.name || targetPlayer?.normalName || targetPlayer?.safeName || 'a player'}`);

        if (targetPlayer) {
            // Find the player's location
            const x = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.x - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.x;
            const y = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.y - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.y;
            const z = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.z - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.z;

            // Adjust the camera to them
            myPlayer[patcher.keys.yaw] = Math.radAdd(Math.atan2(x, z), 0);
            myPlayer[patcher.keys.pitch] = -Math.atan2(y, Math.hypot(x, z)) % 1.5;
        };
    };

    // Auto Reload: check if the ammo is empty
    if (myPlayer.weapon.ammo.rounds < 1 && cheatManager.enabled('Auto Reload')) myPlayer.reload();
};