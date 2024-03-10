import cheatManager from 'modules/cheats.js';
import listenerManager from 'modules/listeners.js';
import patcher from 'modules/patcher.js';

import variables from 'utils/variables.js';

export default () => unsafeWindow[variables.render] = function (babylon, players, myPlayer) {
    if (!myPlayer) return;

    unsafeWindow[variables.leaderboardUpdate]();

    if (!unsafeWindow[variables.lineOrigin]) {
        unsafeWindow[variables.lineOrigin] = new babylon[patcher.keys.Vector3]();
        unsafeWindow[variables.lineArray] = [];
    };

    let lineArray = unsafeWindow[variables.lineArray];
    let lineOrigin = unsafeWindow[variables.lineOrigin];

    lineOrigin.copyFrom(myPlayer[patcher.keys.actor][patcher.keys.mesh].position);

    if (document.querySelector('#coords'))
        document.querySelector('#coords').innerHTML = `${lineOrigin.x.toFixed(1)}, ${lineOrigin.y.toFixed(1)}, ${lineOrigin.z.toFixed(1)}`;

    const yaw = myPlayer[patcher.keys.actor][patcher.keys.mesh].rotation.y;

    lineOrigin.x += Math.sin(yaw);
    lineOrigin.z += Math.cos(yaw);
    lineOrigin.y += Math.sin(-myPlayer[patcher.keys.pitch]);

    for (let i = 0; i < lineArray.length; i++) lineArray[i].playerExists = false;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player || player === myPlayer) continue;

        if (player.sphere === undefined) {
            const material = new babylon.StandardMaterial('myMaterial', player[patcher.keys.actor].scene);
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

            player.sphere = sphere;
        };

        if (player.lines === undefined) {
            const options = {
                points: [lineOrigin, player[patcher.keys.actor][patcher.keys.mesh].position],
                updatable: true
            };

            const lines = options.instance = babylon[patcher.keys.MeshBuilder][patcher.keys.CreateLines]('lines', options, player[patcher.keys.actor].scene);
            lines.color = new babylon.Color3(1, 0, 0);
            lines.alwaysSelectAsActiveMesh = true;
            lines.renderingGroupId = 1;

            player.lines = lines;
            player.lineOptions = options;

            lineArray.push(lines);
        };

        player.lines.playerExists = true;
        player.lines = babylon[patcher.keys.MeshBuilder][patcher.keys.CreateLines]('lines', player.lineOptions);

        let isEnemy = myPlayer.team === 0 || myPlayer.team !== player.team;
        player.sphere.visibility = cheatManager.enabled('ESP Boxes') && isEnemy;
        player.lines.visibility = player[patcher.keys.playing] && cheatManager.enabled('ESP Lines') && isEnemy;

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
        if (!lineArray[i].playerExists) {
            lineArray[i].dispose();
            lineArray.splice(i, 1);
        };
    };

    if (
        ((cheatManager.enabled('Snap Mode') === 'Always On') ||
            (cheatManager.enabled('Snap Mode') === 'Right Mouse') && listenerManager.mouseDown() ||
            (cheatManager.enabled('Snap Mode') === 'Trackpad') && listenerManager.trackpadActive())
        && myPlayer[patcher.keys.playing]
    ) {
        let minDistance = Infinity;
        let targetPlayer;

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

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

        if (targetPlayer) {
            const x = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.x - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.x;
            const y = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.y - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.y;
            const z = targetPlayer[patcher.keys.actor][patcher.keys.mesh].position.z - myPlayer[patcher.keys.actor][patcher.keys.mesh].position.z;

            myPlayer[patcher.keys.yaw] = Math.radAdd(Math.atan2(x, z), 0);
            myPlayer[patcher.keys.pitch] = -Math.atan2(y, Math.hypot(x, z)) % 1.5;
        };
    };

    if (myPlayer.weapon.ammo.rounds < 1 && cheatManager.enabled('Auto Reload')) myPlayer.reload();
};