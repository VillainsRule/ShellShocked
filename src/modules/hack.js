import { onUpdateFuncName } from './hooker.js';
import { rightMouseDown } from './listeners.js';
import settings from '../utils/settings.js';

export async function initHack() {
    window[onUpdateFuncName] = function(BABYLON, players, myPlayer) {
        if (!myPlayer) return;
        let lineOrigin = new BABYLON.Vector3();
        let linesArray = [];
    
        lineOrigin.copyFrom(myPlayer.actor.mesh.position);
    
        const yaw = myPlayer.actor.mesh.rotation.y;
    
        lineOrigin.x += Math.sin(yaw);
        lineOrigin.z += Math.cos(yaw);
        lineOrigin.y += Math.sin(-myPlayer.pitch);
    
        for (let i = 0; i < linesArray.length; i++) linesArray[i].playerExists = false;
    
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (!player || player === myPlayer) continue;
            if (player.sphere === undefined) {
    
                const material = new BABYLON.StandardMaterial('myMaterial', player.actor.scene);
                material.emissiveColor = material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                material.wireframe = true;
    
                const sphere = BABYLON.MeshBuilder.CreateBox('mySphere', {
                    width: 0.5,
                    height: 0.75,
                    depth: 0.5
                }, player.actor.scene);
                sphere.material = material;
                sphere.position.y = 0.3;
                sphere.parent = player.actor.mesh;
                player.sphere = sphere;
            };
    
            if (player.lines === undefined) {
                const options = {
                    points: [lineOrigin, player.actor.mesh.position],
                    updatable: true
                };
    
                const lines = options.instance = BABYLON.MeshBuilder.CreateLines('lines', options, player.actor.scene);
                lines.color = new BABYLON.Color3(1, 0, 0);
                lines.alwaysSelectAsActiveMesh = true;
                lines.renderingGroupId = 1;
    
                player.lines = lines;
                player.lineOptions = options;
    
                linesArray.push(lines);
            };
    
            player.lines.playerExists = true;
            player.lines = BABYLON.MeshBuilder.CreateLines('lines', player.lineOptions);
    
            player.sphere.renderingGroupId = settings.get().hitboxes.enabled ? 1 : 0;
            player.sphere.visibility = (settings.get().aimbot.enabled || settings.get().hitboxes.enabled) && myPlayer !== player && (myPlayer.team === 0 || myPlayer.team !== player.team);
    
            player.lines.visibility = player.playing && player.sphere.visibility && settings.get().espLines.enabled;
        };
    
        for (let i = 0; i < linesArray.length; i++) {
            if (!linesArray[i].playerExists) {
                linesArray[i].dispose();
                linesArray.splice(i, 1);
            };
        };
    
        if (settings.get().aimbot.enabled && (settings.get().aimbot.rightMouse.enabled ? rightMouseDown() : true) && myPlayer.playing) {
            let minDistance = Infinity;
            let targetPlayer;
    
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if (player && player !== myPlayer && player.playing && (myPlayer.team === 0 || player.team !== myPlayer.team)) {
                    const distance = Math.hypot(player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z);
                    if (distance < minDistance) {
                        minDistance = distance;
                        targetPlayer = player;
                    };
                };
            };
    
            if (targetPlayer) {
                const x = targetPlayer.actor.mesh.position.x - myPlayer.actor.mesh.position.x;
                const y = targetPlayer.actor.mesh.position.y - myPlayer.actor.mesh.position.y;
                const z = targetPlayer.actor.mesh.position.z - myPlayer.actor.mesh.position.z;
    
                myPlayer.yaw = Math.radAdd(Math.atan2(x, z), 0);
                myPlayer.pitch = -Math.atan2(y, Math.hypot(x, z)) % 1.5;
            };
        };
    };
}